import { NextRequest, NextResponse } from 'next/server';
import { getFeedbackBySiteId, getSiteAnalytics } from '@/services/feedbackService';
import { getSiteById } from '@/services/siteService';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const siteId = params.siteId;
    const includeAnalytics = request.nextUrl.searchParams.get('analytics') === 'true';
    
    // Verify the site exists
    const site = await getSiteById(siteId);
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }
    
    // Get feedback for the site
    const feedback = await getFeedbackBySiteId(siteId);
    
    // If analytics are requested, include them in the response
    if (includeAnalytics) {
      const analytics = await getSiteAnalytics(siteId);
      return NextResponse.json({ feedback, analytics });
    }
    
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching site feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site feedback' },
      { status: 500 }
    );
  }
} 