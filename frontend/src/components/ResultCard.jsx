import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

export default function ResultCard({ result, courses: propCourses, onReset, onSearchAgain }) {
  const resultRef = useRef(null);
  const headerRef = useRef(null);
  const [printDate, setPrintDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const courses = (propCourses && propCourses.length > 0) ? propCourses : (result?.courses || []);

  const handleResetClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onSearchAgain === 'function') {
      onSearchAgain();
    } else if (typeof onReset === 'function') {
      onReset();
    }
  };

  useEffect(() => {
    // Format matching ss_output.jpg: M/D/YYYY, H:MM:SS AM/PM
    const now = new Date();
    const formatted = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString('en-US')}`;
    setPrintDate(formatted);
  }, []);

  const handleDownloadPdf = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDownloading(true);
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

      html2pdf()
        .set(opt)
        .from(cardEl)
        .save()
        .then(() => {
          headerEl.style.display = 'none';
          setIsDownloading(false);
        })
        .catch((err) => {
          console.error('html2pdf error:', err);
          headerEl.style.display = 'none';
          setIsDownloading(false);
        });
    } else {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 my-6 text-black animate-fadeIn">
      
      {/* Printable / Capturable Result Container */}
      <div ref={resultRef} style={{ background: '#fff', color: '#000', padding: 4, position: 'relative' }}>
        
        {/* DU Printable Header (Shown during html2pdf export) */}
        <header ref={headerRef} style={{ width: '100%', textAlign: 'center', marginBottom: 28, display: 'none', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', borderBottom: '2px solid black', paddingBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/images/logo/logo.jpg"
                alt="DU Logo"
                style={{
                  maxWidth: '85px',
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto 8px auto',
                  objectFit: 'contain',
                  aspectRatio: '1 / 1'
                }}
              />
              <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#000', margin: '0 0 4px 0' }}>
                University of Dhaka
              </h1>
              <h2 style={{ fontSize: 19, fontWeight: 600, color: '#333', margin: 0 }}>
                Affiliated 7 Colleges
              </h2>
            </div>
          </div>
        </header>

        {/* Result Archive Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontWeight: 'bold', color: '#000', fontSize: 18, textDecoration: 'underline', display: 'inline-block' }}>
            Result Archive
          </h3>
        </div>

        {/* Student Meta Details Grid (Exact 2-column rows matching ss_output.jpg) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, rowGap: 8, marginBottom: 24, fontSize: 14 }}>
          <div>
            <b>Name:</b> {result?.name}
          </div>
          <div>
            <b>Registration:</b> {result?.registration || result?.reg}
          </div>

          <div>
            <b>College:</b> {result?.college_name}
          </div>
          <div>
            <b>Subject:</b> {result?.sub_name}
          </div>

          <div>
            <b>Exam:</b> {result?.exam_title}
          </div>
          <div>
            <b>Session:</b> {result?.session_name}
          </div>

          <div>
            <b>Roll:</b> {result?.roll}
          </div>
          <div>
            <b>1st Year GPA:</b> {parseFloat(result?.first_gpa || 0).toFixed(2)}
          </div>

          <div>
            <b>2nd Year GPA:</b> {parseFloat(result?.second_gpa || 0).toFixed(2)}
          </div>
          <div>
            <b>Final CGPA:</b> {parseFloat(result?.cgpa || 0).toFixed(2)}
          </div>

          <div>
            <b>Result:</b> <span style={{ color: '#15803d', fontWeight: 'bold' }}>{result?.pstatus || 'Promoted'}</span>
          </div>
          <div></div>
        </div>

        {/* Course Grades Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 20 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#ffffff' }}>
                Course<br/>Code
              </th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#ffffff' }}>
                Course Title
              </th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#ffffff' }}>
                Grade
              </th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#ffffff' }}>
                Grade<br/>Point
              </th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#ffffff' }}>
                Credit
              </th>
            </tr>
          </thead>
          <tbody>
            {courses && courses.length > 0 ? (
              courses.map((course, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center' }}>
                    {course.code || course.pap_code}
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center' }}>
                    {course.title || course.pname || 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center' }}>
                    {course.letter_grade || course.lg}
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center' }}>
                    {parseFloat(course.grade_point || course.gp || 0).toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'center' }}>
                    {course.credit || '4'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: 12, border: '1px solid #d1d5db' }}>
                  No course data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Result Published Date */}
        {result?.pdate && (
          <div style={{ marginBottom: 10, fontSize: 13.5 }}>
            Result Published Date: {result.pdate}
          </div>
        )}

        {/* Print Date */}
        <div style={{ fontSize: 11.5, color: '#6b7280', textAlign: 'center', marginTop: 6, marginBottom: 8 }}>
          <span>Print Date: {printDate} | </span>
        </div>

      </div>

      {/* Action Buttons (Download PDF & Search Again) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          style={{
            padding: '9px 22px',
            backgroundColor: '#047857',
            color: '#fff',
            borderRadius: 6,
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13.5px',
            opacity: isDownloading ? 0.75 : 1
          }}
        >
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>

        <button
          type="button"
          onClick={handleResetClick}
          style={{
            padding: '9px 22px',
            backgroundColor: '#4b5563',
            color: '#fff',
            borderRadius: 6,
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13.5px'
          }}
        >
          Search Again
        </button>
      </div>

    </div>
  );
}
