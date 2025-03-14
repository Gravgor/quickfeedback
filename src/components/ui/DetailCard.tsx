import React, { ReactNode } from 'react';

interface DetailCardSection {
  label: string;
  content: ReactNode;
}

interface DetailCardProps {
  title: ReactNode;
  sections: DetailCardSection[];
}

export default function DetailCard({ title, sections }: DetailCardProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        {title}
      </div>
      
      <div className="border-t border-gray-200">
        <dl>
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">{section.label}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {section.content}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
} 