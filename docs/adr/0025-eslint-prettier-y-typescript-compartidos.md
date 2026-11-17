# ADR-025 · ESLint, Prettier y TypeScript compartidos

- **Estado:** Aceptado
- **Fecha:** 2026-11-17
- **Registro:** D-152
- **Sustituye en parte a:** [ADR-020](0020-versiones-base-a-12-de-noviembre-de-2026.md), solo en la versión de TypeScript que usa ESLint

- **Contexto:** D-75 pide TypeScript estricto, ESLint y Prettier en todo el monorepo. Al montarlos aparecen dos límites:
  - el paquete de TypeScript 7 ya no trae la API de JavaScript, y typescript-eslint solo admite TypeScript `<6.1`;
  - eslint-plugin-react no declara ESLint 10, y eslint-plugin-jsx-a11y solo declara hasta ESLint 9.
- **Decisión:** la configuración vive en `packages/config` y la comparten todos los paquetes:
  1. un `tsconfig.base.json` con `strict`, `noUncheckedIndexedAccess` e `isolatedModules`, que cada paquete hereda cuando tiene código. Las opciones estrictas nuevas se añaden solo cuando hacen falta;
  2. ESLint 10 _flat_ con typescript-eslint `strictTypeChecked` y `stylisticTypeChecked`, `@eslint-react`, `react-hooks` (dueño de las reglas de hooks: se apagan las copias de `@eslint-react`), `jsx-a11y` y `eslint-config-prettier` al final;
  3. `typescript@~6.0.3` solo para typescript-eslint. `typecheck` y `build` siguen con TypeScript 7;
  4. el aviso de peer de `jsx-a11y` se silencia en `pnpm-workspace.yaml`, porque funciona con ESLint 10;
  5. Prettier, con sus valores por defecto más `singleQuote`, formatea todo el repositorio salvo las exportaciones de diseño.
- **Consecuencias:**
  - El repositorio tiene dos TypeScript: TS 7 comprueba los tipos y TS 6.0 alimenta el lint. Cuando typescript-eslint admita TS 7, se quita el 6.0.
  - Las reglas con tipos son más lentas que las sencillas, pero detectan promesas sin esperar y `any` inseguros.
  - Un paquete nuevo solo tiene que extender `@lexis/config/tsconfig.base.json`.

Detalle de los comandos: [convenciones.md](../proceso/convenciones.md#comandos).
