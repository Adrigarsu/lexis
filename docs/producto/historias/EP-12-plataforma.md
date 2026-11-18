# EP-12 · Plataforma

Historias técnicas: lo que la app necesita por dentro para que se puedan construir las demás historias. Se escriben como historias de usuario desde el punto de vista de la desarrolladora, con criterios Dado / Cuando / Entonces, y se trabajan con el mismo flujo que el resto (D-165). Desde el milestone 2, el trabajo técnico de cada milestone se escribe aquí; la plantilla Tarea queda para el mantenimiento suelto. Todas van en el milestone 2 salvo HU-86, que va en el 4 ([roadmap](../../proceso/roadmap.md)).

## HU-74 · Desplegar la app en Vercel

Must · ADR-006, D-113

Como desarrolladora, quiero que cada cambio se despliegue solo en Vercel, para probar la app en el móvil y revisar cada PR antes de fusionarla.

- Dada una PR abierta, cuando se sube un commit, entonces Vercel publica una vista previa con su propia URL y la enlaza en la PR.
- Dado un cambio fusionado en `main`, cuando termina el despliegue, entonces la versión nueva está en producción en el dominio `*.vercel.app`.
- Dado el proyecto de Vercel, cuando se configura, entonces está en el plan Hobby, solo compila `apps/web` y sus variables de entorno viven en el panel de Vercel, nunca en el repositorio.

## HU-75 · Proyecto de Supabase en la nube

Must · ADR-002, ADR-022, D-17, D-71

Como desarrolladora, quiero el proyecto de Supabase en la nube con las migraciones del repositorio, para que la app tenga cuentas y datos reales.

- Dado el proyecto, cuando se crea, entonces está en el plan gratuito, en una región de la UE, y enlazado con `supabase link`.
- Dada una migración nueva en `main`, cuando se despliega, entonces se aplica en la nube con un proceso documentado, sin ninguna clave en el repositorio.
- Dado que el plan gratuito pausa el proyecto tras 7 días sin uso, cuando pasa cada día, entonces un workflow programado de GitHub Actions hace una petición mínima que lo mantiene activo (D-71).

## HU-76 · Tokens de diseño y tema

Must · ADR-010, D-100, D-104, D-106, D-107, RNF-23

Como desarrolladora, quiero los tokens de Lexis como variables CSS y tema de Tailwind, para que todas las pantallas usen los mismos colores, letras y medidas.

- Dado `docs/diseno/tokens.json`, cuando se compila `packages/design-tokens`, entonces genera las variables CSS de los temas claro y oscuro y el tema de Tailwind CSS v4 que usa `apps/web`.
- Dado el tema del sistema, cuando cambia entre claro y oscuro, entonces la app cambia sin recargar; y si el usuario elige uno, se respeta (D-100).
- Dadas las fuentes de la app (Inter, Noto Sans SC, Noto Serif SC y el subconjunto de LXGW WenKai), cuando se carga la app, entonces se sirven desde la propia app y funcionan sin conexión.
- Dado un color escrito a mano fuera de los tokens, cuando se revisa el código, entonces una comprobación automática lo detecta.

## HU-77 · Componentes base accesibles

Must · ADR-011, D-32, RNF-21, RNF-22, RNF-24

Como desarrolladora, quiero los componentes base del sistema de diseño en React, para montar cualquier pantalla con piezas ya probadas y accesibles.

- Dados los componentes de `docs/diseno/componentes/` que necesitan las pantallas de cuenta y de administración (botón, campo de texto, casilla, interruptor, selector, segmentado, tarjeta, diálogo, hoja inferior, barra de pestañas, menú lateral, aviso, progreso y estado de guardado), cuando se implementan con React Aria Components y los tokens, entonces se ven como sus vistas previas en los dos temas.
- Dado cualquier componente, cuando se prueba, entonces no tiene errores de axe, se usa solo con teclado y el foco se ve.
- Dado un control interactivo, cuando se mide, entonces su zona táctil es de al menos 44 px.
- Los componentes de estudio (carácter con pinyin, tarjeta de estudio, valorar, cuadrícula de escritura, opción de ejercicio, bloques de la frase y palabra de lectura) se hacen con las historias que los usan.

