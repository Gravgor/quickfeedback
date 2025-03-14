#!/usr/bin/env node

// This script tests the connection to Supabase
// Run with: node scripts/test-connection.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection...');

// Check if variables are defined
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not defined in your .env file');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in your .env file');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not defined in your .env file');
  process.exit(1);
}

console.log('✅ Environment variables found');

// Test anonymous client connection
async function testAnonConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Failed to connect with anon key:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase with anon key');
    return true;
  } catch (err) {
    console.error('❌ Error connecting with anon key:', err.message);
    return false;
  }
}

// Test service role client connection
async function testServiceConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Try to query something simple
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1).catch(() => {
      return { data: null, error: { message: 'Could not execute query' } };
    });
    
    if (error && !error.message.includes('does not exist')) {
      console.error('❌ Failed to connect with service key:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase with service key');
    return true;
  } catch (err) {
    console.error('❌ Error connecting with service key:', err.message);
    return false;
  }
}

async function runTests() {
  console.log(`\nSupabase URL: ${supabaseUrl}`);
  
  const anonSuccess = await testAnonConnection();
  const serviceSuccess = await testServiceConnection();
  
  console.log('\nConnection test summary:');
  console.log(`Anonymous connection: ${anonSuccess ? '✅ SUCCESSFUL' : '❌ FAILED'}`);
  console.log(`Service role connection: ${serviceSuccess ? '✅ SUCCESSFUL' : '❌ FAILED'}`);
  
  if (anonSuccess && serviceSuccess) {
    console.log('\n✅ All connection tests passed! Supabase is properly configured.');
    console.log('\nNext steps:');
    console.log('1. Run the database setup script: node scripts/setup-database.js');
    console.log('2. Start the application: npm run dev');
  } else {
    console.log('\n❌ Some connection tests failed. Please check your Supabase configuration.');
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your Supabase URL and API keys in the .env.local file');
    console.log('2. Make sure your Supabase project is active and running');
    console.log('3. Check network connectivity to Supabase servers');
  }
}

runTests(); 