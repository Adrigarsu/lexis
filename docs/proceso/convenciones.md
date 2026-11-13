# Convenciones

Decididas en [ADR-019](../adr/0019-convenciones-de-codigo-y-de-git.md).

## Nombres y archivos

| Qué | Convención | Ejemplo |
| --- | --- | --- |
| Componentes | PascalCase, un componente por archivo `.tsx` | `RatingButtons.tsx` |
| Hooks | camelCase con `use` | `useDueCards.ts` |
| Otros archivos y carpetas | kebab-case | `fsrs-scheduler.ts` |
| Variables y funciones | camelCase | `nextReviewAt` |
| Constantes globales | UPPER_SNAKE_CASE | `MAX_NEW_PER_DAY` |
| Tipos e interfaces | PascalCase, sin prefijo `I` | `ReviewLog` |
| Tablas y columnas | snake_case en inglés (fase 3) | `review_log.reviewed_at` |
| Claves de traducción | por módulo con puntos | `session.rate.again` |
| Pruebas | junto al código, `*.test.ts(x)`; E2E en `e2e/*.spec.ts` | `rating-buttons.test.tsx` |
| Ramas | `tipo/HU-xx-descripcion` desde `main` | `feat/HU-12-valorar-tarjeta` |
| Commits | Conventional Commits con el módulo como ámbito | `feat(sesion): valorar con teclas 1-4` |

Flujo de Git: GitHub Flow. `main` está protegida y solo recibe cambios por PR con el CI en verde, fusionados con *squash*. Cada PR enlaza su historia de usuario y cierra su issue. Lefthook ejecuta lint y formato antes de cada commit, y commitlint revisa el mensaje. Las versiones siguen SemVer con etiquetas y un changelog generado de los commits. Todo commit, push y PR se hace desde la cuenta de la desarrolladora, sin coautorías (D-04).

Comandos raíz: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e` y `pnpm format`.

## Commits

Formato [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/): `tipo(ámbito): descripción`, en presente e imperativo, sin punto final.

| Tipo | Para qué |
| --- | --- |
| `feat` | Funcionalidad nueva para el usuario |
| `fix` | Corrección de un error |
| `test` | Añadir o cambiar pruebas (paso rojo de TDD) |
| `refactor` | Cambiar código sin cambiar lo que hace |
| `docs` | Solo documentación |
| `style` | Formato, sin cambios de lógica |
| `perf` | Mejora de rendimiento |
| `build` | Dependencias, empaquetado |
| `ci` | GitHub Actions |
| `chore` | Mantenimiento que no encaja en lo anterior |

El ámbito es el módulo (`sesion`, `tarjetas`, `escritura`, `sync`, `db`…). Si una PR cierra una historia, el título de la PR lleva el ID: `feat(sesion): valorar con teclas 1-4 (HU-12)`. Ese título es el mensaje del commit de `main` (squash).

**Nunca** se añaden líneas `Co-Authored-By` ni «Generated with» de Claude: todo sale a nombre de la desarrolladora (D-04).

## Ramas

`tipo/HU-xx-descripcion-corta` desde `main` actualizada; para una parte de una issue grande, `tipo/HU-xx-n-descripcion` (por ejemplo `feat/HU-12-1-fsrs`). Las issues sin historia usan su número: `chore/3-skill-crear-issue`. La descripción va en kebab-case, en español y sin tildes.

El tipo depende de la plantilla de la issue (D-144). La rama la crea la skill `empezar-issue`.

| Plantilla | Rama | Ejemplo |
| --- | --- | --- |
| Historia o funcionalidad | `feat/HU-xx-descripcion` | `feat/HU-12-valorar-tarjeta` |
| Bug | `fix/<n>-descripcion`, o `fix/HU-xx-descripcion` si es de una historia | `fix/31-sesion-ultima-tarjeta` |
| Tarea | `chore/<n>-descripcion`, o `ci/` o `build/` si encaja mejor | `chore/6-skill-empezar-issue` |
| Documentación | `docs/<n>-descripcion` | `docs/4-definicion-de-hecho` |
| Parte | la rama de la madre con el número de parte | `feat/HU-12-2-botones` |

## Idiomas

Código, nombres y comentarios en inglés; interfaz (con i18next), documentación, issues y PR en español; rutas en español.
