const jwt = require('jsonwebtoken');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');

const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

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
          phone: config.developerPhone || '',
          company: 'Harsh Developer (Admin)',
          role: 'admin'
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found. Please log in again.'
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

module.exports = { protectUser };
