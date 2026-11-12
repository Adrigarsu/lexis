---
name: crear-issue
description: Crea una issue de Lexis en GitHub cuando la desarrolladora pide algo nuevo (una historia, una funcionalidad, un bug, una tarea técnica o un cambio de documentación). Usa la plantilla de .github/ISSUE_TEMPLATE/, pone etiquetas, milestone y dependencias «blocked by», la añade al Project «Lexis» y, si es una funcionalidad nueva, abre la PR de documentación con su RF, su historia y su decisión.
---

# crear-issue

Convierte una petición en una issue lista para el backlog. Nada se crea sin que ella dé el visto bueno al borrador. Flujo general en `docs/proceso/flujo-trabajo.md`; decisiones D-138, D-141 y D-142.

## Reglas

- **Sin firmas.** Ni el título, ni el cuerpo, ni los commits o la PR llevan `Co-Authored-By`, «Generated with», enlaces de sesión ni menciones de Claude (D-04). Si el hook `guard-git.mjs` bloquea un comando, corrige el texto: no lo rodees.
- **Nada directo a `main`.** Si hay que tocar `docs/` (paso 9), se hace en una rama con PR.
- **Huecos con opciones.** Si falta algo (un campo obligatorio, la prioridad, el milestone, una dependencia dudosa), no lo inventes: preséntalo con 2 o 3 opciones y di cuál recomiendas y por qué.
- **Español** en títulos, cuerpos y comentarios (ADR-019).
- Repositorio `Adrigarsu/lexis`, Project «Lexis» número 5 del usuario `Adrigarsu`.

## 1. Elegir la plantilla

Lee la plantilla que toca en `.github/ISSUE_TEMPLATE/` antes de escribir nada: de ella salen el prefijo del título, las secciones, las obligatorias y las etiquetas fijas.

| Petición | Plantilla | Prefijo |
| --- | --- | --- |
| Una historia que ya está en `docs/producto/historias/` | `1-historia.yml` | `HU-xx · ` |
| Algo que no está en los requisitos ni en las historias | `2-funcionalidad.yml` | `Nueva: ` |
| Algo no funciona como dice la documentación | `3-bug.yml` | `Bug: ` |
| Configuración, herramientas, CI, refactorización, skills | `4-tarea.yml` | `Tarea: ` |
| Corregir, completar o reorganizar `docs/` | `5-documentacion.yml` | `Docs: ` |
| Una parte de una issue grande | `6-parte.yml` | `HU-xx · parte n/N: ` |

La plantilla 6 la usa normalmente `empezar-issue` al partir una issue. Si la petición encaja en dos plantillas, pregunta con opciones.

## 2. Buscar duplicados

```sh
gh issue list --state all --search "<palabras clave>" --limit 20
```

Si ya hay una issue igual o muy parecida, enséñasela y pregunta: usar la existente, ampliarla con un comentario o crear otra.

## 3. Leer lo relacionado

Usa el mapa de documentación de `CLAUDE.md` y lee solo lo que toca: la historia y sus criterios, sus RF en `docs/producto/requisitos.md`, la fila de `docs/producto/trazabilidad.md`, las decisiones y ADR, y las pantallas de `docs/diseno/pantallas/`. Para una historia, copia la historia tal como está en `docs/`: no la reescribas.

## 4. Redactar el borrador

**Cuerpo.** `gh issue create --template` no rellena los formularios YAML, así que el cuerpo se escribe a mano con el mismo formato que genera GitHub: una sección por campo, en el orden de la plantilla, con su `label` como encabezado de nivel 3. Los campos opcionales sin respuesta llevan `_No response_`. Los bloques `type: markdown` de la plantilla son ayuda para quien rellena: no se copian.

```markdown
### Objetivo

…

### Criterios de hecho

- [ ] …

### Decisiones y ADR relacionados

D-138 · ADR-019

### Depende de

#11
```

Escríbelo en un archivo del directorio temporal de la sesión (el *scratchpad*), nunca en el repositorio.

**Etiquetas.**
- Las fijas de la plantilla (`tipo:historia`, `tipo:bug`, `tipo:tarea`, `area:docs`…).
- Una `prio:` (`must`, `should`, `could`). En historias y funcionalidades sale del campo de prioridad; en el resto, propónla.
- Una o varias `area:` (`app`, `db`, `content`, `infra`, `docs`).
- `epica:EP-xx` si es una historia o una funcionalidad que cae en una épica.

Comprueba que existen con `gh label list`. No crees etiquetas nuevas sin preguntar.

**Milestone.** Lista los abiertos con `gh api repos/Adrigarsu/lexis/milestones --jq '.[] | "\(.number) \(.title)"'`. Si no está claro a cuál va, pregunta con opciones. Si no va a ninguno todavía, se queda sin milestone.