## HU-78 · Navegación y estructura de pantallas

Must · ADR-007, D-86, D-129, RNF-26

Como desarrolladora, quiero las rutas y los marcos de pantalla de la app, para que cada historia solo tenga que rellenar su pantalla.

- Dada la tabla de `docs/arquitectura/rutas.md`, cuando se monta React Router en modo de datos, entonces existen todas las rutas, cada una con una pantalla provisional, y la página 404.
- Dado un móvil, cuando se abre una pantalla principal, entonces se ve con la barra inferior Hoy · Practicar · Progreso · Perfil; dado un escritorio desde 1024 px, con el menú lateral ocultable (D-86).
- Dada una ruta que necesita sesión, cuando no hay sesión, entonces lleva a `/entrar`; y todo `/admin` se descarga en un fragmento aparte solo con rol de Editor o Admin (ADR-007).

## HU-79 · Textos de la interfaz con i18next

Must · ADR-012, D-14, RNF-33

Como desarrolladora, quiero todos los textos de la interfaz en un archivo de traducciones, para no escribir textos dentro del código y poder añadir idiomas después.

- Dado un texto visible, cuando se escribe una pantalla, entonces sale de `es.json` con una clave por módulo (por ejemplo `session.rate.again`).
- Dado un número, una fecha o un plural, cuando se muestra, entonces se formatea en español con `Intl` e i18next.
- Dado un texto escrito a mano dentro de un componente, cuando se revisa el código, entonces el lint lo avisa.

## HU-80 · Base de datos local con Dexie

Must · ADR-003, ADR-008, ADR-023, RNF-05

Como desarrolladora, quiero la base de datos local en IndexedDB con Dexie, para que la app guarde y lea todo en el dispositivo y funcione sin conexión.

- Dada la app, cuando se abre, entonces Dexie crea la base local con un número de versión; cada historia añade sus tablas en una versión nueva con su migración.
- Dada una consulta viva (`useLiveQuery`), cuando cambian los datos, entonces la pantalla se actualiza sola.
- Dada una cuenta, cuando inicia sesión, entonces usa su propia base local; y al cerrar sesión, esa base se borra del dispositivo (ADR-023).
- Las pruebas de la base local usan `fake-indexeddb`.

## HU-81 · Registro cerrado

Must · RF-92, ADR-027, D-163

Como desarrolladora, quiero que solo puedan entrar las cuentas que yo cree, para usar la app con cuentas reales antes de tener todo lo que exige el registro abierto.

- Dado el proyecto de Supabase, cuando alguien intenta registrarse por la API, entonces se rechaza: el registro público está desactivado.
- Dada una persona a la que he dado de alta desde el panel de Supabase, cuando inicia sesión con su email y su contraseña, entonces entra.
- Dada la pantalla de iniciar sesión, cuando se abre, entonces no ofrece crear una cuenta.
- La forma de dar de alta una cuenta y de asignarle el rol está documentada en `docs/`.

## HU-82 · Errores con Sentry sin datos personales

Should · ADR-016, D-123, RNF-17

Como desarrolladora, quiero recibir los errores de la app en producción, para arreglar fallos que ocurren en móviles que no son el mío.

- Dado un error en producción, cuando ocurre, entonces llega a Sentry con su traza y la versión de la app.
- Dado cualquier evento, cuando se envía, entonces no lleva IP, email, grabación de sesión ni datos de estudio (`sendDefaultPii: false` y `beforeSend`).
- Dado el entorno local o de pruebas, cuando hay un error, entonces no se envía a Sentry.

## HU-83 · Tablas de contenido

