# Sistema de diseño

> Origen: sistema de diseño «Lexis» en claude.ai, exportado el 12 de noviembre de 2026. Los valores están en [tokens.json](tokens.json); cada componente tiene su guía y su vista previa en [componentes/](componentes/). En el código, los tokens viven en `packages/design-tokens` (ADR-010) y este archivo se mantiene como guía de uso.

Lexis es una app para estudiar chino (HSK 1): una herramienta de estudio con un toque minimalista chino. Papel de arroz, tinta y jade: lo chino está en el origen de cada color y en la forma de la letra, no en adornos.

## Principios

1. **El carácter manda.** En las pantallas de estudio el único color fuerte es el del tono del carácter. La interfaz se queda en papel y tinta para no competir con él.
2. **Papel, no plástico.** Sin sombras. La profundidad se marca con un borde fino de 1px (`line`) y con el papel (`paper` frente a `surface`). Las hojas inferiores y los diálogos también llevan borde fino, y lo de detrás se oscurece con el velo (`scrim`).
3. **Un acento, poco.** El jade (`jade`) marca la acción principal de cada pantalla y nada más. Una sola acción en jade por pantalla.
4. **El color nunca va solo.** Tono, acierto o error se dicen también con marca de tono, icono o texto (WCAG 1.4.1).
5. **Accesible en los dos temas.** Todo texto cumple 4,5:1 y todo control 3:1, en claro y en oscuro.

## Color

Dos temas, `light` (Claro) y `dark` (Oscuro). El tema sigue al sistema por defecto y se cambia en Perfil › Apariencia.

### Base

| Token | Uso |
| --- | --- |
| `paper` | Fondo de página. 宣纸, papel de arroz. |
| `surface` | Tarjetas, hojas, diálogos, cuadrícula. |
| `surface-sunken` | Pistas de barras, segmentos, selección del menú lateral. |
| `line` | Separadores decorativos. No vale como borde de control. |
| `line-strong` | Borde de campos, casillas y botones secundarios (3,4:1). |
| `ink` | Texto principal. 墨, tinta. |
| `ink-2` | Texto secundario, ayudas y placeholders. |

### Acento y marca

- `jade` (玉): botón principal, enlaces y estado correcto. Texto sobre él: `on-jade`.
- `jade-bright`: lo que no es texto y debe verse: barras de progreso, interruptor activo, anillo de foco, siguiente trazo.
- `jade-tint`: fondo de seleccionado y de corrección acertada. Encima, `ink` o `jade`.
- `seal` (朱, sello): solo en el logo y la marca de racha. Nunca en pantallas de estudio, porque se parece al rojo del 1.er tono.

### Estados

`success` es el propio jade. `warning` (琥珀, ámbar) para avisos que no bloquean, como sin conexión o racha en riesgo. `danger` (胭脂, carmín) para errores y acciones destructivas. Cada uno tiene su `-tint` de fondo. Siempre con icono y texto.

### Colores de tono

Sistema tradicional: 1.º rojo, 2.º naranja, 3.º verde, 4.º azul y neutro gris (`tone-1` … `tone-5`).

- Se aplican al pinyin y, si el usuario quiere, también a los caracteres (Ajustes de estudio › Colores según el tono).
- **Siempre con la marca de tono** (ā á ǎ à a). El color ayuda a memorizar, pero no es la única pista.
- Rojo y verde son la pareja que más se confunde con daltonismo. Por eso se separan por luminosidad: el verde es muy oscuro en claro y muy claro en oscuro. Con protanopía, deuteranopía y tritanopía simuladas la diferencia mínima entre tonos es ΔE ≥ 15 en claro y ≥ 16 en oscuro.
- Mientras se responde un ejercicio de tonos se ocultan color y marca (D-94).

### Escritura

- `pen`: azul bolígrafo para los trazos del usuario (D-105). Se desactiva en Ajustes de estudio y entonces los trazos van en `ink`.
- `stroke-outline`: contorno del carácter en la guía «contorno completo».
- `stroke-hint`: el siguiente trazo en la Pista y en la guía «siguiente trazo».
- `grid-line`: líneas del 田字格.

## Tipografía

| Familia | Fuente | Para qué |
| --- | --- | --- |
| `sans` | Inter + Noto Sans SC | Toda la interfaz y el pinyin. |
| `kai` | LXGW WenKai (楷体) | Caracteres de estudio por defecto: tarjetas, fichas, escritura, lecturas. |
| `hei` | Noto Sans SC (黑体) | Alternativa elegible en Ajustes de estudio. |
| `song` | Noto Serif SC (宋体) | Alternativa elegible en Ajustes de estudio. |

