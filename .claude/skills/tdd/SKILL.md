---
name: tdd
description: Programa una issue de Lexis que lleva código con TDD de fuera hacia dentro (ADR-021). Criterio a criterio, en el orden del plan aprobado: prueba de aceptación en rojo, ciclos unitarios hacia dentro, código mínimo en verde y refactorizar, con un commit convencional por paso. Para y pregunta con opciones si algo no está definido. No se usa en issues de skills, documentación o ajustes.
---

# tdd

Paso 4 del flujo de `docs/proceso/flujo-trabajo.md`: **programar**. Decisiones D-133, D-138 y D-148, ADR-021 y `docs/arquitectura/pruebas.md`. Empieza con el plan aprobado y termina con todos los criterios en verde; lo siguiente es `preparar-pr`.

TDD (desarrollo guiado por pruebas) repite un ciclo corto: **rojo** (una prueba que falla), **verde** (el mínimo código que la hace pasar) y **refactorizar** (mejorar el código sin cambiar lo que hace, con las pruebas en verde).

## Reglas

- **Ningún código de producción sin una prueba en rojo antes** (regla 4 de `CLAUDE.md`).
- **No se cambia una prueba para que pase.** Si la prueba está mal, se corrige como paso propio y se explica.
- **Huecos con opciones.** Si un criterio no dice qué pasa en un caso, o dos pruebas chocan, para y pregunta con 2 o 3 opciones y la recomendada. Si sale una decisión, va a `docs/decisiones.md` en esta misma rama.
- **Sin firmas y nada directo a `main`.** Los commits salen a nombre de la desarrolladora, sin `Co-Authored-By` ni menciones de Claude (D-04); el hook de Git los revisa.
- **Solo código** (D-148). En una issue de skills, documentación o ajustes, esta skill no se usa: el paso 4 sigue el plan aprobado, y en las skills la prueba en seco (D-142).

## 1. Antes de empezar

1. Estás en la rama de la issue, no en `main`.
2. La issue tiene un comentario «### Plan aprobado» con las pruebas por criterio. Si no lo tiene, para: primero va `empezar-issue`.
3. La issue cambia código (`apps/`, `packages/`, `supabase/` o `e2e/`). Si no, esta skill no aplica: dilo y sigue el plan.
4. La suite está en verde antes de tocar nada (`pnpm test`). Si ya falla, es un hueco: no se empieza encima de un rojo ajeno.

## 2. Un criterio cada vez, de fuera hacia dentro

En el orden del plan. Para cada criterio de aceptación (Dado / Cuando / Entonces):

### 2.1 Rojo: la prueba de aceptación

- Escribe la prueba en el nivel que dice `pruebas.md`: normalmente **componente** (Vitest + Testing Library + axe) o **E2E** (Playwright + axe).
- El nombre lleva el ID de la historia: `HU-12 rates the card with keys 1-4`.
- La prueba va junto al código (`*.test.ts(x)`), o en `e2e/*.spec.ts` si es E2E.
- Ejecuta **solo esa prueba**: `pnpm test -t "HU-12 rates the card"` o `pnpm test:e2e -g "HU-12"`.
- Comprueba que falla **por el motivo esperado** (falta el comportamiento), no por un error de sintaxis o de importación.
- **Si pasa sin tocar código**, no es un rojo válido: o la prueba no prueba lo que dice, o el comportamiento ya existía. Para y pregunta antes de seguir.
- Commit: `test(<ámbito>): <criterio en pocas palabras>`.

### 2.2 Hacia dentro: la lógica que falta

Si para pasar hace falta lógica nueva (por ejemplo, en `lib/`, `db/`, `sync/` o un hook), cada pieza lleva **su propio ciclo con pruebas unitarias**:

1. Prueba unitaria en rojo: commit `test(<ámbito>): …`.
2. Código mínimo en verde: commit `feat(<ámbito>): …`.
3. Refactorizar si hace falta: commit `refactor(<ámbito>): …`.

La prueba de aceptación sigue en rojo mientras tanto, y es normal.

### 2.3 Verde: la prueba de aceptación pasa

- Escribe el **mínimo** código que hace pasar la prueba de aceptación: nada que ningún criterio pida.
- Ejecuta la **suite entera** (`pnpm test`; y `pnpm test:e2e` si el criterio es E2E). Lo que ya funcionaba sigue en verde.
- Si otra prueba se rompe, no hagas commit: arréglalo hasta que todo esté en verde. Si la otra prueba choca con el criterio, es un hueco: pregunta.
- Commit: `feat(<ámbito>): …`, o `fix(<ámbito>): …` si es un bug.

### 2.4 Refactorizar

- Con todo en verde, mejora nombres, duplicados y estructura **sin cambiar lo que hace**.
- Vuelve a pasar la suite.
- Commit: `refactor(<ámbito>): …`, **solo si hay cambios**. Si no hay nada que mejorar, no hay commit.

## 3. Commits

- Conventional Commits (`docs/proceso/convenciones.md`): `tipo(ámbito): descripción`, en español, en presente e imperativo y sin punto final. El ámbito es el módulo (`sesion`, `tarjetas`, `sync`, `db`…).
- Un commit por paso del ciclo. Un commit en rojo es válido en la rama: `main` solo recibe el *squash* de la PR, que ya está en verde.
- Código, nombres y comentarios en inglés; textos de la interfaz en los archivos de traducción, nunca en el código (RNF-33).

## 4. Excepciones (`pruebas.md`)

- **Ajustes puramente visuales** (espaciado, color con los tokens): no llevan prueba nueva, pero las pruebas de axe tienen que seguir pasando.
- **Experimentos desechables** (*spikes*): se hacen fuera de la rama o se descartan. Si la idea se queda, se reescribe con TDD desde el rojo.

## 5. Al terminar los criterios

1. La suite completa, en el orden del CI: `pnpm lint`, `pnpm typecheck`, `pnpm test` (con cobertura) y `pnpm build`.
2. La cobertura llega al 80 % en `lib/`, `db/`, `sync/` y los hooks que se han tocado (D-75). Si no llega, faltan pruebas: vuelve al ciclo.
3. La documentación que el plan dice que cambia se actualiza en esta rama, con su commit `docs(…)`.
4. Siguiente paso: `preparar-pr`.
