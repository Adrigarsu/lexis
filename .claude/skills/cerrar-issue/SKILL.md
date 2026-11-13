---
name: cerrar-issue
description: Cierra una issue de Lexis cuando la desarrolladora dice que ha fusionado su PR. Comprueba la fusión, actualiza main, borra la rama local si es seguro, comprueba que la issue (y la madre, si es la última parte) está cerrada y en Done en el Project, lista lo que el cierre desbloquea y avisa si el milestone queda completo.
---

# cerrar-issue

Paso 7 del flujo de `docs/proceso/flujo-trabajo.md`: **cerrar**. Decisiones D-138 y D-146. Empieza cuando la PR está fusionada. Termina con `main` al día, la rama borrada y la lista de lo que se desbloquea. Elegir la siguiente issue es cosa de `estado-backlog`.

## Reglas

- **Nada directo a `main`.** Aquí solo se actualiza con `git pull --ff-only`; no se hace ningún commit.
- **No se borra trabajo.** Una rama local con commits que no están en la PR no se borra sin preguntar.
- **No se rodean los hooks.** El hook de Claude Code bloquea `git push --delete`: si la rama remota sigue viva, se pide borrarla desde GitHub.
- **Sin firmas** en los comentarios o cierres que se escriban (D-04).
- **Huecos con opciones** si algo no cuadra.
- Repositorio `Adrigarsu/lexis`, Project «Lexis» número 5 del usuario `Adrigarsu`. En este equipo no hay `jq`: usa el `--jq` de `gh`.

## 1. Identificar la issue y la PR

- **La issue:** el número que te den o, si no, el de la rama actual (`chore/9-…` → #9; en historias, `HU-xx` con `gh issue list --state all --search "HU-xx in:title"`).
- **La PR:** búscala por la rama (`gh pr list --state all --head <rama>`) o con `closedByPullRequestsReferences` de la issue. Después lee:
  ```sh
  gh pr view <pr> --json number,state,mergeCommit,headRefName,headRefOid --jq '{number, state, sha: .mergeCommit.oid, headRefName, headRefOid}'
  ```

## 2. Comprobar la fusión

Si la PR no está `MERGED` (sigue abierta o se cerró sin fusionar), **para**. Dilo y no borres nada.

## 3. Actualizar `main`

```sh
git switch main
git pull --ff-only origin main
git merge-base --is-ancestor <sha de la fusión> HEAD && echo "fusión en main"
```

Si `git switch` falla porque hay cambios sin guardar, para y pregunta qué hacer con ellos.

## 4. Borrar la rama

**Local.** Con *squash and merge*, `git branch -d` no reconoce la rama como fusionada. Bórrala con `-D` **solo** si su último commit es el último de la PR:

```sh
test "$(git rev-parse <rama>)" = "<headRefOid>" && git branch -D <rama>
```

Si no coincide, la rama tiene commits que no entraron en la PR. No la borres: enséñalos (`git log --oneline <headRefOid>..<rama>`) y pregunta con opciones, por ejemplo llevarlos a una issue nueva o descartarlos.

**Remota.** El repositorio borra la rama al fusionar (`delete_branch_on_merge`). Compruébalo con `git ls-remote --heads origin <rama>`. Si sigue ahí, pide a la desarrolladora que la borre con el botón «Delete branch» de la PR; no uses `git push --delete`. Después, `git fetch --prune` limpia la referencia local.

## 5. La issue y su madre

- **La issue:** `gh issue view N --json state,parent`. Si sigue abierta, **avisa y no la cierres** (D-146). Lo normal es que a la PR le faltara `Closes #N`; ella decide.
- **La madre** (si la issue tiene `parent`):
  ```sh
  gh issue view <madre> --json subIssues --jq '.subIssues.nodes[] | "#\(.number) \(.state)"'
  ```
  Si todas las sub-issues están cerradas, esta era la última parte. Como dice `flujo-trabajo.md`, cierra la madre con `gh issue close <madre> --comment "Todas sus partes están fusionadas."` (pide permiso) y comprueba que pasa a *Done*. Si quedan partes abiertas, dilo: la siguiente parte se empieza con `empezar-issue`.

## 6. Project

La automatización del Project pasa a *Done* las issues cerradas. Compruébalo:

```sh
gh project item-list 5 --owner Adrigarsu --format json --jq '.items[] | select(.content.number==N) | .status'
```

Si no está en *Done*, pásala con `gh project item-edit`. Los IDs se leen con `gh project field-list 5 --owner Adrigarsu --format json`, como en `empezar-issue`.

## 7. Lo que se desbloquea

```sh
gh api repos/Adrigarsu/lexis/issues/N/dependencies/blocking --jq '.[] | select(.state=="open") | .number'
```

Para cada una, mira sus bloqueos:

```sh
gh api repos/Adrigarsu/lexis/issues/<m>/dependencies/blocked_by --jq '[.[] | select(.state=="open") | "#\(.number)"] | join(", ")'
```

- Sin bloqueos abiertos: **desbloqueada**.
- Con bloqueos abiertos: «sigue bloqueada por …».

Si se ha cerrado la madre, haz lo mismo con ella. Aquí **no recomiendes** cuál hacer después (D-146): para eso está `estado-backlog`.

## 8. Milestone

```sh
gh issue view N --json milestone --jq .milestone.number
gh api repos/Adrigarsu/lexis/milestones/<n> --jq '{title, open_issues, closed_issues, state}'
```

Si `open_issues` es 0, era la última: avisa de que el milestone está completo y propón cerrarlo (D-146). Solo con su «sí»:

```sh
gh api --method PATCH repos/Adrigarsu/lexis/milestones/<n> -f state=closed
```

## 9. Resumen

En el chat, en pocas líneas:

- el commit de `main`;
- la rama local y la remota;
- la issue (y la madre) y su estado en el Project;
- lo desbloqueado y lo que sigue bloqueado;
- el milestone.

Termina remitiendo a `estado-backlog` para elegir la siguiente issue. Mientras no exista, lista las issues listas del milestone sin recomendar ninguna.
