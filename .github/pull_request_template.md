<!-- Título: Conventional Commits con el ID de la historia, p. ej. «feat(sesion): valorar con teclas 1-4 (HU-12)». Será el commit de main. -->

## Qué cambia

<!-- Dos o tres frases: qué puede hacer ahora el usuario o qué cambia por dentro. -->

Closes #
<!-- Si es una parte de una issue grande: Part of #<madre> -->

## Cómo se ha probado

<!-- Criterio de aceptación → prueba que lo cubre. -->

| Criterio | Prueba |
| --- | --- |
| | |

## Comprobaciones

<!-- Resumen de la definición de hecho: docs/proceso/definicion-de-hecho.md. Marca lo que aplica y escribe «No aplica» en lo demás. -->

- [ ] Rama `tipo/…` desde `main` actualizada; enlaza su issue (`Closes`, `Part of` o `Refs`).
- [ ] Commits y título en Conventional Commits, a nombre de la desarrolladora.
- [ ] Ningún commit, ni el título ni esta descripción llevan firmas o menciones de Claude.
- [ ] Cada criterio de la issue está en «Cómo se ha probado».
- [ ] Documentación actualizada en esta PR (historia, requisitos, decisiones, ADR, pantallas, índices), o no hacía falta.
- [ ] Sin secretos ni datos personales.
- [ ] Skills: prueba en seco con los casos escritos antes (D-142).
- [ ] Si hay código: todas las pruebas pasan en local (lint, tipos, unitarias, componentes, integración, pgTAP si toca `supabase/`, build y E2E de humo).
- [ ] Si hay código: cada criterio de aceptación tiene al menos una prueba con el ID de la historia.
- [ ] Si hay interfaz: sin errores de axe, se usa con teclado y el foco se ve.

## Capturas

<!-- Solo si cambia la interfaz: antes y después, móvil y escritorio. -->

## Decisiones tomadas por el camino

<!-- Huecos que aparecieron y qué opción se eligió. Si son nuevas decisiones, van también a docs/decisiones.md. -->
