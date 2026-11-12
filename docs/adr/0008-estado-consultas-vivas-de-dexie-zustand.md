# ADR-008 · Estado: consultas vivas de Dexie + Zustand

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-115

- **Contexto:** casi todo el estado son datos guardados (tarjetas, repasos, progreso); poco es estado de interfaz.
- **Decisión:** los datos se leen con `useLiveQuery` de Dexie, que repinta solo al cambiar la base local. Zustand guarda lo efímero: sesión de estudio en curso, tema, preferencias de interfaz.
- **Consecuencias:** una sola fuente de verdad (IndexedDB) y sin duplicar datos en memoria. No hace falta Redux ni TanStack Query, porque la red no es la fuente.
