# ADR-017 · Monorepo con pnpm workspaces

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-124

- **Contexto:** la app, la base de datos (migraciones y RLS) y el contenido HSK 1 comparten tipos y esquemas.
- **Decisión:** un solo repositorio con pnpm workspaces: `apps/web` (la PWA), `packages/shared` (tipos y esquemas Zod), `packages/content` (vocabulario, audio y trazos) y `supabase/` (migraciones, políticas y semillas).
- **Consecuencias:** un cambio de esquema se hace en un solo commit y un solo PR. pnpm instala rápido y no duplica dependencias. Vercel compila solo `apps/web`. La estructura de carpetas exacta se cierra en el siguiente paso.
