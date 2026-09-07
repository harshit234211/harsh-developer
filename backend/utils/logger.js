const logger = {
  info: (msg, meta = '') => {
    console.log(`\x1b[36m[INFO]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  success: (msg, meta = '') => {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  error: (msg, err = '') => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${msg}`, err);
  }
};

module.exports = logger;
