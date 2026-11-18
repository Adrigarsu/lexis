# Alta de cuentas y roles

Mientras el registro esté cerrado (D-163, ADR-027), las cuentas las da de alta la desarrolladora a mano en Supabase. Esta guía cubre el alta, los roles, el bloqueo y lo que queda auditado (HU-81, D-173).

Todo se hace en el panel del proyecto de Supabase en la nube. En local funciona igual, desde Studio (`pnpm exec supabase start`, y Studio en el puerto que indica `supabase status`).

## Dar de alta una cuenta

1. **Authentication → Users → Add user → Create new user.**
2. Escribe el email y una contraseña provisional.
3. Marca **Auto Confirm User**, para que el email quede confirmado: sin SMTP propio no se envía ningún correo de verificación (D-163).
4. Pasa la contraseña a la persona por un canal privado y pídele que la cambie cuando exista la pantalla de cuenta. Hasta entonces, si la olvida, se la cambias desde el mismo panel.

La cuenta nueva es **estudiante**: no tiene fila en `user_role`, y eso equivale a no tener rol.

## Asignar un rol

Los roles son `editor` y `admin` (enum `app_role`). Ser admin incluye todo lo que puede hacer un editor. Por la API nadie puede cambiar `user_role`, ni siquiera un admin: hasta que exista la Edge Function de cuentas, se cambia con SQL desde **SQL Editor**, que se ejecuta como propietario de la base.

Busca el id de la cuenta en **Authentication → Users** y ejecuta:

```sql
insert into public.user_role (user_id, role)
values ('<id de la cuenta>', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Para quitar el rol, deja `role` vacío:

```sql
update public.user_role set role = null where user_id = '<id de la cuenta>';
```

## Bloquear y desbloquear

Una cuenta bloqueada no puede leer ni editar sus datos: las políticas exigen `not is_blocked()`. El bloqueo no quita el rol, son independientes: para cortar el acceso de un admin, bloquéalo y quítale también el rol.

```sql
insert into public.user_role (user_id, blocked_at, blocked_reason)
values ('<id de la cuenta>', now(), '<motivo>')
on conflict (user_id) do update
set blocked_at = excluded.blocked_at, blocked_reason = excluded.blocked_reason;

-- Desbloquear
update public.user_role set blocked_at = null, blocked_reason = null
where user_id = '<id de la cuenta>';
```

## Qué queda auditado

Cada cambio en `user_role` (alta, cambio y borrado de la fila) queda en `audit_log` con la fecha, la acción y la fila de antes y de después. Lo hace un trigger, no la app, y nadie puede editarlo ni borrarlo desde la API (D-164). Los cambios hechos desde el SQL Editor no tienen sesión, así que quedan con `actor_id` vacío.

```sql
select at, action, actor_id, old, new
from public.audit_log
where table_name = 'user_role'
order by at desc;
```

## Borrar una cuenta

Desde **Authentication → Users → Delete user**. Su perfil y su fila de `user_role` se borran en cascada. En `audit_log` queda el borrado de su rol.
