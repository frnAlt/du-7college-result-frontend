const PDFDocument = require('pdfkit');

/**
 * Service to generate institutional Academic Result PDF documents
 */
class PdfService {
  /**
   * Generate a PDF buffer for a given student result record
   * @param {Object} student - Student result data
   * @returns {Promise<Buffer>}
   */
  async generateResultPdf(student) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 36, bottom: 36, left: 36, right: 36 },
          info: {
            Title: `Academic Result - ${student.name} (${student.roll})`,
            Author: 'University Result Archive / BoardResultsBD',
            Subject: 'Official Academic Transcript & Result Sheet',
            Keywords: 'Result, Transcript, GPA, DU, Board Results'
          }
        });

        const buffers = [];
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', err => reject(err));

        // Background / Page Border
        doc.rect(20, 20, 555, 802).lineWidth(1.5).strokeColor('#1e3a8a').stroke();
        doc.rect(23, 23, 549, 796).lineWidth(0.5).strokeColor('#94a3b8').stroke();

        // 1. Header Section
        doc.fillColor('#1e3a8a')
           .font('Helvetica-Bold')
           .fontSize(18)
           .text('UNIVERSITY OF DHAKA', { align: 'center' });

        doc.fillColor('#475569')
           .font('Helvetica-Bold')
           .fontSize(12)
           .text('AFFILIATED 7 COLLEGES ACADEMIC RESULT ARCHIVE', { align: 'center' });

        doc.fillColor('#64748b')
           .font('Helvetica')
           .fontSize(10)
           .text('Official Examination Transcript & Provisional Result Sheet', { align: 'center' });

        doc.moveDown(0.4);
        const yLine = doc.y;
        doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(36, yLine).lineTo(559, yLine).stroke();
        doc.moveDown(0.6);

        // 2. Examination Title Banner
        const examY = doc.y;
        doc.roundedRect(36, examY, 523, 26, 4).fillColor('#f1f5f9').fill();
        doc.fillColor('#0f172a')
           .font('Helvetica-Bold')
           .fontSize(11)
           .text(student.exam_title || 'Honours Degree Examination', 36, examY + 7, { align: 'center', width: 523 });

        doc.moveDown(1.2);

        // 3. Student Details Box
        const startDetailY = doc.y;
        doc.roundedRect(36, startDetailY, 523, 112, 4).strokeColor('#cbd5e1').lineWidth(1).stroke();

        // Header of student box
        doc.rect(36, startDetailY, 523, 22).fillColor('#1e40af').fill();
        doc.fillColor('#ffffff')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('STUDENT INFORMATION', 46, startDetailY + 6);

        // Details grid (Left & Right columns)
        const row1 = startDetailY + 28;
        const row2 = startDetailY + 44;
        const row3 = startDetailY + 60;
        const row4 = startDetailY + 76;
        const row5 = startDetailY + 92;

        const col1Key = 46;
        const col1Val = 135;
        const col2Key = 310;
        const col2Val = 395;

        const drawLabel = (text, x, y) => {
          doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8.5).text(text, x, y);
        };
        const drawValue = (text, x, y, width = 160) => {
          doc.fillColor('#0f172a').font('Helvetica').fontSize(8.5).text(text || 'N/A', x, y, { width, ellipsis: true });
        };

        // Row 1
        drawLabel('Student Name:', col1Key, row1);
        drawValue(student.name, col1Val, row1, 165);
        drawLabel('Roll Number:', col2Key, row1);
        doc.fillColor('#1e40af').font('Helvetica-Bold').fontSize(9).text(student.roll, col2Val, row1);

        // Row 2
        drawLabel("Father's Name:", col1Key, row2);
        drawValue(student.father_name, col1Val, row2, 165);
        drawLabel('Registration No:', col2Key, row2);
        doc.fillColor('#1e40af').font('Helvetica-Bold').fontSize(9).text(student.registration, col2Val, row2);

        // Row 3
        drawLabel("Mother's Name:", col1Key, row3);
        drawValue(student.mother_name, col1Val, row3, 165);
        drawLabel('Session:', col2Key, row3);
        drawValue(student.session_name, col2Val, row3, 150);

        // Row 4
        drawLabel('College Name:', col1Key, row4);
        drawValue(student.college_name, col1Val, row4, 165);
        drawLabel('Subject / Discipline:', col2Key, row4);
        drawValue(student.sub_name, col2Val, row4, 150);

        // Row 5
        drawLabel('Result Status:', col1Key, row5);
        doc.fillColor('#15803d').font('Helvetica-Bold').fontSize(9).text(student.pstatus || 'PASSED', col1Val, row5);
        drawLabel('Published Date:', col2Key, row5);
        drawValue(student.pdate || new Date().toLocaleDateString('en-GB'), col2Val, row5, 150);

        doc.y = startDetailY + 120;
        doc.moveDown(0.4);

        // 4. GPA Summary Cards
        const gpaY = doc.y;
        const gpaItems = [];
        if (student.first_gpa) gpaItems.push({ label: '1st Year GPA', val: Number(student.first_gpa).toFixed(2) });
        if (student.second_gpa) gpaItems.push({ label: '2nd Year GPA', val: Number(student.second_gpa).toFixed(2) });
        if (student.third_gpa) gpaItems.push({ label: '3rd Year GPA', val: Number(student.third_gpa).toFixed(2) });
        if (student.fourth_gpa) gpaItems.push({ label: '4th Year GPA', val: Number(student.fourth_gpa).toFixed(2) });
        if (student.cgpa) gpaItems.push({ label: 'Final CGPA', val: Number(student.cgpa).toFixed(2), highlight: true });

        if (gpaItems.length > 0) {
          const cardWidth = (523 - ((gpaItems.length - 1) * 8)) / gpaItems.length;
          gpaItems.forEach((item, idx) => {
            const cardX = 36 + idx * (cardWidth + 8);
            if (item.highlight) {
              doc.roundedRect(cardX, gpaY, cardWidth, 42, 4).fillColor('#ecfdf5').fill();
              doc.roundedRect(cardX, gpaY, cardWidth, 42, 4).strokeColor('#10b981').lineWidth(1).stroke();
              doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(8).text(item.label, cardX, gpaY + 6, { align: 'center', width: cardWidth });
              doc.fillColor('#047857').font('Helvetica-Bold').fontSize(14).text(item.val, cardX, gpaY + 18, { align: 'center', width: cardWidth });
            } else {
              doc.roundedRect(cardX, gpaY, cardWidth, 42, 4).fillColor('#f8fafc').fill();
              doc.roundedRect(cardX, gpaY, cardWidth, 42, 4).strokeColor('#e2e8f0').lineWidth(1).stroke();
              doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(8).text(item.label, cardX, gpaY + 6, { align: 'center', width: cardWidth });
              doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(12).text(item.val, cardX, gpaY + 20, { align: 'center', width: cardWidth });
            }
          });
          doc.y = gpaY + 50;
        }

        // 5. Course / Subject Grades Table
        const tableY = doc.y;
        doc.roundedRect(36, tableY, 523, 20, 2).fillColor('#1e3a8a').fill();
        
        // Table Headers
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5);
        doc.text('SL', 42, tableY + 5, { width: 25, align: 'center' });
        doc.text('Course Code', 72, tableY + 5, { width: 80, align: 'left' });
        doc.text('Course Title / Paper Name', 160, tableY + 5, { width: 230, align: 'left' });
        doc.text('Letter Grade', 395, tableY + 5, { width: 60, align: 'center' });
        doc.text('Grade Point', 460, tableY + 5, { width: 50, align: 'center' });
        doc.text('Credit', 515, tableY + 5, { width: 38, align: 'center' });

        let currentY = tableY + 20;
        const courses = student.courses || [];

        if (courses.length === 0) {
          doc.rect(36, currentY, 523, 24).fillColor('#ffffff').fill();
          doc.rect(36, currentY, 523, 24).strokeColor('#e2e8f0').stroke();
          doc.fillColor('#64748b').font('Helvetica-Oblique').fontSize(9).text('Individual course grades are not published online for this session.', 36, currentY + 7, { align: 'center', width: 523 });
          currentY += 24;
        } else {
          courses.forEach((c, idx) => {
            const rowHeight = 22;
            const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
            doc.rect(36, currentY, 523, rowHeight).fillColor(bgColor).fill();
            doc.rect(36, currentY, 523, rowHeight).strokeColor('#e2e8f0').lineWidth(0.5).stroke();

            doc.fillColor('#334155').font('Helvetica').fontSize(8.5);
            doc.text(String(idx + 1), 42, currentY + 6, { width: 25, align: 'center' });
            
            doc.font('Helvetica-Bold').fillColor('#0f172a');
            doc.text(c.code || c.pap_code || '-', 72, currentY + 6, { width: 80, align: 'left' });
            
            doc.font('Helvetica').fillColor('#1e293b');
            doc.text(c.title || c.pname || 'General Course Module', 160, currentY + 6, { width: 230, align: 'left', ellipsis: true });
            
            doc.font('Helvetica-Bold').fillColor('#1e40af');
            doc.text(c.letter_grade || c.lg || '-', 395, currentY + 6, { width: 60, align: 'center' });
            
            doc.font('Helvetica-Bold').fillColor('#0f172a');
            doc.text(c.grade_point ? Number(c.grade_point).toFixed(2) : (c.gp ? Number(c.gp).toFixed(2) : '-'), 460, currentY + 6, { width: 50, align: 'center' });
            
            doc.font('Helvetica').fillColor('#475569');
            doc.text(String(c.credit || '4.0'), 515, currentY + 6, { width: 38, align: 'center' });

            currentY += rowHeight;
          });
        }

        doc.y = currentY + 12;

        // 6. Grading System Reference Table
        const gradingY = doc.y;
        doc.roundedRect(36, gradingY, 523, 44, 3).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
        doc.fillColor('#475569').font('Helvetica-Bold').fontSize(7.5).text('GRADING SCALE REFERENCE:', 44, gradingY + 5);

        const gradeScale = [
          '80% and above = A+ (4.00)',
          '75% to <80% = A (3.75)',
          '70% to <75% = A- (3.50)',
          '65% to <70% = B+ (3.25)',
          '60% to <65% = B (3.00)',
          '55% to <60% = B- (2.75)',
          '50% to <55% = C+ (2.50)',
          '45% to <50% = C (2.25)',
          '40% to <45% = D (2.00)',
          '<40% = F (0.00)'
        ];

        doc.font('Helvetica').fontSize(7).fillColor('#64748b');
        const scaleText1 = gradeScale.slice(0, 5).join('   |   ');
        const scaleText2 = gradeScale.slice(5).join('   |   ');
        doc.text(scaleText1, 44, gradingY + 18, { width: 505 });
        doc.text(scaleText2, 44, gradingY + 30, { width: 505 });

        // 7. Security / Verification Seal & Footer
        const footerY = 740;
        doc.strokeColor('#cbd5e1').lineWidth(0.8).moveTo(36, footerY).lineTo(559, footerY).stroke();

        const printTime = new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'medium',
          timeStyle: 'medium'
        });

        doc.fillColor('#64748b')
           .font('Helvetica')
           .fontSize(7.5)
           .text(`System Generated Verification Document | Printed on: ${printTime} (BST)`, 36, footerY + 8, { align: 'left', width: 340 });

        doc.text(`Doc ID: BD-RES-${student.roll}-${Buffer.from(student.registration).toString('base64').substring(0, 6)}`, 36, footerY + 19, { align: 'left' });

        doc.fillColor('#0f172a')
           .font('Helvetica-Bold')
           .fontSize(8)
           .text('Controller of Examinations', 380, footerY + 8, { align: 'right', width: 175 });

        doc.fillColor('#64748b')
           .font('Helvetica')
           .fontSize(7)
           .text('University Result Archive', 380, footerY + 19, { align: 'right', width: 175 });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PdfService();
