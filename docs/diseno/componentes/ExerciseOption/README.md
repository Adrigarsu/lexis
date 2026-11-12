# Opción de ejercicio

Cada respuesta posible en los ejercicios de elegir: traducción, tono, pronunciación por opciones y preguntas de lectura.

| Estado | Cómo se marca |
| --- | --- |
| Normal | Borde `line-strong`. |
| Elegida antes de comprobar | `aria-pressed="true"` y borde de 2px en `ink`. |
| Correcta | `data-state="correct"`: borde `success`, fondo `success-tint` y la marca «Correcta» con icono. |
| Tu respuesta fallada | `data-state="wrong"`: borde `danger`, fondo `danger-tint` y la marca «Tu respuesta» con icono. |
| Resto, tras comprobar | `data-state="dim"`: texto `ink-2`. |

- Acierto y fallo se dicen con palabra e icono, no solo con color.
- Tras comprobar, la explicación va debajo, en un Aviso.
- Alto mínimo de 56px. El contenido puede ser texto o un Carácter con pinyin.
