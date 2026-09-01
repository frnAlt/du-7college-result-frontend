const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX, NODE_ENV } = require('../config/env');

const isTest = NODE_ENV === 'test';

/**
 * Standard API rate limiter to protect against brute-force attacks
 * Safely configured with numeric fallbacks
 */
const apiLimiter = rateLimit({
  windowMs: isTest ? 1000 : RATE_LIMIT_WINDOW_MS,
  max: isTest ? 1000 : RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after a few minutes.'
  }
});

module.exports = {
  apiLimiter
};
