-- user_role: read-only through the API (#71, HU-81, docs/datos/esquema.md).
-- Each account sees its own role and an admin sees all. Changes go only
-- through the accounts Edge Function (service_role), or by hand in the
-- Supabase SQL Editor (docs/operacion/alta-de-cuentas.md).
grant select on public.user_role to authenticated;

create policy user_role_select_own_or_admin on public.user_role
for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));
