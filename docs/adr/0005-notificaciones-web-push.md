# ADR-005 · Notificaciones Web Push

- **Estado:** Aceptado
- **Fecha:** 2026-11-08
- **Registro:** D-30, D-66

- **Contexto:** cuatro avisos (diario, racha en riesgo, resumen semanal, repasos acumulados) que deben llegar aunque la app esté cerrada.
- **Decisión:** pg_cron lanza cada 15 minutos una Edge Function de Supabase que decide a quién avisar y envía Web Push con claves VAPID (D-66).
- **Consecuencias:** todo dentro del plan gratuito de Supabase. En iPhone solo funciona con la PWA instalada en la pantalla de inicio. Las claves VAPID viven en los secretos de Supabase.
