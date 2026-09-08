const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  calculateOrder,
  checkoutOrder,
  getMyOrders,
  trackShareEvent,
  getShareAnalytics
} = require('../controllers/orderController');
const { protectUser, optionalUserAuth } = require('../middleware/userAuthMiddleware');

// Product catalog routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

// Order calculation & checkout routes
router.post('/orders/calculate', optionalUserAuth, calculateOrder);
router.post('/orders/checkout', optionalUserAuth, checkoutOrder);
router.get('/orders/my-orders', protectUser, getMyOrders);

// Share analytics routes (Requirement 8)
router.post('/analytics/share', optionalUserAuth, trackShareEvent);
router.get('/analytics/share', getShareAnalytics);

module.exports = router;
