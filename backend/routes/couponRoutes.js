const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  redeemCoupon,
  getMyCouponUsages
} = require('../controllers/couponController');
const { protectUser } = require('../middleware/userAuthMiddleware');

// Client & Public Validation / Redemption
router.post('/validate', validateCoupon);
router.post('/redeem', redeemCoupon);

// Client account coupon redemption history
router.get('/my-usages', protectUser, getMyCouponUsages);

module.exports = router;
