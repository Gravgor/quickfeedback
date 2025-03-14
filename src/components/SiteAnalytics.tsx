import React from 'react';

interface AnalyticsData {
  total: number;
  averageRating: number;
  recentCount: number;
  ratingsDistribution: Record<string, number>;
  countriesDistribution: Record<string, number>;
  devicesDistribution: Record<string, number>;
  browsersDistribution: Record<string, number>;
  averageTimeOnPage: number;
}

interface SiteAnalyticsProps {
  analytics: AnalyticsData;
  loading?: boolean;
}

export function SiteAnalytics({ analytics, loading = false }: SiteAnalyticsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  // Helper function to sort distribution objects
  const sortDistribution = (distribution: Record<string, number>): [string, number][] => {
    return Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  };
  
  // Sort and limit distributions for display
  const sortedRatings = sortDistribution(analytics.ratingsDistribution);
  const sortedCountries = sortDistribution(analytics.countriesDistribution).slice(0, 5);
  const sortedDevices = sortDistribution(analytics.devicesDistribution);
  const sortedBrowsers = sortDistribution(analytics.browsersDistribution).slice(0, 5);
  
  // Format minutes and seconds for average time on page
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return 'N/A';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    if (mins === 0) {
      return `${secs}s`;
    }
    
    return `${mins}m ${secs}s`;
  };

  // Calculate max value for bar charts
  const maxRatingValue = Math.max(...Object.values(analytics.ratingsDistribution), 1);
  const maxCountryValue = Math.max(...Object.values(analytics.countriesDistribution), 1);
  const maxBrowserValue = Math.max(...Object.values(analytics.browsersDistribution), 1);
  
  return (
    <div className="space-y-8">
      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total feedback card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Feedback</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{analytics.total}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Average rating card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900 flex items-center">
                    {analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : 'N/A'}
                    {analytics.averageRating > 0 && (
                      <svg className="ml-1 h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Recent count card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Last 30 Days</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {analytics.recentCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Average time on page */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Time on Page</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {formatTime(analytics.averageTimeOnPage)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ratings distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="w-8 text-right mr-2 text-sm font-medium text-gray-600">{rating}</div>
                <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-400 h-4 rounded-full"
                    style={{ 
                      width: `${analytics.ratingsDistribution[rating] 
                        ? (analytics.ratingsDistribution[rating] / maxRatingValue) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="w-12 text-right ml-2 text-sm font-medium text-gray-600">
                  {analytics.ratingsDistribution[rating] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Countries</h3>
          {sortedCountries.length === 0 ? (
            <p className="text-gray-500 text-sm">No country data available yet</p>
          ) : (
            <div className="space-y-3">
              {sortedCountries.map(([country, count]) => (
                <div key={country} className="flex items-center">
                  <div className="w-24 truncate mr-2 text-sm font-medium text-gray-600">{country}</div>
                  <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-400 h-4 rounded-full"
                      style={{ width: `${(count / maxCountryValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right ml-2 text-sm font-medium text-gray-600">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Devices</h3>
          {sortedDevices.length === 0 ? (
            <p className="text-gray-500 text-sm">No device data available yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortedDevices.map(([device, count]) => (
                <div key={device} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{device}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.round((count / analytics.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {Math.round((count / analytics.total) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browser distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Browsers</h3>
          {sortedBrowsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No browser data available yet</p>
          ) : (
            <div className="space-y-3">
              {sortedBrowsers.map(([browser, count]) => (
                <div key={browser} className="flex items-center">
                  <div className="w-24 truncate mr-2 text-sm font-medium text-gray-600">{browser}</div>
                  <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-400 h-4 rounded-full"
                      style={{ width: `${(count / maxBrowserValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right ml-2 text-sm font-medium text-gray-600">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 