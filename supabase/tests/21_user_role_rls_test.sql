-- user_role: each account sees its own row, an admin sees all, and nobody
-- writes through the API (#71, HU-81, docs/datos/esquema.md «Seguridad: permisos y RLS»).
begin;

select plan(7);

select table_privs_are(
  'public', 'user_role', 'authenticated', array['SELECT'],
  'HU-81 authenticated may only select user_role'
);

select table_privs_are(
  'public', 'user_role', 'anon', array[]::text[],
  'HU-81 anon has no privileges on user_role'
);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'student@example.test'),
  ('00000000-0000-0000-0000-0000000000c2', 'other@example.test'),
  ('00000000-0000-0000-0000-0000000000c3', 'admin@example.test');

insert into public.user_role (user_id, role) values
  ('00000000-0000-0000-0000-0000000000c1', null),
  ('00000000-0000-0000-0000-0000000000c2', 'editor'),
  ('00000000-0000-0000-0000-0000000000c3', 'admin');

-- As a student ----------------------------------------------------------------

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000c1", "role": "authenticated"}',
  true
);

select results_eq(
  $$select user_id from public.user_role$$,
  $$values ('00000000-0000-0000-0000-0000000000c1'::uuid)$$,
  'HU-81 a student sees only their own role'
);

select throws_ok(
  $$update public.user_role set role = 'admin'
    where user_id = '00000000-0000-0000-0000-0000000000c1'$$,
  '42501', null,
  'HU-81 a student cannot give themselves a role'
);

-- As an admin -----------------------------------------------------------------

select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000c3", "role": "authenticated"}',
  true
);

select results_eq(
  $$select count(*)::int from public.user_role$$,
  $$values (3)$$,
  'HU-81 an admin sees every role'
);

-- Changes go only through the accounts Edge Function (service_role).
select throws_ok(
  $$insert into public.user_role (user_id, role)
    values ('00000000-0000-0000-0000-0000000000c2', 'admin')$$,
  '42501', null,
  'HU-81 not even an admin writes roles through the API'
);

select throws_ok(
  $$delete from public.user_role where user_id = '00000000-0000-0000-0000-0000000000c2'$$,
  '42501', null,
  'HU-81 not even an admin deletes roles through the API'
);

select * from finish();
rollback;
