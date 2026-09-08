const express = require('express');
const router = express.Router();
const {
  getAdminCoupons,
  getAdminPrivateSeeds,
  generateAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
  regenerateAdminCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

// All admin coupon management routes are strictly protected by JWT Admin Guard
router.use(protect);

router.get('/', getAdminCoupons);
router.get('/private-seeds', getAdminPrivateSeeds);
router.post('/generate', generateAdminCoupon);
router.patch('/:id/toggle', toggleAdminCoupon);
router.delete('/:id', deleteAdminCoupon);
router.post('/:id/regenerate', regenerateAdminCoupon);

module.exports = router;
