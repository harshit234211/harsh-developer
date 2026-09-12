const { DEVCRAFT_PRODUCTS, calculatePricing } = require('../../scripts/data_products');
const couponSecurity = require('./couponSecurity');
const dbService = require('./dbAdapter');
const logger = require('./logger');

const FORBIDDEN_CODES = new Set(['DEV20X', 'DEV50X', 'DEV95X', 'DEVCRAFT10']);

function findProductById(productId) {
  if (!productId) return null;
  const cleanId = String(productId).trim().toLowerCase();
  return DEVCRAFT_PRODUCTS.find(p => p.id.toLowerCase() === cleanId) || null;
}

/**
 * Server-authoritative calculation of product pricing and coupon discount
 */
async function calculateAuthoritativePrice(productId, couponCode = null, clientEmail = null, req = null) {
  const product = findProductById(productId);
  if (!product) {
    return {
      success: false,
      message: 'Product or course not found in catalog.'
    };
  }

  // Base dynamic discount (50% for App products, 30% for Aptitude)
  const isAptitude = product.type === 'aptitude' || 
                     product.category === 'Aptitude' || 
                     (product.category && product.category.toLowerCase().includes('aptitude'));
  const productDiscountPercent = isAptitude ? 30 : 50;
  const originalPrice = Number(product.originalPrice) || 10000;
  const productDiscountAmount = Math.round(originalPrice * (productDiscountPercent / 100));
  const discountedPrice = Math.max(0, originalPrice - productDiscountAmount);

  let couponResult = {
    applied: false,
    codeMask: null,
    discountPercent: 0,
    discountAmount: 0,
    message: null,
    error: null,
    couponDoc: null
  };

  if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const attemptKey = req ? couponSecurity.getAttemptKey(req, clientEmail) : `127.0.0.1::${clientEmail || ''}`;

    if (couponSecurity.isBruteForced(attemptKey)) {
      return {
        success: false,
        message: 'Too many invalid attempts. Temporary security lockout active (15 minutes).',
        locked: true
      };
    }

    // Check retired legacy codes
    if (FORBIDDEN_CODES.has(cleanCode)) {
      couponSecurity.recordFailedAttempt(attemptKey);
      couponResult.error = 'Invalid or expired coupon code.';
    } else {
      const hash = couponSecurity.hashCouponCode(cleanCode);
      const coupon = await dbService.Coupon.findOne({ code_hash: hash });

      if (!coupon || !coupon.active) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'Invalid or expired coupon code.';
      } else if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= Date.now()) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'Invalid or expired coupon code.';
      } else if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'This coupon has reached its maximum redemptions.';
      } else if (coupon.user_restriction && clientEmail && clientEmail.toLowerCase().trim() !== coupon.user_restriction.toLowerCase().trim()) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'This coupon is restricted to a different client account.';
      } else {
        // Valid coupon!
        couponSecurity.resetFailedAttempts(attemptKey);
        const couponDiscountPercent = Number(coupon.discount_percentage);
        const couponDiscountAmount = Math.round(discountedPrice * (couponDiscountPercent / 100));

        couponResult = {
          applied: true,
          codeMask: coupon.code_mask,
          discountPercent: couponDiscountPercent,
          discountAmount: couponDiscountAmount,
          message: 'Coupon applied successfully.',
          error: null,
          couponDoc: coupon
        };
      }
    }
  }

  const finalAmount = Math.max(0, discountedPrice - couponResult.discountAmount);

  return {
    success: true,
    product: {
      id: product.id,
      name: product.name,
      type: product.type,
      category: product.category,
      badge: product.badge,
      image: product.image,
      features: product.features,
      technologies: product.technologies,
      shortDesc: product.shortDesc
    },
    calculation: {
      isAptitude,
      originalPrice,
      productDiscountPercent,
      productDiscountAmount,
      discountedPrice,
      couponApplied: couponResult.applied,
      couponCodeMask: couponResult.codeMask,
      couponDiscountPercent: couponResult.discountPercent,
      couponDiscountAmount: couponResult.discountAmount,
      couponMessage: couponResult.message,
      couponError: couponResult.error,
      finalAmount
    },
    _couponDoc: couponResult.couponDoc
  };
}

/**
 * Server-authoritative calculation for a multi-item cart
 */
