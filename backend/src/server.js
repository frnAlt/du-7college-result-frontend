const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PORT, CLIENT_ORIGIN, NODE_ENV } = require('./config/env');
const resultRoutes = require('./routes/resultRoutes');
const logger = require('./utils/logger');

const app = express();

// Security headers with permission for PDF embedding in iframes
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allow embedded PDF viewing and modern UI assets
}));

// CORS Configuration
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for easy local preview & deployment
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-token']
}));

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root Greeting Route
app.get('/', (req, res) => {
  res.json({
    name: 'BoardResultsBD API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      checkResult: 'POST /api/result',
      getPdf: 'GET /api/result/pdf/:id',
      health: 'GET /api/health'
    }
  });
});

// API Routes
app.use('/api', resultRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled server error', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`=========================================`);
    logger.info(`🚀 BoardResultsBD Server started on port: ${PORT}`);
    logger.info(`🌐 Local URL: http://localhost:${PORT}`);
    logger.info(`📁 Environment: ${NODE_ENV}`);
    logger.info(`=========================================`);
  });
}

module.exports = app;
