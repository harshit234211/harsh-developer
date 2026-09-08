const jwt = require('jsonwebtoken');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');

const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/devcraft_session=([^;]+)/);
    if (match) return decodeURIComponent(match[1].trim());
  }
  return null;
};

const protectUser = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token required. Please log in to your client account.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    let user = await dbService.User.findById(decoded.id);

    if (!user) {
      const admin = await dbService.Admin.findById(decoded.id);
      if (admin) {
        user = {
          _id: admin._id,
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: config.developer.phone || '',
          company: 'DevCraft Studio (Admin)',
          role: 'admin'
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or token has expired. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired user session. Please log in again.'
    });
  }
};

const optionalUserAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await dbService.User.findById(decoded.id);
    if (user) req.user = user;
  } catch (_) {}
  next();
};

module.exports = { protectUser, optionalUserAuth, extractToken };
