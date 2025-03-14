'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string, 
    password: string, 
    metadata?: { [key: string]: any }
  ) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (
    email: string, 
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState<SupabaseClient>(() => 
    createClient(supabaseUrl, supabaseAnonKey)
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);

        // Refresh the page on sign in or sign out to update server components
        console.log('Event:', event);
        if (event === 'SIGNED_IN') {
          router.refresh();
          // Only redirect to dashboard if not already on an auth page
          const pathName = window.location.pathname;
          if (pathName !== '/login' && pathName !== '/signup' && pathName !== '/reset-password') {
            router.push('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          router.refresh();
          router.push('/');
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { [key: string]: any }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        // Explicitly get the session to ensure it's established
        const { data } = await supabase.auth.getSession();
        console.log('Session established:', !!data.session);
      }
      
      return { error };
    } catch (err) {
      console.error('Error during sign in:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 