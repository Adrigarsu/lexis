# ADR-013 · React Hook Form + Zod

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-120

- **Contexto:** formularios de cuenta, ajustes y edición de contenido en administración.
- **Decisión:** React Hook Form para el estado del formulario y Zod para los esquemas de validación.
- **Consecuencias:** los mismos esquemas Zod validan formularios y datos de sincronización, y viven en un paquete compartido. Los errores se anuncian con `aria-describedby`.
