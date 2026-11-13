# Definición de hecho

Decidida en D-143. Es la lista que tiene que cumplir toda PR antes del *squash and merge*. La skill `preparar-pr` la recorre antes de abrir la PR y la desarrolladora la revisa antes de fusionar. Si un punto no se cumple, la PR no se fusiona: se arregla en la misma rama.

Tiene dos partes: lo **común**, que vale para toda PR, y lo que **se aplica según lo que toque** la PR. La plantilla de PR ([.github/pull_request_template.md](../../.github/pull_request_template.md)) resume estos puntos como casillas.

## Común: toda PR

### Rama y alcance

- [ ] Sale de una rama `tipo/…` creada desde `main` actualizada, con el nombre de [convenciones.md](convenciones.md#ramas). Nada se sube directamente a `main` y no hay push forzado.
- [ ] Resuelve una sola issue y la enlaza: `Closes #n`. Si es una parte, `Closes #<parte>` y `Part of #<madre>`. Si es la PR de documentación de una funcionalidad nueva, `Refs #n`, porque la issue sigue abierta hasta que se programe.

### Commits y autoría

- [ ] Los commits siguen [Conventional Commits](convenciones.md#commits) (`tipo(ámbito): descripción`, en presente e imperativo) y el título de la PR también, porque será el commit de `main`.
- [ ] Todos los commits salen a nombre de la desarrolladora (D-04), y el hook de Git está activo en el clon (`git config core.hooksPath .githooks`).
- [ ] Ni los commits, ni el título, ni la descripción de la PR llevan `Co-Authored-By`, «Generated with», enlaces de sesión ni otras firmas o menciones de Claude (D-04, D-140).

### Criterios y decisiones

- [ ] Cumple todos los criterios de la issue (de aceptación o de hecho), y cada uno aparece en la tabla «Cómo se ha probado» de la PR con la prueba o comprobación que lo cubre.
- [ ] Los huecos que han salido se han resuelto con la desarrolladora y figuran en «Decisiones tomadas por el camino».
- [ ] Las decisiones nuevas están arriba de la tabla de [decisiones.md](../decisiones.md), con el siguiente ID y el recuento de la cabecera actualizado. Si son de arquitectura, además hay un ADR nuevo en [adr/](../adr/README.md) con su fila en el índice. Un ADR aceptado no se edita: se sustituye.

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

### Skills de proyecto (`.claude/skills/`)

- [ ] `SKILL.md` tiene frontmatter con `name` y `description`, e instrucciones en español.
- [ ] Prueba en seco (D-142): los casos se escribieron antes que la skill, con lo que debe salir, y el resultado de recorrerla con cada uno está en «Cómo se ha probado».
- [ ] Respeta las reglas de `CLAUDE.md`: sin firmas, nada directo a `main`, huecos con opciones y nada sin el visto bueno de la desarrolladora cuando crea algo en GitHub.

### Ajustes y hooks (Claude Code o Git)

- [ ] Cada regla nueva se ha probado con un caso que debe bloquear y otro que debe pasar, y los dos están en «Cómo se ha probado».

### Plantillas de `.github/`

- [ ] Se ha revisado cómo se ven en GitHub (vista previa del formulario o de la PR).

## Lo que falta

Esta definición solo recoge lo que se puede comprobar hoy, en el milestone 0, cuando todavía no hay código, `pnpm` ni CI. Cuando el milestone 1 traiga el monorepo y el CI, se ampliará con los puntos de código según [pruebas.md](../arquitectura/pruebas.md) y ADR-021: TDD, todas las pruebas en verde, cobertura, accesibilidad y rendimiento. Mientras tanto, la plantilla de PR conserva esas casillas marcadas «Si hay código».
