# Lexis

App web instalable (PWA) y gratuita para estudiar chino del **HSK 1** (estándar 3.0) en el móvil y el ordenador: tarjetas con repetición espaciada (FSRS), escritura de caracteres con el orden de los trazos, tonos y pronunciación, gramática y lecturas graduadas. Funciona sin conexión y sincroniza el progreso entre dispositivos.

> Estado: cimientos técnicos (milestone 1). El esqueleto del monorepo ya funciona; todavía no hay funcionalidades de la app.

## Documentación

Todo el diseño del producto está en [`docs/`](docs/README.md):

- [Visión y objetivos](docs/producto/vision.md) · [Requisitos](docs/producto/requisitos.md) · [Historias de usuario](docs/producto/historias/README.md)
- [Arquitectura](docs/arquitectura/arquitectura.md) · [Decisiones de arquitectura (ADR)](docs/adr/README.md) · [Esquema de datos](docs/datos/esquema.md)
- [Pantallas](docs/diseno/pantallas/README.md) · [Flujo de pantallas](docs/diseno/flujo-pantallas.md) · [Sistema de diseño](docs/diseno/sistema-diseno.md)
- [Registro de decisiones](docs/decisiones.md) · [Flujo de trabajo](docs/proceso/flujo-trabajo.md)

## Stack

React 19, TypeScript, Vite, Dexie (IndexedDB), Tailwind CSS, React Aria, ts-fsrs y Supabase, en un monorepo con pnpm. Detalle y motivos en los [ADR](docs/adr/README.md).

## Preparar el entorno

Requisitos: Node.js 26 (ver `.nvmrc`), pnpm y GitHub CLI. pnpm se instala una vez con `npm i -g pnpm` y cambia solo a la versión fijada en `packageManager` del `package.json` (ADR-024).

```bash
git clone https://github.com/Adrigarsu/lexis.git
cd lexis
pnpm install                          # instala todo el monorepo y los hooks de Git (Lefthook)
pnpm dev                              # arranca la app en http://localhost:5173
pnpm build                            # compila todos los paquetes
```

### Base de datos local (Supabase)

Hace falta [Docker Desktop](https://www.docker.com/products/docker-desktop/) abierto. La CLI de Supabase viene con `pnpm install`, en la versión fijada en el `package.json` (D-158). La primera vez, `supabase start` descarga las imágenes de Docker y tarda unos minutos.

```bash
pnpm exec supabase start              # levanta Postgres, Auth, Storage y Studio en local
pnpm exec supabase status             # URL, claves locales y Studio (http://127.0.0.1:55323)
pnpm test:db                          # pruebas pgTAP de supabase/tests
pnpm exec supabase stop               # para los contenedores
```

Lexis usa los puertos 553xx (API en 55321, Postgres en 55322 y Studio en 55323) en lugar de los 543xx de Supabase, para poder convivir con otros proyectos de Supabase locales. Si otro proyecto ocupa un puerto, `supabase start` falla con «port is already allocated»: páralo con `pnpm exec supabase stop --project-id <nombre>`.

Las variables de entorno van en un `.env.local` en la raíz, copiado de [`.env.example`](.env.example). En local, sus valores salen de `supabase status`. Los archivos `.env` nunca se suben al repositorio. El proyecto de Supabase en la nube todavía no existe: se creará con la issue que conecte la app.

`pnpm install` instala también los hooks de Git con Lefthook: en cada commit, commitlint revisa el mensaje, se rechaza cualquier firma de Claude, Prettier formatea los archivos preparados y ESLint los comprueba. Los demás comandos (`pnpm lint`, `pnpm typecheck`, `pnpm format`…) están en [convenciones.md](docs/proceso/convenciones.md#comandos).

### Si tu clon tenía `.githooks`

Antes de Lefthook, los hooks se activaban con `git config core.hooksPath .githooks`. Lefthook no se instala mientras ese ajuste exista, así que `pnpm install` lo quita solo (`lefthook install --reset-hooks-path`). Si pnpm dice «Already up to date» y no instala nada, hazlo a mano:

```bash
git config --unset core.hooksPath
pnpm exec lefthook install
```

### Pruebas de extremo a extremo

Las pruebas E2E usan Playwright, que necesita sus propios navegadores. Se instalan una vez, y otra cada vez que se actualiza `@playwright/test`:

```bash
pnpm --filter @lexis/e2e exec playwright install chromium webkit
# en Linux, con las librerías del sistema:
pnpm --filter @lexis/e2e exec playwright install --with-deps chromium webkit
```

Después:

```bash
pnpm test:e2e        # humo (@humo) en Chromium: compila la app y la sirve con vite preview
pnpm test:e2e:full   # todas las pruebas en Chromium y WebKit
```

Los informes quedan en `e2e/playwright-report/` (se abren con `pnpm --filter @lexis/e2e exec playwright show-report`).

### Integración continua

Cada PR y cada push a `main` pasan por el CI de GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): lint, formato y tipos, pruebas con cobertura, pgTAP, build y E2E de humo en Chromium, en ese orden. Si un paso falla, el resto no corre y, si falla el E2E, el informe de Playwright se descarga desde la ejecución (artefacto `playwright-report`).

## Licencia

Código bajo licencia [MIT](LICENSE). Los datos de terceros (vocabulario, trazos, audio) tendrán su propia licencia y atribución en `NOTICE`; el contenido propio (significados, frases, lecturas y gramática), CC BY-SA 4.0.
