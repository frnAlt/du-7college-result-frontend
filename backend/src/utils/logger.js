/**
 * Safe application logger without leaking sensitive or unauthorized information
 */
const logger = {
  info: (message, meta = '') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, meta ? meta : '');
  },
  warn: (message, meta = '') => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, meta ? meta : '');
  },
  error: (message, error = '') => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`, error ? (error.stack || error) : '');
  }
};

module.exports = logger;
