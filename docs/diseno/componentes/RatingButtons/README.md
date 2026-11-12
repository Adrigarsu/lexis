# Botones de valorar

Las cuatro valoraciones de FSRS (Otra vez, Difícil, Bien, Fácil) al terminar una tarjeta, un carácter escrito o una pronunciación (D-91, D-102).

- `<div class="lx-rate" role="group" aria-label="¿Cómo de bien lo sabías?">` con cuatro `<button data-r="1…4">`.
- Cada botón muestra el nombre y, en `<small>`, cuándo vuelve la tarjeta («1 día»).
- `lx-rate--keys` muestra las teclas 1 a 4 en escritorio, y el atajo funciona también sin verlas.
- Los cuatro son iguales: ninguno en jade, para no empujar hacia una respuesta. «Otra vez» lleva el borde en `danger` para que se distinga sin depender solo del color, porque además va el primero y con su nombre.
- Alto de 60px y ocupan todo el ancho, para el pulgar.
- `aria-pressed="true"` marca la valoración propuesta cuando la valoración automática está activada. El usuario puede cambiarla (HU-14).
