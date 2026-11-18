-- Role and block of each account (#71, HU-81, D-67, docs/datos/esquema.md).
-- No row, or an empty role, means a student.
create type public.app_role as enum ('editor', 'admin');

create table public.user_role (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role,
  blocked_at timestamptz,
  blocked_reason text,
  granted_by uuid references auth.users (id) on delete set null
);

-- Every public table has RLS (01_rls_enabled_test.sql); policies come next.
alter table public.user_role enable row level security;
revoke all on public.user_role from anon, authenticated;
