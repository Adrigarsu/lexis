# Chip

Etiquetas pequeñas que describen algo (estado, nivel, origen), leyenda de los tonos y filtros.

| Clase | Uso |
| --- | --- |
| `lx-chip` | Etiqueta neutra: «HSK 1», «Propia», «En repaso». |
| `lx-chip--success`, `--warning`, `--danger` | Estados, siempre con icono y palabra: «Dominado», «Bloqueado», «Error». |
| `lx-chip--tone` + `--t1` … `--t5` | Leyenda de los colores de tono, siempre con su marca (ā á ǎ à a). |
| `lx-chip--filter` | Filtros de listas (`<button>` con `aria-pressed`). Alto 36px dentro de una fila de 44px. Activo: borde de 2px en `ink`. |

- No: chips que solo son de color, sin texto.
- No: usar un chip como botón principal.
