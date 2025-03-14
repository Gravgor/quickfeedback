import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCustomer, createCheckoutSession } from '@/services/stripeService';
import { getSession } from '@/utils/supabase-auth-helpers';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { planId, successUrl, cancelUrl } = await req.json();
    
    if (!planId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get or create Stripe customer for the user
    const customerId = await getOrCreateCustomer({
      userId: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name,
    });
    
    // Create a checkout session for this customer and plan
    const checkoutUrl = await createCheckoutSession(
      customerId,
      planId,
      successUrl,
      cancelUrl
    );
    
    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 