-- Smoke test: the local database is up and pgTAP runs (#29).
begin;

select plan(2);

select has_schema('public', 'the public schema exists');

select ok(
  current_setting('server_version_num')::int >= 170000,
  'the database runs Postgres 17 or later, like the cloud project'
);

select * from finish();

rollback;
