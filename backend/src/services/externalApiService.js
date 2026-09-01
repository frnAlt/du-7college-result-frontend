const { EXTERNAL_API_BASE, EXTERNAL_API_TOKEN, ENABLE_EXTERNAL_API } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Service to interact with DU 7-College result API (resapi.eco.du.ac.bd)
 */
class ExternalApiService {
  /**
   * Fetch result from external API endpoint
   * @param {Object} params - { pid, yid, eid, roll, reg, clientIp }
   */
  async fetchExternalResult({ pid, yid, eid, roll, reg, clientIp = '127.0.0.1' }) {
    if (!ENABLE_EXTERNAL_API) {
      logger.info('External API call skipped (ENABLE_EXTERNAL_API is false)');
      return null;
    }

    try {
      logger.info(`Attempting external API result fetch for roll: ${roll}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const response = await fetch(`${EXTERNAL_API_BASE}/api/web-select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': EXTERNAL_API_TOKEN,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BoardResultsBD/1.0'
        },
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
