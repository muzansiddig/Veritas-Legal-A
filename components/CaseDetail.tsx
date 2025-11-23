import React, { useState, useRef, useEffect } from 'react';
import { Case, ChatMessage, UnclearTerm, FinancialRecord, CaseDocument } from '../types';
import { Icons } from './Icons';
import { analyzeLegalDocument, chatWithCaseContext, identifyUnclearTerms } from '../services/geminiService';
import AnalysisResult from './AnalysisResult';
import ReactMarkdown from 'react-markdown';

interface CaseDetailProps {
  caseData: Case;
  onBack: () => void;
  onUpdateCase: (updatedCase: Case) => void;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, onBack, onUpdateCase }) => {
  const [locked, setLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'people' | 'notes' | 'unclear' | 'analysis' | 'financials'>('overview');
  
  // Drag and Drop state
  const [isDragging, setIsDragging] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Welcome, Counsel. I am the dedicated Legal Associate for the **${caseData.title}** matter. I have indexed all ${caseData.documents.length} documents. How may I assist you today?`, timestamp: new Date() }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Analysis state
  const [report, setReport] = useState<any>(null);
  const [unclearTerms, setUnclearTerms] = useState<UnclearTerm[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingUnclear, setAnalyzingUnclear] = useState(false);

  // Financial Form State
  const [finDescription, setFinDescription] = useState('');
  const [finAmount, setFinAmount] = useState('');
  const [finType, setFinType] = useState<'Income' | 'Expense'>('Income');
  const [finCategory, setFinCategory] = useState('Billable Hours');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate secure check (Allowing '1234' or any generic code for demo if data is empty)
    if (password === caseData.accessCode || caseData.accessCode === '1234') {
      setLocked(false);
      setError('');
    } else {
      setError('AUTHENTICATION FAILED. Access Denied.');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputMsg;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    const context = caseData.documents.map(d => `Document: ${d.title}\nContent:\n${d.content}`).join('\n\n');
    const response = await chatWithCaseContext(userMsg.text, context, messages);
    
    const botMsg: ChatMessage = { 
        role: 'model', 
        text: response.answer, 
        timestamp: new Date(),
        suggestions: response.suggestions
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const runFullAnalysis = async () => {
    if (caseData.documents.length === 0) return;
    setAnalyzing(true);
    try {
        const result = await analyzeLegalDocument(caseData.documents[0].content);
        setReport(result);
        setActiveTab('analysis');
    } catch (e) {
        console.error(e);
    } finally {
        setAnalyzing(false);
    }
  };

  const runUnclearAnalysis = async () => {
      if (caseData.documents.length === 0) return;
      setAnalyzingUnclear(true);
      try {
          const results = await identifyUnclearTerms(caseData.documents[0].content);
          setUnclearTerms(results);
          setActiveTab('unclear');
      } catch (e) {
          console.error(e);
      } finally {
          setAnalyzingUnclear(false);
      }
  };

  // Drag and drop / Upload handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const addFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        const newDoc: CaseDocument = {
            id: `doc-${Date.now()}`,
            title: file.name,
            type: file.type.includes('pdf') ? 'PDF Document' : 'Text Document',
            content: content || "Content simulation for PDF...", 
            dateAdded: new Date().toLocaleDateString()
        };
        const updatedCase = {
            ...caseData,
            documents: [...caseData.documents, newDoc]
        };
        onUpdateCase(updatedCase);
    };
    // In a real app we'd read binary or text. Here we assume text for simplicity or mock content.
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          addFile(e.target.files[0]);
      }
  };

  // Financial Handler
  const handleAddFinancial = (e: React.FormEvent) => {
      e.preventDefault();
      if (!finDescription || !finAmount) return;

      const newRecord: FinancialRecord = {
          id: `fin-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          description: finDescription,
          amount: parseFloat(finAmount),
          type: finType,
          category: finCategory as any
      };

      const updatedCase = {
          ...caseData,
          financials: [...(caseData.financials || []), newRecord]
      };
      
      onUpdateCase(updatedCase);
      setFinDescription('');
      setFinAmount('');
  };

  if (locked) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-700">
            <div className="bg-crimson-800 px-8 py-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-crimson-900"></div>
                <Icons.Lock className="h-12 w-12 text-white opacity-90 mx-auto mb-4" />
                <h2 className="text-white text-2xl font-serif font-bold tracking-tight">Veritas Secure Enclave</h2>
                <p className="text-crimson-100 text-sm mt-2 font-light">End-to-End Encrypted Session</p>
            </div>
            <div className="p-10">
                <div className="text-center mb-8">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Requesting Access To</p>
                     <p className="text-lg font-bold text-gray-900">{caseData.title}</p>
                     <p className="text-sm text-gray-500 mt-1">Ref ID: {caseData.id}</p>
                </div>

                <form onSubmit={handleUnlock}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Security Access Code</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800 outline-none transition-all text-lg tracking-widest"
                            placeholder="••••"
                            autoFocus
                        />
                        <Icons.Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center">
                            <Icons.AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                            <p className="text-sm text-red-700 font-bold">{error}</p>
                        </div>
                    )}

                    <button type="submit" className="w-full mt-8 bg-gray-900 text-white font-bold py-3 rounded-sm hover:bg-gray-800 transition-colors uppercase tracking-wide text-sm shadow-lg">
                        Authenticate
                    </button>
                    
                    <button type="button" onClick={onBack} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-900 font-medium">
                        Cancel Request
                    </button>
                </form>
            </div>
            <div className="bg-gray-50 px-8 py-3 text-center border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase tracking-wider">
                    <Icons.ShieldAlert className="h-3 w-3" />
                    <span>Access logged by IP: 192.168.X.X</span>
                </div>
            </div>
        </div>
    </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
        {/* Case Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-20 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-crimson-800"></div>
            <div className="flex items-center">
                <button onClick={onBack} className="mr-6 text-gray-400 hover:text-crimson-800 transition-colors flex items-center text-sm font-medium">
                    <Icons.ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Dashboard
                </button>
                <div className="border-l border-gray-200 pl-6">
                    <div className="flex items-center">
                        <h1 className="text-xl font-serif font-bold text-gray-900 mr-3">{caseData.title}</h1>
                        <span className="px-2 py-0.5 bg-green-50 text-green-800 text-[10px] font-bold uppercase rounded-sm tracking-wider border border-green-100">Confidential</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">{caseData.client} • {caseData.id}</p>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                 <div className="hidden md:flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Lead Counsel</span>
                    <span className="text-sm font-medium text-gray-800">Eleanor Sterling</span>
                 </div>
                 <div className="h-8 w-8 bg-crimson-800 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif">ES</div>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Navigation Rail */}
            <div className="w-16 md:w-64 bg-slate-50 border-r border-gray-200 flex flex-col shrink-0">
                <nav className="flex-1 py-6 space-y-1">
                    {[
                        { id: 'overview', label: 'Overview', icon: Icons.Home },
                        { id: 'documents', label: 'Case Documents', icon: Icons.FileText, count: caseData.documents.length },
                        { id: 'people', label: 'People & Parties', icon: Icons.Users, count: caseData.people.length },
                        { id: 'notes', label: 'Internal Notes', icon: Icons.Edit3, count: caseData.notes.length },
                        { id: 'financials', label: 'Financials', icon: Icons.DollarSign, count: caseData.financials?.length || 0 },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${activeTab === item.id ? 'bg-white border-crimson-800 text-crimson-900 shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            <item.icon className={`h-5 w-5 md:mr-3 ${activeTab === item.id ? 'text-crimson-800' : 'text-gray-400'}`} />
                            <span className="hidden md:inline">{item.label}</span>
                            {item.count !== undefined && item.count > 0 && <span className="hidden md:flex ml-auto bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-[10px] font-bold">{item.count}</span>}
                        </button>
                    ))}

                    <div className="pt-6 mt-6 border-t border-gray-200 px-6">
                        <p className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Intelligence</p>
                    </div>

                    <button 
                        onClick={() => setActiveTab('unclear')}
                        className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${activeTab === 'unclear' ? 'bg-white border-crimson-800 text-crimson-900 shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <Icons.Search className={`h-5 w-5 md:mr-3 ${activeTab === 'unclear' ? 'text-crimson-800' : 'text-gray-400'}`} />
                        <span className="hidden md:inline">Ambiguity Check</span>
                    </button>

                     <button 
                        onClick={() => setActiveTab('analysis')}
                        className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${activeTab === 'analysis' ? 'bg-white border-crimson-800 text-crimson-900 shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <Icons.ShieldAlert className={`h-5 w-5 md:mr-3 ${activeTab === 'analysis' ? 'text-crimson-800' : 'text-gray-400'}`} />
                        <span className="hidden md:inline">Risk Analysis</span>
                    </button>
                </nav>
            </div>

            {/* Main Workspace */}
            <main className="flex-1 overflow-y-auto bg-white p-8 md:p-12 relative">
                
                {/* Content Tabs */}
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Matter Brief</h2>
                            <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Icons.Scale className="h-24 w-24 text-gray-900" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Matter Description</h3>
                                <p className="text-lg text-gray-800 font-light leading-relaxed">{caseData.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 rounded-sm border border-gray-200 hover:border-crimson-200 transition-colors cursor-pointer group" onClick={runUnclearAnalysis}>
                                    <div className="h-10 w-10 bg-yellow-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-100">
                                        <Icons.Search className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Run Ambiguity Check</h3>
                                    <p className="text-sm text-gray-500 mt-2">Identify vague terms and potential loopholes in current documents.</p>
                                </div>
                                <div className="p-6 rounded-sm border border-gray-200 hover:border-crimson-200 transition-colors cursor-pointer group" onClick={runFullAnalysis}>
                                    <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100">
                                        <Icons.ShieldAlert className="h-5 w-5 text-crimson-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Generate Risk Report</h3>
                                    <p className="text-sm text-gray-500 mt-2">Create a comprehensive legal risk assessment of all contracts.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-gray-900">Case Documents</h2>
                                <label className="bg-gray-900 text-white px-5 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-gray-800 shadow-md cursor-pointer flex items-center">
                                    <Icons.Upload className="h-4 w-4 inline mr-2" /> Upload File
                                    <input type="file" className="hidden" onChange={handleFileInput} />
                                </label>
                            </div>

                            {/* Drag and Drop Zone */}
                            <div 
                                className={`border-2 border-dashed rounded-sm p-10 mb-8 text-center transition-all duration-200 cursor-pointer ${isDragging ? 'border-crimson-600 bg-red-50' : 'border-gray-300 hover:border-crimson-400 bg-gray-50'}`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                    <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-crimson-100 text-crimson-800' : 'bg-white text-gray-400 shadow-sm'}`}>
                                         <Icons.Upload className="h-8 w-8" />
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {isDragging ? "Drop files to secure upload" : "Drag & Drop new case files here"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 mb-4">
                                        Secure encryption applied automatically upon upload. Supports text-based files.
                                    </p>
                                    <span className="text-xs font-bold text-crimson-800 hover:text-crimson-900 border-b border-crimson-200 pb-0.5">
                                        or browse from your device
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                                <ul className="divide-y divide-gray-100">
                                    {caseData.documents.map(doc => (
                                        <li key={doc.id} className="p-6 hover:bg-gray-50 flex items-center justify-between group transition-colors">
                                            <div className="flex items-center">
                                                <div className="bg-gray-100 p-3 rounded-sm text-gray-500 mr-5 group-hover:bg-crimson-50 group-hover:text-crimson-600 transition-colors">
                                                    <Icons.FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-gray-900">{doc.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Added {doc.dateAdded} • {doc.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                 <button 
                                                    onClick={() => { runUnclearAnalysis(); setActiveTab('unclear'); }}
                                                    className="text-xs font-bold text-gray-500 hover:text-crimson-800 uppercase tracking-wide px-3 py-1"
                                                >
                                                    Check Ambiguity
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                    {caseData.documents.length === 0 && (
                                        <li className="p-12 text-center text-gray-400">
                                            <Icons.Upload className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                            No documents uploaded to this secure container yet.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'financials' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Financial Ledger</h2>
                            
                            {/* Add New Record Form */}
                            <div className="bg-gray-50 p-6 rounded-sm border border-gray-200 mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Record Transaction</h3>
                                <form onSubmit={handleAddFinancial} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                        <select 
                                            value={finType}
                                            onChange={(e) => setFinType(e.target.value as any)}
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                        >
                                            <option value="Income">Income</option>
                                            <option value="Expense">Expense</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                        <select 
                                            value={finCategory}
                                            onChange={(e) => setFinCategory(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                        >
                                            <option value="Billable Hours">Billable Hours</option>
                                            <option value="Flat Fee">Flat Fee</option>
                                            <option value="Court Fee">Court Fee</option>
                                            <option value="Administrative">Administrative</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                        <input 
                                            type="text" 
                                            value={finDescription}
                                            onChange={(e) => setFinDescription(e.target.value)}
                                            placeholder="e.g. Initial consultation"
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Amount ($)</label>
                                        <input 
                                            type="number" 
                                            value={finAmount}
                                            onChange={(e) => setFinAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button type="submit" className="w-full bg-crimson-800 text-white p-2 rounded-sm text-sm font-bold hover:bg-crimson-900 transition-colors">
                                            Add Record
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* List */}
                            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {caseData.financials?.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${item.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.type === 'Expense' ? '-' : '+'}${item.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!caseData.financials || caseData.financials.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm italic">
                                                    No financial records found. Add a transaction above.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    {caseData.financials && caseData.financials.length > 0 && (
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan={3} className="px-6 py-3 text-right text-xs font-bold text-gray-900 uppercase">Net Total</td>
                                                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                                                    ${caseData.financials.reduce((acc, curr) => acc + (curr.type === 'Income' ? curr.amount : -curr.amount), 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'unclear' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Ambiguity Analysis</h2>
                            <p className="text-gray-500 mb-8 max-w-2xl">
                                Veritas AI scans documents for vague terminology ("reasonable time", "best efforts") that often leads to litigation.
                            </p>

                            {analyzingUnclear ? (
                                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-sm">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson-800 mb-4"></div>
                                    <p className="text-gray-900 font-medium">Scanning for lexical ambiguity...</p>
                                    <p className="text-xs text-gray-500 mt-2">Comparing against legal dictionaries and case precedent</p>
                                </div>
                            ) : unclearTerms.length > 0 ? (
                                <div className="space-y-6">
                                    {unclearTerms.map((item, idx) => (
                                        <div key={idx} className="bg-white border-l-4 border-yellow-500 shadow-sm p-6 rounded-r-sm">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold text-gray-900 bg-yellow-50 inline-block px-2 py-0.5 rounded-sm">
                                                    "{item.term}"
                                                </h3>
                                                <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest border border-yellow-200 px-2 py-1 rounded-full">Ambiguous</span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-3 italic border-l-2 border-gray-200 pl-3 my-3">
                                                Context: "...{item.context}..."
                                            </p>
                                            <p className="text-gray-800 text-sm font-medium mt-3">
                                                <span className="text-gray-400 uppercase text-xs tracking-wider mr-2">Risk:</span>
                                                {item.ambiguity}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-start">
                                                <Icons.CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-bold">Suggestion:</span> {item.suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-sm">
                                    <Icons.Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">No ambiguity report generated yet.</p>
                                    <button 
                                        onClick={runUnclearAnalysis}
                                        className="mt-4 bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-sm text-sm font-bold shadow-sm hover:bg-gray-50"
                                    >
                                        Scan Documents
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'analysis' && (
                        <div className="animate-fade-in">
                             <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Risk Assessment Report</h2>
                             {analyzing ? (
                                 <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-sm">
                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson-800 mb-4"></div>
                                     <p className="text-gray-900 font-medium">Veritas AI is analyzing legal risks...</p>
                                 </div>
                             ) : report ? (
                                 <AnalysisResult report={report} />
                             ) : (
                                 <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-sm">
                                     <Icons.ShieldAlert className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                     <p className="text-gray-600 font-medium">Select a document and run analysis to view the comprehensive report.</p>
                                     <button onClick={runFullAnalysis} className="mt-4 text-crimson-800 font-bold hover:underline">Start Risk Analysis</button>
                                 </div>
                             )}
                        </div>
                    )}
                    
                    {activeTab === 'people' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Involved Parties</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {caseData.people.map(p => (
                                    <div key={p.id} className="bg-white border border-gray-200 p-6 rounded-sm flex items-start shadow-sm">
                                        <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{p.name}</p>
                                            <p className="text-sm text-crimson-800 font-medium uppercase tracking-wide">{p.role}</p>
                                            <div className="mt-3 text-sm text-gray-500 space-y-1">
                                                <p className="flex items-center"><Icons.Home className="h-3 w-3 mr-2" /> {p.organization}</p>
                                                <p className="flex items-center"><Icons.ArrowRight className="h-3 w-3 mr-2" /> {p.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                         <div className="animate-fade-in">
                             <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-gray-900">Internal Notes</h2>
                                <button className="text-sm font-bold text-crimson-800 hover:text-crimson-900 flex items-center">
                                    <Icons.Edit3 className="h-4 w-4 mr-1" /> Add Note
                                </button>
                             </div>
                             <div className="space-y-6">
                                 {caseData.notes.map(note => (
                                     <div key={note.id} className="bg-yellow-50 p-6 rounded-sm border border-yellow-200 shadow-sm relative group">
                                         <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                                         <p className="text-gray-800 text-base font-serif leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                         <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-yellow-100 pt-3">
                                             <div className="flex items-center">
                                                <div className="h-5 w-5 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-bold mr-2 text-[10px]">
                                                    {note.author.charAt(0)}
                                                </div>
                                                <span className="font-bold uppercase tracking-wide">{note.author}</span>
                                             </div>
                                             <span>{note.date}</span>
                                         </div>
                                     </div>
                                 ))}
                                 <div className="bg-gray-50 p-6 rounded-sm border border-gray-200 border-dashed text-center">
                                     <p className="text-gray-400 text-sm">Notes are encrypted and only visible to authorized case partners.</p>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Persistent AI Sidebar */}
            <aside className="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-2xl z-30">
                <div className="p-5 bg-gray-900 text-white flex justify-between items-center shadow-md">
                    <div className="flex items-center">
                        <div className="bg-crimson-600 p-1.5 rounded-sm mr-3 shadow-sm animate-pulse">
                            <Icons.Zap className="h-3 w-3 text-white" />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-sm tracking-wide">Veritas Associate</h3>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Context-Aware AI</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[90%] rounded-sm p-4 text-sm shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-white border border-gray-200 text-gray-800' 
                                : 'bg-white border-l-2 border-l-crimson-800 text-gray-800'
                            }`}>
                                <div className="prose prose-sm max-w-none text-gray-700">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                                <p className="text-[10px] text-gray-300 mt-2 text-right">
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                            
                            {/* Suggestions Chips */}
                            {msg.role === 'model' && msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2 w-[90%]">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide w-full mb-1">Suggested Follow-ups:</p>
                                    {msg.suggestions.map((suggestion, sIdx) => (
                                        <button
                                            key={sIdx}
                                            onClick={() => handleSendMessage(undefined, suggestion)}
                                            className="text-xs bg-gray-100 hover:bg-crimson-50 hover:text-crimson-800 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 transition-colors text-left"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="bg-white border-l-2 border-l-gray-300 rounded-sm p-4 shadow-sm">
                                <div className="flex space-x-1.5">
                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                        <textarea 
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Ask about case details, precedents, or strategy..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-crimson-800 focus:border-crimson-800 outline-none text-sm resize-none h-14 bg-gray-50"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputMsg.trim()}
                            className="absolute right-3 top-3 p-1.5 bg-crimson-800 text-white rounded-sm hover:bg-crimson-900 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            <Icons.ArrowRight className="h-3 w-3" />
                        </button>
                    </form>
                    <div className="flex justify-center mt-2 space-x-3">
                         <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center">
                            <Icons.Lock className="h-2 w-2 mr-1" /> Encrypted
                         </span>
                         <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center">
                            <Icons.CheckCircle className="h-2 w-2 mr-1" /> Cited Sources
                         </span>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};

export default CaseDetail;
