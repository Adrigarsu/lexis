# Pruebas y TDD

Cómo se aplica la decisión de [ADR-021](../adr/0021-estrategia-de-pruebas-con-tdd.md).

## Cómo se aplica TDD

TDD repite un ciclo corto: **rojo** (escribir una prueba que falla), **verde** (escribir el mínimo código que la hace pasar) y **refactorizar** (mejorar el código con las pruebas en verde). Se trabaja de fuera hacia dentro:

1. Cada criterio de aceptación de la historia (Dado / Cuando / Entonces) se convierte primero en una prueba de componente o E2E que falla.
2. Para hacerla pasar, cada pieza de lógica que falta se escribe con su propio ciclo rojo-verde-refactorizar de pruebas unitarias.
3. La historia está terminada cuando todas sus pruebas de aceptación están en verde y el CI pasa.

Cada prueba lleva el ID de su historia en el nombre (`HU-12 rates the card with keys 1-4`), así la matriz de trazabilidad llega hasta el código. Las pruebas de humo de infraestructura, que no pertenecen a ninguna historia, no llevan ID (D-157). Excepciones a TDD: los ajustes puramente visuales y los experimentos desechables (_spikes_), que se tiran y se reescriben con TDD si se quedan.

## Qué se prueba en cada nivel

| Nivel             | Herramienta                                  | Qué cubre en Lexis                                                                                                                                                                                                                                          | Cuándo corre                                                 |
| ----------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Unitarias         | Vitest                                       | FSRS e intervalos; nivel adaptativo (D-110); orden componente → carácter → palabra (D-127); racha con descansos; valoración automática (tabla 3.2.1); pinyin y tonos; % de palabras conocidas; reglas de notificación (RF-66); lectura de listas importadas | Cada commit y cada PR                                        |
| Componentes       | Vitest + Testing Library + axe               | Botones de valoración y teclas 1-4; carácter con pinyin; cuadrícula y su alternativa sin trazado; formularios con errores de Zod; hoja de ajustes de estudio                                                                                                | Cada PR                                                      |
| Integración       | Vitest + IndexedDB falsa + Supabase simulado | Consultas de Dexie; cola de sincronización sin duplicados; _loaders_ y redirecciones de rutas                                                                                                                                                               | Cada PR                                                      |
| Base de datos     | pgTAP con `supabase test db`                 | Cada política RLS; contenido privado (D-126); registro de auditoría que no se puede modificar                                                                                                                                                               | Cada PR                                                      |
| Extremo a extremo | Playwright + axe                             | Humo en Chromium: registro → metas → sesión diaria. Completa en Chromium y WebKit: sin conexión, dos dispositivos, solo teclado, panel de administración                                                                                                    | Humo en cada PR; completa cada noche y antes de cada versión |
| Rendimiento       | Lighthouse CI                                | Carga, interacción y puntuación de 90 o más (RNF-01 a RNF-04)                                                                                                                                                                                               | Cada PR                                                      |

Además, antes de cada versión se revisa a mano con VoiceOver (RNF-21), porque ninguna herramienta automática detecta todos los problemas de accesibilidad.

Las pruebas de base de datos viven en `supabase/tests/` y se ejecutan con `pnpm test:db` sobre la base local (D-158). Para probar una política RLS, la prueba crea usuarios en `auth.users` y se hace pasar por uno con `set local role authenticated` y `set_config('request.jwt.claims', '{"sub": "<uuid>"}', true)`, o por un visitante con `set local role anon`. `01_rls_enabled_test.sql` falla si alguna tabla de `public` no tiene RLS. pgTAP no se ejecuta contra la nube: las migraciones llegan allí ya probadas, con el workflow `deploy-db` (D-167).

Las pruebas E2E viven en el paquete `e2e/` (D-156). Playwright compila la app y la sirve con `vite preview`, igual que se publica. Las pruebas de humo llevan la etiqueta `@humo`: `pnpm test:e2e` ejecuta solo esas en Chromium, y `pnpm test:e2e:full`, todas en Chromium y WebKit.

Orden en el CI: lint y tipos → unitarias, componentes e integración → base de datos → build → E2E de humo y Lighthouse. Si un paso falla, los siguientes no corren. El CI es [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) (D-159): un solo job `ci` en cada PR y en cada push a `main`, que ejecuta `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test:coverage`, `pnpm test:db` (solo con Postgres, `supabase db start`), `pnpm build` y `pnpm test:e2e`, en menos de 10 minutos (D-77). Lighthouse CI se añadirá con su issue. La cobertura se mide con Vitest y se exige el 80 % solo en `lib/`, `db/`, `sync/` y los hooks de cada funcionalidad.

## Cómo se ejecutan

Configuración en D-157 y [ADR-026](../adr/0026-entorno-de-vitest.md).

| Comando                | Qué hace                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm test`            | Unitarias, componentes e integración de todos los paquetes con `vitest.config.ts`              |
| `pnpm test -t "HU-12"` | Solo las pruebas cuyo nombre contiene `HU-12`                                                  |
| `pnpm test:coverage`   | Lo mismo, con cobertura v8 y el umbral del 80 % en `lib/`, `db/`, `sync/` y los hooks (`use*`) |

- Cada prueba va junto a su código: `Card.tsx` y `Card.test.tsx`.
- Las pruebas de `apps/web` corren en jsdom, sin globales: `describe`, `it` y `expect` se importan de `vitest`. El _setup_ (`src/test/setup.ts`) ya carga los _matchers_ de jest-dom (`toBeInTheDocument`…) y una IndexedDB en memoria (`fake-indexeddb`) para Dexie.
- Accesibilidad en componentes: `await expectNoAxeViolations(container)` de `src/test/axe.ts`. jsdom no calcula estilos, así que axe no mide el contraste; de eso se encargan Playwright + axe y Lighthouse.
- La cobertura es de todo el proyecto: un archivo de `lib/` o un hook sin probar hace fallar `pnpm test:coverage` aunque lo demás esté cubierto.
