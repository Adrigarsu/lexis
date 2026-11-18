-- Audit log: who changed what and when (#71, HU-81, RNF-14, D-164,
-- docs/datos/esquema.md «Auditoría»). Filled only by triggers, never by the app.
-- It never stores study data (GDPR).
create table public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor_id uuid,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  table_name text not null,
  row_id uuid not null,
  old jsonb,
  new jsonb
);

create index audit_log_row_idx on public.audit_log (table_name, row_id);

-- Editors and admins read it; nobody writes, edits or deletes it through the API.
alter table public.audit_log enable row level security;
revoke all on public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;

create policy audit_log_select_editor on public.audit_log
for select to authenticated
using ((select public.is_editor()));

-- Generic trigger: every audited table reuses it. The argument is the name of
-- the primary key column (user_role uses user_id; content tables use id).
-- actor_id is empty when the change comes from the SQL Editor, without a session.
create function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  key_column text := coalesce(tg_argv[0], 'id');
  old_row jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  new_row jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
begin
  insert into public.audit_log (actor_id, action, table_name, row_id, old, new)
  values (
    (select auth.uid()),
    tg_op,
    tg_table_name,
    (coalesce(new_row, old_row) ->> key_column)::uuid,
    old_row,
    new_row
  );
  return null;
end;
$$;

revoke execute on function public.audit_row_change() from public, anon, authenticated;

create trigger audit_user_role
after insert or update or delete on public.user_role
for each row execute function public.audit_row_change('user_id');
