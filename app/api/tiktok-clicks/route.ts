import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    });
    
    // Get request metadata
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referrer = request.headers.get('referer') || 'Direct';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') || 'Unknown';
    
    // Parse user agent to determine device type and browser
    const deviceType = /mobile/i.test(userAgent) ? 'Mobile' : /tablet/i.test(userAgent) ? 'Tablet' : 'Desktop';
    
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    // Get any additional data from request body
    const body = await request.json().catch(() => ({}));
    
    // Insert click record
    const { data, error } = await supabase
      .from('tiktok_clicks')
      .insert({
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer: referrer,
        device_type: deviceType,
        browser: browser,
        metadata: body,
      })
      .select()
      .single();

    if (error) {
      console.error('Error tracking click:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in click tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    });
    
    // Check if user is admin (you may need to adjust this based on your auth setup)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get summary statistics
    const { data: summary, error: summaryError } = await supabase
      .from('tiktok_click_summary')
      .select('*')
      .single();

    if (summaryError) {
      console.error('Error fetching summary:', summaryError);
    }

    // Get recent clicks (last 100)
    const { data: recentClicks, error: recentError } = await supabase
      .from('tiktok_clicks')
      .select('*')
      .order('clicked_at', { ascending: false })
      .limit(100);

    if (recentError) {
      console.error('Error fetching recent clicks:', recentError);
    }

    // Get clicks by date (last 30 days)
    const { data: clicksByDate, error: dateError } = await supabase
      .from('tiktok_clicks')
      .select('clicked_at')
      .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('clicked_at', { ascending: true });

    if (dateError) {
      console.error('Error fetching clicks by date:', dateError);
    }

    // Process clicks by date
    const clicksGroupedByDate = clicksByDate?.reduce((acc: any, click: any) => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Get clicks by device type
    const { data: clicksByDevice, error: deviceError } = await supabase
      .from('tiktok_clicks')
      .select('device_type')
      .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const deviceStats = clicksByDevice?.reduce((acc: any, click: any) => {
      const device = click.device_type || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // Get clicks by country
    const { data: clicksByCountry, error: countryError } = await supabase
      .from('tiktok_clicks')
      .select('country')
      .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const countryStats = clicksByCountry?.reduce((acc: any, click: any) => {
      const country = click.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        summary: summary || {
          total_clicks: 0,
          clicks_last_24h: 0,
          clicks_last_7d: 0,
          clicks_last_30d: 0,
        },
        recentClicks: recentClicks || [],
        clicksByDate: clicksGroupedByDate || {},
        deviceStats: deviceStats || {},
        countryStats: countryStats || {},
      },
    });
  } catch (error) {
    console.error('Error fetching click stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
