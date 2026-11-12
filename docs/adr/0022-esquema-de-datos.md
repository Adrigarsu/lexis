# ADR-022 · Esquema de datos

- **Estado:** Aceptado
- **Fecha:** 2026-11-12
- **Registro:** D-134, D-135

- **Contexto:** el modelo de la fase 3 (21 tablas, D-81) no recogía los componentes, el contenido privado, el orden componente → carácter → palabra ni el nivel adaptativo. Además, Supabase ya no expone las tablas nuevas a la API sin un permiso explícito.
- **Decisión:** 24 tablas en tres zonas, con UUID v7 creados en el dispositivo, claves foráneas reales en vez de referencias polimórficas, contenido común y propio en las mismas tablas (`owner_id`), historiales que solo crecen, `tombstone` para los borrados y, en cada migración, RLS y `GRANT` explícitos. Detalle completo en [Lexis · Esquema de datos](../datos/esquema.md).
- **Consecuencias:** el contenido propio reutiliza las pantallas y el código del común, y Postgres garantiza la integridad de cada referencia. A cambio, `review_log` crece unos 5,5 MB por usuario muy activo al año; si hace falta, se archivan los repasos antiguos.

Detalle: [esquema.md](../datos/esquema.md).
