# ADR-023 · Sincronización sin conexión

- **Estado:** Aceptado
- **Fecha:** 2026-11-12
- **Registro:** D-136

- **Contexto:** la app funciona entera sin red (ADR-003), con varios dispositivos por usuario. Nada puede perderse ni duplicarse (RNF-06), y el indicador de guardado debe decir siempre dónde están los datos (D-99).
- **Decisión:** el dispositivo es la fuente de verdad mientras trabaja. Cada cambio se guarda en IndexedDB junto con una entrada en una cola de salida (*outbox*). Al sincronizar, primero se sube la cola y luego se baja lo que cambió en el servidor. Los conflictos se resuelven con reglas fijas por tipo de tabla.
- **Consecuencias:** la interfaz nunca espera a la red y la sincronización se puede probar con dos dispositivos simulados. A cambio, hay que mantener dos marcas de tiempo por fila y una función de Postgres para subir los cambios.

Detalle: [sincronizacion.md](../arquitectura/sincronizacion.md).
