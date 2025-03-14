import { NextRequest, NextResponse } from 'next/server';
import { createSite, deleteSite, getSiteById, getSitesByUserId, updateSite } from '@/services/siteService';
import { getSession } from '@/utils/supabase-auth-helpers';
import { getSupabaseAdmin } from '@/utils/supabase';
import { nanoid } from 'nanoid';
import { isUserWithinPlanLimits } from '@/services/stripeService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const supabase = getSupabaseAdmin();
    
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(sites);
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { name, url } = await req.json();
    
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseAdmin();
    
    // Get the current site count for the user
    const { count, error: countError } = await supabase
      .from('sites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) {
      throw countError;
    }
    
    const siteCount = count || 0;
    
    // Check if the user is within their plan's site limit
    const limitCheck = await isUserWithinPlanLimits(userId, { 
      siteCount: siteCount + 1,  // +1 for the site we're about to create
      feedbackCount: 0 
    });
    
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.reason || 'Plan limit reached' },
        { status: 403 }
      );
    }
    
    // Generate a site ID
    const siteId = nanoid(10);
    
    // Insert the new site
    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          id: siteId,
          name,
          url,
          user_id: userId,
        },
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create site' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    // Check if site exists
    const existingSite = await getSiteById(id);
    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Update the site
    const updatedSite = await updateSite(id, updates);
    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get siteId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const siteId = searchParams.get('siteId');

    // Validate siteId
    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    // Check if site exists
    const existingSite = await getSiteById(siteId);
    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Delete the site
    await deleteSite(siteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
} 