-- Role functions: what the policies trust instead of the client
-- (#71, HU-81, D-67, docs/datos/esquema.md «Seguridad: permisos y RLS»).
begin;

select plan(21);

-- They read user_role with the owner's rights and cannot be hijacked by search_path.
select is_definer('public', 'is_admin', array[]::name[], 'HU-81 is_admin is security definer');
select is_definer('public', 'is_editor', array[]::name[], 'HU-81 is_editor is security definer');
select is_definer('public', 'is_blocked', array[]::name[], 'HU-81 is_blocked is security definer');

select is(
  (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname in ('is_admin', 'is_editor', 'is_blocked')
     and p.proconfig @> array['search_path=""']),
  3,
  'HU-81 the role functions run with an empty search_path'
);

-- Fixtures: no row, student, editor, admin and a blocked student.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b0', 'none@example.test'),
  ('00000000-0000-0000-0000-0000000000b1', 'student@example.test'),
  ('00000000-0000-0000-0000-0000000000b2', 'editor@example.test'),
  ('00000000-0000-0000-0000-0000000000b3', 'admin@example.test'),
  ('00000000-0000-0000-0000-0000000000b4', 'blocked@example.test');

insert into public.user_role (user_id, role, blocked_at, blocked_reason) values
  ('00000000-0000-0000-0000-0000000000b1', null, null, null),
  ('00000000-0000-0000-0000-0000000000b2', 'editor', null, null),
  ('00000000-0000-0000-0000-0000000000b3', 'admin', null, null),
  ('00000000-0000-0000-0000-0000000000b4', null, now(), 'spam');

-- Runs the three functions as the given user and returns them as a row.
create function pg_temp.roles_of(user_id uuid)
returns table (admin boolean, editor boolean, blocked boolean)
language plpgsql
as $$
begin
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', user_id, 'role', 'authenticated')::text,
    true
  );
  set local role authenticated;
  return query select public.is_admin(), public.is_editor(), public.is_blocked();
  reset role;
end;
$$;

grant execute on function pg_temp.roles_of(uuid) to authenticated;

select is((select admin from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b0')), false, 'HU-81 no row: not admin');
select is((select editor from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b0')), false, 'HU-81 no row: not editor');
select is((select blocked from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b0')), false, 'HU-81 no row: not blocked');

select is((select admin from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b1')), false, 'HU-81 student: not admin');
select is((select editor from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b1')), false, 'HU-81 student: not editor');
select is((select blocked from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b1')), false, 'HU-81 student: not blocked');

select is((select admin from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b2')), false, 'HU-81 editor: not admin');
select is((select editor from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b2')), true, 'HU-81 editor: editor');
select is((select blocked from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b2')), false, 'HU-81 editor: not blocked');

select is((select admin from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b3')), true, 'HU-81 admin: admin');
select is((select editor from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b3')), true, 'HU-81 admin: also counts as editor');
select is((select blocked from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b3')), false, 'HU-81 admin: not blocked');

select is((select admin from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b4')), false, 'HU-81 blocked: not admin');
select is((select editor from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b4')), false, 'HU-81 blocked: not editor');
select is((select blocked from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b4')), true, 'HU-81 blocked: blocked');

-- Role and block are independent: blocking does not take the role away.
update public.user_role set role = 'admin' where user_id = '00000000-0000-0000-0000-0000000000b4';
select is((select admin from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b4')), true, 'HU-81 a blocked admin keeps the role');
select is((select blocked from pg_temp.roles_of('00000000-0000-0000-0000-0000000000b4')), true, 'HU-81 a blocked admin is still blocked');

select * from finish();
rollback;
