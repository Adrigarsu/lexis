-- Guard: every table in public has row level security on (#30, D-33,
-- docs/datos/esquema.md «Seguridad: permisos y RLS»).
begin;

select plan(1);

select is_empty(
  $$select c.relname
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p')
      and not c.relrowsecurity$$,
  'every table in public has row level security enabled'
);

select * from finish();

rollback;
