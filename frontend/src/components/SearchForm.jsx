import React, { useState } from 'react';
import { Search, Hash, FileText, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SearchForm({ onSearch, isLoading }) {
  const [roll, setRoll] = useState('');
  const [registration, setRegistration] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanRoll = roll.trim();
    const cleanReg = registration.trim();

    if (!cleanRoll) {
      setErrorMsg('Please enter your Roll Number / রোল নম্বর লিখুন');
      return;
    }

    if (!cleanReg) {
      setErrorMsg('Please enter your Registration Number / রেজিস্ট্রেশন নম্বর লিখুন');
      return;
    }

    onSearch(cleanRoll, cleanReg);
  };

  const handleQuickFill = (demoRoll, demoReg) => {
    setRoll(demoRoll);
    setRegistration(demoReg);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 px-6 py-5 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Search className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">
                CHECK EXAMINATION RESULT
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                ফলাফল অনুসন্ধানের জন্য রোল ও রেজিস্ট্রেশন নম্বর দিন
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Roll Number Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Roll Number <span className="text-emerald-600 font-normal font-bengali">(রোল নম্বর)</span> <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={isLoading}
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="Enter Examination Roll (e.g. 123456)"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Registration Number Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Registration Number <span className="text-emerald-600 font-normal font-bengali">(রেজিস্ট্রেশন নম্বর)</span> <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={isLoading}
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="Enter Registration No (e.g. 9876543210)"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Database... / যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>CHECK RESULT / ফলাফল দেখুন</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Testing helper box */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Allowed Demo Credentials (পরীক্ষা করার জন্য ক্লিক করুন):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('123456', '9876543210')}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 font-medium px-2.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Roll: <b>123456</b> / Reg: <b>9876543210</b></span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('202401', '1810987654')}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 font-medium px-2.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Roll: <b>202401</b> / Reg: <b>1810987654</b></span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
