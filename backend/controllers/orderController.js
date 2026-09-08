const dbService = require('../utils/dbAdapter');
const { calculateAuthoritativePrice, findProductById, DEVCRAFT_PRODUCTS } = require('../utils/pricingEngine');
const logger = require('../utils/logger');

/**
 * 1. Get all products and courses with calculated discounts
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    let products = [...DEVCRAFT_PRODUCTS];

    if (type) {
      products = products.filter(p => p.type === type.toLowerCase());
    }
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
    const product = findProductById(id);

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
 * 3. Server-authoritative calculation of product + coupon
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
 * 4. Checkout / Order placement with authoritative server calculation
 */
const checkoutOrder = async (req, res, next) => {
  try {
    const { productId, couponCode, clientName, clientEmail, clientPhone, notes } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required for checkout.'
      });
    }

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

    // Run authoritative calculation
    const calcResult = await calculateAuthoritativePrice(productId, couponCode, effectiveEmail, req);
    if (!calcResult.success) {
      const status = calcResult.locked ? 429 : 400;
      return res.status(status).json(calcResult);
    }

    const { calculation, product, _couponDoc } = calcResult;
    const orderId = 'DC-ORD-' + Math.floor(100000 + Math.random() * 900000);

    // Save order
    const order = await dbService.Order.create({
      orderId,
      productId: product.id,
      productName: product.name,
      productType: product.type,
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
    });

    // If coupon was applied, record audit redemption and increment counter
    if (_couponDoc && calculation.couponApplied) {
      const updatedCount = _couponDoc.used_count + 1;
      await dbService.Coupon.findByIdAndUpdate(_couponDoc._id, {
        used_count: updatedCount,
        active: _couponDoc.max_uses && updatedCount >= _couponDoc.max_uses && _couponDoc.max_uses === 1 ? false : _couponDoc.active
      });

      await dbService.CouponUsage.create({
        coupon_id: _couponDoc._id,
        code_mask: _couponDoc.code_mask,
        discount_percentage: calculation.couponDiscountPercent,
        user_id: userId,
        user_email: effectiveEmail,
        order_id: orderId,
        original_amount: calculation.discountedPrice,
        discount_amount: calculation.couponDiscountAmount,
        final_amount: calculation.finalAmount,
        notes: `Redeemed for ${product.name}`
      });
    }

    logger.success(`Order created: ${order.orderId} for ${order.productName} by ${order.clientEmail}. Final: ₹${order.finalAmount}`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! DevCraft will contact you to initiate onboarding.',
      order: {
        id: order._id,
        orderId: order.orderId,
        productName: order.productName,
        productType: order.productType,
        originalPrice: order.originalPrice,
        productDiscountPercent: order.productDiscountPercent,
        discountedPrice: order.discountedPrice,
        couponCodeMask: order.couponCodeMask,
        couponDiscountPercent: order.couponDiscountPercent,
        couponDiscountAmount: order.couponDiscountAmount,
        finalAmount: order.finalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 5. Get user orders (protected)
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
 * 6. Record share event (Requirement 8)
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
 * 7. Get real share analytics (no fake numbers)
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
  checkoutOrder,
  getMyOrders,
  trackShareEvent,
  getShareAnalytics
};
