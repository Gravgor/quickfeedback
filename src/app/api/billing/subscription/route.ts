import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription } from '@/services/stripeService';
import { getSession } from '@/utils/supabase-auth-helpers';
import { PLANS } from '@/config/pricing';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the user's subscription
    const subscription = await getUserSubscription(session.user.id);
    
    // Get plan details
    let plan = PLANS.free;
    if (subscription && subscription.plan_id) {
      plan = PLANS[subscription.plan_id] || PLANS.free;
    }
    
    return NextResponse.json({
      subscription,
      plan,
      // Add a flag to indicate if the subscription is active
      isActive: subscription?.status === 'active' || subscription?.status === 'trialing',
      // Add a flag to indicate if the subscription is set to cancel at period end
      cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 