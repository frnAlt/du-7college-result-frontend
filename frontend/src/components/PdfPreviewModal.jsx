import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { getPdfUrl } from '../services/api';

export default function PdfPreviewModal({ isOpen, onClose, pdfUrl, studentName, roll }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pdfUrl) return null;

  const previewUrl = getPdfUrl(pdfUrl, false);
  const downloadUrl = getPdfUrl(pdfUrl, true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-white truncate">
                {studentName || 'Student Result Sheet'} - Roll: {roll}
              </h3>
              <p className="text-[11px] text-slate-400">
                Official PDF Preview • Dhaka University & Board Results Archive
              </p>
            </div>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title="Open in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content: PDF iFrame */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe
            src={`${previewUrl}#toolbar=1&navpanes=0`}
            title="PDF Result Sheet Viewer"
            className="w-full h-full border-0"
          />

          {/* Fallback bar for mobile browsers */}
          <div className="sm:hidden absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-lg flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">If PDF doesn't display:</span>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 underline"
            >
              Open Directly
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
