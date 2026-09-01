import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

export default function ResultCard({ result, onReset }) {
  const resultRef = useRef(null);
  const headerRef = useRef(null);
  const [printDate, setPrintDate] = useState('');

  useEffect(() => {
    setPrintDate(new Date().toLocaleString());
  }, []);

  const handleDownloadPdf = () => {
    const cardEl = resultRef.current;
    const headerEl = headerRef.current;

    if (cardEl && headerEl) {
      headerEl.style.display = 'flex';
      cardEl.style.transform = '';
      cardEl.style.transformOrigin = '';
      cardEl.style.width = '100%';
      cardEl.style.background = '#fff';

      const opt = {
        margin: 0.9,
        filename: `${result?.name || 'student'} _7college_result.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#fff' },
        jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(cardEl).save().then(() => {
        headerEl.style.display = 'none';
      });
    }
  };

  const thStyle = {
    border: '1px solid #d1d5db',
    padding: 8,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#f3f4f6'
  };

  const tdStyle = {
    border: '1px solid #d1d5db',
    padding: 8,
    textAlign: 'center'
  };

  const courses = result?.courses || [];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 text-black">
      
      {/* Printable / Capturable Result Container */}
      <div ref={resultRef} style={{ background: '#fff', color: '#000', padding: 8, position: 'relative' }}>
        
        {/* DU Printable Header (Included inside generated PDF) */}
        <header ref={headerRef} style={{ width: '100%', textAlign: 'center', marginBottom: 40, display: 'none' }}>
          <div style={{ width: '100%', borderBottom: '2px solid black', paddingBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/images/logo/logo.jpg"
                alt="DU Logo"
                style={{
                  maxWidth: '100px',
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  aspectRatio: '1 / 1'
                }}
              />
              <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#000', margin: 0 }}>
                University of Dhaka
              </h1>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#333', margin: 0 }}>
                Affiliated 7 Colleges
              </h2>
            </div>
          </div>
        </header>

        {/* Result Archive Title */}
        <h3 style={{ fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 24, fontSize: 18, textDecoration: 'underline' }}>
          Result Archive
        </h3>

        {/* Student Meta Details Grid (50% wrap matching resapi.eco.du.ac.bd) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 24, fontSize: 15 }}>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Name:</b> {result?.name}
          </div>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Registration:</b> {result?.registration || result?.reg}
          </div>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>College:</b> {result?.college_name}
          </div>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Subject:</b> {result?.sub_name}
          </div>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Exam:</b> {result?.exam_title}
          </div>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Session:</b> {result?.session_name}
          </div>
          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Roll:</b> {result?.roll}
          </div>

          {result?.first_gpa && (
            <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
              <b>1st Year GPA:</b> {parseFloat(result.first_gpa).toFixed(2)}
            </div>
          )}
          {result?.second_gpa && (
            <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
              <b>2nd Year GPA:</b> {parseFloat(result.second_gpa).toFixed(2)}
            </div>
          )}
          {result?.third_gpa && (
            <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
              <b>3rd Year GPA:</b> {parseFloat(result.third_gpa).toFixed(2)}
            </div>
          )}
          {result?.fourth_gpa && (
            <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
              <b>4th Year GPA:</b> {parseFloat(result.fourth_gpa).toFixed(2)}
            </div>
          )}
          {result?.cgpa && (
            <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
              <b>Final CGPA:</b> {parseFloat(result.cgpa).toFixed(2)}
            </div>
          )}

          <div style={{ flex: '1 1 50%', marginBottom: 8 }}>
            <b>Result:</b> <span style={{ color: '#15803d', fontWeight: 'bold' }}>{result?.pstatus || 'Promoted'}</span>
          </div>
        </div>

        {/* Course Grades Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: 24 }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={thStyle}>Course Code</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Course Title</th>
              <th style={thStyle}>Grade</th>
              <th style={thStyle}>Grade Point</th>
              <th style={thStyle}>Credit</th>
            </tr>
          </thead>
          <tbody>
            {courses && courses.length > 0 ? (
              courses.map((course, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={tdStyle}>{course.code || course.pap_code}</td>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>{course.title || course.pname || 'N/A'}</td>
                  <td style={{ ...tdStyle, color: '#15803d', fontWeight: 'bold' }}>{course.letter_grade || course.lg}</td>
                  <td style={tdStyle}>{parseFloat(course.grade_point || course.gp || 0).toFixed(2)}</td>
                  <td style={tdStyle}>{course.credit || '4'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: 12 }}>
                  No course data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Result Published Date */}
        {result?.pdate && (
          <div style={{ flex: '1 1 50%', marginBottom: 8, fontSize: 14 }}>
            Result Published Date: {result.pdate}
          </div>
        )}

        {/* Print Date */}
        <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 12 }}>
          <span>Print Date: {printDate}</span>
        </div>

      </div>

      {/* Action Buttons (Download PDF & Search Again) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
        <button
          type="button"
          onClick={handleDownloadPdf}
          style={{
            padding: '10px 20px',
            backgroundColor: '#047857',
            color: '#fff',
            borderRadius: 4,
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Download PDF
        </button>

        <button
          type="button"
          onClick={onReset}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4b5563',
            color: '#fff',
            borderRadius: 4,
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Search Again
        </button>
      </div>

    </div>
  );
}