Must · ADR-022, D-126, D-134, D-162, D-164

Como desarrolladora, quiero las tablas de contenido del esquema con sus permisos, para que el panel y el estudio guarden y lean cursos, palabras y caracteres.

- Dadas las tablas de contenido de `docs/datos/esquema.md` que necesitan el panel y la primera sesión de estudio, cuando se aplica la migración, entonces existen con sus claves, restricciones, `enum` y `GRANT` explícitos, escritas con TDD en pgTAP.
- Dado contenido común publicado, cuando lo lee un usuario con sesión, entonces lo ve; dado contenido en borrador, solo lo ven Editor y Admin.
- Dado contenido propio de un usuario (`owner_id`), cuando lo lee otro usuario, entonces no lo ve (D-126).
- Dado un cambio en una tabla de contenido, cuando se guarda, entonces un trigger lo apunta en `audit_log` con autor, fecha, valor anterior y valor nuevo, y nadie puede editar ni borrar ese registro (D-164, RNF-14). La pantalla del registro y «Deshacer» llegan más tarde.
- Dada una acepción de una palabra, cuando se guarda, entonces puede llevar sinónimos por idioma, que se aceptan como respuesta en la práctica de significado; y dado un carácter, entonces tiene su propia categoría gramatical (D-162). Las columnas se deciden en esta historia con un ADR nuevo.

## HU-84 · Datos del HSK 1 listos para importar

Must · D-79, D-80, D-84, D-125, D-127

Como desarrolladora, quiero un script que prepare los datos del HSK 1 en el formato de importación del panel, para cargarlos de golpe en vez de escribirlos a mano.

- Dada la lista oficial del temario de 2025, cuando se ejecuta el script de `packages/content`, entonces genera un archivo de importación con las 300 palabras (pinyin con número de tono, categoría y nivel) y los 246 caracteres (pinyin y nivel, con la categoría vacía para rellenarla en el panel, D-162) y el nombre y el orden de los 70 puntos gramaticales.
- Dada la descomposición de Make Me a Hanzi, cuando se genera, entonces cada carácter lleva su radical y sus componentes, y se crea el conjunto «Componentes del HSK 1» (D-125).
- Dada una palabra de varios caracteres, cuando se genera, entonces lleva sus caracteres en orden con la lectura de cada uno dentro de la palabra (D-84).
- Dado cada elemento, cuando se genera, entonces lleva el significado en inglés de CC-CEDICT como referencia y el significado en español vacío, para escribirlo en el panel; cada fuente queda citada en `NOTICE` con su licencia.

## HU-85 · Trazos de los caracteres

Must · D-50, D-125

Como desarrolladora, quiero los datos de trazos de los caracteres del curso dentro de la app, para animar el orden de los trazos y corregir la escritura sin conexión.

- Dados los caracteres del HSK 1 y sus componentes, cuando se compila la app, entonces sus datos de `hanzi-writer-data` se sirven como archivos estáticos que funcionan sin conexión.
- Dado un carácter o componente sin datos de trazos, cuando se generan, entonces el script lo avisa.
- Dados los datos de trazos, cuando se publican, entonces van acompañados de `ARPHICPL.TXT` sin modificar.

## HU-86 · App instalable y sin conexión

Must · ADR-009, D-116, RNF-05

Como desarrolladora, quiero que la app sea una PWA con service worker, para instalarla en el móvil y estudiar sin conexión desde la primera sesión de estudio.

- Dada la app publicada, cuando se abre en Safari del iPhone o en Chrome, entonces se puede instalar en la pantalla de inicio con su nombre, su icono y sus colores (manifiesto de vite-plugin-pwa).
- Dado que la app se ha abierto una vez con conexión, cuando se abre sin conexión, entonces carga con sus fuentes y los trazos del curso desde la caché.
- Dada una versión nueva publicada, cuando la app la detecta, entonces avisa «Hay una versión nueva» y se actualiza al aceptarlo.
