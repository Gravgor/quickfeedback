'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SiteActionsProps {
  siteId: string;
  showIntegration: boolean;
}

export default function SiteActions({ siteId, showIntegration }: SiteActionsProps) {
  const router = useRouter();
  
  // Toggle the integration guide visibility via URL parameters
  const toggleIntegration = () => {
    const url = showIntegration 
      ? `/dashboard/sites/${siteId}`
      : `/dashboard/sites/${siteId}?showIntegration=true`;
    router.push(url);
  };
  
  return (
    <div className="flex justify-between mb-8">
      <div className="flex space-x-4">
        <Link
          href={`/dashboard/sites/${siteId}/feedback`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View All Feedback
        </Link>
        <button
          onClick={toggleIntegration}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          {showIntegration ? 'Hide Integration Guide' : 'Show Integration Guide'}
        </button>
      </div>
      <Link
        href={`/dashboard/sites/${siteId}/settings`}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Site Settings
      </Link>
    </div>
  );
} 