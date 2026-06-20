-- Rollenmodell: Gäste dürfen die Übersicht lesen, Details nur für eingeloggte User.
-- Im Supabase Dashboard unter SQL Editor ausführen.

-- 1) Übersicht: öffentlich lesbar (Gast + User)
ALTER TABLE public.strava_activities_overview ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read activity overview" ON public.strava_activities_overview;

CREATE POLICY "Public read activity overview"
ON public.strava_activities_overview
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.strava_activities_overview TO anon, authenticated;

-- Falls strava_activities_overview eine VIEW auf strava_activities ist,
-- muss die View als Owner laufen (nicht als anonymer User):
-- CREATE OR REPLACE VIEW public.strava_activities_overview
-- WITH (security_invoker = false) AS
-- SELECT
--   id,
--   name,
--   start_date_local,
--   distance,
--   moving_time,
--   sport_type,
--   total_elevation_gain
-- FROM public.strava_activities;

-- 2) Details: nur für eingeloggte User
ALTER TABLE public.strava_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read activity details" ON public.strava_activities;

CREATE POLICY "Authenticated read activity details"
ON public.strava_activities
FOR SELECT
TO authenticated
USING (true);

GRANT SELECT ON public.strava_activities TO authenticated;
