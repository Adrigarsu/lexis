# Definición de hecho

Decidida en D-143 y ampliada con los puntos de código en D-160. Es la lista que tiene que cumplir toda PR antes del _squash and merge_. La skill `preparar-pr` la recorre antes de abrir la PR y la desarrolladora la revisa antes de fusionar. Si un punto no se cumple, la PR no se fusiona: se arregla en la misma rama.

Las PR de Dependabot son la excepción: no usan la plantilla ni enlazan issue, y se revisan como explica [flujo-trabajo.md](flujo-trabajo.md#actualizaciones-de-dependencias-dependabot) (D-153).

Tiene dos partes: lo **común**, que vale para toda PR, y lo que **se aplica según lo que toque** la PR. La plantilla de PR ([.github/pull_request_template.md](../../.github/pull_request_template.md)) resume estos puntos como casillas.

## Común: toda PR

### Rama y alcance

- [ ] Sale de una rama `tipo/…` creada desde `main` actualizada, con el nombre de [convenciones.md](convenciones.md#ramas). Nada se sube directamente a `main` y no hay push forzado.
- [ ] Resuelve una sola issue y la enlaza: `Closes #n`. Si es una parte, `Closes #<parte>` y `Part of #<madre>`. Si es la PR de documentación de una funcionalidad nueva, `Refs #n`, porque la issue sigue abierta hasta que se programe.

### Commits y autoría

- [ ] Los commits siguen [Conventional Commits](convenciones.md#commits) (`tipo(ámbito): descripción`, en presente e imperativo) y el título de la PR también, porque será el commit de `main`.
- [ ] Todos los commits salen a nombre de la desarrolladora (D-04), y los hooks de Lefthook están instalados en el clon (`pnpm install`).
- [ ] Ni los commits, ni el título, ni la descripción de la PR llevan `Co-Authored-By`, «Generated with», enlaces de sesión ni otras firmas o menciones de Claude (D-04, D-140).

### Criterios y decisiones

- [ ] Cumple todos los criterios de la issue (de aceptación o de hecho), y cada uno aparece en la tabla «Cómo se ha probado» de la PR con la prueba o comprobación que lo cubre.
- [ ] Los huecos que han salido se han resuelto con la desarrolladora y figuran en «Decisiones tomadas por el camino».
- [ ] Las decisiones nuevas están arriba de la tabla de [decisiones.md](../decisiones.md), con el siguiente ID y el recuento de la cabecera actualizado. Si son de arquitectura, además hay un ADR nuevo en [adr/](../adr/README.md) con su fila en el índice. Un ADR aceptado no se edita: se sustituye.

### Pruebas y CI

- [ ] Todas las pruebas pasan en local, en el orden del CI ([pruebas.md](../arquitectura/pruebas.md)): `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test:coverage`, `pnpm build` y `pnpm test:e2e`, más `pnpm test:db` si la PR toca `supabase/`.
- [ ] El check `ci` de la PR está en verde (D-159). Sin él, el _ruleset_ «main» no deja fusionar.

### Documentación y repositorio

- [ ] Todo lo documentado que cambia la PR está actualizado en la misma PR, incluidos índices como [docs/README.md](../README.md), `CLAUDE.md` y [flujo-trabajo.md](flujo-trabajo.md).
- [ ] No hay secretos (claves, tokens, `.env`) ni datos personales en ningún archivo ni en la descripción.
- [ ] Idiomas según ADR-019: código, nombres y comentarios en inglés; interfaz, documentación, issues y PR en español.
- [ ] La descripción usa la plantilla de PR completa.

## Si aplica

### Solo documentación

- [ ] Los enlaces relativos apuntan a archivos que existen.
- [ ] Los IDs nuevos (RF, HU, D, ADR) son los siguientes libres y no están repetidos.
- [ ] Si se añade o cambia un RF o una HU, la [matriz de trazabilidad](../producto/trazabilidad.md) está al día.

### Código (`apps/`, `packages/`, `supabase/`, `e2e/`)

Decidido en ADR-021 y [pruebas.md](../arquitectura/pruebas.md).

- [ ] Hecho con TDD: cada criterio de aceptación tiene antes una prueba en rojo, y el código de producción llega después (skill `tdd`). Los ajustes sin lógica nueva (D-148, D-151) se comprueban con comandos y un rojo provocado, y lo cuentan en «Cómo se ha probado».
- [ ] Cada prueba de una historia lleva su ID en el nombre (`HU-12 rates the card with keys 1-4`). Las de humo de infraestructura no llevan ID (D-157).
- [ ] La cobertura no baja del 80 % en `lib/`, `db/`, `sync/` y los hooks (`use*`): `pnpm test:coverage` en verde (D-75, D-157).
- [ ] Si toca `supabase/`: cada tabla y política RLS nueva tiene su prueba pgTAP.

### Interfaz (pantallas y componentes)

Accesibilidad WCAG 2.2 AA, como requisito.

- [ ] Sin errores de axe: en los componentes, `expectNoAxeViolations`; en la pantalla, la prueba E2E con `@axe-core/playwright`.
- [ ] Se usa entera con teclado, en un orden lógico, y el foco se ve siempre.
- [ ] Cuando Lighthouse CI esté en el CI: en verde, con 90 o más (RNF-01 a RNF-04).

### Skills de proyecto (`.claude/skills/`)

- [ ] `SKILL.md` tiene frontmatter con `name` y `description`, e instrucciones en español.
- [ ] Prueba en seco (D-142): los casos se escribieron antes que la skill, con lo que debe salir, y el resultado de recorrerla con cada uno está en «Cómo se ha probado».
- [ ] Respeta las reglas de `CLAUDE.md`: sin firmas, nada directo a `main`, huecos con opciones y nada sin el visto bueno de la desarrolladora cuando crea algo en GitHub.

### Ajustes y hooks (Claude Code o Git)

- [ ] Cada regla nueva se ha probado con un caso que debe bloquear y otro que debe pasar, y los dos están en «Cómo se ha probado».

### Plantillas de `.github/`

- [ ] Se ha revisado cómo se ven en GitHub (vista previa del formulario o de la PR).

## Lo que falta

- **Lighthouse CI:** todavía no está en el CI. Su casilla del bloque «Interfaz» se cumple cuando llegue.
- **Revisión manual con VoiceOver** (RNF-21): no es de cada PR, sino de antes de cada versión. Irá en la lista de publicación de versiones, cuando exista.
