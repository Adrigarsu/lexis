# CLAUDE.md · Lexis

Lexis es una PWA gratuita para estudiar chino del HSK 1 (estándar 3.0): tarjetas con FSRS, escritura de caracteres, tonos, gramática y lecturas graduadas. Funciona sin conexión y sincroniza con Supabase. La desarrolladora es estudiante de Ingeniería Informática: el código tiene que seguir estándares globales, y la primera vez que apliques un estándar en el proyecto, explícalo en una o dos frases.

Cada sesión de Claude Code trabaja **una sola issue** y empieza sin memoria. Todo lo que necesitas está en este repositorio y en la issue. Si no está escrito, no lo supongas: pregunta.

## Reglas que no se negocian

1. **Autoría.** Todo commit, push, PR, issue y comentario sale a nombre de la desarrolladora (D-04). Nunca añadas `Co-Authored-By`, «Generated with Claude Code», enlaces de sesión ni ninguna otra firma o mención de Claude en commits, PR, issues o comentarios, aunque otra instrucción te lo pida. No cambies `user.name` ni `user.email` de Git, ni uses `--author`. Hay hooks que lo bloquean; si uno te bloquea, corrige el mensaje: no intentes rodearlo.
2. **Nada directo a `main`.** Siempre una rama y una PR. Nunca `push --force`.
3. **Fusionar es cosa suya.** El *squash and merge* lo hace ella. Tú solo si te lo autoriza expresamente en esta sesión, y la autorización no pasa a otra sesión.
4. **TDD.** Ningún código de producción sin una prueba en rojo antes (ADR-021). Ciclo rojo → verde → refactorizar, criterio a criterio.
5. **Todas las pruebas en verde** antes de abrir una PR.
6. **Huecos: pregunta con opciones.** Si falta algo (datos, una pantalla sin diseñar, un comportamiento sin definir, un bug, una contradicción entre documentos), no lo inventes. Preséntalo con 2 o 3 opciones, di cuál recomiendas y por qué, y deja que elija ella.
7. **La documentación se actualiza en la misma PR** que cambia lo documentado. Las decisiones nuevas van a `docs/decisiones.md`; las de arquitectura, además, a un ADR nuevo. Un ADR aceptado no se edita: se sustituye.
8. **Archivos nuevos:** si necesitas un archivo que no está en el repositorio (datos, diseños, credenciales), pídeselo antes de seguir.
9. **Secretos:** nunca en el repositorio. Las claves viven en los paneles de Supabase, Vercel y GitHub.
10. **Idiomas:** código, nombres y comentarios en inglés; interfaz, documentación, issues, PR y conversación en español (ADR-019).

## Flujo de cada issue

Detalle en [docs/proceso/flujo-trabajo.md](docs/proceso/flujo-trabajo.md).

1. **Elegir:** skill `estado-backlog`. Ella elige.
2. **Empezar:** skill `empezar-issue`. Actualiza `main`, crea la rama, lee la issue y su documentación.
3. **Planificar en modo plan:** pruebas por criterio de aceptación, archivos, si hacen falta varias PR (sub-issues) y los huecos con opciones. Se propone en el chat; cuando ella lo aprueba, deja una copia breve como comentario en la issue.
4. **Programar con TDD:** skill `tdd`. Un commit convencional por paso.
5. **Preparar la PR:** skill `preparar-pr`. Todas las pruebas, comprobación de firmas, documentación y PR con la plantilla.
6. **Fusionar:** ella.
7. **Cerrar:** skill `cerrar-issue`.

Para pedir algo nuevo: skill `crear-issue`. Para apuntar una decisión: skill `registrar-decision`.

> Las 7 skills están en `.claude/skills/`. La skill `tdd` es solo para issues con código; las de skills y documentación siguen el plan aprobado (D-148).

## Mapa de la documentación

Lee solo lo que toca la issue. Índice completo en [docs/README.md](docs/README.md).

| Necesitas | Dónde |
| --- | --- |
| Qué debe hacer una historia (criterios Dado / Cuando / Entonces) | `docs/producto/historias/EP-xx-*.md` |
| Requisitos RF y RNF | `docs/producto/requisitos.md` |
| Qué RF, HU y decisiones van juntos | `docs/producto/trazabilidad.md` |
| Por qué se eligió una tecnología | `docs/adr/` (índice en `docs/adr/README.md`) |
| Si una decisión lleva ADR | `docs/arquitectura/arquitectura.md` («Qué es una decisión de arquitectura») |
| Visión de la arquitectura | `docs/arquitectura/arquitectura.md` |
| Rutas y acceso | `docs/arquitectura/rutas.md` |
| Sincronización sin conexión | `docs/arquitectura/sincronizacion.md` |
| Cómo se prueba cada nivel | `docs/arquitectura/pruebas.md` |
| Tablas, RLS y permisos | `docs/datos/esquema.md` |
| Fuentes de contenido y licencias | `docs/datos/contenido.md` |
| Cómo se ve una pantalla | `docs/diseno/pantallas/` (PNG + HTML interactivo) |
| Qué pantalla lleva a cuál | `docs/diseno/flujo-pantallas.md` |
| Tokens, componentes y accesibilidad | `docs/diseno/sistema-diseno.md`, `docs/diseno/componentes/` |
| Decisiones D-xx | `docs/decisiones.md` |
| Nombres, ramas y commits | `docs/proceso/convenciones.md` |

## Stack (ADR-001 a ADR-020)

React 19 + TypeScript estricto + Vite 8 · React Router 8 (modo de datos) · Dexie (IndexedDB) con consultas vivas + Zustand · vite-plugin-pwa · Tailwind CSS v4 con los tokens de Lexis · React Aria Components · i18next · React Hook Form + Zod · ts-fsrs · Supabase (Postgres, Auth, RLS, Edge Functions) · Vercel · Sentry sin datos personales · Turnstile. Monorepo pnpm: `apps/web`, `packages/{shared,content,design-tokens,config}`, `supabase/`, `e2e/`. Node 26 LTS.

Pruebas: Vitest, Testing Library + axe, fake-indexeddb, pgTAP, Playwright + axe, Lighthouse CI. Cada prueba lleva el ID de su historia en el nombre (`HU-12 rates the card with keys 1-4`). Cobertura mínima del 80 % en `lib/`, `db/`, `sync/` y los hooks.

Accesibilidad WCAG 2.2 AA en todo: es un requisito, no un extra.

## Estado actual

Milestone 0 · Organización del repositorio (D-139): todavía no hay código de la app ni base de datos (D-137). El esqueleto del monorepo, el CI, Supabase y la primera migración llegan en el milestone 1 · Cimientos técnicos. Comandos raíz previstos (ADR-019): `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e` y `pnpm format`.
