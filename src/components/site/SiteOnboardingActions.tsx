'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SiteOnboardingActionsProps {
  siteId: string;
}

export default function SiteOnboardingActions({ siteId }: SiteOnboardingActionsProps) {
  const router = useRouter();
  
  const closeIntegrationGuide = () => {
    router.push(`/dashboard/sites/${siteId}`);
  };
  
  return (
    <div className="mt-4 text-center">
      <button 
        onClick={closeIntegrationGuide}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Back to Site Details
      </button>
    </div>
  );
} 