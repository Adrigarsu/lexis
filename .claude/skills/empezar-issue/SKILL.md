---
name: empezar-issue
description: Empieza y planifica una issue de Lexis cuando la desarrolladora dice «empieza la issue N». Comprueba que no está cerrada ni bloqueada, detecta si ya estaba empezada para retomarla, actualiza main, crea la rama, lee la issue y su documentación (historia, RF, decisiones, ADR, pantallas, madre si es una parte) y propone el plan en modo plan. Aprobado el plan, lo comenta en la issue, la mueve a In Progress, revisa el Tamaño y crea las sub-issues si hay que partirla.
---

# empezar-issue

Pasos 2 y 3 del flujo de `docs/proceso/flujo-trabajo.md`: **empezar** y **planificar**. Decisiones D-138, D-141, D-142 y D-144. Termina cuando el plan está aprobado y comentado; lo siguiente es programar (skill `tdd`).

## Reglas

- **Sin firmas.** Ni los comentarios, ni las sub-issues, ni los commits llevan `Co-Authored-By`, «Generated with», enlaces de sesión ni menciones de Claude (D-04). Si el hook `guard-git.mjs` bloquea un comando, corrige el texto: no lo rodees. Ojo: un comando que *busca* esas palabras también se bloquea.
- **Nada directo a `main`.** Todo el trabajo va en la rama de la issue.
- **Huecos con opciones.** Lo que la issue y `docs/` no resuelven se pregunta con 2 o 3 opciones y la recomendada, antes de cerrar el plan.
- **Nada en GitHub sin plan aprobado:** ni comentarios, ni cambios en el Project, ni sub-issues.
- Repositorio `Adrigarsu/lexis`, Project «Lexis» número 5 del usuario `Adrigarsu`.

## 1. Leer la issue

```sh
gh issue view N --json number,title,body,labels,milestone,state,parent,subIssues,closedByPullRequestsReferences
gh issue view N --comments
```

La plantilla se reconoce por el prefijo del título y por las etiquetas: `HU-xx · ` (historia), `Nueva: ` (funcionalidad), `Bug: `, `Tarea: `, `Docs: ` o `HU-xx · parte n/N: ` (parte, con `parent`).

## 2. Comprobar el estado

En este orden:

1. **Cerrada:** avisa y no sigas.
2. **Bloqueada:**
   ```sh
   gh api repos/Adrigarsu/lexis/issues/N/dependencies/blocked_by --jq '.[] | "#\(.number) \(.state) \(.title)"'
   ```
   Si alguna sigue abierta, para. Di qué la bloquea y propón las issues del mismo milestone que están listas, es decir, abiertas y sin bloqueos abiertos. No crees la rama.
3. **Ya empezada.** Cualquiera de estas señales:
   - una rama local o remota de la issue. Busca con la barra delante del número, para que `1` no encuentre `chore/11-…`: `git branch --list "*/N-*"` y `git ls-remote --heads origin "*/N-*"`. En historias y partes, busca `"*/HU-xx-*"`;
   - un comentario que empieza por «### Plan aprobado» (`gh issue view N --json comments --jq '[.comments[].body | startswith("### Plan aprobado")] | any'`);
   - una PR enlazada: `closedByPullRequestsReferences` del paso 1, o `gh pr list --state all --head <rama>` si has encontrado la rama.

   Si hay alguna, **no vuelvas a planificar: retoma**. Cambia a la rama (`git switch <rama>`; si solo está en remoto, `git switch --track origin/<rama>`). Lee el plan comentado y los commits (`git log --oneline main..HEAD`), comprueba si la rama está subida y si la PR existe, y resume qué está hecho y qué queda. Después pregunta si seguir. Si algo no cuadra, pregunta con opciones: cambios sin guardar de otra cosa, una PR cerrada sin fusionar, una rama sin plan.

## 3. Preparar Git

1. `git status`. Si hay cambios sin guardar, o estás en la rama de otra issue con commits sin subir, para y pregunta: no mezcles trabajos.
2. `git switch main && git pull --ff-only origin main`.
3. Crea la rama según la plantilla (D-144, `docs/proceso/convenciones.md`):

| Plantilla | Rama | Ejemplo |
| --- | --- | --- |
| Historia o funcionalidad | `feat/HU-xx-descripcion` | `feat/HU-12-valorar-tarjeta` |
| Bug | `fix/<n>-descripcion`, o `fix/HU-xx-descripcion` si es de una historia | `fix/31-sesion-ultima-tarjeta` |
| Tarea | `chore/<n>-descripcion`, o `ci/` o `build/` si encaja mejor | `chore/6-skill-empezar-issue` |
| Documentación | `docs/<n>-descripcion` | `docs/4-definicion-de-hecho` |
| Parte | la rama de la madre con el número de parte | `feat/HU-12-2-botones` |

La descripción, corta, en kebab-case y en español, sin tildes.

