import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtc2J1c2Rtbm1vdGRwaW5saWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTk3MTc5NywiZXhwIjoyMDU3NTQ3Nzk3fQ.G0SH-7OMQPEJT4nDC9n7PWfSSAFYjcJxiYLMTyjliTM'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client for browser usage (auth + public data)
export const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

// Create a Supabase client with service role for admin operations
// Use this only in server-side contexts, never expose this on the client
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Helper to check if tables exist (run this during setup)
export async function checkSupabaseTables() {
  const supabase = getSupabaseAdmin();
  
  let profilesExist = false;
  let sitesExist = false;
  let feedbackExist = false;
  
  try {
    // Check profiles table
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      profilesExist = !profilesError && profilesData !== null;
    } catch (err) {
      console.error('Error checking profiles table:', err);
    }
    
    // Check sites table
    try {
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('id')
        .limit(1);
      
      sitesExist = !sitesError && sitesData !== null;
    } catch (err) {
      console.error('Error checking sites table:', err);
    }
    
    // Check feedback table
    try {
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('id')
        .limit(1);
      
      feedbackExist = !feedbackError && feedbackData !== null;
    } catch (err) {
      console.error('Error checking feedback table:', err);
    }
    
    return {
      profilesExist,
      sitesExist,
      feedbackExist,
      allExist: profilesExist && sitesExist && feedbackExist
    };
  } catch (error) {
    console.error('Error checking tables:', error);
    return {
      profilesExist: false,
      sitesExist: false,
      feedbackExist: false,
      allExist: false,
      error
    };
  }
}

// SQL for creating tables (to be executed in Supabase SQL editor)
// Moving this to scripts/quickfeedback-schema.sql for better organization

// Types for our database tables
export type Feedback = {
  id: string;
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
  created_at: string;
};

export type Site = {
  id: string;
  name: string;
  url: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
};

export type Profile = {
  id: string;
  email: string;
  name?: string;
  company_name?: string;
  website?: string;
  plan: 'free' | 'premium' | 'enterprise';
  created_at: string;
  updated_at?: string;
};

// Get current authenticated user
export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session.user;
} 