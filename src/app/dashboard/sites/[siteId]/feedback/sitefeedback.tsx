"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSiteById } from '@/services/siteService';
import { getFeedbackBySiteId } from '@/services/feedbackService';

export default function SiteFeedback({ params }: { params: { siteId: string } }) {
    const [site, setSite] = useState<any>(null);
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { siteId } = params;
  
    useEffect(() => {
      async function loadData() {
        if (!user) return;
        
        try {
          setLoading(true);
          
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
        } catch (err: any) {
          console.error('Error loading feedback data:', err);
          setError(err.message || 'An error occurred while loading feedback data');
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
                  href={`/dashboard/sites/${siteId}`}
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Go back to site
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
              href={`/dashboard/sites/${siteId}`} 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Feedback for {site.name}
            </h1>
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
  
        {feedback.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
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
                  <Link
                    href={`/dashboard/sites/${siteId}`}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                  >
                    Go to integration guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Feedback ({feedback.length})
              </h3>
              <div>
                {/* Export button (could be implemented in the future) */}
                <button
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => alert('Export functionality coming soon!')}
                >
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time on Page
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedback.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-500 text-sm">
                            {item.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate">
                          {item.comment || <span className="text-gray-400 italic">No comment</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.url ? (
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="hover:text-blue-600 hover:underline"
                            >
                              {item.url.replace(site.url, '') || '/'}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">Unknown</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()} 
                          <span className="text-xs text-gray-400 ml-1">
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div>{item.device || 'Unknown'}</div>
                          <div className="text-xs text-gray-400">{item.browser} / {item.os || 'Unknown'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.country ? (
                            <div>
                              {item.country}
                              {item.city && <span className="text-xs text-gray-400 ml-1">{item.city}</span>}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Unknown</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.time_on_page ? (
                            formatTime(item.time_on_page)
                          ) : (
                            <span className="text-gray-400 italic">Unknown</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/sites/${siteId}/feedback/${item.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Helper function to format time
  function formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins < 60) {
      return `${mins}m ${secs}s`;
    }
    
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    return `${hours}h ${remainingMins}m`;
}



