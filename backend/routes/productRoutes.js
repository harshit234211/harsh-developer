const express = require('express');
const router = express.Router();
const {
  getPublicProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDiscountRules,
  updateDiscountRules
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPublicProducts);
router.get('/:id', getProductById);

// Admin routes
router.get('/admin/all', protectAdmin, getAdminProducts);
router.post('/admin/create', protectAdmin, createProduct);
router.put('/admin/:id', protectAdmin, updateProduct);
router.delete('/admin/:id', protectAdmin, deleteProduct);

// Global Discount Rules
router.get('/admin/discounts/rules', protectAdmin, getDiscountRules);
router.patch('/admin/discounts/rules', protectAdmin, updateDiscountRules);

module.exports = router;
