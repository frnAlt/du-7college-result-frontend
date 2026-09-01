import React, { useRef, useState, useEffect } from 'react';
import { Download, Eye, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { downloadPdfBlob } from '../services/api';

export default function ResultCard({ result, pdfUrl, onOpenPdfPreview, onReset }) {
  const resultRef = useRef(null);
  const headerRef = useRef(null);
  const [printDate, setPrintDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setPrintDate(new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }));
  }, []);

  const handleDownloadPdf = async () => {
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

      try {
        await html2pdf().set(opt).from(cardEl).save();
      } catch (err) {
        console.warn('html2pdf fallback to backend download:', err);
        const safeName = (result?.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
        await downloadPdfBlob(pdfUrl, `${safeName}_7college_result.pdf`);
      } finally {
        headerEl.style.display = 'none';
        setIsDownloading(false);
      }
    } else {
      const safeName = (result?.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
      await downloadPdfBlob(pdfUrl, `${safeName}_7college_result.pdf`);
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Top Action Bar (with Search Again, Open PDF, Download PDF, and Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm no-print">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Search Again</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenPdfPreview && (
            <button
              type="button"
              onClick={onOpenPdfPreview}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded transition cursor-pointer disabled:opacity-75"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded transition border border-gray-300 dark:border-gray-600 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Official Result Sheet Box */}
      <div className="print-card w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6 sm:p-8 text-black">
        
        {/* Printable / Capturable Result Container */}
        <div ref={resultRef} style={{ background: '#fff', color: '#000', padding: 8, position: 'relative' }}>
          
          {/* DU Printable Header (Shown on PDF and screen) */}
          <header ref={headerRef} style={{ width: '100%', textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', borderBottom: '2px solid black', paddingBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="/images/logo/logo.jpg"
                  alt="DU Logo"
                  style={{
                    maxWidth: '90px',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto 8px auto',
                    objectFit: 'contain',
                    objectPosition: 'center',
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
          <h3 style={{ fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 24, fontSize: 18, textDecoration: 'underline' }}>
            Result Archive
          </h3>

          {/* Student Meta Details Grid */}
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

        {/* Bottom Action Buttons */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 28 }}>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#047857',
              color: '#fff',
              borderRadius: 6,
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>

          <button
            type="button"
            onClick={onReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4b5563',
              color: '#fff',
              borderRadius: 6,
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Search Again
          </button>
        </div>

      </div>

    </div>
  );
}
