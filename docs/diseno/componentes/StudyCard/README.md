# Tarjeta de estudio

El centro de la sesión diaria: una palabra y una pregunta (significado, escritura o pronunciación). Fondo `surface`, borde fino y mucho aire alrededor del carácter (`space-8`).

## Partes

- `lx-study__kind`: qué se pregunta (SIGNIFICADO, ESCRITURA, PRONUNCIACIÓN).
- El carácter con `lx-hz--hero`. Los tamaños Pequeño y Grande de Ajustes de estudio cambian a 64 y 104px.
- `lx-study__audio`: Escuchar y Escuchar más lento (botones de audio de 44px).
- En la pregunta, el botón principal «Mostrar respuesta» (o barra espaciadora en escritorio).
- En la respuesta, `lx-study__divider`, el significado (`lx-study__meaning`), las notas (`lx-study__note`) y debajo, fuera de la tarjeta, los Botones de valorar.

## Comportamiento

- Girar la tarjeta: transición de opacidad de 200ms. Sin giro 3D si `prefers-reduced-motion`.
- El botón «Ajustes de estudio» va en la cabecera de la sesión, no en la tarjeta.
- No: más de una acción en jade. En la respuesta, la acción son los cuatro botones de valorar, todos iguales.
