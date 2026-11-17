# ADR-026 · Entorno de Vitest para el monorepo

- **Estado:** Aceptado
- **Fecha:** 2026-11-17
- **Registro:** D-157

- **Contexto:** ADR-021 eligió Vitest, Testing Library y axe para las pruebas unitarias, de componentes y de integración, y D-75 pide un 80 % de cobertura en la lógica principal. Al montarlos aparecen cuatro límites:
  - Vitest mide la cobertura de toda la ejecución, no de cada paquete;
  - `vitest-axe`, el adaptador de axe para Vitest, sigue en la versión 0.1.0 y no publica nada desde 2022;
  - jsdom no calcula estilos ni tiene canvas, así que axe no puede medir el contraste;
  - pnpm 12 pasa el `--` a Vitest tal cual, y `pnpm test -- --coverage` no activa la cobertura.
- **Decisión:**
  1. Un `vitest.config.ts` en la raíz declara como proyectos los `apps/*/vitest.config.ts` y `packages/*/vitest.config.ts`. Un paquete entra en las pruebas cuando tiene el suyo. La raíz tiene un `tsconfig.json` que solo incluye ese archivo, para que ESLint lo analice con tipos.
  2. `apps/web` reutiliza su `vite.config.ts` y corre en jsdom, sin globales: `describe`, `it` y `expect` se importan de `vitest`. El _setup_ carga los _matchers_ de jest-dom y `fake-indexeddb/auto`, y limpia Testing Library después de cada prueba.
  3. axe se usa directamente con `axe-core`, a través del helper `expectNoAxeViolations(container)` de `apps/web/src/test/axe.ts`. Si hay violaciones, falla con el ID de cada regla y los nodos afectados.
  4. La cobertura usa v8. Solo se mide `apps/web/src/{lib,db,sync}` y los hooks (`use*.ts(x)`), con un umbral del 80 % por carpeta en líneas, funciones, ramas y sentencias.
  5. Hay dos scripts en la raíz: `pnpm test` y `pnpm test:coverage`.
  6. Las pruebas de humo de infraestructura no llevan ID de historia en el nombre.
- **Consecuencias:**
  - El contraste de color no se comprueba en las pruebas de componentes: lo cubren Playwright + axe y Lighthouse, en un navegador de verdad.
  - Un hook o un archivo de `lib/` sin pruebas hace fallar `pnpm test:coverage`, aunque el resto del proyecto esté cubierto.
  - El helper de axe es código nuestro, de pocas líneas y con sus propias pruebas.

Detalle: [pruebas.md](../arquitectura/pruebas.md#cómo-se-ejecutan).
