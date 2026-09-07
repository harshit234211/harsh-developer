const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getStats
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateEnquiry } = require('../middleware/validator');

// Public contact submission
router.post('/', contactLimiter, validateEnquiry, createEnquiry);

// Admin enquiry operations
router.get('/stats', protect, getStats);
router.get('/', protect, getEnquiries);
router.get('/:id', protect, getEnquiryById);
router.patch('/:id', protect, updateEnquiryStatus);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
