# Segmentos

De 2 a 4 opciones excluyentes que se ven a la vez y cambian lo que hay debajo: modo de respuesta en pronunciación (Escribir, Opciones, Hablar), periodo en Progreso (Semana, Mes, Todo) y tamaño de los caracteres.

- Si cambia un panel, usa `role="tablist"` con botones `role="tab"` y `aria-selected`.
- Si solo filtra, usa `role="group"` con `aria-pressed`.
- La opción activa va sobre `surface`, con borde `line-strong` y texto en negrita. Las demás, en `ink-2` sobre `surface-sunken`.

- No: más de 4 opciones ni textos de más de dos palabras. En ese caso, un Select.
