const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  calculateOrder,
  calculateCartOrder,
  checkoutOrder,
  getMyOrders,
  getAdminOrders,
  trackShareEvent,
  getShareAnalytics
} = require('../controllers/orderController');
const { protectUser, optionalUserAuth } = require('../middleware/userAuthMiddleware');
const { protectAdmin } = require('../middleware/authMiddleware');

// Product catalog routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

// Order calculation & checkout routes
router.post('/orders/calculate', optionalUserAuth, calculateOrder);
router.post('/cart/calculate', optionalUserAuth, calculateCartOrder);
router.post('/orders/checkout', optionalUserAuth, checkoutOrder);
router.get('/orders/my-orders', protectUser, getMyOrders);
router.get('/admin/orders', protectAdmin, getAdminOrders);

// Share analytics routes (Requirement 8)
router.post('/analytics/share', optionalUserAuth, trackShareEvent);
router.get('/analytics/share', getShareAnalytics);

module.exports = router;
