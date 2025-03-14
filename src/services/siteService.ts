import { getSupabaseAdmin } from '@/utils/supabase';

export interface Site {
  id?: string;
  user_id: string;
  name: string;
  url: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new site
 */
export async function createSite(site: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: site.user_id,
      name: site.name,
      url: site.url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating site:', error);
    throw new Error('Failed to create site');
  }
  
  return data;
}

/**
 * Update an existing site
 */
export async function updateSite(id: string, updates: Partial<Omit<Site, 'id' | 'user_id' | 'created_at'>>): Promise<Site> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('sites')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating site:', error);
    throw new Error('Failed to update site');
  }
  
  return data;
}

/**
 * Delete a site
 */
export async function deleteSite(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting site:', error);
    throw new Error('Failed to delete site');
  }
}

/**
 * Get a site by ID
 */
export async function getSiteById(id: string): Promise<Site | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No site found with this ID
    }
    console.error('Error fetching site:', error);
    throw new Error('Failed to fetch site');
  }
  
  return data;
}

/**
 * Get all sites for a user
 */
export async function getSitesByUserId(userId: string): Promise<Site[]> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching sites:', error);
    throw new Error('Failed to fetch sites');
  }
  
  return data || [];
} 