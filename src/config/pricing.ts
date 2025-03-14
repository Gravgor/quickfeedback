export type PlanFeature = {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  stripePriceId: string;
  features: PlanFeature[];
  siteLimit: number;
  feedbackLimit: number;
  storageMonths: number;
  analyticsAccess: boolean;
  customBranding: boolean;
  exportFeatures: boolean;
  prioritySupport: boolean;
}

export const PLANS: { [key: string]: PricingPlan } = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic feedback collection',
    price: 0,
    stripePriceId: '', // Free plan has no Stripe price ID
    siteLimit: 1,
    feedbackLimit: 100,
    storageMonths: 1,
    analyticsAccess: true,
    customBranding: false,
    exportFeatures: false,
    prioritySupport: false,
    features: [
      { name: 'Feedback Collection', description: 'Collect user feedback', included: true },
      { name: 'Basic Analytics', description: 'View basic feedback statistics', included: true },
      { name: 'Sites', description: 'Number of sites you can add', included: true, limit: 1 },
      { name: 'Feedback Storage', description: 'Store feedback for 1 month', included: true, limit: 1 },
      { name: 'Feedback Limit', description: 'Monthly feedback entries', included: true, limit: 100 },
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and small businesses',
    price: 19,
    stripePriceId: 'price_1OOtEsXXXXXXXXXXXXXXXXXX', // Replace with actual Stripe price ID
    siteLimit: 5,
    feedbackLimit: 5000,
    storageMonths: 6,
    analyticsAccess: true,
    customBranding: true,
    exportFeatures: true,
    prioritySupport: false,
    features: [
      { name: 'Feedback Collection', description: 'Collect user feedback', included: true },
      { name: 'Advanced Analytics', description: 'Detailed analytics with exports', included: true },
      { name: 'Sites', description: 'Number of sites you can add', included: true, limit: 5 },
      { name: 'Feedback Storage', description: 'Store feedback for 6 months', included: true, limit: 6 },
      { name: 'Feedback Limit', description: 'Monthly feedback entries', included: true, limit: 5000 },
      { name: 'Custom Branding', description: 'Replace QuickFeedback branding', included: true },
      { name: 'Data Export', description: 'Export feedback as CSV', included: true },
    ]
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'For growing businesses with multiple sites',
    price: 49,
    stripePriceId: 'price_1OOtFrXXXXXXXXXXXXXXXXXX', // Replace with actual Stripe price ID
    siteLimit: 20,
    feedbackLimit: 20000,
    storageMonths: 12,
    analyticsAccess: true,
    customBranding: true,
    exportFeatures: true,
    prioritySupport: true,
    features: [
      { name: 'Feedback Collection', description: 'Collect user feedback', included: true },
      { name: 'Premium Analytics', description: 'Full analytics suite with exports', included: true },
      { name: 'Sites', description: 'Number of sites you can add', included: true, limit: 20 },
      { name: 'Feedback Storage', description: 'Store feedback for 12 months', included: true, limit: 12 },
      { name: 'Feedback Limit', description: 'Monthly feedback entries', included: true, limit: 20000 },
      { name: 'Custom Branding', description: 'Replace QuickFeedback branding', included: true },
      { name: 'Data Export', description: 'Export feedback as CSV/JSON', included: true },
      { name: 'Priority Support', description: '24/7 priority support', included: true },
      { name: 'Team Access', description: 'Multiple team members', included: true },
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 149,
    stripePriceId: 'price_1OOtGqXXXXXXXXXXXXXXXXXX', // Replace with actual Stripe price ID
    siteLimit: -1, // Unlimited
    feedbackLimit: -1, // Unlimited
    storageMonths: 24,
    analyticsAccess: true,
    customBranding: true,
    exportFeatures: true,
    prioritySupport: true,
    features: [
      { name: 'Feedback Collection', description: 'Collect user feedback', included: true },
      { name: 'Enterprise Analytics', description: 'Full analytics with API access', included: true },
      { name: 'Sites', description: 'Unlimited sites', included: true },
      { name: 'Feedback Storage', description: 'Store feedback for 24 months', included: true, limit: 24 },
      { name: 'Feedback Limit', description: 'Unlimited feedback entries', included: true },
      { name: 'Custom Branding', description: 'Replace QuickFeedback branding', included: true },
      { name: 'Data Export', description: 'Export in any format', included: true },
      { name: 'Priority Support', description: '24/7 dedicated support', included: true },
      { name: 'Team Access', description: 'Unlimited team members', included: true },
      { name: 'API Access', description: 'Full API access', included: true },
      { name: 'Custom Integrations', description: 'Custom integrations', included: true },
    ]
  }
};

export const getPlanById = (planId: string): PricingPlan => {
  return PLANS[planId] || PLANS.free;
}

export const isFeatureAvailable = (plan: PricingPlan, featureName: string): boolean => {
  const feature = plan.features.find(f => f.name === featureName);
  return feature ? feature.included : false;
}

export function getPlanLimits(planId: string): {
  siteLimit: number;
  feedbackLimit: number;
  storageMonths: number;
} {
  const plan = getPlanById(planId);
  return {
    siteLimit: plan.siteLimit,
    feedbackLimit: plan.feedbackLimit,
    storageMonths: plan.storageMonths
  };
}

export const checkFeatureAccess = (userPlan: string, featureName: keyof PricingPlan): boolean => {
  const plan = getPlanById(userPlan);
  return !!plan[featureName];
}

export function isWithinPlanLimits(
  planId: string,
  { sites, feedbackCount }: { sites: number; feedbackCount: number }
): { allowed: boolean; reason?: string } {
  const plan = getPlanById(planId);
  
  if (plan.siteLimit !== -1 && sites > plan.siteLimit) {
    return {
      allowed: false,
      reason: `Your plan allows up to ${plan.siteLimit} sites. Please upgrade to add more sites.`
    };
  }
  
  if (plan.feedbackLimit !== -1 && feedbackCount > plan.feedbackLimit) {
    return {
      allowed: false,
      reason: `Your plan allows up to ${plan.feedbackLimit} feedback entries per month. Please upgrade for more.`
    };
  }
  
  return { allowed: true };
} 