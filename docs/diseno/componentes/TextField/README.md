# Campo de texto

Entrada de una línea con su etiqueta, su ayuda y su error. Lo usan los formularios de cuenta, el pinyin escrito y la búsqueda de palabras.

## Estructura

- `lx-field`: el contenedor. Puede ser un `<label>` que envuelva todo.
- `lx-field__label`: la etiqueta visible. Siempre visible: el placeholder no la sustituye.
- `lx-input`: el campo. Alto `control-h` (48px), texto de 16px (así iOS no hace zoom) y borde `line-strong`.
- `lx-field__help`: la ayuda, en `ink-2`.
- `lx-field__error`: el error, en `danger` con icono. Se enlaza con `aria-describedby`.

## Estados

- **Foco:** borde `jade` y anillo `focus-ring`.
- **Error:** `aria-invalid="true"`, borde de 2px en `danger` y el mensaje debajo, que dice qué falla y cómo arreglarlo.
- **Desactivado:** fondo `surface-sunken`. Explica en la ayuda dónde se cambia.

## Qué pone el consumidor

El `type` y el `autocomplete` correctos (`email`, `current-password`, `new-password`). Los ids para enlazar el error. Escribe el mensaje de error con frases completas y sin culpas.

## Sí y no

- Sí: una ayuda corta debajo cuando el formato no es obvio, como en el pinyin.
- No: validar mientras se escribe. Se valida al salir del campo o al enviar.
- No: usar el placeholder como etiqueta.
