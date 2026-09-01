import React, { useState } from 'react';
import { fetchWebSelect } from '../services/api';

export default function SearchForm({ onSearch, isLoading }) {
  const [programs, setPrograms] = useState([
    { pid: 1, pname: 'Honours' },
    { pid: 2, pname: 'Degree' },
    { pid: 3, pname: 'Masters' },
    { pid: 4, pname: 'Masters Preliminary' }
  ]);

  const [years, setYears] = useState([
    { yid: 1, yname: 'First Year' },
    { yid: 2, yname: 'Second Year' },
    { yid: 3, yname: 'Third Year' },
    { yid: 4, yname: 'Fourth Year' }
  ]);

  const [exams, setExams] = useState([
    { eid: 105, ename: 'Honours 2nd Year 2024' },
    { eid: 92, ename: 'Honours 2nd Year 2023' },
    { eid: 104, ename: 'Honours 4th Year 2023' },
    { eid: 91, ename: 'Honours 1st Year 2023' }
  ]);

  const [selectedPid, setSelectedPid] = useState('1');
  const [selectedYid, setSelectedYid] = useState('2');
  const [selectedEid, setSelectedEid] = useState('105');
  const [registration, setRegistration] = useState('');
  const [roll, setRoll] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Year options when Program changes
  const handleProgramChange = async (e) => {
    const pid = e.target.value;
    setSelectedPid(pid);
    if (pid) {
      const data = await fetchWebSelect({ action: 'get_yid', pid });
      if (data && data.options) {
        setYears(data.options);
      }
    }
  };

  // Fetch Exam options when Year changes
  const handleYearChange = async (e) => {
    const yid = e.target.value;
    setSelectedYid(yid);
    if (yid && selectedPid) {
      const data = await fetchWebSelect({ action: 'get_eid', pid: selectedPid, yid });
      if (data && data.options) {
        setExams(data.options);
        if (data.options.length > 0) {
          setSelectedEid(String(data.options[0].eid));
        }
      }
    }
  };

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

    onSearch(cleanRoll, cleanReg, {
      pid: selectedPid,
      yid: selectedYid,
      eid: selectedEid
    });
  };

  const handleQuickFill = (demoRoll, demoReg) => {
    setRoll(demoRoll);
    setRegistration(demoReg);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded shadow p-6">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Result Search
      </h3>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
            Program
          </label>
          <select
            value={selectedPid}
            onChange={handleProgramChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.pid} value={p.pid}>
                {p.pname}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
            Exam Year
          </label>
          <select
            value={selectedYid}
            onChange={handleYearChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y.yid} value={y.yid}>
                {y.yname}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
            Exam
          </label>
          <select
            value={selectedEid}
            onChange={(e) => setSelectedEid(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
          >
            <option value="">Select Exam</option>
            {exams.map((ex) => (
              <option key={ex.eid} value={ex.eid}>
                {ex.ename}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
            Registration Number
          </label>
          <input
            type="number"
            disabled={isLoading}
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
            min="1"
            placeholder="Enter your registration number"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
            Roll Number
          </label>
          <input
            type="number"
            disabled={isLoading}
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
            min="1"
            placeholder="Enter your roll number"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition cursor-pointer disabled:opacity-75"
        >
          {isLoading ? 'Searching Result...' : 'Search Result'}
        </button>
      </form>

      {/* Quick Fill for Allowed Student */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        <button
          type="button"
          onClick={() => handleQuickFill('13569', '2022140676')}
          className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Click to fill: Roll <b>13569</b> | Reg <b>2022140676</b>
        </button>
      </div>
    </div>
  );
}
