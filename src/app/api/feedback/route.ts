import { NextRequest, NextResponse } from 'next/server';
import { getSiteById } from '@/services/siteService';
import { submitFeedback } from '@/services/feedbackService';
import { sendFeedbackNotification } from '@/services/notificationService';
import { isUserWithinPlanLimits } from '@/services/stripeService';
import { getSupabaseAdmin } from '@/utils/supabase';

// This would normally connect to a database like Supabase
// For this MVP, we'll simply log the feedback and return a success response

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      siteId, 
      rating, 
      comment, 
      url, 
      browser, 
      device,
      country,
      city,
      os,
      language,
      referrer,
      time_on_page,
      screen_size,
      user_agent
    } = body;

    // Validate required fields
    if (!siteId || rating === undefined) {
      return NextResponse.json(
        { error: 'siteId and rating are required' },
        { status: 400 }
      );
    }

    // Verify site exists
    const site = await getSiteById(siteId);
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }
    
    // Get the current feedback count for this month for the site owner
    const supabase = getSupabaseAdmin();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count, error: countError } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', siteId)
      .gte('created_at', startOfMonth.toISOString());
    
    if (countError) {
      throw countError;
    }
    
    const feedbackCount = (count || 0) + 1; // +1 for the feedback we're about to create
    
    // Check if the user is within their plan's feedback limit
    const limitCheck = await isUserWithinPlanLimits(site.user_id, { 
      siteCount: 0,
      feedbackCount 
    });
    
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.reason || 'Plan limit reached' },
        { status: 403 }
      );
    }

    // Submit feedback
    const feedback = await submitFeedback({
      site_id: siteId,
      rating,
      comment,
      url,
      browser,
      device,
      country,
      city,
      os,
      language,
      referrer,
      time_on_page,
      screen_size,
      user_agent
    });

    // Send notification to site owner if email is enabled
    try {
      if (site.user_id) {
        await sendFeedbackNotification(site.user_id, feedback);
      }
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // We don't want to fail the request if notification fails
    }

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
} 