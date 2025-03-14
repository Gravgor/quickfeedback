"use client"

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

import { useEffect } from "react";
import Link from "next/link";
import { getSiteById } from "@/services/siteService";
import { getFeedbackById } from "@/services/feedbackService";
export default function FeedbackDetail({
    params
}: {
    params: {
        siteId: string;
        feedbackId: string;
    }
}) {
    const [site, setSite] = useState<any>(null);
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { siteId, feedbackId } = params;
  
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
          const feedbackData = await getFeedbackById(feedbackId);
          if (!feedbackData) {
            setError('Feedback not found');
            return;
          }
          
          // Verify the feedback belongs to the site
          if (feedbackData.site_id !== siteId) {
            setError('This feedback does not belong to this site');
            return;
          }
          
          setFeedback(feedbackData);
        } catch (err: any) {
          console.error('Error loading feedback data:', err);
          setError(err.message || 'An error occurred while loading feedback data');
        } finally {
          setLoading(false);
        }
      }
      
      loadData();
    }, [siteId, feedbackId, user]);
  
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
                  href={`/dashboard/sites/${siteId}/feedback`}
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Go back to feedback list
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    if (!site || !feedback) {
      return null;
    }
  
    // Format date
    const formattedDate = new Date(feedback.created_at).toLocaleString();
    
    // Format time on page
    const formatTime = (seconds: number | null): string => {
      if (!seconds) return 'Not recorded';
      
      if (seconds < 60) {
        return `${seconds} seconds`;
      }
      
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      
      if (mins < 60) {
        return `${mins} min ${secs} sec`;
      }
      
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      
      return `${hours} hr ${remainingMins} min`;
    };
  
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Link 
              href={`/dashboard/sites/${siteId}/feedback`} 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Feedback Details
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            For {site.name} - {formattedDate}
          </p>
        </div>
  
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Rating: 
                  <span className="ml-2 inline-flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-gray-500">
                      ({feedback.rating}/5)
                    </span>
                  </span>
                </h3>
              </div>
              <div>
                {feedback.created_at && (
                  <span className="text-sm text-gray-500">
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Comment</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {feedback.comment || <span className="text-gray-400 italic">No comment provided</span>}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Page URL</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {feedback.url ? (
                    <a 
                      href={feedback.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {feedback.url}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Device Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="mb-1">
                    <span className="font-medium">Device:</span> {feedback.device || 'Unknown'}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Browser:</span> {feedback.browser || 'Unknown'}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">OS:</span> {feedback.os || 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Screen Size:</span> {feedback.screen_size || 'Unknown'}
                  </div>
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {feedback.country ? (
                    <div>
                      {feedback.country}
                      {feedback.city && <span className="ml-1">({feedback.city})</span>}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Location not available</span>
                  )}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Session Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="mb-1">
                    <span className="font-medium">Time on Page:</span> {formatTime(feedback.time_on_page)}
                  </div>
                  {feedback.referrer && (
                    <div>
                      <span className="font-medium">Referrer:</span> {feedback.referrer}
                    </div>
                  )}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Language</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {feedback.language || <span className="text-gray-400 italic">Not detected</span>}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">User Agent</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono overflow-auto sm:mt-0 sm:col-span-2">
                  <div className="text-xs bg-gray-100 p-3 rounded max-h-32 overflow-y-auto">
                    {feedback.user_agent || <span className="text-gray-400 italic">Not available</span>}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
}


