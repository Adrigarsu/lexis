# Palabra en una lectura

Las palabras de una lectura graduada (D-95): cada una se puede tocar para ver su significado, y las nuevas van marcadas.

- Cada palabra es un `<button class="lx-word">` con su Carácter con pinyin en tamaño `lx-hz--read` (22px, interlineado 2,1).
- `lx-word--new`: las palabras que aún no conoces, subrayadas con puntos en `jade-bright`. El subrayado es la marca (no solo el color) y va bajo el pinyin.
- Al tocarla: `aria-expanded="true"`, fondo `jade-tint` y se abre `lx-popover` con el pinyin, el audio, el significado y «Añadir a mis palabras». En móvil es una Hoja inferior.
- Los signos de puntuación y las partículas sueltas no son botones.
- Ajustes de pinyin y colores de tono iguales que en las tarjetas.
