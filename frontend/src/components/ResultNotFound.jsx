import React from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

export default function ResultNotFound({ onReset, searchedRoll, searchedReg }) {
  return (
    <div className="w-full max-w-xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden text-center p-8 sm:p-10">
        
        {/* Not Found Icon */}
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Status Headings */}
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Result Not Found
        </h2>
        <p className="text-base text-amber-700 font-semibold mb-4 font-bengali">
          কোনো ফলাফল খুঁজে পাওয়া যায়নি
        </p>

        {/* Explanatory Message */}
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          The <span className="font-semibold text-slate-800">Roll Number</span> or <span className="font-semibold text-slate-800">Registration Number</span> you entered does not match any allowed record in our database.
        </p>

        {/* Input Details Reminder */}
        {(searchedRoll || searchedReg) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 max-w-xs mx-auto text-xs text-slate-600 space-y-1">
            {searchedRoll && (
              <div className="flex justify-between">
                <span>Searched Roll:</span>
                <span className="font-mono font-bold text-slate-800">{searchedRoll}</span>
              </div>
            )}
            {searchedReg && (
              <div className="flex justify-between">
                <span>Searched Reg:</span>
                <span className="font-mono font-bold text-slate-800">{searchedReg}</span>
              </div>
            )}
          </div>
        )}

        {/* Helpful Tips */}
        <div className="flex items-start gap-2.5 text-left bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 mb-8 text-xs text-blue-900">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Please double-check your admit card or registration slip to make sure both numbers are entered correctly.
          </span>
        </div>

        {/* Try Again Button */}
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again / পুনরায় অনুসন্ধান</span>
        </button>

      </div>
    </div>
  );
}
