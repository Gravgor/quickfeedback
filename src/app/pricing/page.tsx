import React from 'react';
import { Metadata } from 'next';
import { PLANS } from '@/config/pricing';
import PricingClient from './pricing-client';

export const metadata: Metadata = {
  title: 'Pricing | QuickFeedback',
  description: 'Simple and affordable pricing for QuickFeedback. Choose the plan that works best for you.',
};

export default function PricingPage() {
  // Convert the PLANS object to an array
  const plansArray = Object.values(PLANS);
  
  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that works best for you. All plans include a 14-day free trial.
        </p>
      </div>
      
      <PricingClient plans={plansArray} />
    </div>
  );
} 