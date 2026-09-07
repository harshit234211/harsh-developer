const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');
const dbService = require('../utils/dbAdapter');

const connectDB = async () => {
  if (!config.mongoUri || config.mongoUri.trim() === '') {
    logger.info('No MONGODB_URI configured. Using persistent local document store (database/store.json).');
    await dbService.seed();
    return;
  }

  try {
    logger.info(`Attempting to connect to MongoDB: ${config.mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    logger.success('Connected to MongoDB successfully!');
    await dbService.seed();
  } catch (error) {
    logger.warn(`MongoDB connection failed (${error.message}). Falling back to persistent local document store.`);
    await dbService.seed();
  }
};

module.exports = connectDB;
