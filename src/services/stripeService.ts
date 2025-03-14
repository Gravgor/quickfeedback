import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/utils/supabase';
import { PLANS } from '@/config/pricing';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface CustomerData {
  userId: string;
  email: string;
  name?: string;
}

export interface SubscriptionData {
  userId: string;
  planId: string;
  customerId: string; // Stripe customer ID
  subscriptionId: string; // Stripe subscription ID
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  canceledAt?: number;
}

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateCustomer(data: CustomerData): Promise<string> {
  const supabase = getSupabaseAdmin();
  
  // Check if user already has a customer ID in our database
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_id')
    .eq('id', data.userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching profile: ${error.message}`);
  }
  
  // If the user already has a Stripe customer ID, return it
  if (profile?.subscription_id) {
    try {
      // Verify the customer exists in Stripe
      const customer = await stripe.customers.retrieve(profile.subscription_id);
      if (!customer.deleted) {
        return profile.subscription_id;
      }
    } catch (err) {
      console.error('Error retrieving Stripe customer:', err);
      // If the customer doesn't exist in Stripe, create a new one
    }
  }
  
  // Create a new customer in Stripe
  const customer = await stripe.customers.create({
    email: data.email,
    name: data.name || undefined,
    metadata: {
      userId: data.userId,
    },
  });
  
  // Update our database with the new customer ID
  await supabase
    .from('profiles')
    .update({ 
      subscription_id: customer.id,
    })
    .eq('id', data.userId);
  
  return customer.id;
}

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(
  customerId: string,
  planId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const plan = PLANS[planId];
  
  if (!plan || !plan.stripePriceId) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      planId,
    },
  });
  
  return session.url || '';
}

/**
 * Create a portal session for managing subscriptions
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
  return session.url;
}

/**
 * Save subscription data to our database
 */
export async function saveSubscription(data: SubscriptionData): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  // Check if subscription already exists
  const { data: existingSubscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', data.subscriptionId)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Error fetching subscription: ${fetchError.message}`);
  }
  
  const subscriptionData = {
    user_id: data.userId,
    stripe_subscription_id: data.subscriptionId,
    stripe_customer_id: data.customerId,
    plan_id: data.planId,
    status: data.status,
    current_period_start: new Date(data.currentPeriodStart * 1000).toISOString(),
    current_period_end: new Date(data.currentPeriodEnd * 1000).toISOString(),
    cancel_at_period_end: data.cancelAtPeriodEnd,
    canceled_at: data.canceledAt ? new Date(data.canceledAt * 1000).toISOString() : null,
  };
  
  if (existingSubscription) {
    // Update existing subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('stripe_subscription_id', data.subscriptionId);
    
    if (updateError) {
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }
  } else {
    // Create new subscription
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert(subscriptionData);
    
    if (insertError) {
      throw new Error(`Error inserting subscription: ${insertError.message}`);
    }
  }
  
  // Update the user's profile with subscription info
  await supabase
    .from('profiles')
    .update({
      plan: data.planId,
      subscription_status: data.status,
      current_period_end: new Date(data.currentPeriodEnd * 1000).toISOString(),
    })
    .eq('id', data.userId);
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  // Cancel the subscription at the end of the billing period
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  
  const supabase = getSupabaseAdmin();
  
  // Update our database
  await supabase
    .from('subscriptions')
    .update({
      cancel_at_period_end: true,
    })
    .eq('stripe_subscription_id', subscriptionId);
}

/**
 * Resume a subscription that was set to cancel at period end
 */
export async function resumeSubscription(subscriptionId: string): Promise<void> {
  // Resume the subscription
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  
  const supabase = getSupabaseAdmin();
  
  // Update our database
  await supabase
    .from('subscriptions')
    .update({
      cancel_at_period_end: false,
    })
    .eq('stripe_subscription_id', subscriptionId);
}

/**
 * Get a user's subscription
 */
export async function getUserSubscription(userId: string): Promise<any> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching subscription: ${error.message}`);
  }
  
  return data;
}

/**
 * Check if a user can access a feature based on their plan
 */
export async function canUserAccessFeature(userId: string, featureName: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();
  
  if (error) {
    throw new Error(`Error fetching profile: ${error.message}`);
  }
  
  if (!data) {
    return false;
  }
  
  const plan = PLANS[data.plan];
  
  if (!plan) {
    return false;
  }
  
  // Find the feature in the plan
  const feature = plan.features.find(f => f.name === featureName);
  
  return feature ? feature.included : false;
}

/**
 * Check if a user is within their plan limits
 */
export async function isUserWithinPlanLimits(
  userId: string,
  { siteCount, feedbackCount }: { siteCount: number; feedbackCount: number }
): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();
  
  if (error) {
    throw new Error(`Error fetching profile: ${error.message}`);
  }
  
  if (!data) {
    return { allowed: false, reason: 'User profile not found' };
  }
  
  const plan = PLANS[data.plan];
  
  if (!plan) {
    return { allowed: false, reason: 'Invalid plan' };
  }
  
  // Check site limit
  if (plan.siteLimit !== -1 && siteCount > plan.siteLimit) {
    return {
      allowed: false,
      reason: `Your ${plan.name} plan allows up to ${plan.siteLimit} sites. Please upgrade to add more sites.`
    };
  }
  
  // Check feedback limit
  if (plan.feedbackLimit !== -1 && feedbackCount > plan.feedbackLimit) {
    return {
      allowed: false,
      reason: `Your ${plan.name} plan allows up to ${plan.feedbackLimit} feedback entries per month. Please upgrade for more.`
    };
  }
  
  return { allowed: true };
} 