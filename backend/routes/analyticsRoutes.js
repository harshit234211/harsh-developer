const express = require('express');
const router = express.Router();
const { trackEvent, getAdminInsights } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { optionalUserAuth } = require('../middleware/userAuthMiddleware');

// Public/authenticated tracking endpoint
router.post('/track', optionalUserAuth, trackEvent);

// Admin insights
router.get('/insights', protect, getAdminInsights);

module.exports = router;
