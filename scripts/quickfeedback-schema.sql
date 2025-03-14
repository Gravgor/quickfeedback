-- QuickFeedback Schema
-- Copy and paste this entire script into the Supabase SQL Editor to set up your database

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company_name TEXT,
  website TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  current_period_end TIMESTAMP WITH TIME ZONE,
  subscription_id TEXT,
  subscription_status TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create feedback table
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

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create trigger to handle updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the profiles table
DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Apply the trigger to the sites table
DROP TRIGGER IF EXISTS update_sites_timestamp ON sites;
CREATE TRIGGER update_sites_timestamp
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Apply the trigger to the subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_timestamp ON subscriptions;
CREATE TRIGGER update_subscriptions_timestamp
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create RLS policies for secure access
-- Profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Insert profile after user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, company_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'company_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sites table policies
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

-- Feedback table policies
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

-- Subscriptions table policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_site_analytics(site_id UUID) 
RETURNS JSON AS $$
DECLARE
  total_count INTEGER;
  avg_rating FLOAT;
  recent_count INTEGER;
  ratings_distribution JSON;
  countries_distribution JSON;
  devices_distribution JSON;
  browsers_distribution JSON;
  avg_time_on_page FLOAT;
BEGIN
  -- Get total feedback count
  SELECT COUNT(*) INTO total_count FROM feedback WHERE feedback.site_id = $1;
  
  -- Get average rating
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating FROM feedback WHERE feedback.site_id = $1;
  
  -- Get recent feedback count (last 30 days)
  SELECT COUNT(*) INTO recent_count FROM feedback 
  WHERE feedback.site_id = $1 
  AND feedback.created_at > NOW() - INTERVAL '30 days';
  
  -- Get ratings distribution
  SELECT json_object_agg(rating, count)
  INTO ratings_distribution
  FROM (
    SELECT rating, COUNT(*) as count
    FROM feedback
    WHERE feedback.site_id = $1
    GROUP BY rating
    ORDER BY rating
  ) AS rating_counts;
  
  -- Get countries distribution
  SELECT json_object_agg(COALESCE(country, 'Unknown'), count)
  INTO countries_distribution
  FROM (
    SELECT country, COUNT(*) as count
    FROM feedback
    WHERE feedback.site_id = $1
    GROUP BY country
    ORDER BY count DESC
    LIMIT 10
  ) AS country_counts;
  
  -- Get devices distribution
  SELECT json_object_agg(COALESCE(device, 'Unknown'), count)
  INTO devices_distribution
  FROM (
    SELECT device, COUNT(*) as count
    FROM feedback
    WHERE feedback.site_id = $1
    GROUP BY device
    ORDER BY count DESC
  ) AS device_counts;
  
  -- Get browsers distribution
  SELECT json_object_agg(COALESCE(browser, 'Unknown'), count)
  INTO browsers_distribution
  FROM (
    SELECT browser, COUNT(*) as count
    FROM feedback
    WHERE feedback.site_id = $1
    GROUP BY browser
    ORDER BY count DESC
  ) AS browser_counts;
  
  -- Get average time on page
  SELECT COALESCE(AVG(time_on_page), 0)
  INTO avg_time_on_page
  FROM feedback
  WHERE feedback.site_id = $1
  AND time_on_page IS NOT NULL;
  
  -- Return as JSON
  RETURN json_build_object(
    'total', total_count,
    'averageRating', avg_rating,
    'recentCount', recent_count,
    'ratingsDistribution', COALESCE(ratings_distribution, '{}'),
    'countriesDistribution', COALESCE(countries_distribution, '{}'),
    'devicesDistribution', COALESCE(devices_distribution, '{}'),
    'browsersDistribution', COALESCE(browsers_distribution, '{}'),
    'averageTimeOnPage', avg_time_on_page
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 