const path = require('path');
const dotenv = require('dotenv');

// Load .env file from backend root or workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  EXTERNAL_API_BASE: process.env.EXTERNAL_API_BASE || 'https://resapi.eco.du.ac.bd',
  EXTERNAL_API_TOKEN: process.env.EXTERNAL_API_TOKEN || '8f3c1e2d3a4b5c6d7e8f9a0b1c2d3e4f',
  DATA_FILE_PATH: process.env.DATA_FILE_PATH || path.resolve(__dirname, '../../data/results.json'),
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100, // max 100 requests per 15 mins
  ENABLE_EXTERNAL_API: process.env.ENABLE_EXTERNAL_API !== 'false'
};
