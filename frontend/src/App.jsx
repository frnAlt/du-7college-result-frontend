import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import ResultCard from './components/ResultCard';
import ResultNotFound from './components/ResultNotFound';
import LoadingState from './components/LoadingState';
import PdfPreviewModal from './components/PdfPreviewModal';
import { checkResult } from './services/api';
import { ShieldCheck, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function App() {
  const [viewState, setViewState] = useState('search'); // 'search' | 'loading' | 'found' | 'not_found' | 'error'
  const [resultData, setResultData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [searchedRoll, setSearchedRoll] = useState('');
  const [searchedReg, setSearchedReg] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (roll, registration) => {
    setSearchedRoll(roll);
    setSearchedReg(registration);
    setViewState('loading');
    setErrorMessage('');

    try {
      const data = await checkResult(roll, registration);

      if (data && data.success && data.result) {
        setResultData(data.result);
        setPdfUrl(data.pdfUrl || '');
        setViewState('found');
      } else {
        setViewState('not_found');
      }
    } catch (err) {
      setErrorMessage('Failed to connect to server. Please try again.');
      setViewState('not_found');
    }
  };

  const handleReset = () => {
    setViewState('search');
    setResultData(null);
    setPdfUrl('');
    setIsPdfModalOpen(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Portal Hero Intro (Only shown during search state) */}
        {viewState === 'search' && (
          <div className="text-center max-w-2xl mx-auto mb-8 animate-fadeIn">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Student Result System
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Online Result Verification & Transcript Portal
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-bengali">
              পরীক্ষার রোল এবং রেজিস্ট্রেশন নম্বর দিয়ে দ্রুত আপনার ফলাফল ও অফিসিয়াল ট্রান্সক্রিপ্ট PDF দেখুন
            </p>
          </div>
        )}

        {/* View State Rendering */}
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
            pdfUrl={pdfUrl}
            onOpenPdfPreview={() => setIsPdfModalOpen(true)}
            onReset={handleReset}
          />
        )}

      </main>

      {/* PDF Modal Viewer */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={pdfUrl}
        studentName={resultData?.name}
        roll={resultData?.roll}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
