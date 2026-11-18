-- profile table and the shared updated_at trigger (#30, docs/datos/esquema.md).
begin;

select plan(31);

-- Structure ---------------------------------------------------------------

select has_table('public', 'profile', 'the profile table exists');

select columns_are(
  'public', 'profile',
  array[
    'id', 'username', 'age_confirmed_at', 'privacy_accepted_at', 'timezone',
    'minutes_per_day', 'new_per_day', 'rest_days_per_week', 'study_settings',
    'created_at', 'updated_at', 'client_updated_at'
  ],
  'profile has exactly the documented columns'
);

select col_is_pk('public', 'profile', 'id', 'id is the primary key');
select col_type_is('public', 'profile', 'id', 'uuid', 'id is a uuid');
select fk_ok('public', 'profile', 'id', 'auth', 'users', 'id', 'id references auth.users');

select col_not_null('public', 'profile', 'username', 'username is required');
select col_not_null('public', 'profile', 'age_confirmed_at', 'age confirmation is required');
select col_not_null('public', 'profile', 'privacy_accepted_at', 'privacy acceptance is required');
select col_type_is('public', 'profile', 'age_confirmed_at', 'timestamp with time zone', 'age_confirmed_at is a timestamptz');

select col_is_null('public', 'profile', 'timezone', 'timezone may be empty until it is set');
select col_is_null('public', 'profile', 'minutes_per_day', 'minutes_per_day may be empty until the welcome');
select col_is_null('public', 'profile', 'new_per_day', 'new_per_day may be empty until the welcome');
select col_hasnt_default('public', 'profile', 'minutes_per_day', 'minutes_per_day has no default');
select col_hasnt_default('public', 'profile', 'new_per_day', 'new_per_day has no default');

select col_default_is('public', 'profile', 'rest_days_per_week', '2', 'two rest days per week by default (D-36)');
select col_type_is('public', 'profile', 'study_settings', 'jsonb', 'study_settings is jsonb');
select col_default_is('public', 'profile', 'study_settings', '''{}''::jsonb', 'study_settings is empty by default');

select col_type_is('public', 'profile', 'created_at', 'timestamp with time zone', 'created_at is a timestamptz');
select col_type_is('public', 'profile', 'updated_at', 'timestamp with time zone', 'updated_at is a timestamptz');
select col_type_is('public', 'profile', 'client_updated_at', 'timestamp with time zone', 'client_updated_at is a timestamptz');

-- Behaviour ---------------------------------------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'b@example.test');

insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at, updated_at)
values ('00000000-0000-0000-0000-00000000000a', 'Ana', now(), now(), '2000-01-01T00:00:00Z');

select is(
  (select rest_days_per_week from public.profile where username = 'Ana'),
  2::smallint,
  'a new profile gets two rest days'
);

select throws_ok(
  $$insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
    values ('00000000-0000-0000-0000-00000000000b', 'ana', now(), now())$$,
  '23505', null,
  'usernames are unique regardless of case'
);

select throws_ok(
  $$insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
    values ('00000000-0000-0000-0000-00000000000b', 'ab', now(), now())$$,
  '23514', null,
  'a username shorter than 3 characters is rejected'
);

select throws_ok(
  $$insert into public.profile (id, username, age_confirmed_at, privacy_accepted_at)
    values ('00000000-0000-0000-0000-00000000000b', repeat('x', 31), now(), now())$$,
  '23514', null,
  'a username longer than 30 characters is rejected'
);

select throws_ok(
  $$update public.profile set minutes_per_day = 0 where username = 'Ana'$$,
  '23514', null,
  'minutes_per_day must be positive'
);

select throws_ok(
  $$update public.profile set new_per_day = 0 where username = 'Ana'$$,
  '23514', null,
  'new_per_day must be positive'
);

select throws_ok(
  $$update public.profile set rest_days_per_week = 7 where username = 'Ana'$$,
  '23514', null,
  'rest_days_per_week is at most 6'
);

select throws_ok(
  $$update public.profile set rest_days_per_week = -1 where username = 'Ana'$$,
  '23514', null,
  'rest_days_per_week is at least 0'
);

select has_trigger('public', 'profile', 'set_updated_at', 'profile keeps updated_at with a trigger');

update public.profile set timezone = 'Europe/Madrid' where username = 'Ana';

select ok(
  (select updated_at > '2000-01-01T00:00:00Z' from public.profile where username = 'Ana'),
  'updating a profile moves updated_at forward'
);

delete from auth.users where id = '00000000-0000-0000-0000-00000000000a';

select is_empty(
  $$select 1 from public.profile where id = '00000000-0000-0000-0000-00000000000a'$$,
  'deleting the account deletes its profile'
);

select * from finish();

rollback;
