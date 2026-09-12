const dbService = require('../utils/dbAdapter');
const { calculateAuthoritativePrice, calculateAuthoritativeCart, findProductById, DEVCRAFT_PRODUCTS } = require('../utils/pricingEngine');
const tranzUpiService = require('../services/tranzUpiService');
const logger = require('../utils/logger');

/**
 * 1. Get all products and courses with calculated discounts
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    let products = await dbService.Product.find({ active: true });

    if (type) {
      products = products.filter(p => p.type && p.type.toLowerCase() === type.toLowerCase());
    }
    if (category && category !== 'All') {
      products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Get single product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await dbService.Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product or course not found.'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Server-authoritative calculation of single product + coupon
 */
const calculateOrder = async (req, res, next) => {
  try {
    const { productId, couponCode, email } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required for price calculation.'
      });
    }

    const clientEmail = (req.user && req.user.email) || (email ? email.toString().toLowerCase().trim() : null);
    const result = await calculateAuthoritativePrice(productId, couponCode, clientEmail, req);

    if (!result.success) {
      const status = result.locked ? 429 : 400;
      return res.status(status).json(result);
    }

    if (couponCode && result.calculation && result.calculation.couponError) {
      return res.status(400).json({
        success: false,
        message: result.calculation.couponError,
        calculation: result.calculation
      });
    }

    res.status(200).json({
      success: true,
      product: result.product,
      calculation: result.calculation
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Server-authoritative calculation for multiple cart items + coupon
 */
const calculateCartOrder = async (req, res, next) => {
  try {
    const { items, cartItems, couponCode, email } = req.body;
    const effectiveItems = items || cartItems;

    if (!effectiveItems || !Array.isArray(effectiveItems) || effectiveItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items array is required.'
      });
    }

    const clientEmail = (req.user && req.user.email) || (email ? email.toString().toLowerCase().trim() : null);
    const result = await calculateAuthoritativeCart(effectiveItems, couponCode, clientEmail, req);

    if (!result.success) {
      const status = result.locked ? 429 : 400;
      return res.status(status).json(result);
    }

    if (couponCode && result.summary && result.summary.couponError) {
      return res.status(400).json({
        success: false,
        message: result.summary.couponError,
        summary: result.summary,
        items: result.items
      });
    }

    res.status(200).json({
      success: true,
      items: result.items,
      summary: result.summary
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 5. Checkout / Order placement (Supports single product and multi-item cart)
 */
const checkoutOrder = async (req, res, next) => {
  try {
    const { productId, cartItems, couponCode, clientName, clientEmail, clientPhone, notes } = req.body;

    const effectiveEmail = (req.user && req.user.email) || (clientEmail ? clientEmail.toString().toLowerCase().trim() : '');
    const effectiveName = (req.user && req.user.name) || (clientName ? clientName.toString().trim() : 'Guest Client');
    const effectivePhone = (req.user && req.user.phone) || (clientPhone ? clientPhone.toString().trim() : '');
    const userId = (req.user && req.user._id) || null;

    if (!effectiveName || effectiveName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid client name (minimum 2 characters).'
      });
    }

    if (!effectiveEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const orderId = 'DC-ORD-' + Math.floor(100000 + Math.random() * 900000);
    let orderRecordData = null;
    let couponDoc = null;
    let couponDiscountAmount = 0;
    let couponDiscountPercent = 0;

    // Check if cartItems was provided
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      const cartCalc = await calculateAuthoritativeCart(cartItems, couponCode, effectiveEmail, req);
      if (!cartCalc.success) {
        const status = cartCalc.locked ? 429 : 400;
        return res.status(status).json(cartCalc);
      }

      const { summary, items, _couponDoc } = cartCalc;
      couponDoc = _couponDoc;
      couponDiscountAmount = summary.couponDiscountAmount;
      couponDiscountPercent = summary.couponDiscountPercent;

      orderRecordData = {
        orderId,
        productId: items.length === 1 ? items[0].productId : 'cart-multi',
        productName: items.length === 1 ? items[0].productName : `DevCraft Bundle (${items.length} Products)`,
        productType: items.length === 1 ? items[0].productType : 'bundle',
        items,
        originalPrice: summary.totalOriginalPrice,
        productDiscountPercent: Math.round((summary.totalProductDiscount / summary.totalOriginalPrice) * 100),
        productDiscountAmount: summary.totalProductDiscount,
        discountedPrice: summary.subtotalDiscounted,
        couponCodeMask: summary.couponCodeMask,
        couponDiscountPercent: summary.couponDiscountPercent,
        couponDiscountAmount: summary.couponDiscountAmount,
        finalAmount: summary.finalAmount,
        userId,
        clientName: effectiveName,
        clientEmail: effectiveEmail,
        clientPhone: effectivePhone,
        notes: notes || '',
        status: 'Confirmed'
      };
    } else if (productId) {
      // Single product checkout
      const calcResult = await calculateAuthoritativePrice(productId, couponCode, effectiveEmail, req);
      if (!calcResult.success) {
        const status = calcResult.locked ? 429 : 400;
        return res.status(status).json(calcResult);
      }

      const { calculation, product, _couponDoc } = calcResult;
      couponDoc = _couponDoc;
      couponDiscountAmount = calculation.couponDiscountAmount;
      couponDiscountPercent = calculation.couponDiscountPercent;

      orderRecordData = {
        orderId,
        productId: product.id,
        productName: product.name,
        productType: product.type,
        items: [{
          productId: product.id,
          productName: product.name,
          quantity: 1,
          finalPrice: calculation.finalAmount
        }],
        originalPrice: calculation.originalPrice,
        productDiscountPercent: calculation.productDiscountPercent,
        productDiscountAmount: calculation.productDiscountAmount,
        discountedPrice: calculation.discountedPrice,
        couponCodeMask: calculation.couponCodeMask,
        couponDiscountPercent: calculation.couponDiscountPercent,
        couponDiscountAmount: calculation.couponDiscountAmount,
        finalAmount: calculation.finalAmount,
        userId,
        clientName: effectiveName,
        clientEmail: effectiveEmail,
        clientPhone: effectivePhone,
        notes: notes || '',
        status: 'Confirmed'
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide a productId or cartItems for checkout.'
      });
    }

    // Save order
    const order = await dbService.Order.create(orderRecordData);

    // If coupon was applied, record audit redemption and increment counter
    if (couponDoc && couponDiscountAmount > 0) {
      const updatedCount = (couponDoc.used_count || 0) + 1;
      await dbService.Coupon.findByIdAndUpdate(couponDoc._id, {
        used_count: updatedCount,
        active: couponDoc.max_uses && updatedCount >= couponDoc.max_uses && couponDoc.max_uses === 1 ? false : couponDoc.active
      });

      await dbService.CouponUsage.create({
        coupon_id: couponDoc._id,
        code_mask: couponDoc.code_mask,
        discount_percentage: couponDiscountPercent,
        user_id: userId,
        user_email: effectiveEmail,
        order_id: orderId,
        original_amount: orderRecordData.discountedPrice,
        discount_amount: couponDiscountAmount,
        final_amount: orderRecordData.finalAmount,
        notes: `Redeemed for order ${orderId}`
      });
    }

    logger.success(`Order created: ${order.orderId} for ${order.productName} by ${order.clientEmail}. Final: ₹${order.finalAmount}`);

    // Generate dynamic UPI payment intent
    const paymentIntent = await tranzUpiService.createPaymentIntent(order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Please complete your UPI payment to unlock full access.',
      order: {
        id: order._id,
        orderId: order.orderId,
        productName: order.productName,
        productType: order.productType,
        items: order.items,
        originalPrice: order.originalPrice,
        productDiscountPercent: order.productDiscountPercent,
        discountedPrice: order.discountedPrice,
        couponCodeMask: order.couponCodeMask,
        couponDiscountPercent: order.couponDiscountPercent,
        couponDiscountAmount: order.couponDiscountAmount,
        finalAmount: order.finalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        entitlements: order.entitlements,
        createdAt: order.createdAt
      },
      payment: paymentIntent
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 6. Get user orders (protected)
 */
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const userEmail = req.user && req.user.email;

    let orders = [];
    if (userId) {
      orders = await dbService.Order.find({ userId });
    }
    if ((!orders || orders.length === 0) && userEmail) {
      orders = await dbService.Order.find({ clientEmail: userEmail });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 7. Admin: Get all orders
 */
const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await dbService.Order.find({});
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 8. Record share event (Requirement 8)
 */
const trackShareEvent = async (req, res, next) => {
  try {
    const { productId, sharePlatform } = req.body;
    const userId = (req.user && req.user._id) || null;
    const ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '127.0.0.1';

    if (!productId || !sharePlatform) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and sharePlatform are required.'
      });
    }

    const shareEvent = await dbService.ShareEvent.create({
      productId: String(productId).trim(),
      sharePlatform: String(sharePlatform).trim().toLowerCase(),
      userId,
      ip: String(ip).trim()
    });

    logger.info(`Share tracked: Product "${productId}" shared on "${sharePlatform}"`);

    res.status(201).json({
      success: true,
      message: 'Share event recorded successfully.',
      event: {
        id: shareEvent._id,
        productId: shareEvent.productId,
        sharePlatform: shareEvent.sharePlatform,
        timestamp: shareEvent.timestamp
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 9. Get real share analytics (no fake numbers)
 */
const getShareAnalytics = async (req, res, next) => {
  try {
    const totalShares = await dbService.ShareEvent.countDocuments({});
    const allEvents = await dbService.ShareEvent.find({});

    const platformBreakdown = allEvents.reduce((acc, ev) => {
      acc[ev.sharePlatform] = (acc[ev.sharePlatform] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      totalShares,
      platformBreakdown,
      stats: {
        totalShares,
        platformBreakdown
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  calculateOrder,
  calculateCartOrder,
  checkoutOrder,
  getMyOrders,
  getAdminOrders,
  trackShareEvent,
  getShareAnalytics
};
