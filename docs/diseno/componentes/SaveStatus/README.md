# Estado de guardado

Indica dónde están guardados tus datos (D-99). Va en la cabecera de Hoy, en Perfil y en el menú lateral. Nunca muestra un número de cambios pendientes.

| Estado | Texto | Cuándo |
| --- | --- | --- |
| Nube | «Guardado en la nube» | Todo está subido. |
| Dispositivo | «Guardado en este dispositivo» | Sin conexión, o mientras se sube. |
| Error | «No se ha podido subir a la nube» | Falló la subida. Es un botón que abre el detalle con «Reintentar ahora». |

`role="status"` para que el lector de pantalla anuncie el cambio sin interrumpir. En error, `lx-save--error` con borde `danger` y 44px de alto, para poder tocarlo.
