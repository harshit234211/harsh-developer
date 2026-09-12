const crypto = require('crypto');
const https = require('https');
const http = require('http');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

class TranzUpiService {
  constructor() {
    this.apiKey = config.tranzUpi.apiKey || '';
    this.merchantId = config.tranzUpi.merchantId || 'DEVCRAFT_MERCHANT';
    this.secret = config.tranzUpi.secret || '';
    this.baseUrl = config.tranzUpi.baseUrl || 'https://api.tranzupi.com';
    this.merchantVpa = config.tranzUpi.merchantVpa || 'devcraft@upi';
    this.publicSiteUrl = config.publicSiteUrl || 'https://kiromage.shop';
  }

  /**
   * Check if live Tranz gateway API credentials are provided in server environment
   */
  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Authoritative dynamic UPI URI generator for actual order amount
   */
  generateDynamicUpiUri({ orderId, amount, note = 'DevCraft Order', customerName = '' }) {
    const cleanAmount = Number(amount).toFixed(2);
    const vpa = this.merchantVpa;
    const name = encodeURIComponent('DEVCRAFT STUDIO');
    const tr = encodeURIComponent(orderId);
    const tn = encodeURIComponent(`${note} ${orderId}`.trim());

    // Standard NPCI UPI URI specifications
    return `upi://pay?pa=${vpa}&pn=${name}&am=${cleanAmount}&cu=INR&tr=${tr}&tn=${tn}`;
  }

