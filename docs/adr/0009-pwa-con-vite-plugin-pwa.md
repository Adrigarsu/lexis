# ADR-009 · PWA con vite-plugin-pwa

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-116

- **Contexto:** instalación en el móvil y funcionamiento sin red.
- **Decisión:** vite-plugin-pwa, que genera el manifiesto y un service worker de Workbox. App y fuentes se precachean; el audio se guarda en caché al primer uso.
- **Consecuencias:** caché versionada y actualización con aviso «Hay una versión nueva». Hay que vigilar el tamaño del precaché.
