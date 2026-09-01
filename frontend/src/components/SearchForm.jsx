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
  const [registration, setRegistration] = useState('2022140676');
  const [roll, setRoll] = useState('13569');
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

    const cleanRoll = String(roll || '').trim();
    const cleanReg = String(registration || '').trim();

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

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100 p-8 my-6">
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Program
          </label>
          <select
            value={selectedPid}
            onChange={handleProgramChange}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-sm"
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.pid} value={p.pid}>
                {p.pname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Exam Year
          </label>
          <select
            value={selectedYid}
            onChange={handleYearChange}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-sm"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y.yid} value={y.yid}>
                {y.yname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Exam
          </label>
          <select
            value={selectedEid}
            onChange={(e) => setSelectedEid(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-sm"
          >
            <option value="">Select Exam</option>
            {exams.map((ex) => (
              <option key={ex.eid} value={ex.eid}>
                {ex.ename}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            disabled={isLoading}
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-sm"
            placeholder="Enter your registration number"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Roll Number
          </label>
          <input
            type="text"
            disabled={isLoading}
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-sm"
            placeholder="Enter your roll number"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold rounded-md transition cursor-pointer disabled:opacity-75 text-sm mt-2"
        >
          {isLoading ? 'Searching Result...' : 'Search Result'}
        </button>
      </form>
    </div>
  );
}
