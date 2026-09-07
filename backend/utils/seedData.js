const connectDB = require('../config/db');
const dbService = require('./dbAdapter');
const logger = require('./logger');

const runSeed = async () => {
  logger.info('Starting manual database seeding...');
  await connectDB();
  logger.success('Database seeded with admin and sample projects successfully!');
  process.exit(0);
};

if (require.main === module) {
  runSeed().catch((err) => {
    logger.error('Seed failed', err);
    process.exit(1);
  });
}

module.exports = runSeed;
