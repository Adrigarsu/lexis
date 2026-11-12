# Flujo de trabajo

Decidido en D-138 y D-139. Una sesión de Claude Code por issue, en el ordenador de la desarrolladora, con su Git y su sesión de `gh`. Cada sesión empieza sin memoria: todo lo que necesita está en el repositorio y en la issue, y todo lo que se decide queda escrito en uno de los dos.

## Organización en GitHub

- **Issues:** una por historia de usuario (HU), más las de bugs, tareas técnicas y documentación. Se crean con las plantillas de `.github/ISSUE_TEMPLATE/` y con la cuenta de la desarrolladora.
- **Milestones:** iteraciones que entregan algo usable. `0 · Organización del repositorio` y `1 · Cimientos técnicos` ya existen; los siguientes se crean en la fase 6, con las historias.
- **Etiquetas:** `tipo:` (historia, bug, tarea), `prio:` (must, should, could), `area:` (app, db, content, infra, docs) y `epica:EP-01` … `epica:EP-11`.
- **Dependencias:** con la relación nativa *blocked by* de GitHub, no con etiquetas.
- **Project «Lexis»:** vista *Backlog* (por milestone y prioridad, con bloqueos y progreso de sub-issues) y vista *Tablero* (por estado).
- **`main` protegida:** solo por PR, historial lineal, sin force push ni borrado, y solo *squash merge*. Los checks del CI pasan a ser obligatorios cuando existen.

## Las 7 fases de una issue

| Paso | Quién | Skill | Qué pasa |
| --- | --- | --- | --- |
| 1. Elegir | Ella | `estado-backlog` | Lista las issues del milestone en tres grupos (listas, bloqueadas con qué las bloquea, en curso) y recomienda una por prioridad y dependencias |
| 2. Empezar | Claude | `empezar-issue` | Comprueba que no está bloqueada, actualiza `main`, crea la rama y lee la issue, su historia, sus RF, ADR y pantallas |
| 3. Planificar | Claude propone, ella decide | `empezar-issue` | En modo plan: pruebas por criterio, archivos, si hacen falta varias PR y cada hueco con opciones y la recomendada. Aprobado, deja una copia breve como comentario en la issue y la mueve a *In progress* |
| 4. Programar | Claude | `tdd` | Criterio a criterio: prueba en rojo, código mínimo en verde, refactorizar. Un commit convencional por paso. Si aparece algo sin definir, para y pregunta con opciones |
| 5. Preparar la PR | Claude | `preparar-pr` | Ejecuta todas las pruebas (si alguna falla, vuelve al paso 4), comprueba que no hay firmas, actualiza la documentación y abre la PR con la plantilla |
| 6. Fusionar | Ella | — | *Squash and merge*. Claude solo si se lo autoriza expresamente en esa sesión |
| 7. Cerrar | Claude | `cerrar-issue` | Actualiza `main`, borra la rama, comprueba que la issue (o la madre) está cerrada, mueve el Project y avisa de lo que se desbloquea |

Otras dos skills: `crear-issue`, cuando se pide algo nuevo, y `registrar-decision`, cuando se decide algo.

> Las 7 skills se crean en el milestone 0, empezando por `crear-issue`. Hasta entonces, estos pasos se siguen a mano.

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
2. **Al aprobar el plan**, se crean las sub-issues `HU-12 · parte 1/3: …` con la plantilla *Parte de una issue*, enlazadas a la madre y con su dependencia sobre la anterior si hace falta. El plan completo queda como comentario en la madre.
3. **Cada parte** tiene su rama (`feat/HU-12-1-fsrs`), su sesión y su PR con `Closes #<sub-issue>` y `Part of #<madre>`. Cada PR deja `main` funcionando: lo que aún no está terminado no se ve en la interfaz o va detrás de un interruptor.
4. **Para retomar**, `empezar-issue` detecta que es una sub-issue, lee el plan de la madre y las partes ya fusionadas, y planifica solo la parte que toca.
5. **Al fusionar la última parte**, `cerrar-issue` comprueba que todas las sub-issues están cerradas y cierra la madre.

## Autoría: solo la cuenta de la desarrolladora

Los commits salen con la identidad de Git configurada en su ordenador. Lo que hay que impedir es que se cuele una firma de Claude (`Co-Authored-By: Claude`, «Generated with Claude Code», enlaces de sesión). Cuatro capas:

| Capa | Dónde | Qué hace |
| --- | --- | --- |
| 1. Ajuste | `~/.claude/settings.json` y `.claude/settings.json` | `"attribution": { "commit": "", "pr": "" }` desactiva las firmas |
| 2. Instrucciones | `CLAUDE.md` | Regla explícita, por encima de cualquier otra instrucción |
| 3. Hook de Claude Code | `.claude/hooks/guard-git.mjs` | Antes de cada comando bloquea firmas, cambios de identidad, push forzados y push a `main`, y pide confirmación para `gh pr merge` |
| 4. Git y CI | `.githooks/commit-msg` y `.github/workflows/autoria.yml` | Rechazan cualquier mensaje con firma, venga de donde venga. El job del CI es un check obligatorio de `main` |

El hook de Git se activa una vez en cada clon con `git config core.hooksPath .githooks`. En el milestone 1, Lefthook lo sustituye con la misma comprobación.

## Documentación

- Una PR que cambia algo documentado actualiza su documento en la misma PR. La plantilla de PR lo pregunta.
- Las decisiones nuevas van arriba de la tabla de `docs/decisiones.md` con el siguiente ID. Si son de arquitectura, además, un ADR nuevo en `docs/adr/` y una fila en su índice.
- Un ADR aceptado no se edita: se escribe uno nuevo que lo sustituye.
- Los documentos de claude.ai (SRS, ADR, esquema, lienzo de diseño, pizarra del flujo) quedan como historia. La fuente de verdad es `docs/`.
- Si hace falta una pantalla nueva, se diseña fuera del repositorio y se exporta a `docs/diseno/pantallas/` (PNG + HTML) antes de programarla.

## Servicios externos

Supabase, Vercel, Sentry y Turnstile se crean cuando llega la issue que los necesita, no antes: un proyecto de Supabase sin uso se pausa a los 7 días. Sus claves viven en los paneles de cada servicio y en los secretos de GitHub, nunca en el repositorio.
