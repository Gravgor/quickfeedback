import React from 'react';
import Link from 'next/link';
import FeedbackRating from '@/components/feedback/FeedbackRating';

// A more flexible interface that accepts both service types and component types
interface FeedbackItem {
  id?: string;
  rating: number;
  comment?: string | null;
  url?: string | null;
  browser?: string | null;
  device?: string | null;
  country?: string | null;
  created_at?: string | null;
}

interface Site {
  id?: string;
  url?: string | null;
}

interface RecentFeedbackProps {
  feedback: FeedbackItem[];
  site: Site;
  siteId: string;
}

export default function RecentFeedback({ feedback, site, siteId }: RecentFeedbackProps) {
  // Only show the 5 most recent feedback entries
  const recentFeedback = feedback.slice(0, 5);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Feedback
        </h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {recentFeedback.map((item, index) => (
          <li key={item.id || index} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <FeedbackRating rating={item.rating} />
                  <span className="ml-2 text-sm text-gray-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
                {item.comment && (
                  <div className="mt-2 text-sm text-gray-700">
                    "{item.comment}"
                  </div>
                )}
                {item.url && site.url && (
                  <div className="mt-1 text-xs text-gray-500">
                    Page: {item.url.replace(site.url, '')}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-gray-500">
                  {item.browser} / {item.device}
                  {item.country && (
                    <span className="ml-2">{item.country}</span>
                  )}
                </div>
                {item.id && (
                  <Link
                    href={`/dashboard/sites/${siteId}/feedback/${item.id}`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View details
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {feedback.length > 5 && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Link
            href={`/dashboard/sites/${siteId}/feedback`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all {feedback.length} feedback
          </Link>
        </div>
      )}
    </div>
  );
} 