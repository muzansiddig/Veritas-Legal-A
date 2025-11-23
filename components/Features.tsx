import React from 'react';
import { Icons } from './Icons';

const features = [
  {
    name: 'Reliable Document Analysis',
    description: 'Instantly extract key clauses and summaries from complex contracts using advanced natural language processing.',
    icon: Icons.FileText,
  },
  {
    name: 'Risk & Liability Assessment',
    description: 'Identify potential legal pitfalls, weak clauses, and non-compliance issues with severity ratings.',
    icon: Icons.ShieldAlert,
  },
  {
    name: 'Grounded Legal Research',
    description: 'Ask complex legal questions and get answers cited from official laws, court rulings, and trusted databases.',
    icon: Icons.BookOpen,
  },
  {
    name: 'Smart ROI Estimation',
    description: 'Calculate the time and cost saved per case by automating initial review and research phases.',
    icon: Icons.BarChart3,
  },
];

const Features: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-crimson-600 font-semibold tracking-wide uppercase">Capabilities</h2>
          <p className="mt-2 text-3xl leading-8 font-serif font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Intelligence for the Modern Legal Practice
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Veritas integrates strictly with verified legal sources to ensure every insight is actionable and trustworthy.
          </p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-crimson-600 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-serif font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;