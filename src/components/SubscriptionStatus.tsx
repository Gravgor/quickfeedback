'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: { name: string; label: string; included: boolean }[];
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/billing/subscription');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription');
        }
        
        const data = await response.json();
        setSubscription(data.subscription);
        setPlan(data.plan);
      } catch (error: any) {
        setError(error.message || 'Failed to load subscription information');
        toast.error('Error', {
          description: 'Failed to load subscription information. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);
  
  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    
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
        description: error.message || 'Failed to open subscription management. Please try again.'
      });
    } finally {
      setIsPortalLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-muted-foreground">Failed to load subscription information</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getPlanStatusBadge = () => {
    if (!subscription) return null;
    
    if (subscription.cancel_at_period_end) {
      return <Badge variant="outline" className="ml-2">Cancelling</Badge>;
    }
    
    switch (subscription.status) {
      case 'active':
        return <Badge variant="default" className="ml-2">Active</Badge>;
      case 'trialing':
        return <Badge variant="secondary" className="ml-2">Trial</Badge>;
      case 'past_due':
        return <Badge variant="destructive" className="ml-2">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="ml-2">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Subscription
          {getPlanStatusBadge()}
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {plan ? (
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <div className="text-right">
                <span className="text-xl font-semibold">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </div>
            {subscription && subscription.cancel_at_period_end && (
              <div className="bg-muted p-3 rounded-md mt-2 mb-4">
                <p className="text-sm">
                  Your subscription will end on{' '}
                  <strong>{formatDate(new Date(subscription.current_period_end))}</strong>.
                  You can reactivate your subscription from the billing portal.
                </p>
              </div>
            )}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Features included:</h4>
              <ul className="space-y-1">
                {plan.features.filter(f => f.included).map((feature, index) => (
                  <li key={index} className="text-sm flex">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No active subscription</p>
            <Link href="/pricing" passHref>
              <Button variant="default" className="mt-2">
                View Plans
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
      {plan && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
          >
            {isPortalLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Manage Subscription'
            )}
          </Button>
          <Link href="/pricing" passHref>
            <Button variant="ghost">View Other Plans</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
} 