# ADR-020 · Versiones base (a 12 de noviembre de 2026)

- **Estado:** Aceptado
- **Fecha:** 2026-11-12
- **Registro:** D-132

| Herramienta | Versión | Por qué |
| --- | --- | --- |
| Node.js | 26 LTS, fijada en `.nvmrc` y `engines` | LTS activa desde el 28 de octubre de 2026, con soporte hasta abril de 2029 |
| pnpm | fijada en `packageManager` (Corepack) | Tu ordenador y el CI usan la misma |
| React | 19 | Lo exige React Router 8 |
| React Router | 8, modo de datos | Versión actual; la 6 ya no tiene soporte |
| Vite | 8 | Versión actual, con Rolldown |
| ESLint | 10, configuración *flat* | La 9 dejó de tener soporte en agosto de 2026 |
| TypeScript, Tailwind CSS, Prettier | última estable al crear el repositorio | Dependabot propone las actualizaciones |

Fuentes: [calendario de Node.js](https://nodejs.org/fr/blog/announcements/evolving-the-nodejs-release-schedule), [Vite 8](https://vite.dev/blog/announcing-vite8), [guía de React Router 8](https://scrimba.com/articles/react-router-complete-guide-2026/), [ESLint 10](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/).
