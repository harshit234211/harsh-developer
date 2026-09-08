const dbService = require('../utils/dbAdapter');
const couponSecurity = require('../utils/couponSecurity');
const logger = require('../utils/logger');

// Disallowed legacy / public codes
const FORBIDDEN_CODES = new Set(['DEV20X', 'DEV50X', 'DEV95X', 'DEVCRAFT10']);

/**
 * Public/Client: Validate coupon code against subtotal without committing
 */
const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal, email, orderId } = req.body;
    const attemptKey = couponSecurity.getAttemptKey(req, email);

    // 1. Rate Limit & Brute-force check
    if (couponSecurity.isBruteForced(attemptKey)) {
      const cooldown = couponSecurity.getCooldownSeconds(attemptKey);
      logger.warn(`Brute force attempt blocked for key: ${attemptKey}`);
      return res.status(429).json({
        success: false,
        valid: false,
        message: `Too many invalid coupon attempts. Temporary security lockout active for ${cooldown} seconds.`
      });
    }

    // 2. Validate Code input
    if (!code || typeof code !== 'string') {
      couponSecurity.recordFailedAttempt(attemptKey);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Please provide a valid coupon code.'
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // 3. Reject legacy or public retired codes
    if (FORBIDDEN_CODES.has(cleanCode) || cleanCode.startsWith('DEV20X') || cleanCode.startsWith('DEV50X') || cleanCode.startsWith('DEV95X')) {
      couponSecurity.recordFailedAttempt(attemptKey);
      logger.warn(`Rejected forbidden legacy promo code attempt: ${cleanCode}`);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'This promo code is invalid or has been permanently retired.'
      });
    }

    // 4. Validate Format
    if (!couponSecurity.isCouponCodeValidFormat(cleanCode)) {
      couponSecurity.recordFailedAttempt(attemptKey);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Invalid promo code format. Codes must follow DEV-XXXX-XXXX-XXXX.'
      });
    }

    // 5. Validate Subtotal
    const amount = Number(subtotal);
    if (isNaN(amount) || amount <= 0 || !isFinite(amount) || amount > 50000000) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Order subtotal must be a valid positive amount.'
      });
    }

    // 6. Query DB by cryptographic hash
    const hash = couponSecurity.hashCouponCode(cleanCode);
    const coupon = await dbService.Coupon.findOne({ code_hash: hash });

    if (!coupon) {
      couponSecurity.recordFailedAttempt(attemptKey);
      logger.warn(`Failed coupon validation for hash: ${hash.slice(0, 10)}... (attempt on ${attemptKey})`);
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Promo code not found or invalid.'
      });
    }

    // 7. Check Active Status
    if (!coupon.active) {
      couponSecurity.recordFailedAttempt(attemptKey);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'This coupon code has been deactivated or revoked.'
      });
    }

    // 8. Check Expiry
    if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= Date.now()) {
      couponSecurity.recordFailedAttempt(attemptKey);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'This coupon code has expired.'
      });
    }

    // 9. Check Max Uses Limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      couponSecurity.recordFailedAttempt(attemptKey);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'This exclusive coupon code has reached its maximum redemption capacity.'
      });
    }

    // 10. Check User Account Restriction
    const clientEmail = (req.user && req.user.email) || (email ? email.toString().toLowerCase().trim() : '');
    if (coupon.user_restriction) {
      if (!clientEmail || clientEmail !== coupon.user_restriction.toLowerCase().trim()) {
        couponSecurity.recordFailedAttempt(attemptKey);
        return res.status(403).json({
          success: false,
          valid: false,
          message: 'This exclusive coupon is restricted to a specific registered client account.'
        });
      }
    }

    // 11. Check duplicate redemptions if user is identified
    if (clientEmail) {
      const pastUsages = await dbService.CouponUsage.find({
        coupon_id: coupon._id,
        user_email: clientEmail
      });
      if (pastUsages.length > 0 && coupon.max_uses === 1) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: 'You have already redeemed this single-use coupon on a previous order.'
        });
      }
    }

    // Reset failed attempts on clean validation
    couponSecurity.resetFailedAttempts(attemptKey);

    // 12. Authoritative Server-side Price Calculation
    const discountPercentage = Number(coupon.discount_percentage);
    const discountAmount = Math.round((amount * discountPercentage) / 100);
    const finalAmount = Math.max(0, amount - discountAmount);

    res.status(200).json({
      success: true,
      valid: true,
      couponId: coupon._id,
      codeMask: coupon.code_mask,
      discountPercentage,
      discountAmount,
      originalAmount: amount,
      finalAmount,
      message: `Verified: ${discountPercentage}% discount successfully calculated!`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Public/Client: Authoritative checkout redemption of coupon
 */
const redeemCoupon = async (req, res, next) => {
  try {
    const { code, subtotal, email, orderId, notes } = req.body;
    const attemptKey = couponSecurity.getAttemptKey(req, email);

    if (couponSecurity.isBruteForced(attemptKey)) {
      return res.status(429).json({
        success: false,
        message: 'Too many invalid attempts. Temporary security lockout active.'
      });
    }

    if (!code || !subtotal || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code, subtotal, and order/reference ID are required for redemption.'
      });
    }

    const cleanCode = code.trim().toUpperCase();
    if (FORBIDDEN_CODES.has(cleanCode)) {
      return res.status(400).json({ success: false, message: 'Invalid or retired promo code.' });
    }

    const hash = couponSecurity.hashCouponCode(cleanCode);
    const coupon = await dbService.Coupon.findOne({ code_hash: hash });

    if (!coupon || !coupon.active) {
      couponSecurity.recordFailedAttempt(attemptKey);
      return res.status(400).json({ success: false, message: 'Coupon is invalid or deactivated.' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired.' });
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ success: false, message: 'Coupon has reached its maximum redemptions.' });
    }

    const clientEmail = (req.user && req.user.email) || (email ? email.toString().toLowerCase().trim() : null);
    const userId = (req.user && req.user._id) || null;

    if (coupon.user_restriction) {
      if (!clientEmail || clientEmail !== coupon.user_restriction.toLowerCase().trim()) {
        return res.status(403).json({
          success: false,
          message: 'This coupon is restricted to a different client account.'
        });
      }
    }

    const amount = Number(subtotal);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order subtotal.' });
    }

    const discountPercentage = Number(coupon.discount_percentage);
    const discountAmount = Math.round((amount * discountPercentage) / 100);
    const finalAmount = Math.max(0, amount - discountAmount);

    // Atomically increment used count
    const updatedCount = coupon.used_count + 1;
    await dbService.Coupon.findByIdAndUpdate(coupon._id, {
      used_count: updatedCount,
      active: updatedCount >= coupon.max_uses && coupon.max_uses === 1 ? false : coupon.active
    });

    // Record audit usage log
    const usage = await dbService.CouponUsage.create({
      coupon_id: coupon._id,
      code_mask: coupon.code_mask,
      discount_percentage: discountPercentage,
      user_id: userId,
      user_email: clientEmail,
      order_id: orderId,
      original_amount: amount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      notes: notes || 'Redeemed during project inquiry or demo checkout'
    });

    couponSecurity.resetFailedAttempts(attemptKey);
    logger.success(`Coupon ${coupon.code_mask} (${discountPercentage}% off) redeemed for order ${orderId} by ${clientEmail || 'Guest'}. Final: ₹${finalAmount}`);

    res.status(200).json({
      success: true,
      message: `Coupon successfully redeemed! ${discountPercentage}% discount applied.`,
      usageId: usage._id,
      orderId,
      originalAmount: amount,
      discountPercentage,
      discountAmount,
      finalAmount,
      codeMask: coupon.code_mask
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Client Portal: Retrieve user's coupon redemption history
 */
const getMyCouponUsages = async (req, res, next) => {
  try {
    const userEmail = req.user && req.user.email;
    const userId = req.user && req.user._id;

    const usages = await dbService.CouponUsage.find({
      user_email: userEmail,
      user_id: userId
    });

    res.status(200).json({
      success: true,
      count: usages.length,
      usages
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get all coupons (safe masked info only - never raw codes)
 */
const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await dbService.Coupon.find({});
    const totalUsages = await dbService.CouponUsage.countDocuments({});
    
    // Calculate total discount savings
    const allUsages = await dbService.CouponUsage.find({});
    const totalDiscountSaved = allUsages.reduce((sum, u) => sum + (u.discount_amount || 0), 0);

    const safeCoupons = coupons.map(c => ({
      _id: c._id,
      code_mask: c.code_mask,
      discount_percentage: c.discount_percentage,
      active: c.active,
      expires_at: c.expires_at,
      max_uses: c.max_uses,
      used_count: c.used_count,
      user_restriction: c.user_restriction,
      notes: c.notes,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: safeCoupons.length,
      stats: {
        totalCoupons: safeCoupons.length,
        activeCoupons: safeCoupons.filter(c => c.active).length,
        totalRedemptions: totalUsages,
        totalSavingsGiven: totalDiscountSaved
      },
      coupons: safeCoupons
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: View the 3 initial private seed offers securely
 */
const getAdminPrivateSeeds = async (req, res, next) => {
  try {
    const seeds = dbService.getPrivateCouponsSeed();
    res.status(200).json({
      success: true,
      seeds
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Generate new coupon with random cryptographic code
 * Raw code is returned ONLY ONCE in the response for admin to copy
 */
const generateAdminCoupon = async (req, res, next) => {
  try {
    const { discountPercentage, maxUses, expiresAt, userRestriction, notes } = req.body;

    const discount = Number(discountPercentage);
    if (![20, 50, 95].includes(discount)) {
      return res.status(400).json({
        success: false,
        message: 'Discount percentage must be one of the 3 standard tiers: 20%, 50%, or 95%.'
      });
    }

    const rawCode = couponSecurity.generateCouponCode();
    const hash = couponSecurity.hashCouponCode(rawCode);
    const mask = couponSecurity.maskCouponCode(rawCode);

    const coupon = await dbService.Coupon.create({
      code_hash: hash,
      code_mask: mask,
      discount_percentage: discount,
      active: true,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      max_uses: Number(maxUses) > 0 ? Number(maxUses) : 1,
      used_count: 0,
      user_restriction: userRestriction ? userRestriction.toString().toLowerCase().trim() : null,
      notes: notes ? notes.trim() : `Admin Generated ${discount}% Discount Offer`
    });

    logger.success(`Admin generated coupon ${mask} (${discount}% off)`);

    // RAW CODE IS RETURNED ONLY IN THIS SINGLE RESPONSE
    res.status(201).json({
      success: true,
      message: 'Cryptographically secure coupon generated successfully. Copy the raw code now; it cannot be viewed again!',
      rawCode, // Single-use reveal
      coupon: {
        _id: coupon._id,
        code_mask: mask,
        discount_percentage: coupon.discount_percentage,
        active: coupon.active,
        expires_at: coupon.expires_at,
        max_uses: coupon.max_uses,
        used_count: coupon.used_count,
        user_restriction: coupon.user_restriction,
        notes: coupon.notes,
        createdAt: coupon.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Toggle active/inactive
 */
const toggleAdminCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await dbService.Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    const updated = await dbService.Coupon.findByIdAndUpdate(id, {
      active: !coupon.active
    });

    logger.info(`Admin toggled coupon ${coupon.code_mask} to active=${!coupon.active}`);

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code_mask} is now ${!coupon.active ? 'Active' : 'Inactive'}.`,
      coupon: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Revoke / Delete coupon
 */
const deleteAdminCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dbService.Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    logger.info(`Admin revoked coupon ID ${id}`);

    res.status(200).json({
      success: true,
      message: 'Coupon has been revoked and removed.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Regenerate replacement coupon
 */
const regenerateAdminCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await dbService.Coupon.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    // Revoke old coupon
    await dbService.Coupon.findByIdAndUpdate(id, { active: false, notes: `${existing.notes} (Superseded)` });

    // Generate new code with same attributes
    const rawCode = couponSecurity.generateCouponCode();
    const hash = couponSecurity.hashCouponCode(rawCode);
    const mask = couponSecurity.maskCouponCode(rawCode);

    const replacement = await dbService.Coupon.create({
      code_hash: hash,
      code_mask: mask,
      discount_percentage: existing.discount_percentage,
      active: true,
      expires_at: existing.expires_at,
      max_uses: existing.max_uses,
      used_count: 0,
      user_restriction: existing.user_restriction,
      notes: `Replacement for ${existing.code_mask}`
    });

    logger.success(`Admin regenerated replacement coupon for ${existing.code_mask} -> ${mask}`);

    res.status(201).json({
      success: true,
      message: 'Replacement coupon generated. Copy the new secret code now.',
      rawCode,
      coupon: replacement
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateCoupon,
  redeemCoupon,
  getMyCouponUsages,
  getAdminCoupons,
  getAdminPrivateSeeds,
  generateAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
  regenerateAdminCoupon
};
