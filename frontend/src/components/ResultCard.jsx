import React from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  ArrowLeft, 
  Building2, 
  BookOpen, 
  Calendar, 
  User, 
  Award,
  Hash
} from 'lucide-react';
import { getPdfUrl } from '../services/api';

export default function ResultCard({ result, pdfUrl, onOpenPdfPreview, onReset }) {
  const downloadUrl = getPdfUrl(pdfUrl, true);

  const handlePrint = () => {
    window.print();
  };

  const gpaItems = [
    { label: '1st Year GPA', val: result.first_gpa },
    { label: '2nd Year GPA', val: result.second_gpa },
    { label: '3rd Year GPA', val: result.third_gpa },
    { label: '4th Year GPA', val: result.fourth_gpa },
    { label: 'Final CGPA', val: result.cgpa, highlight: true },
  ].filter(item => item.val !== undefined && item.val !== null && item.val !== '');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Action Bar (Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Search / নতুন অনুসন্ধান</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenPdfPreview}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Open PDF / প্রিভিউ</span>
          </button>

          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Printable Result Sheet Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>OFFICIAL RESULT VERIFIED</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {result.exam_title || 'Academic Examination Result'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {result.college_name} • Session: {result.session_name || '2019-2020'}
              </p>
            </div>

            {/* Pass Status Badge */}
            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl shrink-0">
              <span className="block text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">
                Status
              </span>
              <span className="text-base font-extrabold text-emerald-400">
                {result.pstatus || 'PASSED'}
              </span>
            </div>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="p-6 sm:p-8 border-b border-slate-200/80 bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Student Profile Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
            
            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Student Name:</span>
              <span className="font-bold text-slate-900">{result.name}</span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Roll Number:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {result.roll}
              </span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Father's Name:</span>
              <span className="font-semibold text-slate-800">{result.father_name || 'N/A'}</span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Registration No:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {result.registration}
              </span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Mother's Name:</span>
              <span className="font-semibold text-slate-800">{result.mother_name || 'N/A'}</span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Session:</span>
              <span className="font-semibold text-slate-800">{result.session_name || 'N/A'}</span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">College Name:</span>
              <span className="font-semibold text-slate-800">{result.college_name || 'N/A'}</span>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-4 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 min-w-[130px] font-medium">Subject / Discipline:</span>
              <span className="font-semibold text-slate-800">{result.sub_name || 'N/A'}</span>
            </div>

          </div>
        </div>

        {/* GPA Summary Highlights */}
        {gpaItems.length > 0 && (
          <div className="p-6 sm:p-8 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Academic Performance Summary</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {gpaItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-xl text-center border transition-all ${
                    item.highlight
                      ? 'bg-emerald-50/80 border-emerald-300 col-span-2 sm:col-span-1 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                    item.highlight ? 'text-emerald-800' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`text-xl sm:text-2xl font-black ${
                    item.highlight ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {Number(item.val).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses & Grades Table */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Subject-wise Grade Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total Courses: {result.courses?.length || 0}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5 text-center w-12">#</th>
                  <th className="py-3 px-3.5">Course Code</th>
                  <th className="py-3 px-3.5">Course Title</th>
                  <th className="py-3 px-3.5 text-center">Grade</th>
                  <th className="py-3 px-3.5 text-center">Point</th>
                  <th className="py-3 px-3.5 text-center">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.courses && result.courses.length > 0 ? (
                  result.courses.map((course, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/40 hover:bg-slate-50/80'}>
                      <td className="py-3 px-3.5 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900 font-mono">{course.code}</td>
                      <td className="py-3 px-3.5 text-slate-700 font-medium">{course.title}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-emerald-700">{course.letter_grade}</td>
                      <td className="py-3 px-3.5 text-center font-semibold text-slate-800">{Number(course.grade_point).toFixed(2)}</td>
                      <td className="py-3 px-3.5 text-center text-slate-600">{course.credit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">
                      No course grade details available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer of result sheet */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span>Published Date: </span>
              <span className="font-semibold text-slate-700">{result.pdate || 'August 2024'}</span>
            </div>
            <div className="italic text-[11px] text-slate-400">
              Official computer-generated result document • Digitally signed
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
