# ADR-014 · SMTP propio con un email dedicado

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-121

- **Contexto:** el SMTP por defecto de Supabase solo envía a miembros del equipo y como máximo 2 correos por hora, así que no sirve para usuarios reales. Resend gratis requiere dominio propio.
- **Decisión:** una cuenta de email nueva solo para Lexis (por ejemplo Gmail, con verificación en dos pasos y contraseña de aplicación) como SMTP personalizado en Supabase Auth.
- **Consecuencias:** coste 0 y suficiente para confirmaciones y recuperación de contraseña en un proyecto pequeño. Gmail limita los envíos diarios; si Lexis crece, se pasa a Resend con un dominio. La contraseña de aplicación vive solo en el panel de Supabase, nunca en el repositorio.
