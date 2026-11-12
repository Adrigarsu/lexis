# Aviso

Un mensaje que informa sin interrumpir: sin conexión, palabras desbloqueadas, error al sincronizar, una función no disponible.

| Clase | Uso | Rol |
| --- | --- | --- |
| `lx-banner` | Información neutra. | — |
| `lx-banner--warning` | Algo limita lo que puedes hacer, pero sigues: sin conexión, racha en riesgo. | `status` |
| `lx-banner--success` | Un logro o algo que ha salido bien. | `status` |
| `lx-banner--danger` | Algo ha fallado y quizá tengas que actuar. Con una acción si la hay («Reintentar»). | `alert` |
| `lx-banner--top` | Variante pegada arriba, de borde a borde (el aviso de sin conexión). | — |

Siempre con icono, título y una frase que dice qué pasa y qué hacer. Los fondos son los `-tint` de cada estado, y el texto va en `ink` (4,5:1 o más).

- No: avisos que desaparecen solos si llevan una acción.
