const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { validateResultRequest } = require('../middleware/validator');
const { apiLimiter } = require('../middleware/rateLimiter');

// Check student result with rate limiting & strict whitelist validation
router.post('/result', apiLimiter, validateResultRequest, (req, res) => {
  resultController.checkResult(req, res);
});

// View / Download student PDF result sheet
router.get('/result/pdf/:id', (req, res) => {
  resultController.getPdf(req, res);
});

// Health check endpoint
router.get('/health', (req, res) => {
  resultController.healthCheck(req, res);
});

module.exports = router;
