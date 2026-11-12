# Pruebas y TDD

Cómo se aplica la decisión de [ADR-021](../adr/0021-estrategia-de-pruebas-con-tdd.md).

## Cómo se aplica TDD

TDD repite un ciclo corto: **rojo** (escribir una prueba que falla), **verde** (escribir el mínimo código que la hace pasar) y **refactorizar** (mejorar el código con las pruebas en verde). Se trabaja de fuera hacia dentro:

1. Cada criterio de aceptación de la historia (Dado / Cuando / Entonces) se convierte primero en una prueba de componente o E2E que falla.
2. Para hacerla pasar, cada pieza de lógica que falta se escribe con su propio ciclo rojo-verde-refactorizar de pruebas unitarias.
3. La historia está terminada cuando todas sus pruebas de aceptación están en verde y el CI pasa.

Cada prueba lleva el ID de su historia en el nombre (`HU-12 rates the card with keys 1-4`), así la matriz de trazabilidad llega hasta el código. Excepciones: los ajustes puramente visuales y los experimentos desechables (*spikes*), que se tiran y se reescriben con TDD si se quedan.

## Qué se prueba en cada nivel

| Nivel | Herramienta | Qué cubre en Lexis | Cuándo corre |
| --- | --- | --- | --- |
| Unitarias | Vitest | FSRS e intervalos; nivel adaptativo (D-110); orden componente → carácter → palabra (D-127); racha con descansos; valoración automática (tabla 3.2.1); pinyin y tonos; % de palabras conocidas; reglas de notificación (RF-66); lectura de listas importadas | Cada commit y cada PR |
| Componentes | Vitest + Testing Library + axe | Botones de valoración y teclas 1-4; carácter con pinyin; cuadrícula y su alternativa sin trazado; formularios con errores de Zod; hoja de ajustes de estudio | Cada PR |
| Integración | Vitest + IndexedDB falsa + Supabase simulado | Consultas de Dexie; cola de sincronización sin duplicados; *loaders* y redirecciones de rutas | Cada PR |
| Base de datos | pgTAP con `supabase test db` | Cada política RLS; contenido privado (D-126); registro de auditoría que no se puede modificar | Cada PR que toca `supabase/` |
| Extremo a extremo | Playwright + axe | Humo en Chromium: registro → metas → sesión diaria. Completa en Chromium y WebKit: sin conexión, dos dispositivos, solo teclado, panel de administración | Humo en cada PR; completa cada noche y antes de cada versión |
| Rendimiento | Lighthouse CI | Carga, interacción y puntuación de 90 o más (RNF-01 a RNF-04) | Cada PR |

Además, antes de cada versión se revisa a mano con VoiceOver (RNF-21), porque ninguna herramienta automática detecta todos los problemas de accesibilidad.

Orden en el CI: lint y tipos → unitarias, componentes e integración → base de datos → build → E2E de humo y Lighthouse. Si un paso falla, los siguientes no corren. La cobertura se mide con Vitest y se exige el 80 % solo en `lib/`, `db/`, `sync/` y los hooks de cada funcionalidad.
