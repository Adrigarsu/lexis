**@lexis/config** · Configuración compartida de TypeScript, ESLint y Prettier (D-152, [ADR-025](../../docs/adr/0025-eslint-prettier-y-typescript-compartidos.md)).

| Archivo              | Qué es                                                                                                                                                                                    | Quién lo usa                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `tsconfig.base.json` | TypeScript estricto: `strict`, `noUncheckedIndexedAccess` e `isolatedModules`                                                                                                             | El `tsconfig.json` de cada paquete con código, con `extends` |
| `eslint.config.js`   | ESLint 10 _flat_: typescript-eslint con tipos, `@eslint-react`, `react-hooks`, `jsx-a11y`, `i18next/no-literal-string` (textos fijos en JSX como error, D-169) y `eslint-config-prettier` | `eslint.config.js` de la raíz                                |
| `prettier.config.js` | Prettier por defecto con comillas simples                                                                                                                                                 | `prettier.config.js` de la raíz                              |

Un paquete nuevo con código:

```jsonc
// tsconfig.json
{
  "extends": "@lexis/config/tsconfig.base.json",
  "include": ["src"],
}
```

y en su `package.json`, `"typecheck": "tsc"` y `"@lexis/config": "workspace:*"` en `devDependencies`.

La configuración de ESLint tiene pruebas en `eslint.config.test.js` (Vitest y la API de ESLint, sin reglas con tipos). Se ejecutan con `pnpm test`. Si un atributo JSX que no se ve salta en `i18next/no-literal-string` (por ejemplo `role`), se añade a `jsx-attributes.exclude` junto con los que la regla excluye por defecto, y con su prueba.

Este paquete instala `typescript@~6.0.3` solo para typescript-eslint, que todavía no admite TypeScript 7. La comprobación de tipos usa el TypeScript 7 de cada paquete.
