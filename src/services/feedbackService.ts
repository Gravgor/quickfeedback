import { getSupabaseAdmin } from '@/utils/supabase';

export interface FeedbackItem {
  id?: string;
  site_id: string;
  rating: number;
  comment?: string;
  url?: string;
  browser?: string;
  device?: string;
  country?: string;
  city?: string;
  os?: string;
  language?: string;
  referrer?: string;
  time_on_page?: number;
  screen_size?: string;
  user_agent?: string;
  created_at?: string;
}

/**
 * Submit feedback to Supabase
 */
export async function submitFeedback(feedback: FeedbackItem): Promise<{ id: string }> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      site_id: feedback.site_id,
      rating: feedback.rating,
      comment: feedback.comment || null,
      url: feedback.url || null,
      browser: feedback.browser || null,
      device: feedback.device || null,
      country: feedback.country || null,
      city: feedback.city || null,
      os: feedback.os || null,
      language: feedback.language || null,
      referrer: feedback.referrer || null,
      time_on_page: feedback.time_on_page || null,
      screen_size: feedback.screen_size || null,
      user_agent: feedback.user_agent || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback');
  }
  
  return { id: data.id };
}

/**
 * Get all feedback for a specific site
 */
export async function getFeedbackBySiteId(siteId: string): Promise<FeedbackItem[]> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
  
  return data || [];
}

/**
 * Get feedback by ID
 */
export async function getFeedbackById(id: string): Promise<FeedbackItem | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No feedback found with this ID
    }
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
  
  return data;
}

/**
 * Delete feedback by ID
 */
export async function deleteFeedback(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting feedback:', error);
    throw new Error('Failed to delete feedback');
  }
}

/**
 * Get analytics for a specific site
 */
export async function getSiteAnalytics(siteId: string) {
  const supabase = getSupabaseAdmin();
  
  try {
   const feedback = await getFeedbackBySiteId(siteId);
    if (!feedback) {
      return {
        total: 0,
        averageRating: 0,
        recentCount: 0,
        ratingsDistribution: {},
        countriesDistribution: {},
        devicesDistribution: {},
        browsersDistribution: {},
        averageTimeOnPage: 0
      };
    }
    
    // Format ratings distribution for display
    const ratingsDistribution = feedback.reduce((acc, item) => {
      acc[item.rating] = (acc[item.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Format other distributions
    const countriesDistribution = feedback.reduce((acc, item) => {
      if (item.country) {
        acc[item.country] = (acc[item.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Device distribution
    const devicesDistribution = feedback.reduce((acc, item) => {
      if (item.device) {
        acc[item.device] = (acc[item.device] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Browser distribution
    const browsersDistribution = feedback.reduce((acc, item) => {
      if (item.browser) {
        acc[item.browser] = (acc[item.browser] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: feedback.length,
      averageRating: feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length,
      recentCount: feedback.length,
      ratingsDistribution,
      countriesDistribution,
      devicesDistribution,
      browsersDistribution,
      averageTimeOnPage: feedback.reduce((sum, item) => sum + (item.time_on_page || 0), 0) / feedback.length
    };
  } catch (error) {
    console.error('Error in getSiteAnalytics:', error);
    // Return empty analytics if there's an error
    return {
      total: 0,
      averageRating: 0,
      recentCount: 0,
      ratingsDistribution: {},
      countriesDistribution: {},
      devicesDistribution: {},
      browsersDistribution: {},
      averageTimeOnPage: 0
    };
  }
} 