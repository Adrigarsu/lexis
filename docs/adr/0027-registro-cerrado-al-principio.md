# ADR-027 · Registro cerrado al principio

- **Estado:** Aceptado
- **Fecha:** 2026-11-18
- **Registro:** D-163

- **Contexto:** el registro abierto a cualquiera (D-37) obliga a tener antes CAPTCHA con Turnstile (ADR-015), SMTP propio para los correos (ADR-014), la política de privacidad y exportar y borrar la cuenta (RGPD). La desarrolladora quiere usar la app con cuentas reales antes de tener todo eso, que llega en el milestone 5 (D-166).
- **Decisión:** el registro público está desactivado en Supabase Auth (`enable_signup = false` en el proyecto de la nube y en `supabase/config.toml`). La desarrolladora da de alta cada cuenta a mano desde el panel de Supabase, con email y contraseña y el email ya confirmado, y le asigna el rol en `user_role` (D-67). Cómo invitar a otras personas se decide más adelante.
- **Consecuencias:**
  - En los milestones 2 a 4 no hacen falta CAPTCHA, SMTP ni verificación del email.
  - Las pantallas de crear cuenta, verificar el email y recuperar la contraseña no se ofrecen hasta el milestone 5. Si alguien olvida su contraseña, la desarrolladora se la cambia desde el panel de Supabase.
  - Las personas que usen la app antes del milestone 5 son conocidas, pero sus datos siguen sujetos al RGPD. La política de privacidad llega con el registro abierto.
  - ADR-014 y ADR-015 siguen aceptados y se aplican en el milestone 5. Abrir el registro será una decisión nueva que sustituya a esta.