## 4. Leer la documentación

Usa el mapa de `CLAUDE.md` y lee solo lo que toca:

- **Historia o funcionalidad:**
  - su bloque en `docs/producto/historias/EP-xx-*.md` (criterios Dado / Cuando / Entonces);
  - sus RF en `docs/producto/requisitos.md` y su fila en `docs/producto/trazabilidad.md`;
  - las decisiones de `docs/decisiones.md` y los ADR de `docs/adr/`;
  - sus pantallas en `docs/diseno/pantallas/README.md`: el PNG para ver cómo es y el HTML para los textos y estados;
  - `docs/diseno/flujo-pantallas.md`, y `docs/arquitectura/rutas.md` si cambia una ruta.
- **Bug:** la HU, el RF o la D que define lo que debería pasar.
- **Tarea o documentación:** las decisiones y los ADR citados, y los documentos que va a cambiar.
- **Parte:** la issue madre, su comentario «Plan aprobado» y las PR de las partes ya fusionadas (`gh issue view <madre> --json subIssues`). Planifica solo esta parte.
- **Según lo que toque:**
  - `docs/arquitectura/pruebas.md` para saber en qué nivel va cada prueba;
  - `docs/datos/esquema.md` si toca la base de datos;
  - `docs/arquitectura/sincronizacion.md` si toca la sincronización;
  - `docs/proceso/definicion-de-hecho.md` siempre.

Si falta algo, es un hueco (reglas 6 y 8 de `CLAUDE.md`): una pantalla sin diseñar, un dato, un archivo que no está en el repositorio, o dos documentos que se contradicen.

## 5. Planificar en modo plan

Entra en modo plan (`EnterPlanMode`). Pregunta los huecos con opciones **antes** de cerrar el plan; después preséntalo con `ExitPlanMode`. El plan lleva:

1. **Contexto:** qué pide la issue y por qué, y la rama.
2. **Pruebas por criterio:**
   - En el código: al menos una prueba por criterio, en el nivel que dice `pruebas.md` y con el ID de la historia en el nombre (`HU-12 rates the card with keys 1-4`).
   - En las skills: los casos de la prueba en seco, escritos antes que la skill (D-142).
   - En la documentación: cómo se comprueba cada criterio.
3. **Archivos** que se crean o cambian.
4. **Documentación** que se actualiza en la misma PR.
5. **¿Varias PR?** Si saldría de más de unas 400 líneas o mezcla áreas (base de datos y pantallas, por ejemplo), propón partirla. Cada parte lleva su alcance (criterios que cubre), su orden, su Tamaño y sus dependencias. Cada PR deja `main` funcionando.
6. **Tamaño:** si el plan no encaja con el Tamaño del Project (S, unas pocas horas; M, una PR normal; L, varias PR, D-141), propón el nuevo.
7. **Huecos resueltos** y la decisión nueva que generan, con el siguiente ID de `docs/decisiones.md`.
8. **Commits** previstos, en Conventional Commits.
9. **Verificación.**

## 6. Al aprobarse el plan

1. **Comentario breve en la issue**, o en la madre si se parte. Escríbelo en un archivo del *scratchpad* y mándalo con `gh issue comment N --body-file <archivo>`:
   ```markdown
   ### Plan aprobado

   Rama `…`, una sola PR (o N partes).

   **Huecos resueltos (D-xx)**
   - …

   **Archivos**
   - …
   ```
2. **Project:** Status *In Progress* y, si cambia, el Tamaño. Lee los IDs cada vez, no los apuntes:
   ```sh
   PROJECT_ID=$(gh project view 5 --owner Adrigarsu --format json --jq .id)
   ITEM_ID=$(gh project item-list 5 --owner Adrigarsu --format json --jq '.items[] | select(.content.number==N) | .id')
   gh project field-list 5 --owner Adrigarsu --format json   # IDs de Status y Tamaño y de sus opciones
   gh project item-edit --id $ITEM_ID --project-id $PROJECT_ID --field-id <campo> --single-select-option-id <opción>
   ```
3. **Si se parte:** crea las sub-issues siguiendo los pasos 4 a 8 de la skill `crear-issue`:
   - plantilla `6-parte.yml` y título `HU-xx · parte n/N: …`;
   - las mismas etiquetas y el mismo milestone que la madre;
   - *blocked by* la parte anterior si depende de ella;
   - enlace como sub-issue de la madre;
   - Project con Status `Todo` y su Tamaño.

   Enseña los borradores con el plan, para que se aprueben juntos. Después, la sesión sigue solo con la parte 1: renombra la rama si hace falta (`git branch -m feat/HU-xx-1-…`) y pasa la parte 1 a *In Progress*.

## 7. Siguiente paso

Di que toca programar con la skill `tdd`. Mientras no exista, se sigue el ciclo rojo → verde → refactorizar a mano, con un commit convencional por paso (ADR-021).
