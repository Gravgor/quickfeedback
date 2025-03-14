import { getSupabaseAdmin } from '@/utils/supabase';
import { FeedbackItem } from './feedbackService';

/**
 * Send email notification for new feedback
 */
export async function sendFeedbackNotification(userId: string, feedback: any): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    // Get user profile to check if notifications are enabled
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, email_notifications')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }
    
    // If notifications are disabled or no email, skip
    if (!profile || !profile.email || profile.email_notifications === false) {
      return;
    }
    
    // Get site information
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('name, url')
      .eq('id', feedback.site_id)
      .single();
    
    if (siteError) {
      throw new Error(`Error fetching site: ${siteError.message}`);
    }
    
    // In a production app, you would integrate with an email service like SendGrid, Mailchimp, etc.
    // For this sample, we'll just log the notification
    console.log(`
      [EMAIL NOTIFICATION]
      To: ${profile.email}
      Subject: New feedback received for ${site.name}
      Body:
      
      You've received new feedback for your site ${site.name}!
      
      Rating: ${feedback.rating}/5
      ${feedback.comment ? `Comment: ${feedback.comment}` : 'No comment provided'}
      
      Page: ${feedback.url}
      ${feedback.country ? `Location: ${feedback.city ? `${feedback.city}, ` : ''}${feedback.country}` : ''}
      Device: ${feedback.device}
      Browser: ${feedback.browser}
      
      Login to your dashboard to see all feedback: https://quickfeedback.com/dashboard/sites/${feedback.site_id}
    `);
    
    // In a real implementation, you would use an email service like this:
    /*
    await sendEmail({
      to: profile.email,
      subject: `New feedback received for ${site.name}`,
      html: `<p>You've received new feedback for your site ${site.name}!</p>
             <p><strong>Rating:</strong> ${feedback.rating}/5</p>
             ${feedback.comment ? `<p><strong>Comment:</strong> ${feedback.comment}</p>` : ''}
             <p><strong>Page:</strong> ${feedback.url}</p>
             ${feedback.country ? `<p><strong>Location:</strong> ${feedback.city ? `${feedback.city}, ` : ''}${feedback.country}</p>` : ''}
             <p><strong>Device:</strong> ${feedback.device}</p>
             <p><strong>Browser:</strong> ${feedback.browser}</p>
             <p><a href="https://quickfeedback.com/dashboard/sites/${feedback.site_id}">View in Dashboard</a></p>`
    });
    */
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
} 