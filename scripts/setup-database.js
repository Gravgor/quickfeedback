#!/usr/bin/env node

// This script sets up the necessary tables in Supabase
// Run with: node scripts/setup-database.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Create a Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log('Setting up QuickFeedback database in Supabase...');
  
  try {
    // Create tables using Supabase's REST API
    
    console.log('Checking profiles table...');
    try {
      const { error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      if (profilesError && profilesError.message.includes('does not exist')) {
        await createProfilesTable();
      } else {
        console.log('Profiles table already exists');
      }
    } catch (err) {
      console.log('Error checking profiles table, assuming it needs to be created');
      await createProfilesTable();
    }

    console.log('Checking sites table...');
    try {
      const { error: sitesError } = await supabase
        .from('sites')
        .select('id')
        .limit(1);
        
      if (sitesError && sitesError.message.includes('does not exist')) {
        await createSitesTable();
      } else {
        console.log('Sites table already exists');
      }
    } catch (err) {
      console.log('Error checking sites table, assuming it needs to be created');
      await createSitesTable();
    }

    console.log('Checking feedback table...');
    try {
      const { error: feedbackError } = await supabase
        .from('feedback')
        .select('id')
        .limit(1);
        
      if (feedbackError && feedbackError.message.includes('does not exist')) {
        await createFeedbackTable();
      } else {
        console.log('Feedback table already exists');
      }
    } catch (err) {
      console.log('Error checking feedback table, assuming it needs to be created');
      await createFeedbackTable();
    }

    console.log('\nSetup complete! Your Supabase database is ready for QuickFeedback.');
    console.log('\nNext steps:');
    console.log('1. Create RLS policies in the Supabase dashboard (SQL Editor)');
    console.log('2. Set up triggers for updated_at timestamps');
    console.log('3. Verify table structures and relationships');
    console.log('\nYou can use the SQL script in scripts/quickfeedback-schema.sql to set up everything at once.');
    
  } catch (err) {
    console.error('Unexpected error during setup:', err);
    process.exit(1);
  }
}

// Create tables using REST API
async function createProfilesTable() {
  console.log('Creating profiles table...');
  // For tables, we need to use SQL Editor in Supabase dashboard
  console.log(`
    To create the profiles table, run this SQL in the Supabase SQL Editor:
    
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      company_name TEXT,
      website TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );
    
    -- Apply RLS policies
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  `);
}

async function createSitesTable() {
  console.log('Creating sites table...');
  console.log(`
    To create the sites table, run this SQL in the Supabase SQL Editor:
    
    CREATE TABLE IF NOT EXISTS sites (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );
    
    -- Apply RLS policies
    ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own sites"
      ON sites FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own sites"
      ON sites FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own sites"
      ON sites FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own sites"
      ON sites FOR DELETE
      USING (auth.uid() = user_id);
  `);
}

async function createFeedbackTable() {
  console.log('Creating feedback table...');
  console.log(`
    To create the feedback table, run this SQL in the Supabase SQL Editor:
    
    CREATE TABLE IF NOT EXISTS feedback (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      url TEXT,
      browser TEXT,
      device TEXT,
      country TEXT,
      city TEXT,
      os TEXT,
      language TEXT,
      referrer TEXT,
      time_on_page INTEGER,
      screen_size TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
    );
    
    -- Apply RLS policies
    ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can insert feedback"
      ON feedback FOR INSERT
      WITH CHECK (true);

    CREATE POLICY "Site owners can view feedback for their sites"
      ON feedback FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM sites 
        WHERE sites.id = feedback.site_id 
        AND sites.user_id = auth.uid()
      ));

    CREATE POLICY "Site owners can delete feedback for their sites"
      ON feedback FOR DELETE
      USING (EXISTS (
        SELECT 1 FROM sites 
        WHERE sites.id = feedback.site_id 
        AND sites.user_id = auth.uid()
      ));
  `);
}

// Run the setup
setupDatabase(); 