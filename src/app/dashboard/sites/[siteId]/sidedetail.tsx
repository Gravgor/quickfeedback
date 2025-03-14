"use client"

import RecentFeedback from "@/components/feedback/RecentFeedback";
import SiteActions from "@/components/site/SiteActions";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { SiteOnboarding } from "@/components/SiteOnboarding";
import BackLink from "@/components/ui/BackLink";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { getFeedbackBySiteId, getSiteAnalytics } from "@/services/feedbackService";
import { getSiteById } from "@/services/siteService";
import { Link } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SideDetail({ params }: { params: { siteId: string } }) {
    const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [site, setSite] = useState<any>(null);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get URL parameters for showing integration guide
  const showIntegration = searchParams.get('showIntegration') === 'true';
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    async function loadData() {
      try {
        setLoading(true);
        setAnalyticsLoading(true);
        
        // Load site data
        const siteData = await getSiteById(params.siteId);
        if (!siteData) {
          setError('Site not found');
          setLoading(false);
          return;
        }
        
        // Verify the site belongs to the user
        if (user && siteData.user_id !== user.id) {
          setError('You do not have permission to access this site');
          setLoading(false);
          return;
        }
        
        setSite(siteData);
        
        // Load feedback data
        const feedbackData = await getFeedbackBySiteId(params.siteId);
        setFeedback(feedbackData);
        
        // Load analytics data
        const analyticsData = await getSiteAnalytics(params.siteId);
        setAnalytics(analyticsData);
        setAnalyticsLoading(false);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'An error occurred while loading data');
        setLoading(false);
        setAnalyticsLoading(false);
      }
    }
    
    loadData();
  }, [params.siteId, user, router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} backLink="/dashboard/sites" />;
  }
  
  if (!site) {
    return null;
  }
  
  // Create a compatible Site object for components that need it
  const siteForComponents = {
    ...site,
    id: site.id || ''  // Ensure id is a string
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BackLink href="/dashboard/sites" />
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
      <SiteActions 
        siteId={params.siteId} 
        showIntegration={showIntegration} 
      />

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
                <Link
                  href={`/dashboard/sites/${params.siteId}?showIntegration=true`}
                  className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                >
                  Show integration guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration guide */}
      {showIntegration && (
        <div className="mb-8">
          <SiteOnboarding 
            site={siteForComponents} 
            onClose={() => router.push(`/dashboard/sites/${params.siteId}`)}
          />
        </div>
      )}

      {/* Recent feedback */}
      {feedback.length > 0 && (
        <RecentFeedback feedback={feedback} site={siteForComponents} siteId={params.siteId} />
      )}
    </div>
  );
}
