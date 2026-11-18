-- Role functions (#71, HU-81, D-67, docs/datos/esquema.md «Seguridad: permisos y RLS»).
-- SECURITY DEFINER so policies read user_role with the owner's rights and never
-- trust the client; the empty search_path stops a caller from shadowing objects.
-- Role and block are independent: blocking does not take the role away (D-172).

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_role
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

-- An admin can do everything an editor can.
create function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_role
    where user_id = (select auth.uid()) and role in ('editor', 'admin')
  );
$$;

create function public.is_blocked()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_role
    where user_id = (select auth.uid()) and blocked_at is not null
  );
$$;

-- Only signed-in users need them; anon has no session to ask about.
revoke execute on function public.is_admin(), public.is_editor(), public.is_blocked() from public, anon;
grant execute on function public.is_admin(), public.is_editor(), public.is_blocked() to authenticated;
