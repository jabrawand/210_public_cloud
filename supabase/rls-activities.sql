-- Activities: Gäste dürfen die Aktivitätsübersicht lesen, Details nur für eingeloggte User.

-- Create a view for the activities overview
create or replace view public.strava_activities_overview as
select
    id,
    name,
    distance,
    moving_time,
    total_elevation_gain,
    sport_type,
    start_date_local
from public.strava_activities;

-- Everyone can view the activities overview
create policy "Everyone can view the activities overview"
on public.strava_activities_overview
for select
using (true);

-- Only logged in users can view the activity details
create policy "Authenticated users can view full activity details"
on public.strava_activities
for select
to authenticated
using (auth.uid() is not null);
