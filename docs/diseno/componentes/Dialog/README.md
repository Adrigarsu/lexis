# Diálogo

Una pregunta que exige respuesta antes de seguir: confirmar un borrado, el aviso de la primera vez que se escribe o el recordatorio diario tras las metas. Centrado, de hasta 480px de ancho, con borde fino y velo `lx-scrim` detrás (sin sombra).

- `lx-dialog__title` es la pregunta. `lx-dialog__body` explica las consecuencias.
- `lx-dialog__actions`: la acción segura a la izquierda («Cancelar») y la principal a la derecha. Si es destructiva, va en `danger` relleno con texto `surface`, y el texto del botón repite qué hace («Borrar para siempre»).
- Accesibilidad: `role="dialog"` (o `alertdialog` si es destructivo), `aria-modal`, `aria-labelledby` y `aria-describedby`. El foco queda atrapado dentro y vuelve al botón que lo abrió.

- No: usar un diálogo para informar de algo que no requiere decisión. Para eso hay un Aviso.