**Dependencias.** Issues que tienen que estar cerradas antes. Van en la sección «Depende de» y, además, como relación *blocked by* (paso 6). No uses etiquetas para esto.

**Project.** Status `Todo`, Prioridad igual que la etiqueta `prio:` y un Tamaño propuesto (D-141):

| Tamaño | Cuándo |
| --- | --- |
| S | Unas pocas horas: un cambio pequeño y acotado |
| M | Una PR normal |
| L | Probablemente varias PR: más de unas 400 líneas o mezcla áreas (base de datos y pantallas, por ejemplo) |

## 5. Enseñar el borrador y esperar

Muestra en el chat, junto: título, cuerpo, etiquetas, milestone, *blocked by*, Prioridad y Tamaño, y los huecos con sus opciones. Si es una funcionalidad nueva, también los IDs y textos que se añadirían a `docs/` (paso 9). **No ejecutes nada hasta que ella lo apruebe.** Si cambia algo, rehaz el borrador y vuelve a enseñarlo.

## 6. Crear la issue y sus dependencias

```sh
gh issue create --repo Adrigarsu/lexis --title "<título>" --body-file <archivo> \
  --label "tipo:tarea" --label "prio:must" --label "area:infra" --milestone "<título del milestone>"
```

Por cada issue que la bloquea, la relación *blocked by* necesita el `id` numérico de la que bloquea (no su número):

```sh
BLOCKER_ID=$(gh api repos/Adrigarsu/lexis/issues/<bloqueadora> --jq .id)
gh api --method POST repos/Adrigarsu/lexis/issues/<nueva>/dependencies/blocked_by -F issue_id=$BLOCKER_ID
```

Si es una parte (plantilla 6), además se enlaza como sub-issue de la madre:

```sh
SUB_ID=$(gh api repos/Adrigarsu/lexis/issues/<nueva> --jq .id)
gh api --method POST repos/Adrigarsu/lexis/issues/<madre>/sub_issues -F sub_issue_id=$SUB_ID
```

## 7. Añadirla al Project «Lexis»

Los IDs de los campos y de sus opciones no se apuntan aquí: se leen cada vez.

```sh
PROJECT_ID=$(gh project view 5 --owner Adrigarsu --format json --jq .id)
ITEM_ID=$(gh project item-add 5 --owner Adrigarsu --url <url de la issue> --format json --jq .id)
gh project field-list 5 --owner Adrigarsu --format json   # IDs de Status, Prioridad y Tamaño y de sus opciones
gh project item-edit --id $ITEM_ID --project-id $PROJECT_ID --field-id <campo> --single-select-option-id <opción>
```

Un `item-edit` por campo: Status `Todo`, Prioridad y Tamaño.

## 8. Comprobar

```sh
gh issue view <nueva> --json title,labels,milestone,url
gh api repos/Adrigarsu/lexis/issues/<nueva>/dependencies/blocked_by --jq '.[].number'
```

Si algo no ha quedado bien, corrígelo antes de seguir y díselo.

## 9. Solo funcionalidades nuevas: PR de documentación

Una funcionalidad nueva necesita su RF, su historia y, si hace falta, una decisión (o un ADR) en `docs/` antes de programarla. La skill los añade en una PR propia:

1. Antes de nada, `git status`. Si hay cambios sin guardar o estás en la rama de otra issue, para y pregunta qué hacer: no mezcles trabajos.
2. Siguientes IDs libres: el RF más alto en `docs/producto/requisitos.md`, la HU más alta en `docs/producto/historias/` y la D más alta en `docs/decisiones.md`, cada uno más uno. Para un ADR, el siguiente número en `docs/adr/README.md`.
3. Actualiza `main` (`git switch main && git pull --ff-only`) y crea la rama `docs/<n>-<descripcion-corta>`, con `<n>` el número de la issue.
4. Añade el RF a `docs/producto/requisitos.md`, la historia con sus criterios Dado / Cuando / Entonces a la épica que toca en `docs/producto/historias/EP-xx-*.md`, su fila en `docs/producto/trazabilidad.md` y, si hay decisión, su fila arriba de la tabla de `docs/decisiones.md` (actualiza el recuento de la cabecera). Sigue el formato que ya tiene cada archivo.
5. Un commit convencional: `docs(<ámbito>): añadir RF-xx y HU-xx para <funcionalidad>`.
6. `git push -u origin <rama>` y la PR con `.github/pull_request_template.md`. En vez de `Closes #`, pon `Refs #<n>`: la issue sigue abierta hasta que se programe. En «Cómo se ha probado», indica que solo cambia documentación.
7. Edita la issue para que «Cambios en la documentación» apunte a la PR.

La PR la fusiona ella.

## 10. Cerrar

Da el enlace de la issue (y de la PR si la hay) y un resumen de una línea: plantilla, etiquetas, milestone, bloqueos y Tamaño. Recuerda que la siguiente issue se elige con `estado-backlog`.
