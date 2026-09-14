const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getMyFeedback,
  getAllFeedbackAdmin,
  updateFeedbackAdmin
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { protectUser, optionalUserAuth } = require('../middleware/userAuthMiddleware');

// Public/User submission
router.post('/', optionalUserAuth, submitFeedback);

// Client account requests
router.get('/my-requests', protectUser, getMyFeedback);

// Admin moderation (supports both /api/feedback/admin and mounted /api/admin/feedback)
router.get('/admin', protect, getAllFeedbackAdmin);
router.patch('/admin/:id', protect, updateFeedbackAdmin);
router.get('/', protect, getAllFeedbackAdmin);
router.patch('/:id', protect, updateFeedbackAdmin);

module.exports = router;
