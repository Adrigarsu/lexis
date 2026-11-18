# Flujo de trabajo

Decidido en D-138, D-139 y D-140. Una sesión de Claude Code por issue, en el ordenador de la desarrolladora, con su Git y su sesión de `gh`. Cada sesión empieza sin memoria: todo lo que necesita está en el repositorio y en la issue, y todo lo que se decide queda escrito en uno de los dos.

## Organización en GitHub

- **Issues:** una por historia de usuario (HU), más las de bugs, tareas técnicas y documentación. Se crean con las plantillas de `.github/ISSUE_TEMPLATE/` y con la cuenta de la desarrolladora.
- **Milestones:** iteraciones que entregan algo usable. `0 · Organización del repositorio` y `1 · Cimientos técnicos` ya existen; los siguientes se crean en la fase 6, con las historias.
- **Etiquetas:** `tipo:` (historia, bug, tarea), `prio:` (must, should, could), `area:` (app, db, content, infra, docs) y `epica:EP-01` … `epica:EP-11`.
- **Dependencias:** con la relación nativa _blocked by_ de GitHub, no con etiquetas.
- **Project «Lexis»:** vista _Backlog_ (por milestone y prioridad, con bloqueos y progreso de sub-issues) y vista _Tablero_ (por estado).
- **`main` protegida:** solo por PR, historial lineal, sin force push ni borrado, y solo _squash merge_. El check `ci` del CI (D-159) pasa a ser obligatorio cuando la desarrolladora lo añade al _ruleset_.
  - Lo aplica el _ruleset_ «main» del repositorio (Settings → Rules), sin excepciones: tampoco la administradora puede saltárselo.
  - El repositorio, además, solo permite _squash merge_ y borra la rama al fusionar.
  - Para comprobarlo: `gh api repos/Adrigarsu/lexis/rules/branches/main`. La API de protección clásica (`branches/main/protection`) responde «Branch not protected» aunque `main` esté protegida, porque no ve los rulesets.

## Las 7 fases de una issue

| Paso              | Quién                       | Skill            | Qué pasa                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | --------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Elegir         | Ella                        | `estado-backlog` | Lista las issues del milestone en tres grupos (listas, bloqueadas con qué las bloquea, en curso) y recomienda una. Por defecto usa el milestone abierto con el número de iteración más bajo que tenga issues abiertas. Recomienda por prioridad, después lo que más desbloquea, después el menor Tamaño y por último el número más bajo (D-147). Solo lee                                                                                                                                                 |
| 2. Empezar        | Claude                      | `empezar-issue`  | Comprueba que no está cerrada ni bloqueada. Si ya estaba empezada (rama, plan comentado o PR), la retoma: resume lo hecho y lo que queda, sin volver a planificar. Si no, actualiza `main`, crea la rama según la plantilla (D-144) y lee la issue, su historia, sus RF, ADR y pantallas                                                                                                                                                                                                                  |
| 3. Planificar     | Claude propone, ella decide | `empezar-issue`  | En modo plan: pruebas por criterio, archivos, si hacen falta varias PR y cada hueco con opciones y la recomendada. Revisa el Tamaño si el plan no encaja con él. Aprobado, deja una copia breve como comentario en la issue, la mueve a _In progress_, ajusta el Tamaño y, si se parte, crea las sub-issues. El plan lleva una línea «Paso 4» (skill `tdd` o seguir el plan) y, aprobado, la sesión pasa sola al paso 4 sin pedirlo; si se parte, solo con la parte 1 (D-154)                             |
| 4. Programar      | Claude                      | `tdd`            | Solo en issues con código (D-148). Criterio a criterio y de fuera hacia dentro: prueba de aceptación en rojo, ciclos unitarios para la lógica que falta, código mínimo en verde con toda la suite pasando, y refactorizar. Un commit convencional por paso. Si aparece algo sin definir, para y pregunta con opciones. Las issues de skills, documentación o ajustes siguen el plan aprobado (D-142 para skills). Lo empieza `empezar-issue` sola al aprobarse el plan, o al retomar tras el «sí» (D-154) |
| 5. Preparar la PR | Claude                      | `preparar-pr`    | Pone la rama al día fusionando `main` (nunca rebase de una rama subida ni push forzado), ejecuta todas las pruebas (si alguna falla, vuelve al paso 4) y recorre la [definición de hecho](definicion-de-hecho.md). Comprueba que no hay firmas pasando commits, título y descripción por `.lefthook/commit-msg/check-signature.sh` (D-155). Después enseña un resumen y, con su «sí», sube la rama y abre la PR con la plantilla (D-145)                                                                  |
| 6. Fusionar       | Ella                        | —                | _Squash and merge_. Claude solo si se lo autoriza expresamente en esa sesión                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 7. Cerrar         | Claude                      | `cerrar-issue`   | Comprueba que la PR está fusionada, actualiza `main` y borra la rama local (solo si su punta es la de la PR; la remota la borra GitHub). Comprueba que la issue está cerrada y en _Done_: si sigue abierta, avisa y no la cierra. Si es la última parte, cierra la madre. Lista lo que se desbloquea (para elegir está `estado-backlog`) y, si el milestone queda completo, propone cerrarlo (D-146)                                                                                                      |

