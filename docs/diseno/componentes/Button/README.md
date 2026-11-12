# Botón

Acciones que el usuario pulsa. Cinco variantes con la misma altura mínima de 44px y radio `radius-md`.

## Variantes

| Clase | Cuándo |
| --- | --- |
| `lx-btn--primary` | La acción principal de la pantalla: «Estudiar hoy», «Comprobar», «Guardar tarjeta». Una sola por pantalla. Alto `control-h-lg` (52px), fondo `jade`, texto `on-jade`. |
| `lx-btn--secondary` | Acciones de apoyo: «Más lento», «Cancelar», «Instalar». Fondo `surface`, borde `line-strong`. |
| `lx-btn--text` | Enlaces con aspecto de acción dentro de un texto o al pie: «Ver todas las lecturas». Texto `jade` subrayado. |
| `lx-btn--danger` | Acciones destructivas que abren una confirmación: «Borrar cuenta…», «Borrar lista». |
| `lx-btn--icon` | Botones solo de icono (ajustes, cerrar, más opciones). Siempre con `aria-label`. |
| `lx-btn--audio` | Reproducir audio. Redondo (`radius-pill`). `aria-pressed="true"` mientras suena. |

Añade `lx-btn--block` para que ocupe todo el ancho (pie de pantallas móviles).

## Estados

- **Hover:** el fondo se oscurece un poco hacia la tinta.
- **Foco:** anillo `focus-ring`.
- **Pulsado:** el fondo se oscurece algo más.
- **Desactivado:** con `aria-disabled="true"`, en vez de `disabled`, para que siga siendo enfocable. Fondo `surface-sunken` y texto `ink-disabled`. Escribe siempre al lado por qué no se puede pulsar.

## Qué pone el consumidor

Un `<button>` (o un `<a>` si navega) con la clase base `lx-btn` y una variante. Texto con verbo y en mayúscula solo al inicio. Icono SVG de 20px con `aria-hidden="true"` si acompaña al texto.

## Sí y no

- Sí: una sola acción en jade por pantalla.
- Sí: «Comprobar», «Guardar tarjeta», «Estudiar hoy».
- No: dos botones primarios uno al lado del otro. El segundo va como secundario.
- No: «OK», «Aceptar» ni «Enviar» sin más contexto.
- No: un botón solo de icono sin `aria-label`.
