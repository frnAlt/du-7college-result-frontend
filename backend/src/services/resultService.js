const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA_FILE_PATH, ENABLE_EXTERNAL_API, EXTERNAL_API_BASE } = require('../config/env');
const logger = require('../utils/logger');
const externalApiService = require('./externalApiService');
const pdfService = require('./pdfService');

// Statically require the results JSON to ensure Vercel NFT bundler includes it
let staticResultsFallback = [];
try {
  staticResultsFallback = require('../../data/results.json');
} catch (e1) {
  try {
    staticResultsFallback = require('../../../data/results.json');
  } catch (e2) {
    staticResultsFallback = [];
  }
}

// Consistent HMAC signing key for stateless token verification across lambda instances
const TOKEN_SECRET = process.env.PDF_TOKEN_SECRET || 'du-7college-result-archive-signing-key-2024';

/**
 * Service to manage student result whitelist, validation, and stateless PDF tokens
 */
class ResultService {
  constructor() {
    this.resultsData = [];
    this.pdfTokenCache = new Map(); // Optional in-memory cache
    this.loadResultsData();
    this.setupFileWatcher();
  }

  /**
   * Load allowed results whitelist from JSON file or bundled fallback
   */
  loadResultsData() {
    try {
      const candidatePaths = [
        DATA_FILE_PATH,
        path.resolve(__dirname, '../../data/results.json'),
        path.resolve(__dirname, '../../../data/results.json'),
        path.resolve(process.cwd(), 'data/results.json'),
        path.resolve(process.cwd(), 'backend/data/results.json')
      ];

      let resolvedPath = null;
      for (const p of candidatePaths) {
        if (p && fs.existsSync(p)) {
          resolvedPath = p;
          break;
        }
      }

      if (resolvedPath) {
        const raw = fs.readFileSync(resolvedPath, 'utf8');
        this.resultsData = JSON.parse(raw);
        logger.info(`Loaded ${this.resultsData.length} student records from ${resolvedPath}`);
      } else if (Array.isArray(staticResultsFallback) && staticResultsFallback.length > 0) {
        this.resultsData = JSON.parse(JSON.stringify(staticResultsFallback));
        logger.info(`Loaded ${this.resultsData.length} student records from bundled fallback`);
      } else {
        logger.warn(`Results data file not found among candidate paths.`);
        this.resultsData = [];
      }
    } catch (err) {
      if (Array.isArray(staticResultsFallback) && staticResultsFallback.length > 0) {
        this.resultsData = JSON.parse(JSON.stringify(staticResultsFallback));
      } else {
        logger.error('Failed to load allowed results dataset', err);
        this.resultsData = [];
      }
    }
  }

  /**
   * Setup file watcher to hot-reload results.json without server restart
   */
  setupFileWatcher() {
    try {
      const dataDir = path.dirname(DATA_FILE_PATH);
      if (fs.existsSync(dataDir)) {
        fs.watch(dataDir, (eventType, filename) => {
          if (filename && filename.endsWith('results.json')) {
            logger.info('Detected changes in results.json, reloading dataset...');
            setTimeout(() => this.loadResultsData(), 200);
          }
        });
      }
    } catch (e) {
      // Ignore file watcher in serverless environments
    }
  }

