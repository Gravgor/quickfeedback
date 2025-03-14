"use client"

import { useAuth } from "@/context/AuthContext";
import { getSiteById } from "@/services/siteService";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { SiteOnboarding } from '@/components/SiteOnboarding';

import { useState, useEffect } from "react";

export default function SiteOnboardingDetailPage({ params }: { params: { siteId: string } }) {
    const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { siteId } = params;

  useEffect(() => {
    async function loadSite() {
      if (!user) return;
      
      try {
        setLoading(true);
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
      } catch (err: any) {
        console.error('Error loading site:', err);
        setError(err.message || 'An error occurred while loading the site');
      } finally {
        setLoading(false);
      }
    }
    
    loadSite();
  }, [siteId, user]);

  const handleClose = () => {
    router.push('/dashboard/sites');
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard/sites" 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Get Started with {site.name}</h1>
          </div>
          <Link
            href={`/dashboard/sites/${site.id}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip tutorial
          </Link>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Follow these steps to set up feedback collection for your website
        </p>
      </div>

      <SiteOnboarding site={site} />

      <div className="mt-8 flex justify-end">
        <Link
          href="/dashboard/sites"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Finish Setup
        </Link>
      </div>
    </div>
  );
}
