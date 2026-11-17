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
git config core.hooksPath .githooks   # activa la comprobación de mensajes de commit
pnpm install                          # instala todo el monorepo
pnpm dev                              # arranca la app en http://localhost:5173
pnpm build                            # compila todos los paquetes
```

El resto de comandos (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e` y `pnpm format`) llegan con sus issues del milestone 1.

## Licencia

Código bajo licencia [MIT](LICENSE). Los datos de terceros (vocabulario, trazos, audio) tendrán su propia licencia y atribución en `NOTICE`; el contenido propio (significados, frases, lecturas y gramática), CC BY-SA 4.0.
