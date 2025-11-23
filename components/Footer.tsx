import React from 'react';
import { Icons } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
                <Icons.Scale className="h-8 w-8 text-crimson-600" />
                <span className="ml-3 text-2xl font-serif font-bold tracking-tight">Veritas AI</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering legal professionals with verified AI intelligence and automated risk assessment.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Document Analysis</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Legal Research</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Risk Reporting</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Security & Privacy</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
             <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Compliance</h3>
             <div className="mt-4 flex items-center space-x-4">
                 <div className="px-3 py-1 border border-gray-700 rounded text-xs text-gray-400">SOC2 Type II</div>
                 <div className="px-3 py-1 border border-gray-700 rounded text-xs text-gray-400">GDPR</div>
             </div>
             <p className="mt-4 text-xs text-gray-500">
               Veritas AI is an assistive tool for legal professionals. It does not provide legal advice.
             </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-base text-gray-500">&copy; 2024 Veritas Legal AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;