  /**
   * Safe HTTP request helper to communicate with third-party Tranz UPI gateway
   */
  async _postToGateway(endpoint, payload) {
    return new Promise((resolve, reject) => {
      try {
        const fullUrl = new URL(endpoint, this.baseUrl);
        const postData = JSON.stringify(payload);
        const isHttps = fullUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
          hostname: fullUrl.hostname,
          port: fullUrl.port || (isHttps ? 443 : 80),
          path: fullUrl.pathname + fullUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Bearer ${this.apiKey}`,
            'x-api-key': this.apiKey,
            'User-Agent': 'DevCraft-TranzUPI-Client/2.0'
          },
          timeout: 10000 // 10s timeout
        };

        const req = client.request(options, (res) => {
          let rawData = '';
          res.setEncoding('utf8');
          res.on('data', chunk => { rawData += chunk; });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(rawData);
              resolve({ statusCode: res.statusCode, data: parsed });
            } catch (err) {
              resolve({ statusCode: res.statusCode, raw: rawData });
            }
          });
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Gateway request timed out'));
        });

        req.write(postData);
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 1. Create UPI Payment Intent for an Order
   */
  async createPaymentIntent(order) {
    if (!order || !order.orderId) {
      throw new Error('Valid order record is required to create payment intent');
    }

    const finalAmount = Number(order.finalAmount);
    const upiUri = this.generateDynamicUpiUri({
      orderId: order.orderId,
      amount: finalAmount,
      note: 'DevCraft License',
      customerName: order.clientName
    });

    // Check for existing payment record or create new
    let payment = await dbService.Payment.findOne({ orderId: order.orderId });
    if (!payment) {
      payment = await dbService.Payment.create({
        orderId: order.orderId,
        amount: finalAmount,
        currency: 'INR',
        status: finalAmount === 0 ? 'paid' : 'pending',
        upiUri,
        customerEmail: order.clientEmail,
        customerPhone: order.clientPhone,
        metadata: {
          productName: order.productName,
          itemsCount: order.items ? order.items.length : 1
        }
      });
    }

    // If live TRANZ_UPI_API_KEY is configured in server environment, dispatch create-order request
    let gatewayData = null;
    if (this.isConfigured() && finalAmount > 0) {
      try {
        logger.info(`[Tranz UPI] Initiating remote gateway order for ${order.orderId} (₹${finalAmount})`);
        const payload = {
          api_key: this.apiKey,
          merchant_id: this.merchantId,
          order_id: order.orderId,
          amount: finalAmount,
          customer_name: order.clientName,
          customer_email: order.clientEmail,
          customer_mobile: order.clientPhone,
          redirect_url: `${this.publicSiteUrl}/cart?orderId=${order.orderId}&status=check`,
          callback_url: `${this.publicSiteUrl}/api/payments/webhook/tranz`,
          remark: `DevCraft Order ${order.orderId}`
        };

        const res = await this._postToGateway('/api/create-order', payload);
        if (res && res.data && (res.data.status === true || res.data.status === 'SUCCESS' || res.data.success)) {
          gatewayData = res.data;
          await dbService.Payment.findByIdAndUpdate(payment._id, {
            gatewayOrderId: gatewayData.order_id || gatewayData.txn_id || '',
            metadata: { ...payment.metadata, gatewayResponse: gatewayData }
          });
        }
      } catch (err) {
        logger.warn(`[Tranz UPI] Remote gateway connection failed: ${err.message}. Falling back to dynamic direct UPI intent.`);
      }
    }

    return {
      success: true,
      paymentId: payment.paymentId,
      orderId: order.orderId,
      amount: finalAmount,
      currency: 'INR',
      productName: order.productName,
      upiUri,
      qrData: upiUri,
      merchantVpa: this.merchantVpa,
      gatewayConfigured: this.isConfigured(),
      gatewayData,
      status: payment.status
    };
  }

  /**
   * 2. Server-side Payment Verification
   */
  async verifyPayment({ orderId, utr = '', txnId = '', adminVerified = false, adminNotes = '', req = null }) {
    if (!orderId) {
      return { success: false, message: 'Order ID is required for verification.' };
    }

    const order = await dbService.Order.findOne({ orderId });
    if (!order) {
      return { success: false, message: `Order ${orderId} not found.` };
    }

    // Idempotent check: If already marked as paid
    if (order.status === 'paid' && order.paymentStatus === 'paid') {
      return {
        success: true,
        verified: true,
        alreadyPaid: true,
        orderId: order.orderId,
        productName: order.productName,
        finalAmount: order.finalAmount,
        entitlements: order.entitlements,
        message: 'Order is verified and marked as PAID.'
      };
    }

    const cleanUtr = String(utr || '').trim();
    const cleanTxnId = String(txnId || '').trim();

    // Case A: Verified via protected Studio Admin Action
    if (adminVerified) {
      logger.success(`[Payment Verification] Admin verified order ${order.orderId} (UTR: ${cleanUtr || 'ADMIN_OVERRIDE'})`);
      const updatedOrder = await this._fulfillPaidOrder(order, {
        utr: cleanUtr || 'ADMIN_VERIFIED',
        txnId: cleanTxnId || `TXN-ADM-${Date.now()}`,
        notes: adminNotes || 'Verified by Studio Administrator'
      });

      return {
        success: true,
        verified: true,
        order: updatedOrder,
        message: 'Payment successfully verified by administrator.'
      };
    }

    // Case B: Live TRANZ_UPI_API_KEY configured in server environment
    if (this.isConfigured()) {
      try {
        logger.info(`[Tranz UPI] Querying gateway payment status for order ${order.orderId}`);
        const statusPayload = {
          api_key: this.apiKey,
          merchant_id: this.merchantId,
          order_id: order.orderId,
          txn_id: cleanTxnId,
          utr: cleanUtr
        };

        const res = await this._postToGateway('/api/check-order-status', statusPayload);
        const data = res.data || {};
        const isSuccess = data.status === 'SUCCESS' || data.status === 'PAID' || data.payment_status === 'SUCCESS';

        if (isSuccess) {
          // Verify returned amount matches order final amount
          const gatewayAmount = Number(data.amount || data.paid_amount || order.finalAmount);
          if (gatewayAmount < Number(order.finalAmount)) {
            logger.warn(`[Tranz UPI] Amount mismatch on order ${order.orderId}: Expected ₹${order.finalAmount}, got ₹${gatewayAmount}`);
            return {
              success: false,
              verified: false,
              message: `Payment amount ₹${gatewayAmount} does not match required order amount ₹${order.finalAmount}.`
            };
          }

          // Authoritative fulfillment
          const updatedOrder = await this._fulfillPaidOrder(order, {
            utr: data.utr || cleanUtr,
            txnId: data.txn_id || cleanTxnId || data.gateway_txn_id,
            gatewayResponse: data
          });

          return {
            success: true,
            verified: true,
            order: updatedOrder,
            message: 'Payment verified successfully by Tranz UPI Gateway.'
          };
        } else if (data.status === 'PENDING' || data.payment_status === 'PENDING') {
          await dbService.Order.findByIdAndUpdate(order._id, {
            status: 'payment_processing',
            paymentStatus: 'pending',
            utr: cleanUtr || order.utr,
            transactionId: cleanTxnId || order.transactionId
          });

          return {
            success: false,
            verified: false,
            status: 'pending',
            message: 'Payment is currently pending bank confirmation. Please wait a moment and try again.'
          };
        } else {
          return {
            success: false,
            verified: false,
            status: 'failed',
            message: data.message || 'Payment verification failed at bank gateway.'
          };
        }
      } catch (err) {
        logger.error(`[Tranz UPI] Error querying gateway verification:`, err.message);
        return {
          success: false,
          verified: false,
          message: `Gateway verification error: ${err.message}`
        };
      }
    }

    // Case C: TRANZ_UPI_API_KEY is not yet supplied in server environment
    // STRICT SECURITY RULE: Never pretend payment succeeded!
    // Isolate missing server configuration clearly and register UTR for admin audit.
    logger.warn(`[Payment Verification] TRANZ_UPI_API_KEY is not configured in server environment. Order ${order.orderId} placed in payment_processing with UTR ${cleanUtr || 'N/A'}`);

    if (cleanUtr) {
      await dbService.Order.findByIdAndUpdate(order._id, {
        status: 'payment_processing',
        paymentStatus: 'pending',
        utr: cleanUtr,
        transactionId: cleanTxnId || `UTR-${cleanUtr}`
      });
    }

    return {
      success: false,
      verified: false,
      status: 'payment_processing',
      requiresGatewayKey: true,
      orderId: order.orderId,
      message: 'Payment details received! Automated real-time bank verification requires TRANZ_UPI_API_KEY in the server environment secrets. Your payment reference has been recorded for review.'
    };
  }

  /**
   * 3. Process Webhook / Callback from Tranz UPI Gateway
   */
  async handleWebhook(body = {}, signature = null) {
    try {
      // Signature verification if TRANZ_UPI_SECRET is set
      if (this.secret && signature) {
        const expectedSig = crypto
          .createHmac('sha256', this.secret)
          .update(JSON.stringify(body))
          .digest('hex');

        if (signature !== expectedSig) {
          logger.warn(`[Tranz Webhook] Invalid HMAC signature: expected ${expectedSig}, received ${signature}`);
          return { success: false, status: 401, message: 'Invalid webhook signature.' };
        }
      }

      const orderId = body.order_id || body.orderId;
      if (!orderId) {
        return { success: false, status: 400, message: 'Missing order_id in webhook payload.' };
      }

      const order = await dbService.Order.findOne({ orderId });
      if (!order) {
        return { success: false, status: 404, message: `Order ${orderId} not found.` };
      }

      // Idempotency: Ignore if already marked as paid
      if (order.status === 'paid' && order.paymentStatus === 'paid') {
        return { success: true, status: 200, message: 'Webhook already processed.' };
      }

      const status = (body.status || body.payment_status || '').toUpperCase();
      const amount = Number(body.amount || body.paid_amount || 0);

      if (status === 'SUCCESS' || status === 'PAID') {
        if (amount > 0 && amount < Number(order.finalAmount)) {
          logger.warn(`[Tranz Webhook] Underpayment on order ${orderId}: Expected ₹${order.finalAmount}, got ₹${amount}`);
          return { success: false, status: 400, message: 'Underpayment detected.' };
        }

        await this._fulfillPaidOrder(order, {
          utr: body.utr || '',
          txnId: body.txn_id || body.transaction_id || '',
          gatewayResponse: body
        });

        logger.success(`[Tranz Webhook] Order ${orderId} marked PAID via webhook.`);
        return { success: true, status: 200, message: 'Order fulfilled successfully.' };
      } else if (status === 'FAILED' || status === 'FAILURE') {
        await dbService.Order.findByIdAndUpdate(order._id, {
          status: 'failed',
          paymentStatus: 'failed',
          updatedAt: new Date().toISOString()
        });
        return { success: true, status: 200, message: 'Order marked as failed.' };
      }

      return { success: true, status: 200, message: 'Webhook acknowledged.' };
    } catch (err) {
      logger.error(`[Tranz Webhook] Error processing webhook:`, err);
      return { success: false, status: 500, message: err.message };
    }
  }

  /**
   * Internal helper: Mark order as PAID, grant entitlements, and record transaction
   */
  async _fulfillPaidOrder(order, paymentDetails = {}) {
    const entitlements = order.entitlements && order.entitlements.length > 0 
      ? order.entitlements 
      : (order.items && order.items.length > 0 ? order.items.map(i => i.productId) : [order.productId]);

    const updatedOrder = await dbService.Order.findByIdAndUpdate(order._id, {
      status: 'paid',
      paymentStatus: 'paid',
      utr: paymentDetails.utr || order.utr || 'VERIFIED',
      transactionId: paymentDetails.txnId || order.transactionId || `TXN-${Date.now()}`,
      entitlements,
      paidAt: new Date().toISOString()
    });

    // Update payment record
    const payment = await dbService.Payment.findOne({ orderId: order.orderId });
    if (payment) {
      await dbService.Payment.findByIdAndUpdate(payment._id, {
        status: 'paid',
        utr: paymentDetails.utr || '',
        gatewayTxnId: paymentDetails.txnId || ''
      });

      // Record transaction
      await dbService.PaymentTransaction.create({
        paymentId: payment.paymentId,
        orderId: order.orderId,
        amount: order.finalAmount,
        status: 'paid',
        txnId: paymentDetails.txnId || '',
        utr: paymentDetails.utr || '',
        gatewayResponse: paymentDetails.gatewayResponse || {}
      });
    }

    // Log activity
    await dbService.ActivityLog.create({
      action: 'ORDER_PAID',
      actor: order.clientEmail || 'Client',
      details: {
        orderId: order.orderId,
        productName: order.productName,
        amount: order.finalAmount,
        entitlements
      }
    });

    // Referral System Conversion & Reward Attribution (Requirement 9)
    try {
      let buyerUser = null;
      if (order.userId) {
        buyerUser = await dbService.User.findById(order.userId);
      }
      if (!buyerUser && order.clientEmail) {
        buyerUser = await dbService.User.findOne({ email: order.clientEmail });
      }

      if (buyerUser && buyerUser.referredBy) {
        // Find existing referral record for this referred user
        const refRecord = await dbService.Referral.findOne({ referredUserId: buyerUser._id });
        if (refRecord) {
          const siteSettings = await dbService.SiteSetting.get();
          const rewardPercent = Number(siteSettings.referralRewardPercent) || 10;
          const rewardAmount = Math.round(Number(order.finalAmount) * (rewardPercent / 100));

          // Only convert if not already converted or if it was in 'registered' status
          if (refRecord.status === 'registered') {
            await dbService.Referral.findByIdAndUpdate(refRecord._id, {
              status: 'converted',
              orderId: order.orderId,
              rewardPercent,
              rewardAmount,
              updatedAt: new Date().toISOString()
            });

            await dbService.ReferralReward.create({
              referralId: refRecord._id,
              referrerId: refRecord.referrerId,
              referredUserId: buyerUser._id,
              orderId: order.orderId,
              orderAmount: order.finalAmount,
              rewardPercent,
              rewardAmount,
              status: 'pending'
            });

            logger.success(`[Referral Reward] Successfully attributed ₹${rewardAmount} (${rewardPercent}%) to referrer ${refRecord.referrerCode} for order ${order.orderId} by ${buyerUser.email}`);
          }
        }
      }
    } catch (refErr) {
      logger.warn(`[Referral Conversion Warning] ${refErr.message}`);
    }

    return updatedOrder;
  }
}

module.exports = new TranzUpiService();
