-- profile: a blocked account cannot read, create or edit its profile
-- (#71, HU-81, D-67, docs/datos/esquema.md «Seguridad: permisos y RLS»).
begin;

select plan(4);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'blocked@example.test'),
  ('00000000-0000-0000-0000-0000000000e2', 'new-blocked@example.test');

insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
values ('00000000-0000-0000-0000-0000000000e1', 'bruno', now(), now());

insert into public.user_role (user_id, blocked_at, blocked_reason) values
  ('00000000-0000-0000-0000-0000000000e1', now(), 'spam'),
  ('00000000-0000-0000-0000-0000000000e2', now(), 'spam');

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}',
  true
);

select is_empty(
  $$select 1 from public.profile$$,
  'HU-81 a blocked account cannot read its profile'
);

update public.profile set timezone = 'Europe/Madrid'
where id = '00000000-0000-0000-0000-0000000000e1';

select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000e2", "role": "authenticated"}',
  true
);

select throws_ok(
  $$insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
    values ('00000000-0000-0000-0000-0000000000e2', 'berta', now(), now())$$,
  '42501', null,
  'HU-81 a blocked account cannot create its profile'
);

reset role;

select is(
  (select timezone from public.profile where id = '00000000-0000-0000-0000-0000000000e1'),
  null,
  'HU-81 a blocked account cannot edit its profile'
);

-- Unblocking gives the profile back.
update public.user_role set blocked_at = null, blocked_reason = null
where user_id = '00000000-0000-0000-0000-0000000000e1';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}',
  true
);

select isnt_empty(
  $$select 1 from public.profile$$,
  'HU-81 an unblocked account reads its profile again'
);

select * from finish();
rollback;
