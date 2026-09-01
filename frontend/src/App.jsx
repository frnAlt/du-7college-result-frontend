import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResultCard from './components/ResultCard';
import Alert from './components/Alert';
import { fetchWebSelect } from './services/api';

export default function App() {
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedPid, setSelectedPid] = useState('');
  const [selectedYid, setSelectedYid] = useState('');
  const [selectedEid, setSelectedEid] = useState('');
  const [roll, setRoll] = useState('13569');
  const [registration, setRegistration] = useState('2022140676');

  const [resultData, setResultData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingProgram, setLoadingProgram] = useState(false);
  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);
  const [alert, setAlert] = useState(null);

  // Load Programs on Mount
  useEffect(() => {
    setLoadingProgram(true);
    fetchWebSelect({ action: 'get_pid2' })
      .then((data) => {
        if (data && data.options && data.options.length > 0) {
          setPrograms(data.options);
          setSelectedPid(String(data.options[0].pid));
        } else {
          setPrograms([
            { pid: 1, pname: 'Honours' },
            { pid: 2, pname: 'Degree' },
            { pid: 3, pname: 'Masters' },
            { pid: 4, pname: 'Masters Preliminary' }
          ]);
          setSelectedPid('1');
        }
      })
      .catch(() => {
        setPrograms([
          { pid: 1, pname: 'Honours' },
          { pid: 2, pname: 'Degree' },
          { pid: 3, pname: 'Masters' },
          { pid: 4, pname: 'Masters Preliminary' }
        ]);
        setSelectedPid('1');
      })
      .finally(() => setLoadingProgram(false));
  }, []);

  // Load Years when Program changes
  useEffect(() => {
    setYears([]);
    setSelectedYid('');
    setExams([]);
    setSelectedEid('');

    if (selectedPid) {
      setLoadingYear(true);
      fetchWebSelect({ action: 'get_yid', pid: selectedPid })
        .then((data) => {
          if (data && data.options && data.options.length > 0) {
            setYears(data.options);
            // Default select 2nd year if available
            const secondYear = data.options.find(y => y.yid === 2 || y.yname?.includes('Second'));
            setSelectedYid(secondYear ? String(secondYear.yid) : String(data.options[0].yid));
          } else {
            const defaultYears = [
              { yid: 1, yname: 'First Year' },
              { yid: 2, yname: 'Second Year' },
              { yid: 3, yname: 'Third Year' },
              { yid: 4, yname: 'Fourth Year' }
            ];
            setYears(defaultYears);
            setSelectedYid('2');
          }
        })
        .catch(() => {
          setYears([
            { yid: 1, yname: 'First Year' },
            { yid: 2, yname: 'Second Year' },
            { yid: 3, yname: 'Third Year' },
            { yid: 4, yname: 'Fourth Year' }
          ]);
          setSelectedYid('2');
        })
        .finally(() => setLoadingYear(false));
    }
  }, [selectedPid]);

  // Load Exams when Year changes
  useEffect(() => {
    setExams([]);
    setSelectedEid('');

    if (selectedPid && selectedYid) {
      setLoadingExam(true);
      fetchWebSelect({ action: 'get_eid', pid: selectedPid, yid: selectedYid })
        .then((data) => {
          if (data && data.options && data.options.length > 0) {
            setExams(data.options);
            setSelectedEid(String(data.options[0].eid));
          } else {
            const defaultExams = [
              { eid: 105, ename: 'Honours 2nd Year 2024' },
              { eid: 92, ename: 'Honours 2nd Year 2023' }
            ];
            setExams(defaultExams);
            setSelectedEid('105');
          }
        })
        .catch(() => {
          setExams([
            { eid: 105, ename: 'Honours 2nd Year 2024' },
            { eid: 92, ename: 'Honours 2nd Year 2023' }
          ]);
          setSelectedEid('105');
        })
        .finally(() => setLoadingExam(false));
    }
  }, [selectedPid, selectedYid]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setAlert(null);
    setResultData(null);

    const cleanRoll = String(roll || '').trim();
    const cleanReg = String(registration || '').trim();

    if (!selectedPid || !selectedYid || !selectedEid || !cleanRoll || !cleanReg) {
      setAlert({
        variant: 'error',
        title: 'Invalid Input',
        message: 'Please select all fields and enter either roll & registration number.'
      });
      return;
    }

    setIsSearching(true);

    try {
      const data = await fetchWebSelect({
        action: 'get_result',
        pid: selectedPid,
        yid: selectedYid,
        eid: selectedEid,
        roll: cleanRoll,
        reg: cleanReg
      });

      if (data && data.result) {
        setResultData(data);
      } else {
        setResultData({
          error: data?.error || 'No result found for the provided information.'
        });
      }
    } catch (err) {
      setResultData({
        error: 'Network error. Please try again.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchAgain = () => {
    setResultData(null);
    setAlert(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans">
      
      {/* Exact DU Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl mt-8">
          
          {/* Top Alert Banner */}
          {alert && (
            <div className="mb-6">
              <Alert
                variant={alert.variant}
                title={alert.title}
                message={alert.message}
              />
            </div>
          )}

          {/* Search Form (Rendered when no result or on reset) */}
          {(!resultData || resultData.error) && (
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-fadeIn">
              
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
                  Program
                </label>
                <select
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
                  value={selectedPid}
                  onChange={(e) => setSelectedPid(e.target.value)}
                  required
                  disabled={loadingProgram || isSearching}
                >
                  <option value="">{loadingProgram ? 'Loading...' : 'Select Program'}</option>
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
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
                  value={selectedYid}
                  onChange={(e) => setSelectedYid(e.target.value)}
                  required
                  disabled={!selectedPid || loadingYear || isSearching}
                >
                  <option value="">{loadingYear ? 'Loading...' : 'Select Year'}</option>
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
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
                  value={selectedEid}
                  onChange={(e) => setSelectedEid(e.target.value)}
                  required
                  disabled={!selectedYid || loadingExam || isSearching}
                >
                  <option value="">{loadingExam ? 'Loading...' : 'Select Exam'}</option>
                  {exams.map((ex) => (
                    <option key={ex.eid} value={ex.eid}>
                      {ex.ename}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
                  Registration Number{' '}
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value.replace(/\D/, ''))}
                  min="1"
                  placeholder="Enter your registration number"
                  disabled={isSearching}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
                  Roll Number
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white text-sm"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value.replace(/\D/, ''))}
                  min="1"
                  placeholder="Enter your roll number"
                  disabled={isSearching}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition cursor-pointer disabled:opacity-75 text-sm"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search Result'}
              </button>
            </form>
          )}

          {/* Result Card Output if Result Found */}
          {resultData && resultData.result && (
            <div className="animate-fadeIn">
              <ResultCard
                result={resultData.result}
                courses={resultData.courses}
                onSearchAgain={handleSearchAgain}
              />
            </div>
          )}

          {/* Result Not Found Card with Search Again Button */}
          {resultData && resultData.error && (
            <div className="mt-8 animate-fadeIn">
              <Alert
                variant="error"
                title="Result Not Found"
                message={resultData.error}
              />
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSearchAgain}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-600 text-white font-semibold rounded transition cursor-pointer text-sm"
                >
                  Search Again
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Exact DU Footer */}
      <Footer />

    </div>
  );
}
