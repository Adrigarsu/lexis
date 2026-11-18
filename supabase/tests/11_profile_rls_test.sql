-- profile: each user reads and edits only their own profile; anon sees nothing
-- (#30, D-33, docs/datos/esquema.md «Seguridad: permisos y RLS»).
begin;

select plan(11);

-- Privileges (first lock: what the API sees) -------------------------------

select table_privs_are(
  'public', 'profile', 'authenticated', array['SELECT', 'INSERT', 'UPDATE'],
  'authenticated may select, insert and update profile, never delete'
);

select table_privs_are(
  'public', 'profile', 'anon', array[]::text[],
  'anon has no privileges on profile'
);

-- Fixtures, as the table owner ------------------------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'b@example.test'),
  ('00000000-0000-0000-0000-00000000000c', 'c@example.test');

insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
values ('00000000-0000-0000-0000-00000000000b', 'bea', now(), now());

-- As user A (second lock: which rows) -------------------------------------------

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-00000000000a", "role": "authenticated"}',
  true
);

select lives_ok(
  $$insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
    values ('00000000-0000-0000-0000-00000000000a', 'ana', now(), now())$$,
  'the owner can create their profile'
);

select results_eq(
  $$select id from public.profile$$,
  $$values ('00000000-0000-0000-0000-00000000000a'::uuid)$$,
  'the owner sees only their own profile'
);

select lives_ok(
  $$update public.profile set timezone = 'Europe/Madrid'
    where id = '00000000-0000-0000-0000-00000000000a'$$,
  'the owner can update their profile'
);

select is(
  (select timezone from public.profile where id = '00000000-0000-0000-0000-00000000000a'),
  'Europe/Madrid',
  'the owner''s update is saved'
);

update public.profile set timezone = 'Asia/Shanghai'
where id = '00000000-0000-0000-0000-00000000000b';

select throws_ok(
  $$insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
    values ('00000000-0000-0000-0000-00000000000c', 'carla', now(), now())$$,
  '42501', null,
  'a user cannot create a profile for someone else'
);

select throws_ok(
  $$delete from public.profile where id = '00000000-0000-0000-0000-00000000000a'$$,
  '42501', null,
  'a user cannot delete a profile'
);

-- As anon ------------------------------------------------------------------------

reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true);

select throws_ok(
  $$select * from public.profile$$,
  '42501', null,
  'anon cannot read profiles'
);

-- Back as the table owner, to check what A could not change ---------------------

reset role;

select is(
  (select timezone from public.profile where id = '00000000-0000-0000-0000-00000000000b'),
  null,
  'another user''s update does not reach the profile'
);

select is_empty(
  $$select 1 from public.profile where id = '00000000-0000-0000-0000-00000000000c'$$,
  'no profile was created for someone else'
);

select * from finish();

rollback;
