-- Raceplan: Gäste dürfen lesen, eingeloggte User mit Admin-Rechten (Sportler/Admin) dürfen Einträge erstellen.

-- Create a function to check if the user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
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

-- Everyone can view races
create policy "Everyone can view races"
on public.races
for select
using (true);

-- Only admins can insert races
create policy "Admin can insert races"
on public.races
for insert
with check (public.is_admin());

-- Only admins can update races
create policy "Admin can update races"
on public.races
for update
using (public.is_admin())
with check (public.is_admin());

-- Only admins can delete races
create policy "Admin can delete races"
on public.races
for delete
using (public.is_admin())
with check (public.is_admin());