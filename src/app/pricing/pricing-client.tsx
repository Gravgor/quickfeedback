'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PricingCard from '@/components/PricingCard';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { PricingPlan } from '@/config/pricing';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PricingClientProps {
  plans: PricingPlan[];
}

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  cancel_at_period_end: boolean;
}

export default function PricingClient({ plans }: PricingClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createCheckoutLoading, setCreateCheckoutLoading] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/billing/subscription');
        const data = await response.json();
        if (data.subscription) {
          setCurrentSubscription(data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };
    
    fetchSubscription();
  }, [user]);
  
  const handleCheckout = async (planId: string) => {
    if (!user) {
      // Redirect to sign in if not logged in
      router.push(`/signin?return_to=${encodeURIComponent('/pricing')}`);
      return;
    }
    
    setCreateCheckoutLoading(planId);
    
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/dashboard?checkout_success=true`,
          cancelUrl: `${window.location.origin}/pricing?checkout_canceled=true`,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setCreateCheckoutLoading(null);
    }
  };
  
  const handleManageSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getButtonText = (plan: PricingPlan) => {
    if (!user) {
      return 'Sign up';
    }
    
    if (currentSubscription && currentSubscription.plan_id === plan.id) {
      return currentSubscription.cancel_at_period_end ? 'Reactivate' : 'Current plan';
    }
    
    if (plan.price === 0) {
      return 'Get started';
    }
    
    return 'Subscribe';
  };
  
  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId && !currentSubscription?.cancel_at_period_end;
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            title={plan.name}
            description={plan.description}
            price={plan.price}
            features={plan.features.map(f => f.name)}
            popular={plan.id === 'pro'}
            currentPlan={isCurrentPlan(plan.id)}
            buttonText={
              createCheckoutLoading === plan.id 
                ? 'Loading...'
                : getButtonText(plan)
            }
            disabled={
              createCheckoutLoading !== null || 
              isCurrentPlan(plan.id) ||
              (plan.id === 'free' && currentSubscription?.status === 'active')
            }
            onClick={() => {
              if (isCurrentPlan(plan.id)) return;
              handleCheckout(plan.id);
            }}
          />
        ))}
      </div>
      
      {currentSubscription && (
        <div className="mt-12 text-center">
          <h3 className="text-xl font-medium mb-4">Manage your subscription</h3>
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Manage Subscription'
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            You can update your payment method, billing information, or cancel your subscription.
          </p>
        </div>
      )}
    </div>
  );
} 