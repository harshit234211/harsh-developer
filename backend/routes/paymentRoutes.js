const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protectAdmin, optionalUserAuth } = require('../middleware/authMiddleware');

// Public / Client payment endpoints
router.post('/create-intent', optionalUserAuth, paymentController.createPaymentIntent);
router.post('/verify/:orderId', optionalUserAuth, paymentController.verifyPayment);
router.get('/status/:orderId', optionalUserAuth, paymentController.getPaymentStatus);

// Webhook & Callback
router.post('/webhook/tranz', paymentController.handleTranzWebhook);
router.all('/callback', paymentController.handlePaymentCallback);

// Protected Admin Payment Verification
router.post('/admin/verify-manual', protectAdmin, paymentController.adminVerifyPayment);

module.exports = router;
