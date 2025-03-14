'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SignUpConfirmation() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">QuickFeedback</span>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 text-center">
            <div className="bg-blue-50 mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a confirmation link to{' '}
              <span className="font-medium text-gray-900">{email || 'your email'}</span>.
              <br />
              Please click the link to verify your account.
            </p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to login
              </Link>
              <p className="text-sm text-gray-500">
                Didn't receive an email?{' '}
                <button className="text-blue-600 hover:text-blue-500 font-medium">
                  Click here to resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 