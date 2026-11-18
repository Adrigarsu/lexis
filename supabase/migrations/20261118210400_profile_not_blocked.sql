-- profile: own rows only, and only while the account is not blocked
-- (#71, HU-81, docs/datos/esquema.md «Seguridad: permisos y RLS»).
-- Resolves the TODO(user_role) of 20261118004918_profile.sql.
alter policy profile_select_own on public.profile
using (id = (select auth.uid()) and not (select public.is_blocked()));

alter policy profile_insert_own on public.profile
with check (id = (select auth.uid()) and not (select public.is_blocked()));

alter policy profile_update_own on public.profile
using (id = (select auth.uid()) and not (select public.is_blocked()))
with check (id = (select auth.uid()) and not (select public.is_blocked()));
