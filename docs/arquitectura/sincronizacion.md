# Sincronización sin conexión

Cómo funciona la decisión de [ADR-023](../adr/0023-sincronizacion-sin-conexion.md).

## Cómo funciona

1. **Escribir:** cada cambio se hace en una sola transacción de Dexie: la fila y su entrada en `outbox` (tabla, id, tipo de operación, datos, intentos). La interfaz solo lee de Dexie (ADR-008), así que ve el cambio al instante.
2. **Cuándo se sincroniza:** al abrir la app, al recuperar la conexión, al terminar una sesión o lectura, cada 5 minutos con la app abierta, y en segundo plano donde el navegador lo permita.
3. **Subir:** la cola se envía en orden, en lotes de 100, a la función `sync_push`. Es una sola transacción por lote y se ejecuta con los permisos del usuario, así que RLS se aplica igual. Reenviar un lote no duplica nada: todo usa el UUID creado en el dispositivo.
4. **Bajar:** para cada tabla se piden las filas con `updated_at` posterior al cursor guardado, y los `tombstone` posteriores al último leído. El cursor retrocede 5 minutos en cada petición para no perder transacciones que terminaron tarde; aplicar una fila dos veces no cambia nada.
5. **Recalcular:** las prácticas que recibieron repasos de otro dispositivo recalculan su estado FSRS y su nivel desde `review_log` (D-81). Los dos dispositivos llegan al mismo resultado porque parten del mismo historial.

## Reglas de conflicto

| Tipo de dato | Tablas | Regla |
| --- | --- | --- |
| Historiales | `review_log`, `reading_attempt`, `tone_attempt` | Solo se añaden filas con UUID único: nunca hay conflicto |
| Prácticas | `practice` | Id determinista (UUID v5 de usuario + elemento + habilidad). Dos dispositivos que crean la misma práctica sin conexión crean la misma fila; su estado se recalcula del historial |
| Ajustes y recordatorios | `profile`, `reminder` | Gana el cambio más reciente de la fila (*last write wins*) |
| Contenido propio | `course`, `course_item`, `word`, `character`, `reading` y sus hijas | Gana el cambio más reciente; un borrado gana siempre a una edición (D-135) |
| Contenido común | Tablas de contenido sin dueño | Solo se baja: los estudiantes no lo editan |

**Dos marcas de tiempo por fila editable.** `client_updated_at` la pone el dispositivo y decide quién gana un conflicto. `updated_at` la pone el servidor con un trigger y sirve de cursor para bajar cambios. Así, un reloj mal puesto en un dispositivo puede decidir mal un conflicto, pero nunca hace que otro dispositivo se salte filas.

## Errores y reintentos

- **Sin red o el servidor no responde:** se reintenta con espera creciente (1 s, 2 s, 4 s… hasta 5 minutos, con un margen aleatorio). Indicador: «Guardado en este dispositivo».
- **Sesión caducada:** se renueva el token y se reintenta sin avisar.
- **Cambio rechazado** (por ejemplo, un nombre de usuario ya ocupado o un límite superado): esa entrada se marca como fallida y las demás siguen. Indicador: «No se ha podido subir a la nube», con el detalle al tocarlo (D-99).
- **Más de 90 días sin sincronizar:** los `tombstone` ya se han purgado, así que el dispositivo descarga todo de nuevo antes de subir su cola.
- **Cerrar sesión con cambios sin subir:** la app avisa y propone sincronizar antes. Al cerrar sesión se borra la base local, para que otra persona no vea nada en ese dispositivo (HU-03). Cada cuenta tiene su propia base en IndexedDB.

Pruebas (ADR-021): unitarias de la cola y de cada regla de conflicto, e integración con dos dispositivos simulados que trabajan sin conexión y luego sincronizan (RNF-06, HU-66).
