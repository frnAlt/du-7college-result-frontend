const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Service to generate PDF documents identical in look and feel to the on-screen result archive card
 */
class PdfService {
  /**
   * Generate an exact replica PDF buffer for a student result
   * @param {Object} student - Student result data
   * @returns {Promise<Buffer>}
   */
  async generateResultPdf(student) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 30, bottom: 30, left: 35, right: 35 },
          info: {
            Title: `${student.name || 'Student'} - 7college_result`,
            Author: 'University of Dhaka - Affiliated 7 Colleges',
            Subject: 'Result Archive',
            Keywords: 'DU, 7 College, Result Archive'
          }
        });

        const buffers = [];
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', err => reject(err));

        const logoCandidates = [
          path.resolve(__dirname, '../assets/logo.jpg'),
          path.resolve(__dirname, '../../public/images/logo/logo.jpg'),
          path.resolve(process.cwd(), 'backend/src/assets/logo.jpg'),
          path.resolve(process.cwd(), 'frontend/public/images/logo/logo.jpg')
        ];

        let logoPath = null;
        for (const lp of logoCandidates) {
          if (fs.existsSync(lp)) {
            logoPath = lp;
            break;
          }
        }

        // 1. Logo
        if (logoPath) {
          doc.image(logoPath, 260, 32, { width: 60, align: 'center' });
          doc.y = 98;
        } else {
          doc.y = 40;
        }

        // 2. University and Portal Titles (Matching on-screen ResultCard)
        doc.fillColor('#000000')
           .font('Helvetica-Bold')
           .fontSize(18)
           .text('University of Dhaka', { align: 'center' });

        doc.fillColor('#333333')
           .font('Helvetica-Bold')
           .fontSize(14)
           .text('Affiliated 7 Colleges', { align: 'center' });

        doc.moveDown(0.4);
        const lineY = doc.y;
        doc.strokeColor('#000000').lineWidth(1.5).moveTo(35, lineY).lineTo(560, lineY).stroke();
        doc.moveDown(0.6);

        // 3. Result Archive Heading
        doc.fillColor('#000000')
           .font('Helvetica-Bold')
           .fontSize(13)
           .text('Result Archive', { align: 'center', underline: true });

        doc.moveDown(0.8);

        // 4. Student Meta Details Grid (2-Columns matching on-screen layout)
        const startMetaY = doc.y;
        const col1X = 40;
        const col1ValX = 130;
        const col2X = 310;
        const col2ValX = 400;
        const lineHeight = 17;

        let currentMetaY = startMetaY;

        // Row 1
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Name:', col1X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(student.name || 'N/A', col1ValX, currentMetaY, { width: 175 });

        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Registration:', col2X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(String(student.registration || 'N/A'), col2ValX, currentMetaY);
        currentMetaY += lineHeight;

        // Row 2
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('College:', col1X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(student.college_name || 'N/A', col1ValX, currentMetaY, { width: 175 });

        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Subject:', col2X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(student.sub_name || 'N/A', col2ValX, currentMetaY, { width: 155 });
        currentMetaY += lineHeight;

        // Row 3
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Exam:', col1X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(student.exam_title || 'N/A', col1ValX, currentMetaY, { width: 175 });

        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Session:', col2X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(student.session_name || 'N/A', col2ValX, currentMetaY);
        currentMetaY += lineHeight;

        // Row 4
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Roll:', col1X, currentMetaY);
        doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(String(student.roll || 'N/A'), col1ValX, currentMetaY);

        if (student.first_gpa) {
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('1st Year GPA:', col2X, currentMetaY);
          doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(Number(student.first_gpa).toFixed(2), col2ValX, currentMetaY);
          currentMetaY += lineHeight;
        }

        if (student.second_gpa) {
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('2nd Year GPA:', col2X, currentMetaY);
          doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(Number(student.second_gpa).toFixed(2), col2ValX, currentMetaY);
          currentMetaY += lineHeight;
        }

        if (student.third_gpa) {
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('3rd Year GPA:', col2X, currentMetaY);
          doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(Number(student.third_gpa).toFixed(2), col2ValX, currentMetaY);
          currentMetaY += lineHeight;
        }

        if (student.fourth_gpa) {
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('4th Year GPA:', col2X, currentMetaY);
          doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(Number(student.fourth_gpa).toFixed(2), col2ValX, currentMetaY);
          currentMetaY += lineHeight;
        }

        if (student.cgpa) {
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Final CGPA:', col2X, currentMetaY);
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#111827').text(Number(student.cgpa).toFixed(2), col2ValX, currentMetaY);
          currentMetaY += lineHeight;
        }

        // Result Status
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text('Result:', col1X, currentMetaY);
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#15803d').text(student.pstatus || 'PASSED', col1ValX, currentMetaY);
        currentMetaY += lineHeight + 8;

        doc.y = currentMetaY;

        // 5. Courses Table (Matching on-screen table)
        const tableY = doc.y;
        const rowHeight = 22;
        const tableWidth = 525;
        const startX = 35;

        // Table Header
        doc.rect(startX, tableY, tableWidth, rowHeight).fillColor('#f3f4f6').fill();
        doc.rect(startX, tableY, tableWidth, rowHeight).strokeColor('#d1d5db').lineWidth(1).stroke();

        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9);
        doc.text('Course Code', startX + 10, tableY + 6, { width: 85, align: 'center' });
        doc.text('Course Title', startX + 105, tableY + 6, { width: 235, align: 'left' });
        doc.text('Grade', startX + 350, tableY + 6, { width: 55, align: 'center' });
        doc.text('Grade Point', startX + 410, tableY + 6, { width: 65, align: 'center' });
        doc.text('Credit', startX + 480, tableY + 6, { width: 40, align: 'center' });

        let currentY = tableY + rowHeight;
        const courses = student.courses || [];

        if (courses.length === 0) {
          doc.rect(startX, currentY, tableWidth, rowHeight).fillColor('#ffffff').fill();
          doc.rect(startX, currentY, tableWidth, rowHeight).strokeColor('#d1d5db').lineWidth(0.5).stroke();
          doc.fillColor('#6b7280').font('Helvetica').fontSize(9).text('No course data found.', startX, currentY + 6, { align: 'center', width: tableWidth });
          currentY += rowHeight;
        } else {
          courses.forEach((c, idx) => {
            const bg = idx % 2 === 0 ? '#ffffff' : '#f9fafb';
            doc.rect(startX, currentY, tableWidth, rowHeight).fillColor(bg).fill();
            doc.rect(startX, currentY, tableWidth, rowHeight).strokeColor('#d1d5db').lineWidth(0.5).stroke();

            // Course Code
            doc.fillColor('#111827').font('Helvetica').fontSize(8.5);
            doc.text(c.code || c.pap_code || '-', startX + 10, currentY + 6, { width: 85, align: 'center' });

            // Course Title
            doc.text(c.title || c.pname || 'Course Module', startX + 105, currentY + 6, { width: 235, align: 'left', ellipsis: true });

            // Grade
            doc.font('Helvetica-Bold').fillColor('#15803d');
            doc.text(c.letter_grade || c.lg || '-', startX + 350, currentY + 6, { width: 55, align: 'center' });

            // Grade Point
            doc.font('Helvetica').fillColor('#111827');
            const gpVal = c.grade_point || c.gp;
            doc.text(gpVal ? Number(gpVal).toFixed(2) : '-', startX + 410, currentY + 6, { width: 65, align: 'center' });

            // Credit
            doc.fillColor('#4b5563');
            doc.text(String(c.credit || '4'), startX + 480, currentY + 6, { width: 40, align: 'center' });

            currentY += rowHeight;
          });
        }

        doc.y = currentY + 18;

        // 6. Footer Information (Matching on-screen footer)
        const printTime = new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'medium',
          timeStyle: 'medium'
        });

        doc.font('Helvetica').fontSize(8.5).fillColor('#4b5563');
        if (student.pdate) {
          doc.text(`Result Published Date: ${student.pdate}`, startX, doc.y);
          doc.moveDown(0.3);
        }
        doc.text(`Print Date: ${printTime}`, startX, doc.y);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PdfService();
