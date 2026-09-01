const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { validateResultRequest } = require('../middleware/validator');
const { apiLimiter } = require('../middleware/rateLimiter');

// Compatibility endpoint for https://resapi.eco.du.ac.bd/api/web-select
router.post('/web-select', apiLimiter, (req, res) => {
  resultController.handleWebSelect(req, res);
});

// Primary result check endpoint
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
