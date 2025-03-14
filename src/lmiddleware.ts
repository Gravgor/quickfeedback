import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = path.startsWith('/dashboard') || 
                          path.startsWith('/settings') || 
                          path.startsWith('/sites');
  
  // Check if the path is an auth route
  const isAuthRoute = path === '/login' || path === '/signup' || path === '/forgot-password';

  try {
    // Get the session from the request cookies
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session:', session);
    // Add debug header to see if we're getting a session
    const response = NextResponse.next();
    response.headers.set('x-session-exists', session ? 'true' : 'false');

    // If the user is accessing a protected route but isn't authenticated, redirect to login
    if (isProtectedRoute && !session) {
      console.log('No session found, redirecting to login');
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }

    // If the user is accessing an auth route but is already authenticated, redirect to dashboard
    if (isAuthRoute && session) {
      console.log('Session found, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Otherwise, proceed as normal
    return response;
  } catch (error) {
    console.error('Error in middleware:', error);
    // If there's an error, allow the request to proceed
    // but don't redirect protected routes (security first)
    if (isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }
} 