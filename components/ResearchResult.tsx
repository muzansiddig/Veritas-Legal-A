import React from 'react';
import { ResearchResult as ResearchResultType } from '../types';
import { Icons } from './Icons';
import ReactMarkdown from 'react-markdown';

interface ResearchResultProps {
  result: ResearchResultType;
}

const ResearchResult: React.FC<ResearchResultProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-fade-in">
      <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
        <Icons.BookOpen className="h-6 w-6 text-crimson-600 mr-3" />
        <h3 className="text-2xl font-serif font-bold text-gray-900">Research Findings</h3>
      </div>
      
      <div className="prose prose-crimson max-w-none text-gray-700">
        <ReactMarkdown>{result.answer}</ReactMarkdown>
      </div>

      {result.sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Cited Sources</h4>
          <div className="grid grid-cols-1 gap-3">
            {result.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors group"
              >
                <div className="bg-white p-2 rounded border border-gray-200 mr-3 group-hover:border-crimson-200">
                    <Icons.Scale className="h-4 w-4 text-gray-400 group-hover:text-crimson-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-900 group-hover:text-blue-700 truncate">{source.title}</p>
                    <p className="text-xs text-gray-500 truncate">{source.uri}</p>
                </div>
                <Icons.ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-gray-600" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchResult;