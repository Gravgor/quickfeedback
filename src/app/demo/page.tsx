import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">QuickFeedback</span>
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/" 
              className="py-2 px-4 rounded-lg hover:bg-gray-100 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">QuickFeedback Demo</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page demonstrates the QuickFeedback widget in action. Look for the feedback button in the bottom-right corner of the screen.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click the feedback button in the bottom-right corner</li>
              <li>Rate your experience from 1-5</li>
              <li>Optionally leave a comment</li>
              <li>Submit your feedback</li>
            </ol>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Widget Installation</h2>
            <p className="mb-4">Adding the widget to your own website is simple. Just add this code to your website:</p>
            <div className="bg-gray-800 text-white p-3 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              &lt;script src="https://quickfeedback.vercel.app/widget.js" data-site-id="your-site-id" data-position="bottom-right" data-color="#2563eb" data-company="Your Company"&gt;&lt;/script&gt;
            </div>
            <p className="text-sm text-gray-600">
              Replace "your-site-id" with the ID you get after signing up for QuickFeedback.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Customization Options</h2>
            <p className="mb-4">The widget can be customized using data attributes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><span className="font-mono text-blue-600">data-position</span>: Position of the widget (bottom-right, bottom-left, top-right, top-left)</li>
              <li><span className="font-mono text-blue-600">data-color</span>: Primary color for the widget (hex code)</li>
              <li><span className="font-mono text-blue-600">data-company</span>: Your company name to display in the widget</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            Ready to add this to your website? <Link href="/signup" className="text-blue-600 hover:underline">Sign up for free</Link>
          </p>
        </div>
      </footer>

      {/* Widget Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const script = document.createElement('script');
              script.src = '/widget.js';
              script.setAttribute('data-site-id', 'demo-site');
              script.setAttribute('data-position', 'bottom-right');
              script.setAttribute('data-color', '#2563eb');
              script.setAttribute('data-company', 'QuickFeedback Demo');
              script.setAttribute('data-api-url', window.location.origin);
              document.body.appendChild(script);
              
              // Override the fetch call for demo purposes
              const originalFetch = window.fetch;
              window.fetch = function(url, options) {
                if (url.includes('/api/feedback') && options?.method === 'POST') {
                  // Redirect to our demo endpoint
                  return originalFetch('/api/demo-feedback', options);
                }
                return originalFetch(url, options);
              };
            });
          `
        }}
      />
    </div>
  );
} 