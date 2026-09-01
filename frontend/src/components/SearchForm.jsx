import React, { useState } from 'react';

export default function SearchForm({ onSearch, isLoading }) {
  const [program, setProgram] = useState('1');
  const [examYear, setExamYear] = useState('2');
  const [exam, setExam] = useState('105');
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
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 my-6">
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Program
          </label>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="1">Honours</option>
            <option value="2">Degree</option>
            <option value="3">Masters</option>
            <option value="4">Masters Preliminary</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Exam Year
          </label>
          <select
            value={examYear}
            onChange={(e) => setExamYear(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Exam
          </label>
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="105">Honours 2nd Year 2024</option>
            <option value="104">Honours 4th Year 2023</option>
            <option value="91">Honours 1st Year 2023</option>
            <option value="106">Honours 3rd Year 2023</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="number"
            disabled={isLoading}
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Enter your registration number"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Roll Number
          </label>
          <input
            type="number"
            disabled={isLoading}
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Enter your roll number"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition cursor-pointer disabled:opacity-75"
        >
          {isLoading ? 'Searching Result...' : 'Search Result'}
        </button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
        <button
          type="button"
          onClick={() => handleQuickFill('13513', '2022140676')}
          className="text-blue-700 hover:underline cursor-pointer"
        >
          Click to fill: Roll <b>13513</b> | Reg <b>2022140676</b>
        </button>
      </div>
    </div>
  );
}
