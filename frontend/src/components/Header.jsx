import React from 'react';
import { GraduationCap, ShieldCheck, Award } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo & Portal Title */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Academic Result Archive
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Official
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              University of Dhaka Affiliated Colleges & Board Results Portal
            </p>
          </div>
        </div>

        {/* Security & Verification Badge */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Verified Examination Records</span>
        </div>
      </div>
    </header>
  );
}
