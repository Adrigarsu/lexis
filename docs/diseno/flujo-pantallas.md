# Flujo de pantallas

> Origen: pizarra «Lexis · Flujo de pantallas» en claude.ai (D-129), exportada el 12 de noviembre de 2026. Desde ahora la fuente de verdad es este archivo.

Hay un flujo para móvil y otro para escritorio, más una zona de estados y diálogos globales que salen sobre cualquier pantalla. Todo empieza y vuelve a **Hoy**. Cada pantalla tiene su imagen y su HTML en [pantallas/](pantallas/README.md), y su ruta en [rutas.md](../arquitectura/rutas.md). Cada flecha se escribe como `→ destino` debajo de la pantalla de la que sale.

## Móvil (iPhone)

Barra inferior en las pantallas principales: Hoy · Practicar · Progreso · Perfil. Durante una sesión se oculta y solo hay «Salir».

### Acceso

- **Iniciar sesión**
  - → Crear cuenta
  - → Recuperar la contraseña
  - → Hoy (inicio)
- **Crear cuenta**
  - → Verificar email (código de 6 cifras)
- **Verificar email (código de 6 cifras)**
  - → Bienvenida y metas + diálogo recordatorio
- **Bienvenida y metas + diálogo recordatorio**
  - → Hoy (inicio)
- **Recuperar la contraseña**
  - → Contraseña nueva (vuelve a Iniciar sesión)
- **Contraseña nueva (vuelve a Iniciar sesión)**

### Hoy y sesión diaria (orden: componente → carácter → palabra)

- **Hoy (inicio)**
  - → Calentamiento de tonos (si está activado)
- **Calentamiento de tonos (si está activado)**
  - → Ficha de componente (禾)
- **Ficha de componente (禾)** *(nueva)*
  - → Ficha de carácter (租)
- **Ficha de carácter (租)** *(nueva)*
  - → Ficha de palabra (出租车)
- **Ficha de palabra (出租车)**
  - → Tarjeta de significado pregunta → respuesta
- **Tarjeta de significado pregunta → respuesta**
  - → Escritura → valorar
- **Escritura → valorar**
  - → Pronunciación (3 modos)
- **Pronunciación (3 modos)**
  - → Desbloqueo de escritura y pronunciación (aviso)
- **Desbloqueo de escritura y pronunciación (aviso)**
  - → Resumen de la sesión
- **Resumen de la sesión**
  - → Día completado (vuelve a Hoy)
- **Día completado (vuelve a Hoy)**
- **Nada que repasar (desde Hoy)**

### Practicar (pestaña)

- **Tarjetas**
  - → Sesión libre de tarjetas
- **Sesión libre de tarjetas**
- **Escritura**
  - → Escritura de caracteres
- **Escritura de caracteres**
  - → Valorar escritura
- **Valorar escritura**
- **Tonos**
  - → Identificar · pares · pronunciar
- **Identificar · pares · pronunciar**
- **Tabla de pinyin (desde Tonos)**
- **Practicar (barra inferior)**
  - → Tarjetas
  - → Escritura
  - → Tonos
  - → Gramática: lista
  - → Lecturas: lista
  - → Mis listas
- **Gramática: lista**
  - → Lección
- **Lección**
  - → Ejercicio: ordenar, completar o traducir
- **Ejercicio: ordenar, completar o traducir**
  - → Corrección
- **Corrección**
  - → Lección terminada
- **Lección terminada**
- **Lecturas: lista**
  - → Lectura
  - → Mi texto (privado)
- **Lectura**
  - → Preguntas
- **Preguntas**
  - → Lectura terminada
- **Lectura terminada**
- **Mi texto (privado)** *(nueva)*
  - → Lectura
- **Mis listas**
  - → Lista: añadir y quitar palabras
  - → Importar caracteres (privado)
- **Lista: añadir y quitar palabras**
  - → Crear tarjeta propia
- **Crear tarjeta propia**
- **Importar caracteres (privado)** *(nueva)*
  - → Lista: añadir y quitar palabras

### Progreso y perfil (barra inferior)

- **Progreso**
  - → Palabras difíciles
- **Palabras difíciles**
  - → Sesión libre de tarjetas
- **Sesión libre de tarjetas**
- **Ajustes de estudio y metas**
- **Perfil y ajustes**
  - → Ajustes de estudio y metas
  - → Recordatorios
  - → Cuenta y privacidad + diálogo borrar cuenta
- **Recordatorios**
- **Cuenta y privacidad + diálogo borrar cuenta**

## Escritorio (1280 px)

### Acceso

- **Iniciar sesión**
  - → Crear cuenta
  - → Recuperar la contraseña
  - → Hoy (inicio)
- **Crear cuenta**
  - → Verificar email (código de 6 cifras)
