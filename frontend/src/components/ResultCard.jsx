import React, { useState, useEffect } from 'react';
import { Download, Eye, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { getPdfUrl, downloadPdfBlob } from '../services/api';

export default function ResultCard({ result, pdfUrl, onOpenPdfPreview, onReset }) {
  const [printDate, setPrintDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setPrintDate(new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }));
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    const safeName = (result?.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}_7college_result.pdf`;
    await downloadPdfBlob(pdfUrl, filename);
    setIsDownloading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Top Action Buttons (no-print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm no-print">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Search Again</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPdfPreview}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition border border-slate-300 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Official Result Sheet Box */}
      <div className="print-card w-full bg-white rounded-lg shadow-lg border border-slate-200 p-6 sm:p-8 text-slate-900">
        
        {/* DU Result Header */}
        <div className="text-center pb-5 mb-5 border-b-2 border-slate-900 flex flex-col items-center">
          <img
            src="/images/logo/logo.jpg"
            alt="University of Dhaka Logo"
            className="w-20 h-20 object-contain mx-auto mb-2"
          />
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
            University of Dhaka
          </h1>
          <h2 className="text-lg font-bold text-slate-800">
            Affiliated 7 Colleges
          </h2>
          <h3 className="text-sm font-extrabold text-slate-900 underline mt-2 uppercase tracking-wide">
            Result Archive
          </h3>
        </div>

        {/* Student Meta Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm mb-6">
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Name:</span>
            <span className="text-slate-800 font-semibold">{result.name}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Registration:</span>
            <span className="font-mono text-slate-800 font-semibold">{result.registration}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">College:</span>
            <span className="text-slate-800 font-semibold">{result.college_name}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Subject:</span>
            <span className="text-slate-800 font-semibold">{result.sub_name}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Exam:</span>
            <span className="text-slate-800 font-semibold">{result.exam_title}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Session:</span>
            <span className="text-slate-800 font-semibold">{result.session_name}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Roll:</span>
            <span className="font-mono text-slate-800 font-semibold">{result.roll}</span>
          </div>

          {result.first_gpa && (
            <div className="flex">
              <span className="font-bold min-w-[110px] text-slate-900">1st Year GPA:</span>
              <span className="text-slate-800 font-semibold">{Number(result.first_gpa).toFixed(2)}</span>
            </div>
          )}
          {result.second_gpa && (
            <div className="flex">
              <span className="font-bold min-w-[110px] text-slate-900">2nd Year GPA:</span>
              <span className="text-slate-800 font-semibold">{Number(result.second_gpa).toFixed(2)}</span>
            </div>
          )}
          {result.third_gpa && (
            <div className="flex">
              <span className="font-bold min-w-[110px] text-slate-900">3rd Year GPA:</span>
              <span className="text-slate-800 font-semibold">{Number(result.third_gpa).toFixed(2)}</span>
            </div>
          )}
          {result.fourth_gpa && (
            <div className="flex">
              <span className="font-bold min-w-[110px] text-slate-900">4th Year GPA:</span>
              <span className="text-slate-800 font-semibold">{Number(result.fourth_gpa).toFixed(2)}</span>
            </div>
          )}
          {result.cgpa && (
            <div className="flex">
              <span className="font-bold min-w-[110px] text-slate-900">Final CGPA:</span>
              <span className="font-bold text-slate-950">{Number(result.cgpa).toFixed(2)}</span>
            </div>
          )}
          <div className="flex">
            <span className="font-bold min-w-[110px] text-slate-900">Result:</span>
            <span className="font-bold text-emerald-700">{result.pstatus || 'PASSED'}</span>
          </div>
        </div>

        {/* Course Grades Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-300 text-sm text-center">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 px-3 py-2">Course Code</th>
                <th className="border border-slate-300 px-3 py-2 text-left">Course Title</th>
                <th className="border border-slate-300 px-3 py-2">Grade</th>
                <th className="border border-slate-300 px-3 py-2">Grade Point</th>
                <th className="border border-slate-300 px-3 py-2">Credit</th>
              </tr>
            </thead>
            <tbody>
              {result.courses && result.courses.length > 0 ? (
                result.courses.map((course, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border border-slate-300 px-3 py-2 font-mono font-medium">{course.code || course.pap_code}</td>
                    <td className="border border-slate-300 px-3 py-2 text-left">{course.title || course.pname}</td>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-emerald-700">{course.letter_grade || course.lg}</td>
                    <td className="border border-slate-300 px-3 py-2 font-medium">{Number(course.grade_point || course.gp).toFixed(2)}</td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-600">{course.credit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-slate-300 p-4 text-slate-500">
                    No course data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Meta */}
        <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <span>Result Published Date: </span>
            <span className="font-semibold text-slate-700">{result.pdate || '15 August, 2024'}</span>
          </div>
          <div>
            <span>Print Date: </span>
            <span className="font-semibold text-slate-700">{printDate}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
