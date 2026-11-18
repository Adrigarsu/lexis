-- audit_log: who changed which account and when; nobody edits it through the API
-- (#71, HU-81, RNF-14, D-164, docs/datos/esquema.md «Auditoría»).
begin;

select plan(13);

select table_privs_are(
  'public', 'audit_log', 'authenticated', array['SELECT'],
  'HU-81 authenticated may only select audit_log'
);

select table_privs_are(
  'public', 'audit_log', 'anon', array[]::text[],
  'HU-81 anon has no privileges on audit_log'
);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'student@example.test'),
  ('00000000-0000-0000-0000-0000000000d2', 'editor@example.test'),
  ('00000000-0000-0000-0000-0000000000d3', 'admin@example.test');

insert into public.user_role (user_id, role) values
  ('00000000-0000-0000-0000-0000000000d2', 'editor'),
  ('00000000-0000-0000-0000-0000000000d3', 'admin');

-- The admin gives the student a role, changes it and takes the row away.
select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000d3", "role": "authenticated"}',
  true
);

insert into public.user_role (user_id, role)
values ('00000000-0000-0000-0000-0000000000d1', 'editor');
update public.user_role set blocked_at = now(), blocked_reason = 'spam'
where user_id = '00000000-0000-0000-0000-0000000000d1';
delete from public.user_role where user_id = '00000000-0000-0000-0000-0000000000d1';

select results_eq(
  $$select action from public.audit_log
    where table_name = 'user_role' and row_id = '00000000-0000-0000-0000-0000000000d1'
    order by id$$,
  $$values ('INSERT'), ('UPDATE'), ('DELETE')$$,
  'HU-81 every change to a role is logged'
);

select is(
  (select actor_id from public.audit_log
   where row_id = '00000000-0000-0000-0000-0000000000d1' and action = 'INSERT'),
  '00000000-0000-0000-0000-0000000000d3'::uuid,
  'HU-81 the log keeps who made the change'
);

select ok(
  (select old is null and new ->> 'role' = 'editor' from public.audit_log
   where row_id = '00000000-0000-0000-0000-0000000000d1' and action = 'INSERT'),
  'HU-81 an insert keeps the new row'
);

select ok(
  (select old ->> 'blocked_at' is null and new ->> 'blocked_reason' = 'spam' from public.audit_log
   where row_id = '00000000-0000-0000-0000-0000000000d1' and action = 'UPDATE'),
  'HU-81 an update keeps the row before and after'
);

select ok(
  (select old ->> 'role' = 'editor' and new is null from public.audit_log
   where row_id = '00000000-0000-0000-0000-0000000000d1' and action = 'DELETE'),
  'HU-81 a delete keeps the old row'
);

select isnt(
  (select at from public.audit_log
   where row_id = '00000000-0000-0000-0000-0000000000d1' and action = 'INSERT'),
  null,
  'HU-81 the log keeps when it happened'
);

-- As a student: nothing to read ---------------------------------------------------

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000d1", "role": "authenticated"}',
  true
);

select is_empty($$select 1 from public.audit_log$$, 'HU-81 a student cannot read the log');

-- As an editor: reads, but cannot touch it ------------------------------------------

select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000d2", "role": "authenticated"}',
  true
);

select isnt_empty($$select 1 from public.audit_log$$, 'HU-81 an editor can read the log');

-- As an admin: reads, but cannot touch it either ---------------------------------------

select set_config(
  'request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-0000000000d3", "role": "authenticated"}',
  true
);

select isnt_empty($$select 1 from public.audit_log$$, 'HU-81 an admin can read the log');

select throws_ok(
  $$update public.audit_log set action = 'INSERT'$$,
  '42501', null,
  'HU-81 not even an admin edits the log'
);

select throws_ok(
  $$delete from public.audit_log$$,
  '42501', null,
  'HU-81 not even an admin deletes the log'
);

select * from finish();
rollback;