  /**
   * Strictly verify if Roll Number and Registration Number match an allowed student record
   * @param {string} rollInput 
   * @param {string} regInput 
   * @param {string} clientIp
   * @returns {Promise<Object|null>}
   */
  async findAllowedResult(rollInput, regInput, clientIp = '127.0.0.1') {
    const cleanRoll = String(rollInput || '').trim();
    const cleanReg = String(regInput || '').trim();

    if (!cleanRoll || !cleanReg) {
      return null;
    }

    if (!this.resultsData || this.resultsData.length === 0) {
      this.loadResultsData();
    }

    // STRICT MATCH: Both roll and registration must match the EXACT same record in allowed list
    const matchedRecord = this.resultsData.find(student => {
      const sRoll = String(student.roll || '').trim();
      const sReg = String(student.registration || '').trim();
      return sRoll === cleanRoll && sReg === cleanReg;
    });

    if (!matchedRecord) {
      return null;
    }

    let studentResult = JSON.parse(JSON.stringify(matchedRecord));

    if (ENABLE_EXTERNAL_API && EXTERNAL_API_BASE && studentResult.externalFetch && studentResult.externalFetch.enabled) {
      try {
        const externalData = await externalApiService.fetchExternalResult({
          pid: studentResult.externalFetch.pid,
          yid: studentResult.externalFetch.yid,
          eid: studentResult.externalFetch.eid,
          roll: cleanRoll,
          reg: cleanReg,
          clientIp
        });

        if (externalData && externalData.result) {
          const extRes = externalData.result;
          studentResult.name = extRes.name || studentResult.name;
          studentResult.college_name = extRes.college_name || studentResult.college_name;
          studentResult.sub_name = extRes.sub_name || studentResult.sub_name;
          studentResult.exam_title = extRes.exam_title || studentResult.exam_title;
          studentResult.cgpa = extRes.cgpa || studentResult.cgpa;
          studentResult.pstatus = extRes.pstatus || studentResult.pstatus;

          if (externalData.courses && externalData.courses.length > 0) {
            studentResult.courses = externalData.courses.map(c => ({
              code: c.pap_code || c.code || '',
              title: c.pname || c.title || 'Course Paper',
              letter_grade: c.lg || c.letter_grade || 'A',
              grade_point: c.gp ? String(c.gp) : (c.grade_point || '4.00'),
              credit: c.credit ? String(c.credit) : '4.0'
            }));
          }
        }
      } catch (err) {
        logger.warn(`External sync error for roll ${cleanRoll}, using preconfigured record.`);
      }
    }

    return studentResult;
  }

  /**
   * Create a stateless, HMAC-signed PDF token for a verified student record
   * Works across multiple serverless lambda containers
   * @param {Object} student 
   * @returns {string} token
   */
  async createPdfToken(student) {
    const payload = {
      r: String(student.roll || '').trim(),
      g: String(student.registration || '').trim(),
      id: student.id || '',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days validity
    };

    const dataB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(dataB64).digest('base64url');
    const token = `${dataB64}.${signature}`;

    // Also populate in-memory cache for instant lookup
    this.pdfTokenCache.set(token, {
      student,
      expiresAt: payload.exp
    });

    return token;
  }

  /**
   * Retrieve student record and generate PDF buffer by token (Stateless & Serverless Safe)
   * @param {string} token 
   * @returns {Promise<{ student: Object, buffer: Buffer } | null>}
   */
  async getPdfByToken(token) {
    if (!token || typeof token !== 'string') return null;

    if (!this.resultsData || this.resultsData.length === 0) {
      this.loadResultsData();
    }

    // 1. Check in-memory cache first
    const cachedEntry = this.pdfTokenCache.get(token);
    if (cachedEntry && Date.now() <= cachedEntry.expiresAt) {
      if (!cachedEntry.pdfBuffer) {
        cachedEntry.pdfBuffer = await pdfService.generateResultPdf(cachedEntry.student);
      }
      return {
        student: cachedEntry.student,
        buffer: cachedEntry.pdfBuffer
      };
    }

    // 2. Stateless HMAC token verification (Solves Vercel serverless multi-instance state)
    if (token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 2) {
        const [dataB64, sig] = parts;
        const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(dataB64).digest('base64url');

        if (sig === expectedSig) {
          try {
            const payload = JSON.parse(Buffer.from(dataB64, 'base64url').toString('utf8'));
            if (!payload.exp || Date.now() <= payload.exp) {
              const matchedStudent = this.resultsData.find(s => {
                const sRoll = String(s.roll || '').trim();
                const sReg = String(s.registration || '').trim();
                return sRoll === payload.r && sReg === payload.g;
              });

              if (matchedStudent) {
                const pdfBuffer = await pdfService.generateResultPdf(matchedStudent);
                return {
                  student: matchedStudent,
                  buffer: pdfBuffer
                };
              }
            }
          } catch (e) {
            logger.warn('Failed to parse stateless PDF token payload');
          }
        }
      }
    }

    // 3. Fallback: Lookup by student ID or Roll in whitelist
    const directMatch = this.resultsData.find(s => s.id === token || s.roll === token);
    if (directMatch) {
      const pdfBuffer = await pdfService.generateResultPdf(directMatch);
      return {
        student: directMatch,
        buffer: pdfBuffer
      };
    }

    return null;
  }
}

module.exports = new ResultService();
