# ADR-002 · Supabase como nube

- **Estado:** Aceptado
- **Fecha:** 2026-11-08
- **Registro:** D-17

- **Contexto:** hacen falta cuentas, copia en la nube y un panel de administración, sin servidor propio y gratis.
- **Decisión:** Supabase gratis: Postgres, Auth y seguridad por fila (RLS).
- **Consecuencias:** 500 MB de base de datos, 50.000 usuarios activos al mes y 5 GB de transferencia. El proyecto se pausa tras 7 días sin actividad. Los proyectos creados desde el 30 de mayo de 2026 necesitan permisos de Postgres explícitos para la API.
