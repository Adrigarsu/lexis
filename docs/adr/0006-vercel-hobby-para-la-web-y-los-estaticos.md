# ADR-006 · Vercel Hobby para la web y los estáticos

- **Estado:** Aceptado
- **Fecha:** 2026-11-10
- **Registro:** D-113

- **Contexto:** la transferencia es lo que se descarga de un servidor cada vez que alguien abre la app. Si el audio y las fuentes salieran de Supabase, sus 5 GB al mes se agotarían pronto.
- **Decisión:** la web, el audio, las fuentes y los datos de trazos se sirven desde Vercel Hobby, con dominio automático `*.vercel.app`. Supabase solo mueve datos pequeños de sincronización y cuentas.
- **Consecuencias:** 100 GB de transferencia al mes en Vercel y la PWA guarda en caché los estáticos, así que cada usuario los descarga casi una sola vez. Al superar el límite Vercel pausa en vez de cobrar. El plan Hobby es solo para uso no comercial; si Lexis llegara a cobrar, habría que mudarse (por ejemplo a Cloudflare Pages, con transferencia ilimitada y 500 compilaciones al mes).

Cada `git push` a la rama principal despliega una versión nueva; cada PR recibe su URL de vista previa.
