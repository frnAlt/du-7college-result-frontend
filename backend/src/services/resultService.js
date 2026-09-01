const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA_FILE_PATH, ENABLE_EXTERNAL_API, EXTERNAL_API_BASE } = require('../config/env');
const logger = require('../utils/logger');
const externalApiService = require('./externalApiService');
const pdfService = require('./pdfService');

/**
 * Service to manage student result whitelist, validation, and PDF tokens
 */
class ResultService {
  constructor() {
    this.resultsData = [];
    this.pdfTokenCache = new Map(); // token -> { student, expiresAt, pdfBuffer }
    this.loadResultsData();
    this.setupFileWatcher();
  }

  /**
   * Load allowed results whitelist from JSON file
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
        logger.info(`Loaded ${this.resultsData.length} allowed student result records from ${resolvedPath}`);
      } else {
        logger.warn(`Results data file not found among candidate paths.`);
        this.resultsData = [];
      }
    } catch (err) {
      logger.error('Failed to load allowed results dataset', err);
      this.resultsData = [];
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
      // Ignore file watcher errors in serverless environments (read-only filesystem)
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

    // STRICT MATCH: Both roll and registration must match the EXACT same record in allowed list
    const matchedRecord = this.resultsData.find(student => {
      const sRoll = String(student.roll || '').trim();
      const sReg = String(student.registration || '').trim();
      return sRoll === cleanRoll && sReg === cleanReg;
    });

    if (!matchedRecord) {
      // Not allowed or not found in whitelist
      return null;
    }

    // Clone record to avoid mutating base data
    let studentResult = JSON.parse(JSON.stringify(matchedRecord));

    // Only attempt external fetch if ENABLE_EXTERNAL_API is true and student has externalFetch configured
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
   * Create a temporary secure PDF download token for a verified student record
   * @param {Object} student 
   * @returns {string} token
   */
  async createPdfToken(student) {
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours validity

    this.pdfTokenCache.set(token, {
      student,
      expiresAt
    });

    this.cleanExpiredTokens();

    return token;
  }

  /**
   * Retrieve student record or generate PDF buffer by token
   * @param {string} token 
   * @returns {Promise<{ student: Object, buffer: Buffer } | null>}
   */
  async getPdfByToken(token) {
    if (!token) return null;

    const entry = this.pdfTokenCache.get(token);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.pdfTokenCache.delete(token);
      return null;
    }

    if (!entry.pdfBuffer) {
      entry.pdfBuffer = await pdfService.generateResultPdf(entry.student);
    }

    return {
      student: entry.student,
      buffer: entry.pdfBuffer
    };
  }

  cleanExpiredTokens() {
    const now = Date.now();
    for (const [token, data] of this.pdfTokenCache.entries()) {
      if (now > data.expiresAt) {
        this.pdfTokenCache.delete(token);
      }
    }
  }
}

module.exports = new ResultService();