Otras dos skills: `crear-issue`, cuando se pide algo nuevo, y `registrar-decision`, cuando se decide algo. Una decisión que sale dentro de una issue va en su rama; si sale fuera, se registra en una issue «Docs: registrar D-xx …» con su propia PR (D-149).

> Las 7 skills están en `.claude/skills/`: `estado-backlog`, `empezar-issue`, `tdd`, `preparar-pr`, `cerrar-issue`, `crear-issue` y `registrar-decision`.

Las skills viven en `.claude/skills/<nombre>/SKILL.md`. Se prueban en seco (D-142): antes de escribirlas se apuntan casos con lo que debe salir y después se recorre la skill con cada uno, mostrando los comandos que lanzaría sin ejecutarlos. El resultado va en la PR.

## Crear una issue

La skill `crear-issue` convierte una petición en una issue lista para el backlog:

1. Elige la plantilla de `.github/ISSUE_TEMPLATE/`, busca duplicados y lee la documentación relacionada.
2. Redacta el cuerpo con las secciones del formulario (GitHub CLI no rellena formularios YAML), las etiquetas `tipo:`, `prio:`, `area:` y `epica:`, el milestone y las dependencias.
3. Enseña el borrador con los huecos y sus opciones. No crea nada sin el visto bueno de la desarrolladora.
4. Crea la issue, sus relaciones _blocked by_ (y la de sub-issue si es una parte) y la añade al Project «Lexis» con Status `Todo`, la Prioridad de su etiqueta y el Tamaño confirmado (D-141): S, unas pocas horas; M, una PR normal; L, probablemente varias PR.
5. Si es una **funcionalidad nueva**, abre además una rama `docs/<n>-descripcion` y una PR que añade su RF, su historia, su fila de trazabilidad y, si hace falta, su decisión. La PR lleva `Refs #<n>`, porque la issue sigue abierta hasta que se programe.

## Huecos durante el plan o el trabajo

Un hueco es cualquier cosa que la issue y `docs/` no resuelven: datos que faltan, una pantalla sin diseñar, un comportamiento sin definir, un bug encontrado, dos documentos que se contradicen. Claude no lo rellena por su cuenta: lo presenta así y espera la respuesta.

```text
Hueco: la HU-12 no dice qué pasa si se pulsa «Otra vez» en la última tarjeta.
1. Volver a mostrarla al final de la sesión (recomendada: es lo que hace HU-11 con las demás).
2. Terminar la sesión y dejarla para mañana.
3. Preguntar al usuario.
```

Si la respuesta es una decisión nueva, va a `docs/decisiones.md` en la misma PR.

## Issues que necesitan varias PR

Se usan las sub-issues nativas de GitHub: la historia es la madre y cada PR resuelve una sub-issue.

1. **Al planificar**, si una PR saldría de más de unas 400 líneas o mezcla áreas (base de datos y pantallas, por ejemplo), Claude propone partirla y lo explica. Ejemplo: HU-12 en 1/3 lógica de FSRS y nivel, 2/3 botones y teclas, 3/3 guardar en el historial.
2. **Al aprobar el plan**, se crean las sub-issues `HU-12 · parte 1/3: …` con la plantilla _Parte de una issue_, enlazadas a la madre y con su dependencia sobre la anterior si hace falta. El plan completo queda como comentario en la madre.
3. **Cada parte** tiene su rama (`feat/HU-12-1-fsrs`), su sesión y su PR con `Closes #<sub-issue>` y `Part of #<madre>`. Cada PR deja `main` funcionando: lo que aún no está terminado no se ve en la interfaz o va detrás de un interruptor.
4. **Para retomar**, `empezar-issue` detecta que es una sub-issue, lee el plan de la madre y las partes ya fusionadas, y planifica solo la parte que toca.
5. **Al fusionar la última parte**, `cerrar-issue` comprueba que todas las sub-issues están cerradas y cierra la madre.

