import React from 'react';
import { Icons } from './Icons';
import { AppView } from '../types';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-crimson-800 uppercase bg-red-50 rounded-sm border border-red-100">
                Veritas Legal Intelligence
              </span>
              <h1 className="text-4xl tracking-tight font-serif font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                <span className="block xl:inline">Legal Precision.</span>{' '}
                <span className="block text-crimson-800 xl:inline">Absolute Authority.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-light leading-relaxed">
                Veritas AI analyzes legal documents using only verified official laws and court rulings. 
                Experience risk assessments, clause extraction, and research with world-class accuracy.
              </p>
              <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-sm shadow-md">
                  <button
                    onClick={onGetStarted}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm text-white bg-crimson-800 hover:bg-crimson-900 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Analysis
                    <Icons.ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:border-crimson-200"
                  >
                    Platform Overview
                  </button>
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                 <div className="flex items-center">
                    <Icons.ShieldAlert className="h-4 w-4 text-crimson-600 mr-2" />
                    <span className="uppercase tracking-wide text-xs font-semibold">SOC2 Compliant</span>
                 </div>
                 <div className="flex items-center">
                    <Icons.Lock className="h-4 w-4 text-crimson-600 mr-2" />
                    <span className="uppercase tracking-wide text-xs font-semibold">End-to-End Encryption</span>
                 </div>
                 <div className="flex items-center">
                    <Icons.CheckCircle className="h-4 w-4 text-crimson-600 mr-2" />
                    <span className="uppercase tracking-wide text-xs font-semibold">Verified Sources</span>
                 </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-50 border-l border-gray-200 flex items-center justify-center">
         {/* Abstract UI representation */}
         <div className="relative w-3/4 h-3/4 bg-white shadow-2xl rounded-sm p-8 border border-gray-200 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-700">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                </div>
                <div className="text-xs text-crimson-800 font-bold uppercase tracking-widest">Confidential Report</div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                     <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icons.Scale className="h-5 w-5 text-gray-400" />
                     </div>
                     <div className="flex-1">
                        <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-50 rounded w-1/4"></div>
                     </div>
                </div>
                
                <div className="p-5 bg-red-50 border-l-2 border-crimson-700 rounded-r-sm">
                    <div className="flex items-start">
                        <Icons.AlertTriangle className="h-5 w-5 text-crimson-700 mr-3 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-serif font-bold text-crimson-900">Critical Risk Detected</h4>
                            <p className="text-xs text-crimson-800 mt-1 leading-relaxed">Clause 12.4 contains ambiguity regarding liability caps that contradicts state statutes.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Hero;