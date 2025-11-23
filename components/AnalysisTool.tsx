import React, { useState } from 'react';
import { Icons } from './Icons';
import { analyzeLegalDocument, performLegalResearch } from '../services/geminiService';
import AnalysisResult from './AnalysisResult';
import ResearchResultDisplay from './ResearchResultDisplay'; // Renamed to avoid collision in imports
import { LegalReport, ResearchResult } from '../types';
import { SAMPLE_CONTRACT } from '../constants';
import ResearchResultView from './ResearchResult';

const AnalysisTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'document' | 'research'>('document');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<LegalReport | null>(null);
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysisReport(null);
    setResearchResult(null);

    try {
      if (activeTab === 'document') {
        const report = await analyzeLegalDocument(inputText);
        setAnalysisReport(report);
      } else {
        const result = await performLegalResearch(inputText);
        setResearchResult(result);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setInputText(SAMPLE_CONTRACT);
    setActiveTab('document');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-crimson-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-serif font-bold">Veritas Console</h1>
            <p className="mt-2 text-crimson-100 max-w-2xl">Secure environment for document analysis and grounded legal research.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
            
            {/* Sidebar / Tabs */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <button 
                    onClick={() => setActiveTab('document')}
                    className={`p-4 text-left font-medium flex items-center border-l-4 transition-colors ${activeTab === 'document' ? 'bg-white border-crimson-600 text-crimson-700' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                >
                    <Icons.FileText className="h-5 w-5 mr-3" />
                    Document Analysis
                </button>
                <button 
                    onClick={() => setActiveTab('research')}
                    className={`p-4 text-left font-medium flex items-center border-l-4 transition-colors ${activeTab === 'research' ? 'bg-white border-crimson-600 text-crimson-700' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                >
                    <Icons.Search className="h-5 w-5 mr-3" />
                    Legal Research
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-8">
                
                {/* Input Section (Hidden if we have results, unless we want to clear) */}
                {(!analysisReport && !researchResult) && (
                    <div className="max-w-3xl mx-auto">
                         <div className="mb-6">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                                {activeTab === 'document' ? 'Review & Analyze Contract' : 'Ask a Legal Question'}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {activeTab === 'document' 
                                    ? 'Paste any legal document text below. Veritas will extract clauses, identify risks, and provide a summary.' 
                                    : 'Ask a question about case law, regulations, or legal procedures. We use grounded search for accuracy.'}
                            </p>
                         </div>

                        <div className="relative">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={activeTab === 'document' ? "Paste contract text here..." : "e.g., What are the requirements for a valid NDA in New York?"}
                                className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson-600 focus:border-transparent resize-none font-mono text-sm bg-white shadow-inner"
                            />
                            {activeTab === 'document' && !inputText && (
                                <button 
                                    onClick={loadSample}
                                    className="absolute top-4 right-4 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded border border-gray-300 transition-colors"
                                >
                                    Load Sample
                                </button>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-400">
                                <Icons.Lock className="h-3 w-3 mr-1" />
                                End-to-end encrypted
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !inputText}
                                className={`flex items-center px-8 py-3 rounded-sm font-medium text-white transition-all ${loading || !inputText ? 'bg-gray-300 cursor-not-allowed' : 'bg-crimson-600 hover:bg-crimson-700 shadow-md'}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        {activeTab === 'document' ? 'Analyze Document' : 'Search Case Law'}
                                        <Icons.ChevronRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                                <Icons.AlertTriangle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Results Section */}
                {(analysisReport || researchResult) && (
                    <div className="max-w-5xl mx-auto">
                        <button 
                            onClick={() => { setAnalysisReport(null); setResearchResult(null); }}
                            className="mb-6 flex items-center text-sm text-gray-500 hover:text-crimson-600 transition-colors"
                        >
                            <Icons.ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                            Back to Input
                        </button>
                        
                        {analysisReport && <AnalysisResult report={analysisReport} />}
                        {researchResult && <ResearchResultView result={researchResult} />}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTool;