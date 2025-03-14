'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);
  
  const demoCode = '<script src="https://quickfeedback.vercel.app/widget.js" data-site-id="your-site-id" data-position="bottom-right" data-color="#2563eb" data-company="Your Company"></script>';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(demoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">QuickFeedback</span>
          </div>
          <nav className="hidden sm:flex gap-8">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            <Link href="/demo" className="hover:text-blue-600 transition">Demo</Link>
          </nav>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="py-2 px-4 rounded-lg hover:bg-gray-100 transition"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Instant Website Feedback Widget
            </h1>
            <p className="text-xl text-gray-600">
              Get actionable user insights in minutes – no heavy analytics tools required!
            </p>
            
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
              <span className="font-medium">✨ Currently 100% Free!</span> We're testing this idea and offering all features free of charge during our beta period.
            </div>
            
            <div className="flex gap-4 mt-6">
              <Link 
                href="/signup" 
                className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Start for Free
              </Link>
              <Link 
                href="/demo" 
                className="py-3 px-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                See Demo
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-blue-600 font-medium">How was your experience?</div>
                  <div className="text-sm text-gray-400">Powered by QuickFeedback</div>
                </div>
                <div className="flex gap-2 mb-4 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button 
                      key={rating} 
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full border border-gray-200 rounded-lg p-3 mb-3 text-sm" 
                  placeholder="Tell us what you think..." 
                  rows={3}
                ></textarea>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">Core Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Embed Widget</h3>
              <p className="text-gray-600">Simple JavaScript snippet that site owners can copy and paste in seconds.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Customizable Form</h3>
              <p className="text-gray-600">Allow users to rate their experience and leave detailed feedback.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">View aggregated feedback and learn what your users truly think.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Email Notifications</h3>
              <p className="text-gray-600">Get alerted instantly when users submit new feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-6">Simple Pricing</h2>
          <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Start for free and upgrade as you grow. No credit card required to get started.</p>
          
          <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 max-w-2xl mx-auto mb-16">
            <p className="font-medium">🎉 All plans are currently free during our beta period!</p>
            <p className="text-sm mt-1">We're testing the idea and gathering feedback. Sign up now to lock in benefits before paid plans are introduced.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>1 website</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Up to 100 feedback submissions</span>
          </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Basic analytics</span>
          </li>
              </ul>
              <Link 
                href="/signup" 
                className="block w-full py-2 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Start for Free
              </Link>
            </div>

            <div className="border-2 border-blue-600 rounded-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <p className="text-gray-600">For growing businesses</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>5 websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited feedback submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Custom branding</span>
                </li>
              </ul>
              <Link 
                href="/signup?plan=premium" 
                className="block w-full py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Get Premium
              </Link>
            </div>

            <div className="border border-gray-200 rounded-xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited feedback submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>API access & integration</span>
                </li>
              </ul>
              <Link 
                href="/contact" 
                className="block w-full py-2 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-6">See It in Action</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Adding QuickFeedback to your website is as simple as copying and pasting a single line of code.
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <div className="bg-gray-800 text-white p-3 rounded-t-lg font-mono text-sm overflow-x-auto">
              {demoCode}
            </div>
            <div className="border border-gray-200 rounded-b-lg p-4">
              <p className="text-gray-600 text-sm mb-4">Add this code to the &lt;body&gt; of your website to install QuickFeedback.</p>
              <button 
                onClick={copyToClipboard}
                className="py-2 px-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get instant feedback?</h2>
          <p className="mb-8 text-blue-100">
            Start collecting actionable insights from your website visitors today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="py-3 px-8 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Sign Up Free
            </Link>
            <Link 
              href="/contact" 
              className="py-3 px-8 border border-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">QuickFeedback</div>
              <p className="mb-4">Get actionable user insights in minutes.</p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            © {new Date().getFullYear()} QuickFeedback. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
