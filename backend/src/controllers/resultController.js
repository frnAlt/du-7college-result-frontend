const resultService = require('../services/resultService');
const logger = require('../utils/logger');

/**
 * Program, Year, and Exam lists matching University of Dhaka 7-Colleges Structure
 */
const PROGRAM_OPTIONS = [
  { pid: 1, pname: 'Honours' },
  { pid: 2, pname: 'Degree' },
  { pid: 3, pname: 'Masters' },
  { pid: 4, pname: 'Masters Preliminary' }
];

const YEAR_OPTIONS = [
  { yid: 1, yname: 'First Year' },
  { yid: 2, yname: 'Second Year' },
  { yid: 3, yname: 'Third Year' },
  { yid: 4, yname: 'Fourth Year' }
];

const EXAM_OPTIONS_MAP = {
  '1_1': [
    { eid: 104, ename: 'Honours 1st Year 2024' },
    { eid: 91, ename: 'Honours 1st Year 2023' },
    { eid: 80, ename: 'Honours 1st Year 2022' }
  ],
  '1_2': [
    { eid: 105, ename: 'Honours 2nd Year 2024' },
    { eid: 92, ename: 'Honours 2nd Year 2023' },
    { eid: 81, ename: 'Honours 2nd Year 2022' }
  ],
  '1_3': [
    { eid: 106, ename: 'Honours 3rd Year 2024' },
    { eid: 93, ename: 'Honours 3rd Year 2023' },
    { eid: 82, ename: 'Honours 3rd Year 2022' }
  ],
  '1_4': [
    { eid: 107, ename: 'Honours 4th Year 2024' },
    { eid: 94, ename: 'Honours 4th Year 2023' },
    { eid: 83, ename: 'Honours 4th Year 2022' }
  ],
  '2_1': [
    { eid: 201, ename: 'Degree 1st Year Examination 2023' },
    { eid: 202, ename: 'Degree 1st Year Examination 2022' }
  ],
  '3_1': [
    { eid: 301, ename: 'Masters Final Examination 2023' }
  ],
  '4_1': [
    { eid: 401, ename: 'Masters Preliminary Examination 2023' }
  ]
};

class ResultController {
  /**
   * Compatibility endpoint for https://resapi.eco.du.ac.bd/api/web-select
   * POST /api/web-select
   */
  async handleWebSelect(req, res) {
    try {
      const { action, pid, yid, eid, roll, reg, clientInfo } = req.body || {};

      if (action === 'get_pid2') {
        return res.json({ options: PROGRAM_OPTIONS });
      }

      if (action === 'get_yid') {
        return res.json({ options: YEAR_OPTIONS });
      }

      if (action === 'get_eid') {
        const key = `${pid}_${yid}`;
        const exams = EXAM_OPTIONS_MAP[key] || [
          { eid: 104, ename: 'Honours 4th Year 2023' },
          { eid: 91, ename: 'Honours 1st Year 2023' }
        ];
        return res.json({ options: exams });
      }

      if (action === 'get_result') {
        const cleanRoll = String(roll || '').trim();
        const cleanReg = String(reg || '').trim();

        if (!cleanRoll || !cleanReg || cleanRoll === '0' || cleanReg === '0') {
          return res.status(400).json({ error: 'Please enter both Roll and Registration Number.' });
        }

        const clientIp = clientInfo || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const student = await resultService.findAllowedResult(cleanRoll, cleanReg, clientIp);

        if (!student) {
          logger.info(`[web-select] Result Not Found for roll: ${cleanRoll}, reg: ${cleanReg}`);
          return res.status(404).json({
            error: 'Result Not Found. The Roll Number or Registration Number does not match any record.'
          });
        }

        const pdfToken = await resultService.createPdfToken(student);

        // Normalize courses
        const courses = (student.courses || []).map((c, i) => ({
          id: i + 1,
          pap_code: c.code || c.pap_code,
          pname: c.title || c.pname,
          lg: c.letter_grade || c.lg,
          gp: c.grade_point || c.gp,
          credit: c.credit || '4.0'
        }));

        logger.info(`[web-select] Result Found for student: ${student.name} (Roll: ${student.roll})`);

        return res.status(200).json({
          result: {
            id: student.id,
            roll: student.roll,
            reg: student.registration,
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
            pdate: student.pdate
          },
          courses: courses,
          pdfUrl: `/api/result/pdf/${pdfToken}`
        });
      }

      return res.status(400).json({ error: 'Invalid action parameter' });
    } catch (err) {
      logger.error('Error in /api/web-select handler', err);
      return res.status(500).json({ error: 'Server error processing request' });
    }
  }

  /**
   * Search student result with whitelist validation
   * POST /api/result
   */
  async checkResult(req, res) {
    try {
      const { roll, registration } = req.sanitizedInput;
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      logger.info(`Received result search query for roll: ${roll}`);

      const student = await resultService.findAllowedResult(roll, registration, clientIp);

      if (!student) {
        logger.info(`Result check NOT matched for roll: ${roll} / reg: ${registration}`);
        return res.status(404).json({
          success: false,
          message: 'Result Not Found'
        });
      }

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
      service: 'Office of the Controller of Examinations - University of Dhaka'
    });
  }
}

module.exports = new ResultController();
