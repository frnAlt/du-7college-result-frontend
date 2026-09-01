import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import ResultCard from './components/ResultCard';
import ResultNotFound from './components/ResultNotFound';
import LoadingState from './components/LoadingState';
import { checkResult } from './services/api';

export default function App() {
  const [viewState, setViewState] = useState('search'); // 'search' | 'loading' | 'found' | 'not_found'
  const [resultData, setResultData] = useState(null);
  const [searchedRoll, setSearchedRoll] = useState('');
  const [searchedReg, setSearchedReg] = useState('');

  const handleSearch = async (roll, registration, extra = {}) => {
    setSearchedRoll(roll);
    setSearchedReg(registration);
    setViewState('loading');

    try {
      const data = await checkResult(roll, registration, extra);

      if (data && data.success && data.result) {
        setResultData(data.result);
        setViewState('found');
      } else {
        setViewState('not_found');
      }
    } catch (err) {
      setViewState('not_found');
    }
  };

  const handleReset = () => {
    setViewState('search');
    setResultData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans">
      
      {/* DU Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4">
        
        {viewState === 'search' && (
          <SearchForm onSearch={handleSearch} isLoading={false} />
        )}

        {viewState === 'loading' && (
          <LoadingState />
        )}

        {viewState === 'not_found' && (
          <ResultNotFound
            onReset={handleReset}
            searchedRoll={searchedRoll}
            searchedReg={searchedReg}
          />
        )}

        {viewState === 'found' && resultData && (
          <ResultCard
            result={resultData}
            onReset={handleReset}
          />
        )}

      </main>

      {/* DU Footer */}
      <Footer />

    </div>
  );
}
