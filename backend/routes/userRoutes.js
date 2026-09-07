const express = require('express');
const router = express.Router();
const { register, login, getMe, getMyEnquiries } = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuthMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', protectUser, getMe);
router.get('/my-enquiries', protectUser, getMyEnquiries);

module.exports = router;
