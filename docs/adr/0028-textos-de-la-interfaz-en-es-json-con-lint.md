# ADR-028 · Textos de la interfaz en es.json con lint contra textos fijos

- **Estado:** Aceptado
- **Fecha:** 2026-11-18
- **Registro:** D-169

- **Contexto:** [ADR-012](0012-i18next.md) elige i18next, y RNF-33 prohíbe escribir textos de la interfaz en el código. Pero nada impedía escribir uno a mano, y una clave mal escrita solo se descubría al verla en pantalla.
- **Decisión:**
  - Una instancia de i18next en `apps/web/src/lib/i18n/`, con `locales/es.json` importado de forma estática y la inicialización síncrona (`initAsync: false`), para que `t()` funcione desde el primer render.
  - Claves con tipos mediante `CustomTypeOptions` (`lib/i18n/i18next.d.ts`).
  - Números, fechas y plurales con los formateadores de i18next sobre `Intl`.
  - La regla `i18next/no-literal-string` de `eslint-plugin-i18next`, en modo `jsx-only` y con nivel `error`, en la configuración compartida de `packages/config`, probada con la API de ESLint.
- **Consecuencias:**
  - Un texto fijo en JSX rompe `pnpm lint`, y por tanto el pre-commit y el CI. Una clave que no existe rompe `pnpm typecheck`.
  - Añadir un idioma es añadir un JSON y registrarlo en `resources`.
  - Los atributos que no se ven y que la regla no excluye por defecto (como `role` o `href`) se añaden a su `exclude` cuando aparezcan.
  - Las pruebas de componentes cargan i18n desde `src/test/setup.ts`. Para comprobar que un texto sale del JSON, cambian la traducción con `i18n.addResource`.
