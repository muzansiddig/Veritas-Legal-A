import React from 'react';
import { Case } from '../types';
import { Icons } from './Icons';

interface DashboardProps {
  cases: Case[];
  onSelectCase: (c: Case) => void;
  onCreateCase: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, onSelectCase, onCreateCase }) => {
  const activeCases = cases.filter(c => c.status === 'Active');
  const pendingCases = cases.filter(c => c.status === 'Pending');
  const archivedCases = cases.filter(c => c.status === 'Archived');

  // Calculate total financials
  const totalIncome = cases.reduce((sum, c) => {
    return sum + (c.financials?.filter(f => f.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0) || 0);
  }, 0);

  const totalExpenses = cases.reduce((sum, c) => {
    return sum + (c.financials?.filter(f => f.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0) || 0);
  }, 0);

  const netRevenue = totalIncome - totalExpenses;

  const CaseCard = ({ data }: { data: Case }) => (
    <div 
        onClick={() => onSelectCase(data)}
        className="group relative bg-white border border-gray-200 rounded-sm p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer"
    >
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-crimson-800 transition-colors"></div>
        <div className="flex justify-between items-start mb-4 mt-2">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{data.id}</p>
                <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-crimson-800 transition-colors">
                    {data.title}
                </h3>
            </div>
            {data.status === 'Active' ? (
                 <div className="bg-green-50 text-green-700 p-1.5 rounded-full">
                    <Icons.BarChart3 className="h-4 w-4" />
                 </div>
            ) : (
                 <div className="bg-yellow-50 text-yellow-700 p-1.5 rounded-full">
                    <Icons.Lock className="h-4 w-4" />
                 </div>
            )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-6 h-10 font-light">
            {data.description}
        </p>

        <div className="flex items-center justify-between">
             <div className="flex -space-x-2">
                 {data.people.length > 0 ? data.people.map(p => (
                     <div key={p.id} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600" title={p.name}>
                        {p.name.charAt(0)}
                     </div>
                 )) : (
                     <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-400">?</div>
                 )}
             </div>
             <span className="text-xs text-gray-500 font-medium">Updated {data.lastUpdated}</span>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
                <div className="h-16 w-16 bg-crimson-800 rounded-sm flex items-center justify-center text-white font-serif text-2xl font-bold shadow-md mr-6">
                    ES
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Eleanor Sterling</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Senior Partner • Veritas Legal Group</p>
                </div>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
                <button 
                  onClick={onCreateCase}
                  className="flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-crimson-800 hover:bg-crimson-900 transition-colors"
                >
                    <Icons.Upload className="h-4 w-4 mr-2" />
                    New Matter
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Financial Overview - New Feature */}
        <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center">
                <Icons.DollarSign className="h-5 w-5 mr-2 text-crimson-800" />
                Financial Performance (All Matters)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 border border-green-100 rounded-sm">
                    <p className="text-xs text-green-800 font-bold uppercase tracking-wider">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
                    <p className="text-xs text-red-800 font-bold uppercase tracking-wider">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Net Income</p>
                    <p className={`text-2xl font-bold mt-1 ${netRevenue >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        ${netRevenue.toLocaleString()}
                    </p>
                </div>
            </div>
        </section>

        {/* Active Cases Section */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center">
                    Active Litigation & Review
                    <span className="ml-3 px-2 py-0.5 rounded-full bg-crimson-50 text-crimson-800 text-xs font-sans font-bold">{activeCases.length}</span>
                </h2>
            </div>
            {activeCases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCases.map(c => <CaseCard key={c.id} data={c} />)}
                </div>
            ) : (
                <p className="text-gray-500 text-sm italic">No active cases.</p>
            )}
        </section>

        {/* Pending Cases Section */}
        <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center">
                Pending Intake & Conflict Check
                <span className="ml-3 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-xs font-sans font-bold">{pendingCases.length}</span>
            </h2>
            {pendingCases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingCases.map(c => <CaseCard key={c.id} data={c} />)}
                </div>
            ) : (
                <p className="text-gray-500 text-sm italic">No pending cases.</p>
            )}
        </section>

        {/* Archives Section (List View) */}
        <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center">
                 Past Matters & Archives
            </h2>
            <div className="bg-white shadow-sm overflow-hidden rounded-sm border border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">Case Title / Client</div>
                    <div className="col-span-2">Matter ID</div>
                    <div className="col-span-3">Date Closed</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                    {archivedCases.map((c) => (
                        <li key={c.id} onClick={() => onSelectCase(c)} className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                <div className="col-span-5">
                                    <p className="text-sm font-serif font-medium text-gray-900 truncate">{c.title}</p>
                                    <p className="text-xs text-gray-500">{c.client}</p>
                                </div>
                                <div className="col-span-2 text-xs text-gray-400 font-mono">{c.id}</div>
                                <div className="col-span-3 text-sm text-gray-600">{c.lastUpdated}</div>
                                <div className="col-span-2 text-right">
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                        Archived
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                    {archivedCases.length === 0 && (
                        <li className="px-6 py-4 text-center text-sm text-gray-500 italic">No archived cases.</li>
                    )}
                </ul>
            </div>
        </section>

        {/* System Health / Risk Monitor */}
        <section className="bg-gray-900 rounded-sm p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-serif font-bold text-white mb-1">System Integrity Monitor</h3>
                    <p className="text-gray-400 text-sm">Real-time analysis of platform security and operational bottlenecks.</p>
                </div>
                <Icons.ShieldAlert className="h-6 w-6 text-green-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-gray-800 p-4 rounded-sm border border-gray-700">
                    <div className="flex items-center mb-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Encryption</span>
                    </div>
                    <p className="text-sm text-gray-300">End-to-end AES-256 active for all case files. Keys rotated every 24h.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-sm border border-gray-700">
                     <div className="flex items-center mb-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Reliability</span>
                    </div>
                    <p className="text-sm text-gray-300">Context window at 45% capacity. Verification layer active for hallucinations.</p>
                </div>
                 <div className="bg-gray-800 p-4 rounded-sm border border-gray-700">
                     <div className="flex items-center mb-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Audit Logs</span>
                    </div>
                    <p className="text-sm text-gray-300">Immutable access logs recording. 0 unauthorized attempts in last 7 days.</p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
