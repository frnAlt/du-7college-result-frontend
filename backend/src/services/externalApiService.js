const { EXTERNAL_API_BASE, EXTERNAL_API_TOKEN, ENABLE_EXTERNAL_API } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Service to interact with external DU 7-College API (if enabled)
 */
class ExternalApiService {
  /**
   * Fetch result from external API endpoint
   * @param {Object} params - { pid, yid, eid, roll, reg, clientIp }
   */
  async fetchExternalResult({ pid, yid, eid, roll, reg, clientIp = '127.0.0.1' }) {
    if (!ENABLE_EXTERNAL_API) {
      return null;
    }

    if (!EXTERNAL_API_BASE) {
      logger.warn('External API call skipped: EXTERNAL_API_BASE is not configured.');
      return null;
    }

    try {
      logger.info(`Attempting external API result fetch for roll: ${roll}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DU7C-ResultArchive/1.0'
      };

      if (EXTERNAL_API_TOKEN) {
        headers['x-api-token'] = EXTERNAL_API_TOKEN;
      }

      const response = await fetch(`${EXTERNAL_API_BASE}/api/web-select`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'get_result',
          pid: String(pid || '1'),
          yid: String(yid || '4'),
          eid: Number(eid || 104),
          roll: Number(roll),
          reg: Number(reg),
          clientInfo: clientIp
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.warn(`External API responded with status ${response.status}`);
        return null;
      }

      const data = await response.json();
      if (!data || data.error || !data.result) {
        logger.warn('External API returned no result or error payload');
        return null;
      }

      logger.info('External API successfully returned student result');
      return data;
    } catch (err) {
      logger.warn(`External API request failed or timed out: ${err.message}`);
      return null;
    }
  }
}

module.exports = new ExternalApiService();
