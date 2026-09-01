import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm py-5 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
        {/* Official DU Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
          <img
            src="/images/logo/logo.svg"
            alt="University of Dhaka Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header Text */}
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
            University of Dhaka
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-blue-900 leading-snug">
            Affiliated 7 Colleges
          </h2>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Official Result Archive & Verification Portal
          </span>
        </div>
      </div>
    </header>
  );
}
