---
name: estado-backlog
description: Enseña el estado del backlog de Lexis y recomienda la siguiente issue cuando la desarrolladora pregunta qué hacer ahora o qué queda, o cuando otra skill remite a ella. Agrupa las issues abiertas del milestone en curso en «En curso», «Listas» y «Bloqueadas» (con lo que las bloquea) y recomienda una por prioridad, lo que desbloquea, Tamaño y número. Solo lee: no cambia nada ni empieza ninguna issue.
---

# estado-backlog

Paso 1 del flujo de `docs/proceso/flujo-trabajo.md`: **elegir**. Decisiones D-138, D-146 y D-147. La skill recomienda, pero **elige la desarrolladora**. Después, la issue se empieza con `empezar-issue`.

## Reglas

- **Solo lectura.** No comentes, no cambies el Project, no crees ramas ni empieces ninguna issue por tu cuenta.
- **Huecos con opciones** si algo no cuadra (por ejemplo, una issue en curso sin rama, o una dependencia circular).
- Repositorio `Adrigarsu/lexis`, Project «Lexis» número 5 del usuario `Adrigarsu`. En este equipo no hay `jq`: usa el `--jq` de `gh`.

## 1. Elegir el milestone

```sh
gh api repos/Adrigarsu/lexis/milestones --jq '.[] | "\(.number)\t\(.title)\t\(.open_issues)"'
```

El número de iteración es el que va al principio del **título** (`0 · …`, `1 · …`). No es el `number` de la API: el milestone `0 · Organización del repositorio` tiene `number` 1 en GitHub.

- **Con argumento** (`estado-backlog 1`): el milestone cuyo título empieza por ese número (`1 · Cimientos técnicos`).
- **Sin argumento** (D-147): el milestone abierto con el número de iteración más bajo que tenga issues abiertas. Los milestones son iteraciones en orden.
- Si ningún milestone abierto tiene issues abiertas, dilo y propón crear la siguiente con `crear-issue`.

## 2. Leer las issues y el Project

Issues abiertas del milestone:

```sh
gh issue list --milestone "<título>" --state open --limit 100 --json number,title,labels
```

Project, una sola vez para todas:

```sh
gh project item-list 5 --owner Adrigarsu --limit 200 --format json --jq '.items[] | select(.content.number) | "\(.content.number)\t\(.status)\t\(.prioridad)\t\(."tamaño")"'
```

Para cada issue abierta del milestone:

```sh
gh api repos/Adrigarsu/lexis/issues/<n>/dependencies/blocked_by --jq '[.[] | select(.state=="open") | "#\(.number)"] | join(", ")'
gh api repos/Adrigarsu/lexis/issues/<n>/dependencies/blocking --jq '[.[] | select(.state=="open")] | length'
gh issue view <n> --json parent,subIssues --jq '{parent: .parent.number, subs: .subIssues.totalCount}'
```

La Prioridad sale del campo del Project; si está vacío, de la etiqueta `prio:`.

## 3. Agrupar

| Grupo | Cuándo |
| --- | --- |
| **En curso** | Status *In Progress* en el Project |
| **Listas** | No están en curso y no tienen ningún *blocked by* abierto |
| **Bloqueadas** | No están en curso y tienen algún *blocked by* abierto: di cuáles |

- Una sub-issue lleva «parte de #madre».
- Una madre con sub-issues no va en «Listas»: se trabajan sus partes, así que se anota «partida en N partes».

## 4. Recomendar

Entre las **Listas**, en este orden (D-147):

1. **Prioridad:** Must, después Should, después Could.
2. **Lo que desbloquea:** más issues abiertas en `blocking`, antes.
3. **Tamaño:** S, M, L, y sin Tamaño al final.
4. **Número:** el más bajo.

Explica en una frase por qué gana la recomendada, por ejemplo: «Must como las demás, y desbloquea #8».

Si no hay ninguna lista (todo en curso o bloqueado), no recomiendes empezar algo nuevo. Dilo y señala qué issue, al cerrarse, desbloquearía más.

## 5. Presentar

En el chat, corto:

- **Milestone** y recuento (abiertas y cerradas).
- Tres tablas: **En curso**, **Listas** y **Bloqueadas**. Columnas: número, título, Prioridad y Tamaño; en las bloqueadas, además, «bloqueada por». Un grupo vacío se dice en una línea.
- **Recomendación**, con el motivo.
- Una línea con las issues abiertas de los demás milestones y las que no tienen milestone:
  ```sh
  gh issue list --state open --limit 200 --json milestone --jq 'map(select(.milestone == null)) | length'
  ```

Termina diciendo que la elección es suya y que, cuando elija, la issue se empieza con `empezar-issue`.
