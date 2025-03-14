import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCustomer, createPortalSession } from '@/services/stripeService';
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
    
    const { returnUrl } = await req.json();
    
    if (!returnUrl) {
      return NextResponse.json(
        { error: 'Missing returnUrl' },
        { status: 400 }
      );
    }
    
    // Get or create Stripe customer for the user
    const customerId = await getOrCreateCustomer({
      userId: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name,
    });
    
    // Create a portal session for this customer
    const portalUrl = await createPortalSession(
      customerId,
      returnUrl
    );
    
    return NextResponse.json({ url: portalUrl });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 