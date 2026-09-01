import React, { useState } from 'react';
import { Search, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SearchForm({ onSearch, isLoading }) {
  const [program, setProgram] = useState('1'); // Honours
  const [examYear, setExamYear] = useState('4'); // Fourth Year
  const [exam, setExam] = useState('104'); // Honours 4th Year 2023
  const [registration, setRegistration] = useState('');
  const [roll, setRoll] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanRoll = roll.trim();
    const cleanReg = registration.trim();

    if (!cleanRoll) {
      setErrorMsg('Please enter your roll number.');
      return;
    }

    if (!cleanReg) {
      setErrorMsg('Please enter your registration number.');
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
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
        
        <h2 className="text-xl font-bold text-center text-slate-800 mb-6 pb-2 border-b border-slate-100">
          Result Search
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Program Select */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">
              Program <span className="text-red-500">*</span>
            </label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            >
              <option value="1">Honours</option>
              <option value="2">Degree</option>
              <option value="3">Masters</option>
              <option value="4">Masters Preliminary</option>
            </select>
          </div>

          {/* Exam Year Select */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">
              Exam Year <span className="text-red-500">*</span>
            </label>
            <select
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            >
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          {/* Exam Select */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">
              Exam <span className="text-red-500">*</span>
            </label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            >
              <option value="104">Honours 4th Year 2023</option>
              <option value="91">Honours 1st Year 2023</option>
              <option value="105">Honours 2nd Year 2023</option>
              <option value="106">Honours 3rd Year 2023</option>
            </select>
          </div>

          {/* Registration Number Input */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              disabled={isLoading}
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="Enter your registration number"
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>

          {/* Roll Number Input */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              disabled={isLoading}
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="Enter your roll number"
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold rounded transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching Result...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search Result</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Box */}
        <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-lg text-xs text-slate-600">
          <div className="flex items-center gap-1 font-semibold mb-2 text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Allowed Test Credentials (ক্লিক করলেই ফিল হবে):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('123456', '9876543210')}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-300 px-2.5 py-1.5 rounded font-medium transition flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Roll: <b>123456</b> | Reg: <b>9876543210</b></span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('202401', '1810987654')}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-300 px-2.5 py-1.5 rounded font-medium transition flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Roll: <b>202401</b> | Reg: <b>1810987654</b></span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
