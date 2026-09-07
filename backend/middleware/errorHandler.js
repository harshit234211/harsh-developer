const logger = require('../utils/logger');
const config = require('../config/env');

const notFound = (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
};

module.exports = { notFound, errorHandler };
