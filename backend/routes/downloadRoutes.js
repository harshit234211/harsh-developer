const express = require('express');
const router = express.Router();
const {
  upload,
  uploadProductFile,
  downloadProductFile,
  getDownloadHistory
} = require('../controllers/downloadController');
const { protectAdmin, optionalUserAuth } = require('../middleware/authMiddleware');

// Public / Client file download endpoint
router.get('/:productId', optionalUserAuth, downloadProductFile);

// User / Admin download history
router.get('/history/all', optionalUserAuth, getDownloadHistory);

// Admin software upload endpoint
router.post('/admin/upload', protectAdmin, upload.single('packageFile'), uploadProductFile);

module.exports = router;
