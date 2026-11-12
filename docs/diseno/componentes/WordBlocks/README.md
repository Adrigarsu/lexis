# Bloques de la frase

El ejercicio de ordenar la frase: se toca (o arrastra) cada bloque para pasarlo de las palabras disponibles a la respuesta.

- `lx-answer`: la zona de la respuesta, con borde punteado `line-strong` sobre `paper`. Un toque en un bloque colocado lo devuelve.
- `lx-bank`: las palabras disponibles. El hueco del bloque usado queda con `lx-block--ghost`, para que el resto no salte de sitio.
- `lx-block`: un botón de 56px como mínimo con una palabra (Carácter con pinyin `lx-hz--lg`). Elegido con el teclado: `aria-pressed="true"`.
- Teclado: Tab entre bloques, Intro o Espacio para mover. Arrastrar es opcional; tocar basta.
- «Comprobar» (botón principal) queda bloqueado con `aria-disabled` hasta que estén todos los bloques, con el motivo escrito al lado.