async function calculateAuthoritativeCart(cartItems = [], couponCode = null, clientEmail = null, req = null) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return {
      success: false,
      message: 'Cart is empty.'
    };
  }

  const rules = dbService.getDiscountRules ? dbService.getDiscountRules() : { appDefaultDiscount: 50, aptitudeDefaultDiscount: 30 };
  let processedItems = [];
  let totalOriginalPrice = 0;
  let totalProductDiscount = 0;
  let subtotalDiscounted = 0;

  for (const item of cartItems) {
    const p = findProductById(item.productId || item.id);
    if (!p) continue;

    const qty = Math.max(1, Math.min(99, parseInt(item.quantity || 1, 10) || 1));
    const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude' || (p.category && p.category.toLowerCase().includes('aptitude'));
    const discountPercent = p.discountPercent !== undefined && p.discountPercent !== null 
      ? Number(p.discountPercent) 
      : (isAptitude ? (rules.aptitudeDefaultDiscount || 30) : (rules.appDefaultDiscount || 50));
    
    const unitOriginal = Number(p.originalPrice) || 10000;
    const unitDiscountAmount = Math.round(unitOriginal * (discountPercent / 100));
    const unitDiscounted = Math.max(0, unitOriginal - unitDiscountAmount);

    const lineOriginal = unitOriginal * qty;
    const lineDiscount = unitDiscountAmount * qty;
    const lineDiscounted = unitDiscounted * qty;

    totalOriginalPrice += lineOriginal;
    totalProductDiscount += lineDiscount;
    subtotalDiscounted += lineDiscounted;

    processedItems.push({
      productId: p.id,
      productName: p.name,
      productType: p.type,
      category: p.category,
      platform: p.platform,
      image: p.image,
      quantity: qty,
      unitOriginalPrice: unitOriginal,
      unitDiscountPercent: discountPercent,
      unitFinalPrice: unitDiscounted,
      lineOriginalPrice: lineOriginal,
      lineDiscountAmount: lineDiscount,
      lineFinalPrice: lineDiscounted
    });
  }

  if (processedItems.length === 0) {
    return {
      success: false,
      message: 'No valid products in cart.'
    };
  }

  let couponResult = {
    applied: false,
    codeMask: null,
    discountPercent: 0,
    discountAmount: 0,
    message: null,
    error: null,
    couponDoc: null
  };

  if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const attemptKey = req ? couponSecurity.getAttemptKey(req, clientEmail) : `127.0.0.1::${clientEmail || ''}`;

    if (couponSecurity.isBruteForced(attemptKey)) {
      return {
        success: false,
        message: 'Too many invalid attempts. Temporary security lockout active (15 minutes).',
        locked: true
      };
    }

    if (FORBIDDEN_CODES.has(cleanCode)) {
      couponSecurity.recordFailedAttempt(attemptKey);
      couponResult.error = 'Invalid or expired coupon code.';
    } else {
      const hash = couponSecurity.hashCouponCode(cleanCode);
      const coupon = await dbService.Coupon.findOne({ code_hash: hash });

      if (!coupon || !coupon.active) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'Invalid or expired coupon code.';
      } else if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= Date.now()) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'Invalid or expired coupon code.';
      } else if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'This coupon has reached its maximum redemptions.';
      } else if (coupon.user_restriction && clientEmail && clientEmail.toLowerCase().trim() !== coupon.user_restriction.toLowerCase().trim()) {
        couponSecurity.recordFailedAttempt(attemptKey);
        couponResult.error = 'This coupon is restricted to a different client account.';
      } else {
        couponSecurity.resetFailedAttempts(attemptKey);
        const couponDiscountPercent = Number(coupon.discount_percentage);
        const couponDiscountAmount = Math.round(subtotalDiscounted * (couponDiscountPercent / 100));

        couponResult = {
          applied: true,
          codeMask: coupon.code_mask,
          discountPercent: couponDiscountPercent,
          discountAmount: couponDiscountAmount,
          message: 'Coupon applied successfully.',
          error: null,
          couponDoc: coupon
        };
      }
    }
  }

  const finalAmount = Math.max(0, subtotalDiscounted - couponResult.discountAmount);

  return {
    success: true,
    items: processedItems,
    summary: {
      totalItems: processedItems.reduce((s, i) => s + i.quantity, 0),
      totalOriginalPrice,
      totalProductDiscount,
      subtotalDiscounted,
      couponApplied: couponResult.applied,
      couponCodeMask: couponResult.codeMask,
      couponDiscountPercent: couponResult.discountPercent,
      couponDiscountAmount: couponResult.discountAmount,
      couponMessage: couponResult.message,
      couponError: couponResult.error,
      finalAmount
    },
    _couponDoc: couponResult.couponDoc
  };
}

module.exports = {
  findProductById,
  calculateAuthoritativePrice,
  calculateAuthoritativeCart,
  DEVCRAFT_PRODUCTS
};
