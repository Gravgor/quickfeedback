import { getSupabaseAdmin } from '@/utils/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  company_name?: string;
  website?: string;
  plan: 'free' | 'pro' | 'business';
  created_at?: string;
  updated_at?: string;
}

/**
 * Get a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No profile found with this ID
    }
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
  
  return data;
}

/**
 * Create a new user profile
 */
export async function createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: profile.id,
      email: profile.email,
      name: profile.name || null,
      company_name: profile.company_name || null,
      website: profile.website || null,
      plan: profile.plan || 'free',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
  
  return data;
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
): Promise<UserProfile> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
  
  return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No profile found with this email
    }
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user by email');
  }
  
  return data;
}

/**
 * Delete a user profile
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  
  if (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}

export async function uploadAvatar(userId: string, file: File) {
  const supabase = getSupabaseAdmin();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('user-content')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }
  
  const { data } = supabase.storage.from('user-content').getPublicUrl(filePath);
  
  // Update user profile with new avatar URL
  await updateUserProfile(userId, { avatar_url: data.publicUrl });
  
  return data.publicUrl;
}

export async function updateUserPlan(userId: string, plan: 'free' | 'pro' | 'business') {
  return updateUserProfile(userId, { plan });
} 