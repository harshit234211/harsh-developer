const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getMe,
  getClients,
  getAdminReferrals,
  getAdminSettings,
  updateAdminSettings,
  getAdminActivityLogs
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateLogin } = require('../middleware/validator');

router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/clients', protect, getClients);
router.get('/users', protect, getClients);
router.get('/referrals', protect, getAdminReferrals);
router.get('/settings', protect, getAdminSettings);
router.patch('/settings', protect, updateAdminSettings);
router.get('/activity', protect, getAdminActivityLogs);

module.exports = router;
