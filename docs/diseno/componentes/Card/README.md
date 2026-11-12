# Tarjeta

Agrupa un bloque de información. Va sobre `surface` con un borde fino `line`, sin sombra (D-107).

| Clase | Uso |
| --- | --- |
| `lx-card` | Datos y accesos: racha, lectura recomendada, una lista. Como `<a>`, al pasar por encima el borde pasa a `line-strong`. |
| `lx-card--hero` | La acción del día: «Estudiar hoy». Fondo `jade` y texto `on-jade`. Una por pantalla, y cuenta como el botón principal. |
| `lx-card--selected` | La tarjeta elegida en una selección (la lista abierta en escritorio). Borde de 2px en `ink`. |

Partes: `lx-card__eyebrow` (antetítulo), `lx-card__title` y `lx-card__meta`. Relleno `space-4` en móvil y `space-5` o `space-6` en escritorio.

- Sí: un solo enlace por tarjeta, toda la tarjeta clicable.
- No: tarjetas dentro de tarjetas.
- No: un borde de color solo en un lado como adorno.
