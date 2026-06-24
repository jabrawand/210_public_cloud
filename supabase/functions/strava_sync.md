```ts
// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed',
        }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
      'SUPABASE_SERVICE_ROLE_KEY'
    );
    const STRAVA_CLIENT_ID = Deno.env.get('STRAVA_CLIENT_ID');
    const STRAVA_CLIENT_SECRET = Deno.env.get('STRAVA_CLIENT_SECRET');

    if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
    if (!SUPABASE_SERVICE_ROLE_KEY)
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    if (!STRAVA_CLIENT_ID) throw new Error('Missing STRAVA_CLIENT_ID');
    if (!STRAVA_CLIENT_SECRET)
      throw new Error('Missing STRAVA_CLIENT_SECRET');

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verbindung laden
    const { data: connection, error: connectionError } = await supabase
      .from('strava_connection')
      .select('*')
      .eq('id', 1)
      .single();

    if (connectionError || !connection) {
      throw new Error('No Strava connection found');
    }

    let accessToken = connection.access_token;
    let refreshToken = connection.refresh_token;

    // Token prüfen
    const now = new Date();
    const expiresAt = new Date(connection.expires_at);

    const tokenExpired = now >= expiresAt;

    if (tokenExpired) {
      console.log('Access token expired. Refreshing...');

      const refreshResponse = await fetch(
        'https://www.strava.com/oauth/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        }
      );

      const refreshJson = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error(
          `Strava refresh failed: ${JSON.stringify(refreshJson)}`
        );
      }

      accessToken = refreshJson.access_token;
      refreshToken = refreshJson.refresh_token;

      const expiresAtIso = new Date(
        refreshJson.expires_at * 1000
      ).toISOString();

      // Update table
      const { error: updateError } = await supabase
        .from('strava_connection')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAtIso,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (updateError) {
        throw updateError;
      }

      console.log('Token successfully refreshed');
    } else {
      console.log('Access token still valid');
    }

    return new Response(
      JSON.stringify({
        success: true,
        token_refreshed: tokenExpired,
        expires_at: connection.expires_at,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
```