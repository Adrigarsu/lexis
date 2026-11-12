# Lista agrupada

Filas dentro de un mismo marco, separadas por líneas finas. Es el patrón de Perfil, Ajustes, Recordatorios, Practicar y las palabras de una lista.

- `lx-list__heading`: el título del grupo, en mayúsculas pequeñas y `ink-2`.
- `lx-list`: un `<ul>` con fondo `surface`, borde `line` y radio `radius-lg`.
- `lx-row`: cada fila, de 56px de alto como mínimo, separada por `line`. Si navega, es un `<a>` y lleva la flecha `lx-row__chev`. Si es un ajuste, la fila es el `<label>` de un Interruptor, un Spinner o un Select.
- `lx-row__title` y `lx-row__desc`: el texto y su resumen. El resumen dice el valor actual («[3] de 4 activados»).

- Sí: un tipo de control por fila.
- No: filas sin borde separadas solo por espacio. En una lista densa se pierde la fila.
