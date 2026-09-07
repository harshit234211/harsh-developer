const express = require('express');
const router = express.Router();
const { login, logout, getMe, getClients } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateLogin } = require('../middleware/validator');

router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/clients', protect, getClients);

module.exports = router;