- Por defecto, Kai: tiene la forma de la escritura a mano y coincide con la animación de trazos. El usuario puede cambiarla en Ajustes de estudio › Fuente de los caracteres (D-106).
- Las cuatro tienen licencia SIL OFL 1.1. Inter y Noto se sirven desde Google Fonts. LXGW WenKai se aloja en la app como subconjunto de los caracteres del curso (HSK 1 más el conjunto extra), para que pese poco y funcione sin conexión.
- Escala: `title-1` 28, `title-2` 22, `title-3` 18, `body` 16, `body-sm` 14, `label` 14, `button` 16 y `caption` 12. No hay texto por debajo de 12px, y los campos van a 16px para que iOS no haga zoom.
- Caracteres: `hanzi-hero` 96 (tarjeta), `hanzi-xl` 64 (ficha y escritura), `hanzi-lg` 32, `hanzi-read` 22 con interlineado 2,1 (deja sitio al pinyin) y `hanzi-sm` 18.
- El pinyin siempre en ruby bajo cada carácter (D-85): `pinyin-lg`, `pinyin-md` y `pinyin-ruby`. La opacidad la elige el usuario.
- El tamaño de letra de la app (100–200 %) escala todo, caracteres incluidos (RNF-23).

## Espaciado, radios y medidas

- Escala de 4px: `space-1` 4 … `space-16` 64. Margen lateral de 20px en móvil (`space-5`) y de 40px en escritorio (`space-10`).
- Radios sobrios (D-107): `radius-sm` 6 para chips y casillas, `radius-md` 8 para botones y campos, `radius-lg` 10 para tarjetas, `radius-xl` 16 para hojas y diálogos, y `radius-pill` solo para los botones redondos de audio y el avatar.
- Bordes: `border-hair` (1px, `line`) en tarjetas, filas, hojas y diálogos; `border-control` (1px, `line-strong`) en campos y botones secundarios; `border-selected` (2px, `ink` o `jade`) para lo elegido.
- Sin sombras. El único «halo» es el anillo de foco (`focus-ring`), obligatorio por accesibilidad.
- Todo lo que se toca mide al menos `touch-min` (44px). Botón principal y botones de valorar: `control-h-lg` (52px).
- Escritorio desde `bp-desktop` (1024px): menú lateral (`sidebar-w`) y cuadrícula a la derecha del texto (D-92).

## Movimiento

Corto y funcional. Se respeta `prefers-reduced-motion`: en ese caso, sin desplazamientos, solo cambios de opacidad.

- Rápido, 120 ms: estados de botón, interruptores.
- Base, 200 ms: girar la tarjeta, abrir una hoja inferior.
- Lento, 320 ms: aparición de diálogos y del aviso de desbloqueo.
- Curva estándar: `cubic-bezier(0.2, 0, 0, 1)`.
- La animación del orden de trazos la marca Hanzi Writer y se puede repetir o pausar.

## Iconografía

Iconos de trazo de 2px en rejilla de 24px, con esquinas redondeadas y siempre en `currentColor`. Por ejemplo, Lucide, con licencia ISC. Los iconos solos llevan `aria-label`. Nada de emojis en la interfaz.

## Voz y contenido

- Español de España, tuteo, frases cortas. Mayúscula solo al inicio.
- Botones con verbo: «Comprobar», «Estudiar hoy», «Guardar tarjeta».
- Errores: qué pasa y qué hacer, sin culpas. Por ejemplo: «No se ha podido subir a la nube. Lo intentaremos de nuevo».
- Estado de guardado: «Guardado en la nube», «Guardado en este dispositivo» o «No se ha podido subir a la nube», nunca un número de cambios (D-99).
- Sin textos de relleno (D-88): si falta un dato, el hueco va entre corchetes, por ejemplo [18], solo en los diseños.

## Accesibilidad

WCAG 2.2 AA en los dos temas. Texto 4,5:1. Controles, bordes de campo, iconos y anillo de foco 3:1. Foco visible con `focus-ring` en todo elemento interactivo. Objetivos de 44px. Nada se comunica solo con color.

## Componentes

Todos los estilos están en `componentes/bundle.css` con el prefijo `lx-` y solo usan tokens. Envuelve la app (o la vista previa) en un elemento con la clase `lx`. Cada componente tiene su guía en `componentes/<Comp>/README.md`.
