'use client';

import { useState } from 'react';
import Link from 'next/link';
import Widget from './Widget';

export default function WidgetDemo() {
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [color, setColor] = useState('#2563eb');
  const [companyName, setCompanyName] = useState('');

  const positions = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' },
  ];

  const colors = [
    { value: '#2563eb', label: 'Blue' },
    { value: '#16a34a', label: 'Green' },
    { value: '#dc2626', label: 'Red' },
    { value: '#7c3aed', label: 'Purple' },
    { value: '#ea580c', label: 'Orange' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">QuickFeedback</span>
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/" 
              className="py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Widget Demo</h1>
          <p className="text-gray-600 mb-12">
            Customize the widget below to see how it would look on your website. Try clicking the widget icon in the corner to see it in action!
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-xl font-semibold mb-6">Customization</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <div className="grid grid-cols-2 gap-3">
                    {positions.map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => setPosition(pos.value as any)}
                        className={`py-2 px-3 border rounded-lg text-sm transition ${
                          position === pos.value
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((col) => (
                      <button
                        key={col.value}
                        onClick={() => setColor(col.value)}
                        className={`w-10 h-10 rounded-full transition border-2 ${
                          color === col.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: col.value, borderColor: color === col.value ? col.value : 'transparent' }}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Company Name (optional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6">Generated Code</h2>
              <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                {`<script 
  src="https://quickfeedback.io/widget.js" 
  data-site-id="demo123"
  data-position="${position}"
  data-color="${color}"${companyName ? `\n  data-company="${companyName}"` : ''}
></script>`}
              </div>
              <button className="py-2 px-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
                Copy Code
              </button>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="font-medium mb-2">Installation</h3>
                <p className="text-sm text-gray-600">
                  Add this code to the <code className="bg-blue-100 px-1 py-0.5 rounded">&lt;head&gt;</code> section of your website to install the QuickFeedback widget.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <p className="text-gray-600 mb-4">
              This is a simulated preview of how the widget would appear on your website. Click the feedback button in the {position.replace('-', ' ')} corner to try it out.
            </p>
            
            <div className="relative h-96 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="w-full h-8 bg-gray-100 rounded mb-4"></div>
                <div className="w-3/4 h-4 bg-gray-100 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-100 rounded mb-8"></div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="h-24 bg-gray-100 rounded"></div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                </div>
                
                <div className="w-full h-32 bg-gray-100 rounded"></div>
              </div>

              {/* Widget will be rendered relative to this container */}
              <Widget 
                siteId="demo123" 
                position={position}
                primaryColor={color}
                companyName={companyName}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 