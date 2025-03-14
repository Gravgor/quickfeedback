import React from 'react';
import Link from 'next/link';

interface BackLinkProps {
  href: string;
}

export default function BackLink({ href }: BackLinkProps) {
  return (
    <Link 
      href={href} 
      className="text-gray-500 hover:text-gray-700"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </Link>
  );
} 