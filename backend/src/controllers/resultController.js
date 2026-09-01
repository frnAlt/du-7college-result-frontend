const resultService = require('../services/resultService');
const logger = require('../utils/logger');

/**
 * Controller handling student result lookups and PDF generation
 */
class ResultController {
  /**
   * Search student result with whitelist validation
   * POST /api/result
   */
  async checkResult(req, res) {
    try {
      const { roll, registration } = req.sanitizedInput;
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      logger.info(`Received result search query for roll: ${roll}`);

      // Query allowed result whitelist
      const student = await resultService.findAllowedResult(roll, registration, clientIp);

      if (!student) {
        logger.info(`Result check NOT matched for roll: ${roll} / reg: ${registration}`);
        return res.status(404).json({
          success: false,
          message: 'Result Not Found'
        });
      }

      // Generate a secure PDF access token
      const pdfToken = await resultService.createPdfToken(student);

      logger.info(`Result check SUCCESS for student: ${student.name} (Roll: ${student.roll})`);

      return res.status(200).json({
        success: true,
        message: 'Result retrieved successfully',
        result: {
          id: student.id,
          roll: student.roll,
          registration: student.registration,
          name: student.name,
          father_name: student.father_name,
          mother_name: student.mother_name,
          college_name: student.college_name,
          sub_name: student.sub_name,
          exam_title: student.exam_title,
          session_name: student.session_name,
          first_gpa: student.first_gpa,
          second_gpa: student.second_gpa,
          third_gpa: student.third_gpa,
          fourth_gpa: student.fourth_gpa,
          cgpa: student.cgpa,
          pstatus: student.pstatus,
          pdate: student.pdate,
          courses: student.courses || []
        },
        pdfUrl: `/api/result/pdf/${pdfToken}`
      });
    } catch (error) {
      logger.error('Error during result verification', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while processing result'
      });
    }
  }

  /**
   * Serve generated PDF document
   * GET /api/result/pdf/:id
   */
  async getPdf(req, res) {
    try {
      const token = req.params.id;
      const isDownload = req.query.download === '1' || req.query.download === 'true';

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'PDF access token is missing'
        });
      }

      const pdfData = await resultService.getPdfByToken(token);

      if (!pdfData || !pdfData.buffer) {
        return res.status(404).json({
          success: false,
          message: 'PDF document not found or link has expired'
        });
      }

      const safeStudentName = (pdfData.student.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Result_${safeStudentName}_${pdfData.student.roll}.pdf`;
      const disposition = isDownload ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', disposition);
      res.setHeader('Content-Length', pdfData.buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=3600');

      return res.send(pdfData.buffer);
    } catch (error) {
      logger.error('Error serving PDF document', error);
      return res.status(500).json({
        success: false,
        message: 'Could not render PDF document'
      });
    }
  }

  /**
   * Health check endpoint
   * GET /api/health
   */
  healthCheck(req, res) {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'BoardResultsBD API'
    });
  }
}

module.exports = new ResultController();
