# ADR-015 · Cloudflare Turnstile

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-122

- **Contexto:** registro e inicio de sesión públicos atraen bots.
- **Decisión:** Cloudflare Turnstile, integrado con la protección CAPTCHA de Supabase Auth.
- **Consecuencias:** gratis, normalmente invisible y sin acertijos de imágenes, lo que ayuda a la accesibilidad. Añade un script de Cloudflare solo en las pantallas de cuenta.
