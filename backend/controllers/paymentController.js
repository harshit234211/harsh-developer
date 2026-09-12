const tranzUpiService = require('../services/tranzUpiService');
const dbService = require('../utils/dbAdapter');
const { calculateAuthoritativePrice, calculateAuthoritativeCart } = require('../utils/pricingEngine');
const logger = require('../utils/logger');

/**
 * 1. Create UPI Payment Intent for an order
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required to initialize UPI payment.'
      });
    }

    const order = await dbService.Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${orderId} not found.`
      });
    }

    const intentData = await tranzUpiService.createPaymentIntent(order);

    res.status(200).json(intentData);
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Verify Payment (Server-side authoritative check)
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { utr, txnId } = req.body;

    const result = await tranzUpiService.verifyPayment({
      orderId,
      utr,
      txnId,
      adminVerified: false,
      req
    });

    const statusCode = result.verified || result.alreadyPaid ? 200 : (result.requiresGatewayKey ? 202 : 400);
    res.status(statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Query Payment & Order Status
 */
const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await dbService.Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${orderId} not found.`
      });
    }

    const payment = await dbService.Payment.findOne({ orderId });

    res.status(200).json({
      success: true,
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      isPaid: Boolean(order.paymentStatus === 'paid' || order.status === 'paid'),
      paidAt: order.paidAt,
      finalAmount: order.finalAmount,
      productName: order.productName,
      entitlements: order.entitlements,
      paymentDetails: payment ? {
        paymentId: payment.paymentId,
        status: payment.status,
        utr: payment.utr,
        gatewayOrderId: payment.gatewayOrderId
      } : null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Tranz UPI Gateway Webhook Listener
 */
const handleTranzWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-tranz-signature'] || req.headers['x-signature'] || null;
    const result = await tranzUpiService.handleWebhook(req.body, signature);
    res.status(result.status || 200).json(result);
  } catch (err) {
    logger.error('Error handling Tranz webhook:', err);
    res.status(500).json({ success: false, message: 'Internal webhook error' });
  }
};

/**
 * 5. Callback endpoint for payment redirects
 */
const handlePaymentCallback = async (req, res, next) => {
  try {
    const orderId = req.query.orderId || req.body.order_id || req.body.orderId;
    if (orderId) {
      return res.redirect(`/cart?orderId=${encodeURIComponent(orderId)}&status=complete`);
    }
    res.redirect('/cart');
  } catch (err) {
    next(err);
  }
};

/**
 * 6. Admin Manual Payment Verification (Protected)
 */
const adminVerifyPayment = async (req, res, next) => {
  try {
    const { orderId, utr, adminNotes } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required for admin payment verification.'
      });
    }

    const result = await tranzUpiService.verifyPayment({
      orderId,
      utr,
      adminVerified: true,
      adminNotes: adminNotes || `Manually verified by admin ${req.user ? req.user.email : 'shakyaharshit683@gmail.com'}`
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPaymentIntent,
  verifyPayment,
  getPaymentStatus,
  handleTranzWebhook,
  handlePaymentCallback,
  adminVerifyPayment
};
