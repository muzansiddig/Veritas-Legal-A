import React, { useState } from 'react';
import { Icons } from './Icons';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setView(AppView.LANDING)}>
            <div className="bg-crimson-800 p-1.5 rounded-sm mr-3">
               <Icons.Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">VERITAS</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setView(AppView.LANDING)} 
              className={`text-sm font-medium transition-colors ${currentView === AppView.LANDING ? 'text-crimson-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setView(AppView.DASHBOARD)} 
              className={`text-sm font-medium transition-colors ${currentView === AppView.DASHBOARD || currentView === AppView.CASE_DETAIL ? 'text-crimson-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Partner Dashboard
            </button>
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-crimson-100 flex items-center justify-center text-crimson-800 font-serif font-bold border border-crimson-200">
                    JD
                </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <Icons.X className="h-6 w-6" /> : <Icons.Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { setView(AppView.LANDING); setIsOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100">Home</button>
            <button onClick={() => { setView(AppView.DASHBOARD); setIsOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100">Partner Dashboard</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
