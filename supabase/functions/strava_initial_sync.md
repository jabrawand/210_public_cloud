```ts
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Use POST',
        }),
        { status: 405 }
      );
    }

    const syncStartedAt = new Date();

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY =
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // ----------------------------------------
    // Load connection
    // ----------------------------------------
    const { data: connection, error } = await supabase
      .from('strava_connection')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !connection) {
      throw new Error('No connection found');
    }

    const accessToken = connection.access_token;
    const athleteId = connection.athlete_id;

    // ----------------------------------------
    // Zeitraum festlegen
    // ----------------------------------------
    const startDate = new Date('2026-04-01T00:00:00Z');

    const afterUnix = Math.floor(
      startDate.getTime() / 1000
    );

    const beforeUnix = Math.floor(
      Date.now() / 1000
    );

    console.log('Initial Sync');
    console.log('After:', afterUnix);
    console.log('Before:', beforeUnix);

    // ----------------------------------------
    // Load all activities (Pagination)
    // ----------------------------------------
    let page = 1;
    let activities: any[] = [];

    while (true) {

      console.log(`Loading page ${page}`);

      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${afterUnix}&before=${beforeUnix}&page=${page}&per_page=200`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Strava API error',
            details: data,
          }),
          {
            status: 400,
          }
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          `Unexpected Strava response: ${JSON.stringify(data)}`
        );
      }

      console.log(
        `Fetched ${data.length} activities`
      );

      if (data.length === 0) {
        break;
      }

      activities.push(...data);

      page++;
    }

    console.log(
      `Total fetched activities: ${activities.length}`
    );

    // ----------------------------------------
    // Mapping
    // ----------------------------------------
    const mapped = activities.map((a: any) => ({
      strava_activity_id: a.id,
      name: a.name,
      sport_type: a.sport_type,
      start_date: a.start_date,
      start_date_local: a.start_date_local,
      distance: a.distance,
      moving_time: a.moving_time,
      elapsed_time: a.elapsed_time,
      total_elevation_gain: a.total_elevation_gain,
      elev_low: a.elev_low,
      elev_high: a.elev_high,
      average_speed: a.average_speed,
      max_speed: a.max_speed,
      device_watts: a.device_watts,
      average_watts: a.average_watts,
      weighted_average_watts: a.weighted_average_watts,
      max_watts: a.max_watts,
      has_heartrate: a.has_heartrate,
      average_heartrate: a.average_heartrate,
      max_heartrate: a.max_heartrate,
      kilojoules: a.kilojoules,
      summary_polyline: a.map?.summary_polyline ?? null,
      start_latlng: a.start_latlng,
      end_latlng: a.end_latlng,
      raw_data: a,
      updated_at: new Date().toISOString(),
    }));

    // ----------------------------------------
    // Upsert
    // ----------------------------------------
    if (mapped.length > 0) {

      const { error: upsertError } =
        await supabase
          .from('strava_activities')
          .upsert(mapped, {
            onConflict: 'strava_activity_id',
          });

      if (upsertError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'DB upsert failed',
            details: upsertError.message,
          }),
          {
            status: 500,
          }
        );
      }

      console.log(
        `Upserted ${mapped.length} activities`
      );

    } else {

      console.log(
        'No activities found for initial import.'
      );

    }

    // ----------------------------------------
    // Update last_sync
    // ----------------------------------------
    const now = new Date().toISOString();

    const { error: updateError } =
      await supabase
        .from('strava_connection')
        .update({
          last_sync: syncStartedAt.toISOString(),
          updated_at: now,
        })
        .eq('id', 1);

    if (updateError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to update last_sync',
          details: updateError.message,
        }),
        {
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: mapped.length,
        last_sync: syncStartedAt.toISOString(),
      }),
      {
        status: 200,
      }
    );

  } catch (err) {

    console.error(err);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          err instanceof Error
            ? err.message
            : String(err),
      }),
      {
        status: 500,
      }
    );

  }
});


```