# ADR-024 · pnpm sin Corepack

- **Estado:** Aceptado
- **Fecha:** 2026-11-17
- **Registro:** D-150
- **Sustituye en parte a:** [ADR-020](0020-versiones-base-a-12-de-noviembre-de-2026.md), solo en cómo se fija pnpm

- **Contexto:** ADR-020 fija pnpm en `packageManager` con Corepack, pero Node.js dejó de traer Corepack a partir de la versión 25, así que en Node 26 no está disponible.
- **Decisión:** pnpm se sigue fijando en el campo `packageManager` del `package.json` raíz (`pnpm@12.21.0`), sin Corepack. pnpm se instala una vez con `npm i -g pnpm`, y él mismo cambia a la versión de `packageManager` (opción `manage-package-manager-versions`, activa por defecto). En el CI, `pnpm/action-setup` lee el mismo campo.
- **Consecuencias:** el ordenador de la desarrolladora y el CI usan la misma versión de pnpm sin depender de una herramienta que Node ya no mantiene. Actualizar pnpm es cambiar una línea del `package.json`, y Dependabot puede proponerlo.
