'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSitesByUserId, deleteSite } from '@/services/siteService';
import { getSiteAnalytics } from '@/services/feedbackService';

export default function SitesList() {
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadSites() {
      if (!user) return;
      
      try {
        setLoading(true);
        // Load user's sites
        const userSites = await getSitesByUserId(user.id);
        setSites(userSites);
        
        // Load analytics for each site
        const analyticsData: Record<string, any> = {};
        for (const site of userSites) {
          const siteAnalytics = await getSiteAnalytics(site.id);
          analyticsData[site.id] = siteAnalytics;
        }
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading sites:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSites();
  }, [user]);

  const handleDeleteSite = async (siteId: string) => {
    if (deleting) return;
    
    try {
      setDeleting(true);
      await deleteSite(siteId);
      setSites(sites.filter(site => site.id !== siteId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting site:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Sites</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the websites you're collecting feedback from
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Site
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {sites.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sites</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first website.</p>
              <div className="mt-6">
                <Link
                  href="/dashboard/sites/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Site
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sites.map((site) => (
                <li key={site.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-lg">
                          {site.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <a 
                            href={site.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 hover:underline"
                          >
                            {site.url}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center px-4">
                        <div className="text-sm font-medium text-gray-500">Feedback</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {analytics[site.id]?.total || 0}
                        </div>
                      </div>
                      <div className="text-center px-4">
                        <div className="text-sm font-medium text-gray-500">Avg. Rating</div>
                        <div className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                          <span>
                            {analytics[site.id]?.averageRating
                              ? analytics[site.id].averageRating.toFixed(1)
                              : 'N/A'}
                          </span>
                          {analytics[site.id]?.averageRating && (
                            <svg
                              className="h-5 w-5 text-yellow-400 ml-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/sites/${site.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(site.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Integration prompt for sites with no feedback */}
                  {(!analytics[site.id] || analytics[site.id]?.total === 0) && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex flex-1 justify-between">
                          <div>
                            <p className="text-sm text-blue-700">
                              No feedback collected yet. Add the widget to your website to start collecting feedback.
                            </p>
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/sites/onboarding/${site.id}`}
                              className="whitespace-nowrap bg-blue-100 px-3 py-1 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-200"
                            >
                              Integration Guide
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete confirmation */}
                  {deleteConfirm === site.id && (
                    <div className="mt-4 bg-red-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Are you sure you want to delete this site?
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              This will permanently delete the site and all associated feedback. This action cannot be undone.
                            </p>
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <button
                              type="button"
                              onClick={() => handleDeleteSite(site.id)}
                              disabled={deleting}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                            >
                              {deleting ? 'Deleting...' : 'Yes, delete site'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(null)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 