-- Raceplan: Gäste dürfen lesen; Admins (Sportler) dürfen Einträge erstellen, bearbeiten und löschen.

alter table public.races enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Everyone can view races" on public.races;
create policy "Everyone can view races"
on public.races
for select
using (true);

drop policy if exists "Admin can insert races" on public.races;
create policy "Admin can insert races"
on public.races
for insert
with check (public.is_admin());

drop policy if exists "Admin can update races" on public.races;
create policy "Admin can update races"
on public.races
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin can delete races" on public.races;
create policy "Admin can delete races"
on public.races
for delete
using (public.is_admin());