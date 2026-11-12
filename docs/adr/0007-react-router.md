# ADR-007 · React Router

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-114

- **Contexto:** 88 pantallas entre móvil, escritorio y administración, con rutas protegidas por sesión.
- **Decisión:** React Router en modo de datos (`createBrowserRouter`), con carga diferida por ruta.
- **Consecuencias:** la librería de rutas más usada y documentada. La zona de administración va en un fragmento aparte que el estudiante nunca descarga.