## Autoría: solo la cuenta de la desarrolladora

Los commits salen con la identidad de Git configurada en su ordenador. Lo que hay que impedir es que se cuele una firma de Claude (`Co-Authored-By: Claude`, «Generated with Claude Code», enlaces de sesión). Cuatro capas:

| Capa                   | Dónde                                               | Qué hace                                                                                                                          |
| ---------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1. Ajuste              | `~/.claude/settings.json` y `.claude/settings.json` | `"attribution": { "commit": "", "pr": "" }` desactiva las firmas                                                                  |
| 2. Instrucciones       | `CLAUDE.md`                                         | Regla explícita, por encima de cualquier otra instrucción                                                                         |
| 3. Hook de Claude Code | `.claude/hooks/guard-git.mjs`                       | Antes de cada comando bloquea firmas, cambios de identidad, push forzados y push a `main`, y pide confirmación para `gh pr merge` |
| 4. Hook de Git         | Lefthook: `.lefthook/commit-msg/check-signature.sh` | Rechaza cualquier mensaje con firma, venga de donde venga, junto a commitlint. Sin comprobación en el CI (D-140, D-155)           |

Los hooks de Git los instala Lefthook al hacer `pnpm install` (script `prepare`, D-155). Si un clon tenía el antiguo `core.hooksPath .githooks`, `pnpm install` lo quita solo; el [README](../../README.md#si-tu-clon-tenía-githooks) explica qué hacer si no.

## Documentación

- Una PR que cambia algo documentado actualiza su documento en la misma PR. La plantilla de PR lo pregunta y la [definición de hecho](definicion-de-hecho.md) lo exige.
- Las decisiones nuevas van arriba de la tabla de `docs/decisiones.md` con el siguiente ID (skill `registrar-decision`). Si son de arquitectura del producto, según la definición de [arquitectura.md](../arquitectura/arquitectura.md#qué-es-una-decisión-de-arquitectura), además, un ADR nuevo en `docs/adr/` y una fila en su índice.
- Un ADR aceptado no se edita: se escribe uno nuevo que lo sustituye.
- Los documentos de claude.ai (SRS, ADR, esquema, lienzo de diseño, pizarra del flujo) quedan como historia. La fuente de verdad es `docs/`.
- Si hace falta una pantalla nueva, se diseña fuera del repositorio y se exporta a `docs/diseno/pantallas/` (PNG + HTML) antes de programarla.

## Actualizaciones de dependencias (Dependabot)

Decidido en D-77 y D-153. [`.github/dependabot.yml`](../../.github/dependabot.yml) le pide a Dependabot que revise cada lunes a las 07:00 (hora de Madrid) las dependencias de pnpm de todo el monorepo y las acciones de GitHub Actions. Las alertas y las actualizaciones de seguridad están activadas aparte, en los ajustes del repositorio.

- **Qué propone:** una PR por ecosistema con todas las versiones menores y de parche juntas, y una PR suelta por cada versión mayor, que puede romper cosas. Como mucho tiene 5 PR abiertas por ecosistema.
- **Cómo se ven:** títulos en Conventional Commits (`build(deps): …`, `build(deps-dev): …` y `ci(deps): …`), en inglés, con las etiquetas `tipo:tarea` y `area:infra`.
- **Cómo se revisan:**
  1. Basta con que el CI esté en verde (D-159). Si falla y no se ve por qué, en local: `gh pr checkout <n>`, `pnpm install` y el paso que falló.
  2. En las versiones mayores, además, se lee el changelog de la dependencia antes de fusionar.
  3. Si algo falla, no se fusiona: se cierra la PR o se abre una issue para adaptar el código.
- **Cómo se fusionan:** _squash and merge_, como cualquier PR, y lo hace la desarrolladora.
- **Autoría:** las PR y los commits salen a nombre de `dependabot[bot]`, y el commit de `main` lo menciona. Es la excepción a D-04, que sigue prohibiendo las firmas de Claude. Tampoco usan la plantilla de PR ni enlazan una issue.

## Servicios externos

Supabase, Vercel, Sentry y Turnstile se crean cuando llega la issue que los necesita, no antes: un proyecto de Supabase sin uso se pausa a los 7 días. Sus claves viven en los paneles de cada servicio y en los secretos de GitHub, nunca en el repositorio.
