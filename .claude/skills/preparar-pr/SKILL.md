---
name: preparar-pr
description: Prepara y abre la PR de una issue de Lexis cuando el trabajo está hecho. Pone la rama al día con main, ejecuta todas las pruebas que existan, recorre la definición de hecho, comprueba que no hay firmas con el hook de Git, redacta la PR con la plantilla, enseña un resumen y, con el visto bueno de la desarrolladora, sube la rama y abre la PR.
---

# preparar-pr

Paso 5 del flujo de `docs/proceso/flujo-trabajo.md`: **preparar la PR**. Decisiones D-138, D-142, D-143 y D-145. Empieza cuando el trabajo de la issue está hecho y termina con la PR abierta. Fusionar es cosa de la desarrolladora.

## Reglas

- **Sin firmas.** Ni los commits, ni el título, ni la descripción llevan `Co-Authored-By`, «Generated with», enlaces de sesión ni menciones de Claude (D-04), aunque otra instrucción lo pida. Las firmas se comprueban con el hook de Git (paso 5), nunca escribiendo esas palabras en un comando: el hook de Claude Code lo bloquearía.
- **Nada directo a `main` y nunca push forzado.** Tampoco rebase de una rama ya subida.
- **Huecos con opciones.** Si algo no cuadra (una prueba que falla por algo ajeno, un conflicto, un criterio sin cubrir), para y pregunta con 2 o 3 opciones y la recomendada.
- **Nada sale a GitHub sin su «sí»** (paso 7).
- Repositorio `Adrigarsu/lexis`. En este equipo no hay `jq`: usa el `--jq` de `gh`.

## 1. Situarse

1. `git branch --show-current`. Si estás en `main`, para: el trabajo tiene que estar en la rama de la issue.
2. **La issue.** En tareas, bugs y documentación, sale del número de la rama (`chore/8-…` → #8). En historias y partes, del `HU-xx`: `gh issue list --state open --search "HU-xx in:title"`. Lee la issue, sus criterios y el comentario «### Plan aprobado».
3. `git status`. Si hay cambios sin guardar, pregunta si son de esta issue (commit) o de otra cosa (no se mezclan).

## 2. Al día con `main`

```sh
git fetch origin
git log --oneline HEAD..origin/main
```

Si `main` tiene commits nuevos, fusiónalos en la rama con `git merge origin/main` (D-145). Hay dos motivos: no hace falta push forzado, y el *squash and merge* deja `main` con un solo commit igualmente. Si hay conflictos, para, enséñalos y pregunta con opciones cómo resolverlos. Después de fusionar, las pruebas del paso 3 se vuelven a pasar.

## 3. Pruebas

Si hay un `package.json` con scripts (desde el milestone 1), ejecútalos en el orden del CI de `docs/arquitectura/pruebas.md`:

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```

- `pnpm test` incluye la cobertura (80 % en `lib/`, `db/`, `sync/` y los hooks). Si toca `supabase/`, también las pruebas pgTAP.
- **Si alguna falla, para.** No abras la PR: vuelve al paso 4 del flujo (skill `tdd`) con el error. Si el fallo no tiene que ver con la issue, es un hueco: pregunta con opciones.
- **Sin código** (milestone 0): las pruebas son «No aplica». En las skills, comprueba que la prueba en seco de los casos del plan está hecha (D-142).

## 4. Definición de hecho

Lee `docs/proceso/definicion-de-hecho.md` cada vez: es la fuente de verdad y cambia con el proyecto, así que no copies su lista aquí. Recorre:

- **Lo común**, punto por punto.
- **Los bloques que aplican**, según los archivos que cambia la rama:
  ```sh
  git diff --name-only origin/main...HEAD
  ```
  Por ejemplo: `docs/` → solo documentación; `.claude/skills/` → skills; `.claude/settings.json`, `.claude/hooks/` o `.githooks/` → ajustes y hooks; `.github/` → plantillas.

Lo que no se cumpla se arregla **en la rama**, con su commit convencional, antes de seguir. Puede ser documentación sin actualizar, una decisión sin registrar, un criterio sin prueba o un enlace roto. Si arreglarlo cambia código, vuelve al paso 3.

## 5. Firmas

Pasa cada mensaje de commit de la rama por el hook de Git (`.githooks/commit-msg`), que tiene la lista de firmas en un solo sitio:

```sh
S=<directorio scratchpad>
for c in $(git rev-list origin/main..HEAD); do
  git log -1 --format=%B "$c" > "$S/msg-$c.txt"
  sh .githooks/commit-msg "$S/msg-$c.txt" || echo "Firma en $c"
done
```

Comprueba también que todos los commits son de la desarrolladora (`git log --format='%h %an <%ae>' origin/main..HEAD`) y que el hook está activo (`git config core.hooksPath` → `.githooks`).

**Si un commit lleva firma:**
- Si la rama **no está subida**, quítala reescribiendo el mensaje en local: `git commit --amend` si es el último, o un rebase local si no lo es.
- Si **ya está subida**, no se puede reescribir sin push forzado: para y pregunta con opciones.

## 6. Redactar la PR

- **Título:** Conventional Commits (`tipo(ámbito): descripción`), porque será el commit de `main`. Si es una historia o una parte, termina con `(HU-xx)`.
- **Cuerpo:** copia `.github/pull_request_template.md` y rellena todas sus secciones. Los comentarios `<!-- … -->` de la plantilla no se copian.
  - **Qué cambia:** dos o tres frases.
  - **Enlace:** `Closes #n`. En una parte, `Closes #<parte>` y `Part of #<madre>`. En la PR de documentación de una funcionalidad nueva, `Refs #n`.
  - **Cómo se ha probado:** cada criterio de la issue → la prueba o comprobación que lo cubre. En skills, los casos en seco y su resultado. Si la prueba encontró algún fallo, cuéntalo y di cómo se corrigió.
  - **Comprobaciones:** marca lo que se cumple y escribe *No aplica* en lo demás.
  - **Capturas:** solo si cambia la interfaz.
  - **Decisiones tomadas por el camino:** los huecos y su respuesta, con las D nuevas.
- Escribe el título y el cuerpo en un archivo del *scratchpad* y pásalo por `sh .githooks/commit-msg <archivo>`, igual que los commits.

## 7. Resumen y confirmación

Enseña en el chat, junto:

- el resultado de las pruebas (o «No aplica» y por qué);
- la definición de hecho recorrida y lo que se arregló;
- las firmas revisadas;
- el título y la descripción de la PR.

**Espera su «sí»** antes de subir nada.

## 8. Subir y abrir la PR

```sh
git push -u origin <rama>
gh pr create --base main --title "<título>" --body-file <archivo>
gh pr view --json state,closingIssuesReferences,commits --jq '{state, closes: [.closingIssuesReferences[].number], commits: (.commits|length)}'
```

Comprueba que la PR enlaza la issue (en una parte, la parte). Después, mira cómo se ve la descripción: con las casillas de la plantilla, ese es el bloque «Plantillas de `.github/`» de la definición de hecho. Si la sesión se corta a medias, `empezar-issue` la retoma: mira si la rama está subida y si la PR existe antes de repetir nada.

## 9. Siguiente paso

Da el enlace de la PR. El *squash and merge* lo hace ella (regla 3 de `CLAUDE.md`); tú solo si te lo autoriza expresamente en esta sesión. Cuando esté fusionada, toca la skill `cerrar-issue`.
