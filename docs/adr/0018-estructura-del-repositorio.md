# ADR-018 · Estructura del repositorio

- **Estado:** Aceptado
- **Fecha:** 2026-11-12
- **Registro:** D-130

- **Contexto:** un solo repositorio público (ADR-017) con la app, la base de datos, el contenido y las pruebas. Tiene que poder leerse sin explicaciones.
- **Decisión:** carpetas por funcionalidad (*feature folders*): cada módulo de la app reúne sus pantallas, componentes, hooks y pruebas. Lo compartido vive en paquetes.
- **Consecuencias:** al trabajar en una historia de usuario se toca casi siempre una sola carpeta. No se usa Turborepo: `pnpm -r` basta mientras el proyecto sea pequeño.

```text
lexis/
├─ apps/
│  └─ web/                    PWA (Vite + React)
│     ├─ public/              iconos, manifiesto, fuentes
│     └─ src/
│        ├─ app/              router, proveedores y layouts
│        ├─ features/         auth, hoy, sesion, tarjetas, escritura, tonos,
│        │                    gramatica, lecturas, listas, progreso, perfil, admin
│        ├─ components/       interfaz compartida (React Aria + Tailwind)
│        ├─ db/               Dexie: esquema y consultas locales
│        ├─ sync/             cola de cambios y sincronización
│        ├─ lib/              FSRS, pinyin, fechas, utilidades
│        └─ i18n/             es.json
├─ packages/
│  ├─ shared/                 tipos y esquemas Zod del dominio
│  ├─ content/                HSK 1, componentes, trazos, audio y scripts de importación
│  ├─ design-tokens/          tokens.json → variables CSS y tema de Tailwind
│  └─ config/                 ESLint, TypeScript y Prettier compartidos
├─ supabase/
│  ├─ migrations/             SQL versionado
│  ├─ functions/              Edge Functions (notificaciones, cuentas)
│  ├─ tests/                  pruebas de políticas RLS
│  └─ seed.sql
├─ e2e/                       pruebas de extremo a extremo (Playwright)
├─ docs/adr/                  los ADR en Markdown
├─ .github/                   CI, plantillas de issue y PR, Dependabot
└─ package.json, pnpm-workspace.yaml, .nvmrc, .editorconfig,
   LICENSE (MIT), NOTICE, README.md
```
