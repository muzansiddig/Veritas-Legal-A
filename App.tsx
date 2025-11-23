import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AnalysisTool from './components/AnalysisTool';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CaseDetail from './components/CaseDetail';
import { AppView, Case } from './types';
import { MOCK_CASES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);

  // Load data from local storage or use mock data on first load
  useEffect(() => {
    const savedCases = localStorage.getItem('veritas_cases');
    if (savedCases) {
      try {
        setCases(JSON.parse(savedCases));
      } catch (e) {
        console.error("Failed to parse saved cases", e);
        setCases(MOCK_CASES);
      }
    } else {
      setCases(MOCK_CASES);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('veritas_cases', JSON.stringify(cases));
    }
  }, [cases]);

  const handleCaseSelect = (c: Case) => {
    setSelectedCaseId(c.id);
    setCurrentView(AppView.CASE_DETAIL);
  };

  const handleUpdateCase = (updatedCase: Case) => {
    setCases(prevCases => prevCases.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleCreateCase = () => {
    const newCase: Case = {
      id: `CS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: 'New Legal Matter',
      client: 'Unassigned Client',
      status: 'Pending',
      description: 'New matter created via dashboard.',
      accessCode: '1234',
      documents: [],
      people: [],
      notes: [],
      financials: [],
      lastUpdated: 'Just now',
      progress: 0
    };
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setCurrentView(AppView.CASE_DETAIL);
  };

  const getSelectedCase = () => cases.find(c => c.id === selectedCaseId) || null;

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            cases={cases} 
            onSelectCase={handleCaseSelect} 
            onCreateCase={handleCreateCase}
          />
        );
      case AppView.CASE_DETAIL:
        const activeCase = getSelectedCase();
        return activeCase ? (
          <CaseDetail 
            caseData={activeCase} 
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
            onUpdateCase={handleUpdateCase}
          />
        ) : (
          <Dashboard 
            cases={cases} 
            onSelectCase={handleCaseSelect} 
            onCreateCase={handleCreateCase}
          />
        );
      case AppView.TOOL:
        return <AnalysisTool />;
      case AppView.LANDING:
      default:
        return (
          <>
            <Hero onGetStarted={() => setCurrentView(AppView.DASHBOARD)} />
            <Features />
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-crimson-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 py-12 md:p-16 text-center">
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to optimize your legal workflow?</h2>
                        <p className="text-crimson-100 mb-8 max-w-2xl mx-auto">Join over 500 law firms using Veritas to reduce contract review time by 60%.</p>
                        <button 
                            onClick={() => setCurrentView(AppView.DASHBOARD)}
                            className="bg-white text-crimson-800 px-8 py-3 rounded-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                            Access Partner Dashboard
                        </button>
                    </div>
                </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-crimson-600 selection:text-white">
      {/* Hide Navbar in CaseDetail for a more immersive 'App' feel */}
      {currentView !== AppView.CASE_DETAIL && (
        <Navbar currentView={currentView} setView={setCurrentView} />
      )}
      
      <main>
        {renderContent()}
      </main>

      {currentView !== AppView.CASE_DETAIL && <Footer />}
    </div>
  );
};

export default App;
