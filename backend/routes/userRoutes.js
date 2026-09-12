const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  toggleSavedDemo,
  getMyEnquiries,
  getReferralStats
} = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuthMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

// Public Auth Endpoints
router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', loginLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Client Account Endpoints
router.get('/me', protectUser, getMe);
router.patch('/profile', protectUser, updateProfile);
router.post('/change-password', protectUser, changePassword);
router.post('/saved-demos/toggle', protectUser, toggleSavedDemo);
router.get('/my-enquiries', protectUser, getMyEnquiries);
router.get('/referrals', protectUser, getReferralStats);

module.exports = router;
