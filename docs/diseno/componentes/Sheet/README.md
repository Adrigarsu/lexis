# Hoja inferior

Un panel que sube desde abajo en móvil, sin salir de la pantalla: Ajustes de estudio (D-87), Reportar un error, Nueva lista, Instalar la app. En escritorio, lo mismo va en un panel lateral o en un Diálogo.

- Fondo `surface`, borde fino `line` arriba y a los lados y esquinas superiores `radius-xl`. Sin sombra: lo de detrás se oscurece con `lx-scrim` (D-107).
- `lx-sheet__grip`: el asa, solo decorativa.
- `lx-sheet__head`: título y una acción de cierre visible («Listo» o un botón con `aria-label="Cerrar"`).
- `role="dialog"`, `aria-modal="true"` y `aria-labelledby`. Al abrirla, el foco va dentro. Escape y un toque en el velo la cierran, y el foco vuelve al botón que la abrió.

- No: más de una pantalla de contenido. Si hace falta desplazarse mucho, es una pantalla.
