# Barra de progreso

Cuánto llevas: el HSK 1 por práctica, la sesión del día, la meta de la semana o lo que conoces de una lista.

- `lx-progress__head`: la etiqueta y el número. El número siempre está escrito, porque la barra sola no basta (D-96).
- `lx-progress__track`: la pista, en `surface-sunken` con borde `line`. `lx-progress__fill`: el relleno, en `jade-bright` (3,4:1 sobre el papel).
- `role="progressbar"` con `aria-valuenow`, `aria-valuemin`, `aria-valuemax` y `aria-label`.
- `lx-progress--thin` (6px) para la cabecera de una sesión de estudio.

- No: barras de colores distintos para cada práctica. El color lo reservamos para los tonos.
