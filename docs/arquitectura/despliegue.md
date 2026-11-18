# Despliegue en Vercel

Decidido en ADR-006 y D-113, y puesto en marcha en HU-74 con D-167. La web se sirve desde Vercel en el plan Hobby, con un dominio `*.vercel.app`. Supabase no interviene en el despliegue de la web.

## Cómo se despliega

Vercel está conectado al repositorio `Adrigarsu/lexis` con su integración de Git, es decir, la app de Vercel instalada en GitHub. No hay ningún workflow de despliegue en GitHub Actions ni token de Vercel en GitHub.

| Cuándo                      | Qué pasa                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Se sube un commit a una PR  | Vercel compila una **vista previa** con su propia URL y la comenta en la PR. Cada commit tiene la suya.    |
| Se fusiona una PR en `main` | Vercel compila la versión de **producción** y la publica en `https://lexis-mu-indol.vercel.app`.           |
| El commit no toca la web    | No se compila nada: la PR muestra el despliegue como cancelado (_Ignored Build Step_). Ver «Qué se salta». |

El despliegue no espera al CI: Vercel compila en paralelo con el job `ci`. Lo que impide fusionar algo roto sigue siendo el _ruleset_ «main» (D-159).

Las PR de Dependabot también tienen vista previa, porque el repositorio es público.

## Configuración

La configuración de compilación está versionada en [apps/web/vercel.json](../../apps/web/vercel.json), así que se revisa en las PR como cualquier código. En el panel del proyecto solo quedan los ajustes que `vercel.json` no admite:

| Ajuste                | Valor                                                                    | Dónde         |
| --------------------- | ------------------------------------------------------------------------ | ------------- |
| Plan                  | Hobby                                                                    | Panel         |
| Proyecto              | `lexis`                                                                  | Panel         |
| Directorio raíz       | `apps/web`                                                               | Panel         |
| Rama de producción    | `main`                                                                   | Panel         |
| Node.js               | 26.x, de `engines` en `package.json`                                     | Panel         |
| Framework             | Vite                                                                     | `vercel.json` |
| Instalación           | `pnpm install --frozen-lockfile --ignore-scripts --filter @lexis/web...` | `vercel.json` |
| Compilación           | `pnpm --filter @lexis/web... build`                                      | `vercel.json` |
| Salida                | `dist`                                                                   | `vercel.json` |
| Saltar la compilación | `ignoreCommand`                                                          | `vercel.json` |

- **Solo `apps/web`.** El filtro `@lexis/web...` instala y compila la web y los paquetes del workspace de los que depende, nada más.
- **pnpm sin Corepack.** Vercel lee la versión de `packageManager` (ADR-024).
- **`--ignore-scripts`.** En la máquina de compilación no hay repositorio Git, así que el `prepare` de la raíz (`lefthook install`) fallaría. El otro script que se ejecuta, el `postinstall` de la CLI de Supabase, tampoco hace falta para compilar la web.

## Qué se salta

El `ignoreCommand` compara el commit con el anterior. Si no cambia nada de esto, no se compila:

- `apps/web/`
- `packages/`
- `package.json`, `pnpm-lock.yaml` y `pnpm-workspace.yaml` de la raíz

Así, una PR que solo toca `docs/`, `.claude/`, `supabase/`, `e2e/` o `.github/` no gasta compilaciones y no tiene vista previa. Si un día la web empieza a depender de otra carpeta, hay que añadirla al `ignoreCommand`.

## Quién puede ver cada despliegue

- **Vistas previas:** protegidas con Vercel Authentication, la opción por defecto de Vercel (_Standard Protection_). Solo las ve quien ha iniciado sesión en Vercel con la cuenta del proyecto. Para probarlas en el móvil, inicia sesión en vercel.com en el navegador del móvil.
- **Producción:** pública en `lexis-mu-indol.vercel.app`.

No hay ningún _Protection Bypass for Automation_. Si alguna vez hace falta, por ejemplo para pasar los E2E contra una vista previa, se decide en su propia issue.

## Variables de entorno

Viven solo en el panel de Vercel (_Settings → Environment Variables_), separadas por entorno (_Production_ y _Preview_), y nunca en el repositorio. Hoy la web no necesita ninguna. Cuando llegue Supabase en la nube (HU-75), sus `VITE_*` se añaden ahí con `vercel env add`. En local se siguen leyendo del `.env.local` de la raíz (D-158).

`vercel link` y `vercel env pull` crean un `.env.local` con un `VERCEL_OIDC_TOKEN` en la carpeta donde se ejecutan. El `.gitignore` lo ignora, pero no lo uses como `.env.local` de la raíz: bórralo.

## Recrear o enlazar el proyecto

Con la CLI de Vercel y la sesión de la desarrolladora:

```sh
pnpm dlx vercel@latest login
pnpm dlx vercel@latest link --yes --project lexis   # desde la raíz del repositorio
```

`vercel link` crea `.vercel/` (ignorado en Git) y, si el proyecto es nuevo, lo conecta a GitHub. Si el directorio raíz no es `apps/web`, se cambia en el panel (_Settings → Build and Deployment_) o con la API. Ojo con dos efectos de la CLI: `link` añade líneas al `.gitignore` (deshazlas, ya están cubiertas) y `vercel curl` crea un _Protection Bypass for Automation_ en el proyecto (revócalo si no lo necesitas).

## Límites del plan Hobby

100 GB de transferencia al mes. Al superarlos Vercel pausa, no cobra (ADR-006). El plan es solo para uso no comercial; la salida prevista sería Cloudflare Pages.
