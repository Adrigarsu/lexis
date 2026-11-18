**@lexis/design-tokens** · Tokens de diseño de Lexis (`docs/diseno/tokens.json`), convertidos en variables CSS y en el tema de Tailwind CSS v4 (ADR-010, ADR-029).

- `pnpm --filter @lexis/design-tokens build` escribe `dist/tokens.css` (variables `--lx-*` de los temas claro y oscuro) y `dist/theme.css` (`@theme inline`). `pnpm build` y `pnpm dev` lo hacen solos.
- `apps/web` los importa como `@lexis/design-tokens/tokens.css` y `@lexis/design-tokens/theme.css`.
- El CSS generado no se versiona: se edita `tokens.json` y se vuelve a compilar.
