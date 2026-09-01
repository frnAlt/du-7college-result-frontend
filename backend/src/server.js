const express = require('express');
const path = require('path');
const fs = require('fs');
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
  contentSecurityPolicy: false
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
    if (!origin || allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-token']
}));

// Body Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static images and public assets
const publicImagesPath = path.resolve(__dirname, '../public');
if (fs.existsSync(publicImagesPath)) {
  app.use(express.static(publicImagesPath));
}

// API Routes
app.use('/api', resultRoutes);

// Serve Frontend in Production / Standalone deployment
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  logger.info(`Serving static frontend build from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root Greeting Route in API-only mode
  app.get('/', (req, res) => {
    res.json({
      name: 'Affiliated 7 College Result Archive API',
      organization: 'Office of the Controller of Examinations, University of Dhaka',
      status: 'Online',
      endpoints: {
        webSelect: 'POST /api/web-select',
        checkResult: 'POST /api/result',
        getPdf: 'GET /api/result/pdf/:id',
        health: 'GET /api/health'
      }
    });
  });
}

// 404 Route Handler for unmatched API routes
app.use('/api/*', (req, res) => {
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
    logger.info(`================================================================`);
    logger.info(`🎓 Office of the Controller of Examinations - University of Dhaka`);
    logger.info(`🚀 Portal & API Server running on port: ${PORT}`);
    logger.info(`🌐 Local URL: http://localhost:${PORT}`);
    logger.info(`📁 Environment: ${NODE_ENV}`);
    logger.info(`================================================================`);
  });
}

module.exports = app;
