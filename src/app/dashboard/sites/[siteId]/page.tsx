'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSiteById } from '@/services/siteService';
import { getFeedbackBySiteId, getSiteAnalytics } from '@/services/feedbackService';
import { SiteOnboarding } from '@/components/SiteOnboarding';
import { SiteAnalytics } from '@/components/SiteAnalytics';

export default function SiteDetail({ params }: { params: { siteId: string } }) {
  const [site, setSite] = useState<any>(null);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIntegration, setShowIntegration] = useState(false);
  const { user } = useAuth();
  const { siteId } = params;

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        setAnalyticsLoading(true);
        
        // Load site data
        const siteData = await getSiteById(siteId);
        if (!siteData) {
          setError('Site not found');
          return;
        }
        
        // Verify the site belongs to the user
        if (siteData.user_id !== user.id) {
          setError('You do not have permission to access this site');
          return;
        }
        
        setSite(siteData);
        
        // Load feedback data
        const feedbackData = await getFeedbackBySiteId(siteId);
        setFeedback(feedbackData || []);
        
        // Load analytics data
        const analyticsData = await getSiteAnalytics(siteId);
        setAnalytics(analyticsData);
        setAnalyticsLoading(false);
        
        // Show integration guide if there's no feedback
        if (!feedbackData || feedbackData.length === 0) {
          setShowIntegration(true);
        }
      } catch (err: any) {
        console.error('Error loading site data:', err);
        setError(err.message || 'An error occurred while loading site data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [siteId, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <Link
                href="/dashboard/sites"
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                Go back to sites
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!site) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard/sites" 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{site.name}</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          <a 
            href={site.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-600 hover:underline"
          >
            {site.url}
          </a>
        </p>
      </div>

      {/* Analytics Dashboard */}
      <div className="mb-8">
        <SiteAnalytics analytics={analytics} loading={analyticsLoading} />
      </div>

      {/* Action buttons */}
      <div className="flex justify-between mb-8">
        <div className="flex space-x-4">
          <Link
            href={`/dashboard/sites/${siteId}/feedback`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Feedback
          </Link>
          <button
            onClick={() => setShowIntegration(!showIntegration)}
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

      {/* No feedback prompt */}
      {feedback.length === 0 && !showIntegration && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No feedback has been collected yet. Add the widget to your website to start receiving feedback.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setShowIntegration(true)}
                  className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                >
                  Show integration guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration guide */}
      {showIntegration && (
        <div className="mb-8">
          <SiteOnboarding site={site} onClose={() => setShowIntegration(false)} />
        </div>
      )}

      {/* Recent feedback */}
      {feedback.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Feedback
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {feedback.slice(0, 5).map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {item.comment && (
                      <div className="mt-2 text-sm text-gray-700">
                        "{item.comment}"
                      </div>
                    )}
                    {item.url && (
                      <div className="mt-1 text-xs text-gray-500">
                        Page: {item.url.replace(site.url, '')}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.browser} / {item.device}
                    {item.country && (
                      <span className="ml-2">{item.country}</span>
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
      )}
    </div>
  );
} 