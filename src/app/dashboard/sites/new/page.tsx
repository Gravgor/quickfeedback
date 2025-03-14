'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createSite } from '@/services/siteService';
import Link from 'next/link';

export default function NewSite() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a site');
      return;
    }
    
    // Basic validation
    if (!name.trim()) {
      setError('Site name is required');
      return;
    }
    
    if (!url.trim()) {
      setError('Site URL is required');
      return;
    }
    
    // Simple URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      setError('Please enter a valid URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format URL if needed
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Create the site
      const newSite = await createSite({
        name,
        url: formattedUrl,
        user_id: user.id
      });
      
      // Redirect to onboarding page for the new site
      if (newSite && newSite.id) {
        router.push(`/dashboard/sites/onboarding/${newSite.id}`);
      } else {
        router.push('/dashboard/sites');
      }
      router.refresh();
    } catch (err: any) {
      console.error('Error creating site:', err);
      setError(err.message || 'Failed to create site. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Site</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Add a new website to collect feedback from your visitors
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="My Awesome Website"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                A friendly name to identify this site in your dashboard
              </p>
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Site URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                The URL of your website (e.g., https://example.com)
              </p>
            </div>

            <div className="flex justify-end">
              <Link
                href="/dashboard/sites"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Site'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 