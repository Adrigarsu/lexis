# Rutas

> Origen: «Lexis · Arquitectura (ADR), sección Flujo de pantallas y rutas» en claude.ai, exportado el 12 de noviembre de 2026. Desde ahora la fuente de verdad es este archivo.

El flujo completo está en la pizarra [Lexis · Flujo de pantallas](../diseno/flujo-pantallas.md), con un flujo para móvil y otro para escritorio, y cada pantalla en el lienzo [Lexis · Wireframes y diseño](../diseno/pantallas/README.md). De ahí salen estas rutas de React Router (D-129).

Convenciones: rutas en español porque las ve el usuario, en minúsculas con guiones (kebab-case), con sustantivos y parámetros `:id`. Móvil y escritorio comparten las mismas rutas: solo cambia el diseño. Los pasos de una sesión de estudio (fichas, tarjetas, escritura, resumen) no tienen ruta propia: viven en el estado de la sesión, y Atrás pide confirmar la salida. Los estados globales (sin conexión, error al sincronizar, cargando) y los diálogos tampoco son rutas.

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/` | Redirige a `/hoy` o a `/entrar` | Pública |
| `/entrar` | Iniciar sesión | Solo sin sesión |
| `/registro` | Crear cuenta | Solo sin sesión |
| `/verificar` | Verificar email | Sesión sin verificar |
| `/recuperar` | Recuperar la contraseña | Solo sin sesión |
| `/nueva-clave` | Contraseña nueva | Enlace de un solo uso |
| `/bienvenida` | Bienvenida y metas | Sesión verificada sin metas |
| `/hoy` | Hoy (inicio), día completado o nada que repasar | Sesión |
| `/sesion` | Sesión diaria: calentamiento, fichas de componente, carácter y palabra, tarjetas, resumen | Sesión |
| `/practicar` | Practicar (solo móvil; en escritorio redirige a `/hoy`) | Sesión |
| `/practicar/tarjetas` | Sesión libre de tarjetas | Sesión |
| `/practicar/escritura` | Escritura de caracteres y valorar | Sesión |
| `/practicar/tonos` | Tonos: inicio | Sesión |
| `/practicar/tonos/:tipo` | Identificar, pares, pronunciar o cambios de tono | Sesión |
| `/practicar/tonos/tabla` | Tabla de pinyin | Sesión |
| `/practicar/gramatica` | Gramática: lista de puntos | Sesión |
| `/practicar/gramatica/:puntoId` | Lección, ejercicios, corrección y lección terminada | Sesión |
| `/practicar/lecturas` | Lecturas: lista | Sesión |
| `/practicar/lecturas/nueva` | Mi texto (privado) | Sesión |
| `/practicar/lecturas/:lecturaId` | Lectura, preguntas y lectura terminada | Sesión (las privadas, solo su dueño) |
| `/practicar/listas` | Mis listas | Sesión |
| `/practicar/listas/importar` | Importar caracteres (privado) | Sesión |
| `/practicar/listas/:listaId` | Lista: añadir y quitar palabras; tarjeta propia (diálogo en escritorio) | Sesión (solo su dueño) |
| `/caracter/:caracter` | Ficha de carácter o componente fuera de la sesión | Sesión |
| `/progreso` | Progreso | Sesión |
| `/progreso/dificiles` | Palabras difíciles | Sesión |
| `/perfil` | Perfil y ajustes (en escritorio, una página con secciones) | Sesión |
| `/perfil/estudio` | Ajustes de estudio y metas (móvil) | Sesión |
| `/perfil/recordatorios` | Recordatorios (móvil) | Sesión |
| `/perfil/cuenta` | Cuenta y privacidad | Sesión |
| `/admin` | Administración: resumen | Editor o Admin |
| `/admin/palabras` y `/admin/palabras/:id` | Palabras y editar palabra | Editor o Admin |
| `/admin/caracteres` y `/admin/caracteres/:id` | Caracteres y radicales; editar carácter | Editor o Admin |
| `/admin/gramatica` y `/admin/gramatica/:id` | Gramática; editar punto gramatical | Editor o Admin |
| `/admin/lecturas` y `/admin/lecturas/:id` | Lecturas; editar lectura | Editor o Admin |
| `/admin/importar` | Importar contenido | Editor o Admin |
| `/admin/reportes` | Reportes de errores | Editor o Admin |
| `/admin/usuarios` | Usuarios | Solo Admin |
| `/admin/registro` | Registro de cambios | Editor o Admin |
| `*` | Página no encontrada (404) | Pública |

El acceso se comprueba dos veces: en el cliente, con un *loader* de React Router que redirige; y en la base de datos, con RLS, que es lo que de verdad protege los datos. Todo `/admin` va en un fragmento aparte que solo se descarga con rol de Editor o Admin (ADR-007).
