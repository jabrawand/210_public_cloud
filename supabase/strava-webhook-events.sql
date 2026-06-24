-- Deduplication table for Strava webhook events.
-- Strava may deliver the same event more than once.

create table if not exists public.strava_webhook_events (
  id bigint generated always as identity primary key,
  event_id bigint not null unique,
  object_id bigint not null,
  received_at timestamptz not null default now(),
  unique (event_id)
);

create index if not exists strava_webhook_events_object_id_idx
  on public.strava_webhook_events (object_id);
