# Menú inferior

La navegación principal en móvil, con cuatro destinos fijos (D-86): Hoy, Practicar, Progreso y Perfil. Mide `nav-h` y suma el área segura del iPhone.

`<nav class="lx-tabbar" aria-label="Navegación principal">` con cuatro `<a>`, cada uno con icono de 24px y texto de 12px. El destino actual lleva `aria-current="page"` y va en `jade`.

- Se oculta en las pantallas de una sesión de estudio (tarjetas, escritura, ejercicios), que tienen su propia cabecera con «Salir».
- No: más de cuatro destinos ni iconos sin texto.
