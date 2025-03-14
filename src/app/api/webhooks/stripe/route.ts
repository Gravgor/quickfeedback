import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { saveSubscription } from '@/services/stripeService';
import { getSupabaseAdmin } from '@/utils/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer and subscription details
        if (session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const planId = session.metadata?.planId;
          
          if (!planId) {
            console.error('No plan ID found in session metadata');
            break;
          }
          
          // Find the user ID from the customer metadata
          const customer = await stripe.customers.retrieve(session.customer as string);
          const userId = customer.metadata?.userId;
          
          if (!userId) {
            console.error('No user ID found in customer metadata');
            break;
          }
          
          // Save the subscription to our database
          await saveSubscription({
            userId,
            planId,
            customerId: subscription.customer as string,
            subscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            canceledAt: subscription.canceled_at || undefined,
          });
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the user ID from the customer metadata
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata?.userId;
        
        if (!userId) {
          console.error('No user ID found in customer metadata');
          break;
        }
        
        // Get the plan ID from the price
        const priceId = subscription.items.data[0]?.price.id;
        if (!priceId) {
          console.error('No price ID found in subscription');
          break;
        }
        
        // Find the plan ID that corresponds to this price ID
        const supabase = getSupabaseAdmin();
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('plan_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();
        
        const planId = existingSubscription?.plan_id;
        
        if (!planId) {
          console.error('No plan ID found for subscription');
          break;
        }
        
        // Update the subscription in our database
        await saveSubscription({
          userId,
          planId,
          customerId,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at || undefined,
        });
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the user ID from the customer metadata
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata?.userId;
        
        if (!userId) {
          console.error('No user ID found in customer metadata');
          break;
        }
        
        // Get the current subscription data
        const supabase = getSupabaseAdmin();
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('plan_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();
        
        const planId = existingSubscription?.plan_id;
        
        if (!planId) {
          console.error('No plan ID found for subscription');
          break;
        }
        
        // Update the subscription in our database as canceled
        await saveSubscription({
          userId,
          planId,
          customerId,
          subscriptionId: subscription.id,
          status: 'canceled',
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at || Date.now() / 1000,
        });
        
        // Update user to free plan after subscription ends
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            subscription_status: 'inactive',
          })
          .eq('id', userId);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 500 }
    );
  }
} 