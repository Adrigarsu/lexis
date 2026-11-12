# ADR-016 · Sentry gratis sin datos personales

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-123

- **Contexto:** hay que enterarse de los fallos que ocurren en móviles ajenos.
- **Decisión:** Sentry en su plan gratuito, con `sendDefaultPii: false`, sin IP, sin email, sin grabación de sesiones y con un `beforeSend` que borra datos de estudio.
- **Consecuencias:** errores con traza y versión sin exponer al usuario. Es la única excepción a «ningún tercero», así que RNF-17 debe mencionarla.
