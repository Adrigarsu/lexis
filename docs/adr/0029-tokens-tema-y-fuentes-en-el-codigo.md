# ADR-029 · Tokens, tema y fuentes en el código

- **Estado:** Aceptado
- **Fecha:** 2026-11-18
- **Registro:** D-172

- **Contexto:** [ADR-010](0010-tailwind-css-con-los-tokens-de-lexis.md) elige Tailwind CSS con los tokens de `tokens.json`, pero no decía cómo llegan al código, cómo se cambia de tema, de dónde salen las fuentes ni cómo se impide un color escrito a mano. `sistema-diseno.md` servía Inter y Noto desde Google Fonts, y eso choca con el uso sin conexión y con D-106.
- **Decisión:**
  - **Tokens.** `packages/design-tokens` genera dos archivos a partir de `docs/diseno/tokens.json`, la única fuente: `tokens.css`, con las variables `--lx-*` de los temas claro y oscuro, y `theme.css`, el tema de Tailwind CSS v4 (`@theme inline`). Este tema quita la paleta, las familias, la escala, los radios, las sombras y los puntos de corte por defecto, así que solo existen los de Lexis. La escala tipográfica va en `rem`, para que el texto crezca hasta el 200 % (RNF-23). El CSS generado no se versiona: se compila con `pnpm build` y antes de `pnpm dev`.
  - **Tema.** El tema del sistema se sigue con `prefers-color-scheme`, solo con CSS, así que cambia sin recargar. Si el usuario elige uno, se guarda en `localStorage` (`lexis.theme`: `system`, `light` o `dark`) y se aplica como `data-theme` en `<html>`. Un script en línea de `index.html` lo aplica antes del primer pintado, y el hook `useTheme` lo cambia desde la app (D-100).
  - **Fuentes.** Todas salen de la propia app, nunca de un tercero. Inter, de `@fontsource/inter`. LXGW WenKai, del subconjunto del sistema de diseño. Noto Sans SC (400 y 700) y Noto Serif SC (400), como subconjuntos con los mismos caracteres que WenKai, generados por `pnpm fonts:subset` (`apps/web/scripts/subset-fonts.ts`). El script descarga una versión fijada de `notofonts/noto-cjk`, comprueba su SHA-256 y recorta con `subset-font`. Solo se versionan los subconjuntos. Las cuatro tienen licencia SIL OFL 1.1.
  - **Colores a mano.** Stylelint (`color-no-hex`, `color-named` y las funciones de color prohibidas) en los CSS, y una regla `no-restricted-syntax` de ESLint para los literales de TS/TSX de `apps/*/src`, como `bg-[#123456]` o `rgba(…)`. Las dos viven en `packages/config`, se prueban con sus API y corren en `pnpm lint`, en Lefthook y en el CI.
- **Consecuencias:**
  - El CSS que bloquea el primer pintado pesa unos 4 KB comprimido, frente a los 155 KB de los tramos `unicode-range` de Noto de Fontsource.
  - Un carácter que no está en los subconjuntos se pinta con la fuente del sistema. Cuando lleguen los datos del HSK 1 (HU-84), se regenera el subconjunto de WenKai y, después, `pnpm fonts:subset`.
  - Las fuentes funcionan sin conexión cuando el service worker las precachea (HU-86).
  - La elección de tema vive en el dispositivo; si un día se sincroniza con la cuenta, será con la pantalla de Perfil.
  - Los diseños exportados de `docs/diseno/` quedan fuera de Stylelint, porque conservan sus colores.
