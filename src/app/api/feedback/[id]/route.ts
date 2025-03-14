import { NextRequest, NextResponse } from 'next/server';
import { getFeedbackById, deleteFeedback } from '@/services/feedbackService';
import { getSiteById } from '@/services/siteService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch the feedback
    const feedback = await getFeedbackById(id);
    
    // If feedback doesn't exist, return a 404
    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verify the feedback exists
    const feedback = await getFeedbackById(id);
    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }
    
    // Verify the site exists (optional additional check)
    const site = await getSiteById(feedback.site_id);
    if (!site) {
      return NextResponse.json(
        { error: 'Associated site not found' },
        { status: 404 }
      );
    }
    
    // Delete the feedback
    await deleteFeedback(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
} 