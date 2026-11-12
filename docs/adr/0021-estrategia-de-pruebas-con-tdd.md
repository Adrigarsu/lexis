# ADR-021 · Estrategia de pruebas con TDD

- **Estado:** Aceptado
- **Fecha:** 2026-11-12
- **Registro:** D-133

- **Contexto:** la lógica de Lexis (FSRS, nivel adaptativo, orden de aprendizaje, racha, sincronización) decide qué estudia el usuario; un error ahí no se ve en pantalla, pero arruina el aprendizaje. Hay que cumplir el 80 % de cobertura en esa lógica (D-75), WCAG 2.2 AA y un CI de menos de 10 minutos (D-77).
- **Decisión:** desarrollo guiado por pruebas (TDD) en todo el código de la app, con pruebas en seis niveles.
- **Consecuencias:** cada historia de usuario empieza por sus pruebas y llega al PR ya cubierta. Al principio se avanza algo más despacio, y a cambio se puede cambiar el código sin miedo.

Detalle: [pruebas.md](../arquitectura/pruebas.md).
