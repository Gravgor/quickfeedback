import React, { useState } from 'react';
import { Site } from '@/utils/supabase';

interface SiteOnboardingProps {
  site: Site;
  onClose?: () => void;
}

export function SiteOnboarding({ site, onClose }: SiteOnboardingProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const widgetCode = `<script 
  src="${process.env.NEXT_PUBLIC_APP_URL || 'https://quickfeedback.vercel.app'}/widget.js" 
  data-site-id="${site.id}" 
  data-position="bottom-right" 
  data-color="#2563eb"
  data-company="Your Company">
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      number: 1,
      title: 'Add widget to your website',
      description: 'Copy and paste this code before the closing </body> tag of your website.',
      action: (
        <div className="mt-4">
          <div className="relative">
            <div className="bg-gray-800 rounded-md p-4 text-white font-mono text-sm overflow-x-auto">
              {widgetCode}
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Customize your widget',
      description: 'Adjust the appearance and behavior of your feedback widget.',
      action: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600">You can customize the widget using data attributes:</p>
          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li><span className="font-mono text-blue-600">data-position</span>: Position of the widget (bottom-right, bottom-left, top-right, top-left)</li>
            <li><span className="font-mono text-blue-600">data-color</span>: Primary color for the widget (hex code)</li>
            <li><span className="font-mono text-blue-600">data-company</span>: Your company name to display in the widget</li>
          </ul>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Test your integration',
      description: 'Verify that your feedback widget is working correctly.',
      action: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600">After adding the widget to your website:</p>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Visit your website</li>
            <li>Look for the feedback button in the specified position</li>
            <li>Click the button and submit a test feedback</li>
            <li>Return to your QuickFeedback dashboard to view the feedback</li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Get Started with {site.name}</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Follow these steps to start collecting feedback from your website visitors
        </p>
      </div>

      <div className="p-6">
        <div className="flex mb-8">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`flex-1 text-center relative ${
                step.number < activeStep ? 'text-blue-600' : step.number === activeStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className="flex items-center justify-center">
                <div className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full ${
                  step.number < activeStep
                    ? 'bg-blue-100 text-blue-600'
                    : step.number === activeStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number < activeStep ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
              </div>
              <div className="mt-2 text-xs font-medium">
                {step.title}
              </div>
              {step.number < steps.length && (
                <div className="hidden sm:block absolute top-4 w-full">
                  <div className="h-0.5 mx-auto w-full bg-gray-200">
                    <div 
                      className={`h-0.5 ${
                        step.number < activeStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} 
                      style={{width: step.number < activeStep ? '100%' : '0%'}}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900">
            {steps[activeStep - 1].title}
          </h4>
          <p className="mt-2 text-sm text-gray-600">
            {steps[activeStep - 1].description}
          </p>
          {steps[activeStep - 1].action}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
            disabled={activeStep === steps.length}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 