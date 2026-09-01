const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env files if present (backend directory or workspace root)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

/**
 * Safely parse a positive integer with fallback
 * Handles undefined, null, empty string, NaN, non-numeric strings, <= 0
 */
function parsePositiveInt(value, defaultValue) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const parsed = parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

/**
 * Safely parse a boolean with fallback
 * Handles undefined, null, empty string, 'true'/'false', '1'/'0'
 */
function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const str = String(value).trim().toLowerCase();
  return str === 'true' || str === '1' || str === 'yes';
}

/**
 * Safely parse string value with trimming
 */
function parseString(value, defaultValue = '') {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return String(value).trim();
}

/**
 * Resolve data file path across different environments (local, root, vercel serverless)
 */
function resolveDataFilePath(customPath) {
  if (customPath && typeof customPath === 'string' && customPath.trim()) {
    const trimmed = customPath.trim();
    if (fs.existsSync(trimmed)) return trimmed;
  }

  const candidatePaths = [
    path.resolve(__dirname, '../../data/results.json'),
    path.resolve(__dirname, '../../../data/results.json'),
    path.resolve(process.cwd(), 'data/results.json'),
    path.resolve(process.cwd(), 'backend/data/results.json')
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return candidatePaths[0];
}

const nodeEnv = parseString(process.env.NODE_ENV, 'development');
const isExternalApiEnabled = parseBoolean(process.env.ENABLE_EXTERNAL_API, false);
const externalApiBase = parseString(process.env.EXTERNAL_API_BASE, '');
const externalApiToken = parseString(process.env.EXTERNAL_API_TOKEN, '');

// Validation for external API when explicitly enabled
if (isExternalApiEnabled && !externalApiBase) {
  console.warn('[CONFIG WARNING] ENABLE_EXTERNAL_API is set to true, but EXTERNAL_API_BASE is empty.');
}

module.exports = {
  PORT: parsePositiveInt(process.env.PORT, 5000),
  NODE_ENV: nodeEnv,
  CLIENT_ORIGIN: parseString(process.env.CLIENT_ORIGIN, ''),
  ENABLE_EXTERNAL_API: isExternalApiEnabled,
  EXTERNAL_API_BASE: externalApiBase,
  EXTERNAL_API_TOKEN: externalApiToken,
  DATA_FILE_PATH: resolveDataFilePath(process.env.DATA_FILE_PATH),
  RATE_LIMIT_WINDOW_MS: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 900000), // 15 mins default (900000ms)
  RATE_LIMIT_MAX: parsePositiveInt(process.env.RATE_LIMIT_MAX, 60) // 60 requests default
};
