# ADR-010 · Tailwind CSS con los tokens de Lexis

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-117

- **Contexto:** el sistema de diseño ya existe en `tokens.json` con tema claro y oscuro.
- **Decisión:** Tailwind CSS v4, con su tema generado desde `tokens.json` como variables CSS. No se usan colores sueltos fuera de los tokens.
- **Consecuencias:** diseño y código comparten una fuente. El tema oscuro cambia solo las variables. Las clases largas se agrupan en componentes.
