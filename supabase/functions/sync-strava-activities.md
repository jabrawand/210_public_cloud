import { createClient } from 'npm:@supabase/supabase-js@2';

const CONNECTION_ID = 1;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

type StravaConnection = {
  id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string | null;
  last_sync: string | null;
};

type StravaActivity = Record<string, unknown>;

function mapActivityToRow(activity: StravaActivity) {
  return {
    strava_activity_id: activity.id,
    name: activity.name,
    sport_type: activity.sport_type,
    start_date: activity.start_date,
    start_date_local: activity.start_date_local,
    distance: activity.distance,
    moving_time: activity.moving_time,
    elapsed_time: activity.elapsed_time,
    total_elevation_gain: activity.total_elevation_gain,
    elev_low: activity.elev_low,
    elev_high: activity.elev_high,
    average_speed: activity.average_speed,
    max_speed: activity.max_speed,
    device_watts: activity.device_watts,
    average_watts: activity.average_watts,
    weighted_average_watts: activity.weighted_average_watts,
    max_watts: activity.max_watts,
    has_heartrate: activity.has_heartrate,
    average_heartrate: activity.average_heartrate,
    max_heartrate: activity.max_heartrate,
    kilojoules: activity.kilojoules,
    location_city: activity.location_city ?? null,
    location_state: activity.location_state ?? null,
    summary_polyline:
      (activity.map as { summary_polyline?: string } | undefined)
        ?.summary_polyline ?? null,
    start_latlng: activity.start_latlng,
    end_latlng: activity.end_latlng,
    raw_data: activity,
    updated_at: new Date().toISOString(),
  };
}

async function parseStravaResponse(response: Response): Promise<unknown> {
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`Strava API error: ${JSON.stringify(body)}`);
  }

  return body;
}

async function fetchActivitiesSince(
  accessToken: string,
  afterUnix: number,
  page = 1,
  perPage = 50
): Promise<StravaActivity[]> {
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${afterUnix}&page=${page}&per_page=${perPage}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const activities = await parseStravaResponse(response);

  if (!Array.isArray(activities)) {
    throw new Error(
      `Unexpected Strava response: ${JSON.stringify(activities)}`
    );
  }

  return activities as StravaActivity[];
}

async function refreshAccessToken(
  supabase: ReturnType<typeof createClient>,
  connection: StravaConnection,
  clientId: string,
  clientSecret: string
): Promise<string> {
  console.log('Access token expired. Refreshing...');

  const refreshResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
    }),
  });

  if (!refreshResponse.ok) {
    throw new Error('Token konnte nicht erneuert werden.');
  }

  const refreshed = await refreshResponse.json();

  const { error: updateError } = await supabase
    .from('strava_connection')
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: new Date(refreshed.expires_at * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', CONNECTION_ID);

  if (updateError) {
    throw new Error(`Failed to update tokens: ${updateError.message}`);
  }

  console.log('Access token successfully refreshed.');
  return refreshed.access_token;
}

async function ensureValidAccessToken(
  supabase: ReturnType<typeof createClient>,
  connection: StravaConnection,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const now = new Date();
  const expiresAt = connection.expires_at
    ? new Date(connection.expires_at)
    : null;

  if (!expiresAt || now < expiresAt) {
    console.log('Access token is still valid.');
    return connection.access_token;
  }

  return refreshAccessToken(supabase, connection, clientId, clientSecret);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ success: false, error: 'Use POST' }, 405);
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const STRAVA_CLIENT_ID = Deno.env.get('STRAVA_CLIENT_ID');
    const STRAVA_CLIENT_SECRET = Deno.env.get('STRAVA_CLIENT_SECRET');

    if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    if (!STRAVA_CLIENT_ID) throw new Error('Missing STRAVA_CLIENT_ID');
    if (!STRAVA_CLIENT_SECRET) throw new Error('Missing STRAVA_CLIENT_SECRET');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const syncStartedAt = new Date();

    const { data: connection, error: connectionError } = await supabase
      .from('strava_connection')
      .select('*')
      .eq('id', CONNECTION_ID)
      .single();

    if (connectionError || !connection) {
      throw new Error('No Strava connection found');
    }

    const accessToken = await ensureValidAccessToken(
      supabase,
      connection as StravaConnection,
      STRAVA_CLIENT_ID,
      STRAVA_CLIENT_SECRET
    );

    const lastSyncDate = connection.last_sync
      ? new Date(connection.last_sync)
      : new Date(0);
    const afterUnix = Math.floor(lastSyncDate.getTime() / 1000);

    console.log('Full sync after:', lastSyncDate.toISOString());

    const allActivities: StravaActivity[] = [];
    let page = 1;

    while (true) {
      const batch = await fetchActivitiesSince(accessToken, afterUnix, page);

      if (batch.length === 0) {
        break;
      }

      allActivities.push(...batch);

      if (batch.length < 50) {
        break;
      }

      page += 1;
    }

    console.log(`Fetched ${allActivities.length} activities`);

    if (allActivities.length > 0) {
      const mapped = allActivities.map(mapActivityToRow);

      const { error: upsertError } = await supabase
        .from('strava_activities')
        .upsert(mapped, { onConflict: 'strava_activity_id' });

      if (upsertError) {
        throw new Error(`DB upsert failed: ${upsertError.message}`);
      }
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('strava_connection')
      .update({
        last_sync: syncStartedAt.toISOString(),
        updated_at: now,
      })
      .eq('id', CONNECTION_ID);

    if (updateError) {
      throw new Error(`Failed to update last_sync: ${updateError.message}`);
    }

    return jsonResponse({
      success: true,
      synced: allActivities.length,
      last_sync: syncStartedAt.toISOString(),
    });
  } catch (err) {
    console.error(err);

    return jsonResponse(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      500
    );
  }
});
