import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo feedback to avoid database dependency
// This is just for demo purposes and will be cleared on server restart
let feedbackStore: any[] = [];

export async function GET(req: NextRequest) {
  // Return the stored feedback entries
  const totalFeedback = feedbackStore.length;
  const averageRating = feedbackStore.length
    ? feedbackStore.reduce((sum, item) => sum + (item.rating || 0), 0) / feedbackStore.length
    : 0;
  
  // Calculate ratings distribution
  const ratingsDistribution = feedbackStore.reduce((acc, item) => {
    acc[item.rating] = (acc[item.rating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Country distribution
  const countriesDistribution = feedbackStore.reduce((acc, item) => {
    if (item.country) {
      acc[item.country] = (acc[item.country] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Device distribution
  const devicesDistribution = feedbackStore.reduce((acc, item) => {
    if (item.device) {
      acc[item.device] = (acc[item.device] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return NextResponse.json({
    feedback: feedbackStore,
    analytics: {
      total: totalFeedback,
      averageRating,
      ratingsDistribution,
      countriesDistribution,
      devicesDistribution
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
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
    if (rating === undefined) {
      return NextResponse.json(
        { error: 'Rating is required' },
        { status: 400 }
      );
    }

    // Create a new feedback entry
    const newFeedback = {
      id: Date.now().toString(),
      rating,
      comment: comment || null,
      url: url || null,
      browser: browser || null,
      device: device || null,
      country: country || null,
      city: city || null,
      os: os || null,
      language: language || null,
      referrer: referrer || null,
      time_on_page: time_on_page || null,
      screen_size: screen_size || null,
      user_agent: user_agent || null,
      created_at: new Date().toISOString()
    };

    // Add the feedback to the store
    feedbackStore.unshift(newFeedback);
    
    // Keep only the last 100 entries to avoid memory issues
    if (feedbackStore.length > 100) {
      feedbackStore = feedbackStore.slice(0, 100);
    }

    return NextResponse.json(newFeedback);
  } catch (error: any) {
    console.error('Error processing demo feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process feedback' },
      { status: 500 }
    );
  }
} 