# ADR-003 · Sin conexión primero con Dexie

- **Estado:** Aceptado
- **Fecha:** 2026-11-08
- **Registro:** D-07, D-16, D-72

- **Contexto:** se estudia en el metro y sin red; la app no puede depender de la nube.
- **Decisión:** IndexedDB con Dexie como fuente de verdad local; la nube sincroniza en segundo plano.
- **Consecuencias:** la app es rápida y funciona siempre. A cambio hay que diseñar la sincronización y los conflictos (pendiente en esta fase).