- **Verificar email (código de 6 cifras)**
  - → Bienvenida y metas + diálogo recordatorio
- **Bienvenida y metas + diálogo recordatorio**
  - → Hoy (inicio)
- **Recuperar la contraseña**
  - → Contraseña nueva (vuelve a Iniciar sesión)
- **Contraseña nueva (vuelve a Iniciar sesión)**

### Hoy y sesión diaria (orden: componente → carácter → palabra)

- **Hoy (inicio)**
  - → Calentamiento de tonos (si está activado)
- **Calentamiento de tonos (si está activado)**
  - → Ficha de componente (禾)
- **Ficha de componente (禾)** *(nueva)*
  - → Ficha de carácter (租)
- **Ficha de carácter (租)** *(nueva)*
  - → Ficha de palabra (出租车)
- **Ficha de palabra (出租车)**
  - → Tarjeta de significado pregunta → respuesta
- **Tarjeta de significado pregunta → respuesta**
  - → Escritura → valorar
- **Escritura → valorar**
  - → Pronunciación (3 modos)
- **Pronunciación (3 modos)**
  - → Desbloqueo de escritura y pronunciación (aviso)
- **Desbloqueo de escritura y pronunciación (aviso)**
  - → Resumen de la sesión
- **Resumen de la sesión**
  - → Día completado (vuelve a Hoy)
- **Día completado (vuelve a Hoy)**
- **Nada que repasar (desde Hoy)**

### Menú lateral: módulos

- **Tarjetas**
  - → Sesión libre de tarjetas
- **Sesión libre de tarjetas**
- **Escritura**
  - → Escritura de caracteres
- **Escritura de caracteres**
  - → Valorar escritura
- **Valorar escritura**
- **Tonos**
  - → Identificar · pares · pronunciar
- **Identificar · pares · pronunciar**
- **Tabla de pinyin (desde Tonos)**
- **Menú lateral (siempre visible)**
  - → Tarjetas
  - → Escritura
  - → Tonos
  - → Gramática: lista
  - → Lecturas: lista
  - → Mis listas
- **Gramática: lista**
  - → Lección
- **Lección**
  - → Ejercicio: ordenar, completar o traducir
- **Ejercicio: ordenar, completar o traducir**
  - → Corrección
- **Corrección**
  - → Lección terminada
- **Lección terminada**
- **Lecturas: lista**
  - → Lectura
  - → Mi texto (privado)
- **Lectura**
  - → Preguntas
- **Preguntas**
  - → Lectura terminada
- **Lectura terminada**
- **Mi texto (privado)** *(nueva)*
  - → Lectura
- **Mis listas**
  - → Lista elegida (misma página)
  - → Importar caracteres (privado)
- **Lista elegida (misma página)**
  - → Crear tarjeta propia (diálogo)
- **Crear tarjeta propia (diálogo)**
- **Importar caracteres (privado)** *(nueva)*
  - → Lista elegida (misma página)

### Progreso y perfil

- **Progreso**
  - → Palabras difíciles
- **Palabras difíciles**
  - → Sesión libre de tarjetas
- **Sesión libre de tarjetas**
- **Perfil y ajustes (una página)**
  - → Cuenta y privacidad + diálogo borrar cuenta
  - → Administración (solo Editor y Admin)
- **Cuenta y privacidad + diálogo borrar cuenta**
- **Administración (solo Editor y Admin)**

### Panel de administración (solo escritorio, Editor y Admin)

- **Resumen**
- **Palabras**
  - → Editar palabra
- **Editar palabra**
- **Caracteres y radicales**
  - → Editar carácter
- **Editar carácter** *(nueva)*
- **Gramática**
  - → Editar punto gramatical
- **Editar punto gramatical** *(nueva)*
- **Administración (desde Perfil y ajustes)**
  - → Resumen
  - → Palabras
  - → Caracteres y radicales
  - → Gramática
  - → Lecturas
  - → Importar contenido
  - → Reportes de errores
  - → Usuarios
  - → Registro de cambios
- **Lecturas**
  - → Editar lectura
- **Editar lectura**
- **Importar contenido**
- **Reportes de errores**
- **Usuarios**
- **Registro de cambios**

## Estados y diálogos globales

### Estados y diálogos globales: salen sobre cualquier pantalla (diseñados en móvil; en escritorio se adaptan)

- **Sin conexión (aviso fijo arriba)**
- **Error al sincronizar (Reintentar)**
- **Cargando (primera descarga)**
- **Página no encontrada (404)**
- **Hoja: Ajustes de estudio (desde cualquier tarjeta)**
- **Diálogo: Reportar error (tarjeta o lectura)**
- **Diálogo: primera vez que escribes**
- **Diálogo: recordatorio diario (tras metas)**
- **Diálogo: borrar cuenta (Cuenta y privacidad)**
