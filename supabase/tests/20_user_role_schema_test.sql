-- user_role: role and block of each account (#71, HU-81, D-67, docs/datos/esquema.md).
begin;

select plan(11);

select enum_has_labels(
  'public', 'app_role', array['editor', 'admin'],
  'HU-81 app_role has the editor and admin roles'
);

select has_table('public', 'user_role', 'HU-81 user_role exists');

select col_is_pk('public', 'user_role', 'user_id', 'HU-81 user_id is the primary key');
select fk_ok(
  'public', 'user_role', 'user_id', 'auth', 'users', 'id',
  'HU-81 user_id references auth.users'
);

select col_type_is('public', 'user_role', 'role', 'app_role', 'HU-81 role is an app_role');
select col_is_null('public', 'user_role', 'role', 'HU-81 an empty role means student');
select col_type_is(
  'public', 'user_role', 'blocked_at', 'timestamp with time zone',
  'HU-81 blocked_at is a timestamptz'
);
select col_is_null('public', 'user_role', 'blocked_at', 'HU-81 an account is not blocked by default');
select col_type_is('public', 'user_role', 'blocked_reason', 'text', 'HU-81 blocked_reason is text');
select col_type_is('public', 'user_role', 'granted_by', 'uuid', 'HU-81 granted_by is a uuid');

-- Deleting the Auth account takes its role with it (RF-07).
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-0000000000a1', 'cascade@example.test');
insert into public.user_role (user_id, role)
values ('00000000-0000-0000-0000-0000000000a1', 'admin');
delete from auth.users where id = '00000000-0000-0000-0000-0000000000a1';

select is_empty(
  $$select 1 from public.user_role where user_id = '00000000-0000-0000-0000-0000000000a1'$$,
  'HU-81 the role goes with the deleted account'
);

select * from finish();
rollback;
