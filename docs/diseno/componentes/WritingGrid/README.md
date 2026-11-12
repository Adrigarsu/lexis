# Cuadrícula de escritura

La cuadrícula 田字格 donde se escribe con el dedo o el ratón (HU-18). La corrección trazo a trazo la hace Hanzi Writer; este componente define su aspecto.

## Capas

| Clase | Qué es | Token |
| --- | --- | --- |
| `guide` | Líneas de la cuadrícula: cruz y diagonales punteadas | `grid-line` |
| `outline` | Contorno del carácter (guía «contorno completo») | `stroke-outline` |
| `stroke` | Los trazos del usuario | `pen` (azul bolígrafo, D-105) |
| `hint` | El siguiente trazo (Pista o guía «siguiente trazo») | `stroke-hint` |
| `miss` | Un trazo mal hecho, que se ve un momento y se borra | `danger` |

- Con el azul bolígrafo desactivado, el contenedor lleva `lx-pen-off` y los trazos van en `ink`.
- Medidas: `grid-cell` es 280px en móvil y 360px en escritorio, donde va a la derecha del texto (D-92). Fondo `surface`, borde `line-strong` y `touch-action: none` para que el dedo no desplace la página.
- Debajo, Pista y Borrar como botones secundarios. Usar la Pista cuenta para la valoración automática.
- Accesibilidad: `role="img"` con un `aria-label` que dice qué carácter es y cuántos trazos llevas. Para teclado y lector de pantalla hay una alternativa: elegir el carácter correcto entre varios (RNF-22, HU-23).
