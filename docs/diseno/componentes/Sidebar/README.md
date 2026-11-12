# Menú lateral

La navegación principal en escritorio, a partir de `bp-desktop` (1024px). Tiene la misma estructura que el menú inferior (D-86): Hoy, los seis módulos de Practicar, Progreso y Perfil. Ancho `sidebar-w` (248px); cerrado, queda como barra de iconos de 64px y se recuerda entre sesiones (RF-81).

- `lx-sidebar__brand`: el logo, con el sello `seal` como marca.
- `lx-sidebar__section`: el título de un grupo («Practicar»).
- Enlaces de 40px de alto. El actual lleva `aria-current="page"`, fondo `surface`, borde `line-strong` y el icono en `jade`.

- El botón de plegar lleva `aria-expanded` y `aria-label` («Ocultar menú» o «Mostrar menú»).
- Cerrado, cada icono lleva `aria-label` y `title` con su nombre.
