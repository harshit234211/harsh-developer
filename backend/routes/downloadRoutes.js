const express = require('express');
const router = express.Router();
const {
  upload,
  uploadProductFile,
  generateDownloadToken,
  downloadProductFile,
  getDownloadHistory
} = require('../controllers/downloadController');
const { protectAdmin, optionalUserAuth } = require('../middleware/authMiddleware');

// Public / Client file download endpoint (Requires authorization for paid products)
router.get('/:productId', optionalUserAuth, downloadProductFile);

// Secure temporary download token generation for paid orders
router.get('/token/:orderId/:productId', optionalUserAuth, generateDownloadToken);

// User / Admin download history
router.get('/history/all', optionalUserAuth, getDownloadHistory);

// Admin software upload endpoint
router.post('/admin/upload', protectAdmin, upload.single('packageFile'), uploadProductFile);

module.exports = router;
