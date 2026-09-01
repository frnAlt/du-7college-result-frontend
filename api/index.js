const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const resultRoutes = require('../backend/src/routes/resultRoutes');

const app = express();

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-token']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Mount API routes at both /api and root
app.use('/api', resultRoutes);
app.use('/', resultRoutes);

module.exports = app;
