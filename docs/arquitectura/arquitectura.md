# Arquitectura

> Origen: «Lexis · Arquitectura (ADR)» en claude.ai, exportado el 12 de noviembre de 2026. Desde ahora la fuente de verdad es este archivo.

## Principios

1. **Coste 0 para la desarrolladora.** Solo planes gratuitos, sin tarjeta y sin facturación automática al superar límites.
2. **Sin conexión primero.** La app funciona entera sin red; la nube solo sincroniza y hace copia.
3. **Accesibilidad WCAG 2.2 AA.** Ninguna librería elegida puede impedirla.
4. **Seguridad y privacidad.** Datos mínimos, acceso por usuario con RLS y ningún dato personal en servicios de terceros.

## Visión general

Todo el estudio ocurre en el dispositivo. La red solo hace falta para descargar la app la primera vez, sincronizar el progreso y gestionar la cuenta. Así la transferencia pesada (audio, fuentes, trazos) va a Vercel, con 100 GB al mes, y Supabase solo mueve kilobytes de repasos.

```text
Dispositivo (PWA)
  Interfaz React (React Router, React Aria, Tailwind)
    → Estado: consultas vivas de Dexie + Zustand
    → IndexedDB (Dexie): fuente de verdad local, FSRS en el dispositivo
  Service worker: caché de la app, fuentes y audio
        │
        ├─ Vercel Hobby ── web, audio, fuentes, trazos (100 GB/mes)
        ├─ Supabase ────── Auth, Postgres + RLS, sync_push, Edge Functions, pg_cron
        │                     └─ SMTP propio (correos de cuenta)
        ├─ Turnstile ───── CAPTCHA en registro e inicio de sesión
        └─ Sentry ──────── errores sin datos personales
```

## Qué es una decisión de arquitectura

Arquitectura es la arquitectura del producto (D-149). Una decisión es de arquitectura si cambia cómo está construido Lexis:

- las tecnologías y servicios que usa, y cómo se reparten sus piezas (dispositivo, nube, servicios externos);
- el modelo de datos y la sincronización;
- los patrones que atraviesan varios módulos (estado, rutas, traducciones, PWA);
- la seguridad y el rendimiento;
- la estructura del repositorio;
- la estrategia de pruebas y las convenciones del código.

Estas decisiones llevan un ADR en [adr/](../adr/README.md), además de su fila en [decisiones.md](../decisiones.md).

No son de arquitectura, y solo van a `decisiones.md`:

- qué hace el producto (requisitos, historias, contenido);
- cómo se ve (diseño, textos);
- cómo se trabaja (flujo, skills, issues).

La skill `registrar-decision` aplica esta definición.

## Decisiones

Cada decisión está en su ADR: [lista completa](../adr/README.md). Las que más se consultan al programar:

- Rutas y acceso: [rutas.md](rutas.md)
- Sincronización sin conexión: [sincronizacion.md](sincronizacion.md) (ADR-023)
- Pruebas y TDD: [pruebas.md](pruebas.md) (ADR-021)
- Estructura del repositorio: [ADR-018](../adr/0018-estructura-del-repositorio.md)
- Convenciones: [convenciones.md](../proceso/convenciones.md) (ADR-019)
- Esquema de datos: [esquema.md](../datos/esquema.md) (ADR-022)
