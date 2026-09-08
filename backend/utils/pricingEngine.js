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

module.exports = {
  findProductById,
  calculateAuthoritativePrice,
  DEVCRAFT_PRODUCTS
};
