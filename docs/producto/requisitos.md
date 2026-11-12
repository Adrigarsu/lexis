# Requisitos (SRS)

> Origen: «Lexis · Especificación de requisitos (SRS)» en claude.ai, exportado el 12 de noviembre de 2026. Desde ahora la fuente de verdad es este archivo.

Especificación de requisitos según ISO/IEC/IEEE 29148, versión 1.4 (89 requisitos funcionales, 35 no funcionales y 73 historias de usuario). Las decisiones de origen están en @.

## 1. Introducción

### 1.1 Propósito

Este documento define qué debe hacer Lexis y con qué calidad. Sirve de referencia para diseñar, implementar y probar la aplicación. Va dirigido al autor como desarrollador y a cualquier persona que revise el proyecto.

### 1.2 Alcance

Lexis es una aplicación web instalable (PWA), gratuita, para aprender chino mandarín desde el ordenador y el iPhone. La primera versión cubre el nivel HSK 1 del estándar 3.0 con cinco áreas: tarjetas con repetición espaciada, escritura de caracteres, tonos y pronunciación, gramática y lecturas graduadas.

- **Incluido:** cuentas de usuario con sincronización entre dispositivos, uso sin conexión, tarjetas y listas propias, estadísticas de progreso, recordatorios diarios.
- **Excluido en esta versión:** niveles HSK superiores (la arquitectura los admite), interfaz en otros idiomas (preparada con i18n), apps nativas de tienda, acierto por tono, previsión de repasos y animaciones de celebración (RF-85).

### 1.3 Definiciones

| Término | Significado |
| --- | --- |
| HSK | Examen oficial de nivel de chino. Esta app sigue el estándar 3.0, nivel 1 |
| Hanzi | Carácter chino |
| Pinyin | Transcripción del chino al alfabeto latino, con marcas o números de tono |
| Tono | Variación de altura de la voz que cambia el significado de una sílaba (cuatro tonos y uno neutro) |
| Tarjeta | Unidad de repaso: una palabra estudiada en un modo (significado, escritura o pronunciación) |
| Repetición espaciada | Técnica que programa cada repaso justo antes de que se olvide la tarjeta |
| FSRS | Algoritmo de repetición espaciada que calcula el siguiente repaso según la memoria del usuario |
| Racha | Días consecutivos de estudio, con días de descanso permitidos |
| PWA | Aplicación web que se puede instalar en la pantalla de inicio y funcionar sin conexión |
| MVP | Producto mínimo viable: la primera versión usable |
| MoSCoW | Priorización en Must (imprescindible), Should (importante), Could (deseable) y Won't (no en esta versión) |
| Historia de usuario | Descripción breve de una funcionalidad desde el punto de vista de quien la usa: "Como… quiero… para…", con criterios de aceptación verificables |
| Épica | Grupo de historias de usuario que forman un módulo o una funcionalidad grande |

### 1.4 Referencias

- ISO/IEC/IEEE 29148:2018, ingeniería de requisitos.
- WCAG 2.2, pautas de accesibilidad web del W3C.
- OWASP ASVS, estándar de verificación de seguridad de aplicaciones.
- Reglamento General de Protección de Datos (UE) 2016/679 y LOPDGDD.
- Registro de decisiones y objetivos del proyecto (enlazado arriba).

## 2. Descripción general

### 2.1 Perspectiva del producto

Lexis es un producto nuevo e independiente. Se compone de una PWA (React + TypeScript) que guarda los datos primero en el dispositivo (IndexedDB) y de un proyecto de Supabase en la UE: Auth para las cuentas, PostgreSQL con RLS para los datos, Edge Functions y pg_cron para la lógica en servidor y las notificaciones Web Push, y Storage para los audios. No hay servidor propio que mantener.

### 2.2 Actores

| Actor | Tipo | Descripción |
| --- | --- | --- |
| Estudiante | Principal | Persona registrada que estudia chino. Necesita cuenta para usar la app. |
| Administrador | Principal | Gestiona el contenido común (vocabulario, gramática, lecturas, audios) desde un panel de administración. Es un Estudiante con el rol de administrador. |
| Visitante | Secundario | Persona sin cuenta. Solo puede ver la bienvenida, registrarse, iniciar sesión y leer la política de privacidad. |
| Supabase | Sistema externo | Autentica usuarios, almacena los datos, ejecuta tareas programadas y envía notificaciones push. |
| Navegador | Sistema externo | Aporta voz sintética, reconocimiento de voz (Web Speech API) y almacenamiento local. |

### 2.3 Funciones principales

1. Registro, inicio de sesión y gestión de la cuenta (incluidos exportar y borrar datos).
2. Bienvenida y configuración de metas en el primer uso: minutos al día, palabras nuevas al día y días de descanso.
3. Sesión guiada diaria ("Estudiar hoy") que mezcla repasos pendientes y palabras nuevas.
4. Práctica libre por módulo: tarjetas, escritura, tonos, gramática y lecturas.
5. Tarjetas y listas propias.
6. Estadísticas de progreso y recordatorios diarios.
7. Panel de administración del contenido común.

### 2.4 Restricciones

- Coste de operación 0 €: plan gratuito de Supabase y alojamiento web gratuito.
- Navegadores objetivo: Safari en iPhone y navegadores modernos de ordenador. En la app instalada en iPhone no hay reconocimiento de voz.
- Cumplimiento de RGPD, WCAG 2.2 AA y OWASP ASVS nivel 2.
- Datos alojados en la Unión Europea.
- Código bajo licencia MIT; datos de terceros con su licencia y atribución.

### 2.5 Supuestos y dependencias

- El uso cabe en el plan gratuito de Supabase (500 MB de base de datos, 1 GB de archivos, 5 GB de transferencia y 500.000 invocaciones de Edge Functions al mes). El contenido común se guarda en el dispositivo para no descargarlo en cada sesión.
- Existen y siguen disponibles las fuentes de datos con licencia libre: CC-CEDICT, Make Me a Hanzi y audio-cmn.
- El rol de administrador y los bloqueos se guardan en una tabla de PostgreSQL y las políticas RLS los comprueban en cada acceso; el primer administrador se crea a mano desde el panel de Supabase (D-67).
- El proyecto de Supabase se pausa tras 7 días sin actividad. Un ping diario desde GitHub Actions lo mantiene activo (D-71).

## 3. Requisitos funcionales

Cada requisito tiene un ID único, una prioridad MoSCoW y la decisión del registro de la que procede. "El sistema deberá" indica obligación verificable.

### 3.1 Cuenta y primer uso

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-01 | El sistema deberá permitir registrarse con email, contraseña y un nombre de usuario único. | Must | D-28 |
| RF-02 | El sistema deberá exigir, al registrarse, declarar tener al menos 14 años y aceptar la política de privacidad. | Must | D-37 |
| RF-03 | El sistema deberá verificar el email con un código de 6 cifras (caduca a los 10 minutos, máximo 5 intentos, reenvío cada 60 s) y no dar acceso al estudio hasta verificarlo. La pantalla de verificación permitirá corregir el email sin volver atrás. | Must | D-33 |
| RF-04 | El sistema deberá permitir iniciar y cerrar sesión, y recuperar la contraseña por email. | Must | D-28 |
| RF-05 | El sistema deberá permitir cambiar email, contraseña y nombre de usuario. | Should | D-28 |
| RF-06 | El sistema deberá permitir descargar todos los datos del usuario en un archivo JSON. | Must | D-37 |
| RF-07 | El sistema deberá permitir borrar la cuenta y, con ella, todos los datos del usuario. | Must | D-37 |
| RF-08 | En el primer inicio de sesión, el sistema deberá mostrar una bienvenida y pedir las metas: minutos al día, palabras nuevas al día y días de descanso por semana (2 por defecto). | Must | D-13, D-36, D-41 |
| RF-09 | El sistema deberá permitir cambiar las metas en cualquier momento desde los ajustes. | Must | D-13 |

### 3.2 Tarjetas y repetición espaciada

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-10 | Cada palabra deberá tener tres prácticas independientes (significado, escritura y pronunciación), cada una con su propio estado de memoria FSRS e historial. | Must | D-06, D-43 |
| RF-11 | Antes de la primera tarjeta de una palabra nueva, el sistema deberá mostrar una ficha de presentación con: caracteres, pinyin, audio, significado en español, animación del orden de trazos y una frase de ejemplo. | Must | D-44 |
| RF-12 | Al introducir una palabra, el sistema deberá activar solo la práctica de significado. | Must | D-43 |
| RF-13 | Cuando la práctica de significado de una palabra alcance una estabilidad FSRS de 5 días o más, el sistema deberá activar sus prácticas de escritura y pronunciación. | Must | D-43, D-47 |
| RF-14 | El sistema deberá programar cada repaso con el algoritmo FSRS a partir de la valoración obtenida (Otra vez, Difícil, Bien o Fácil). | Must | D-06 |
| RF-15 | En la práctica de significado, el usuario deberá valorar su respuesta con cuatro botones: Otra vez, Difícil, Bien y Fácil. | Must | D-06, D-45 |
| RF-16 | En escritura y pronunciación, el usuario deberá valorar cada respuesta con los 4 botones (Otra vez, Difícil, Bien, Fácil). Si activa la valoración automática en Ajustes (apagada por defecto), el sistema la calculará según la tabla 3.2.1 y el usuario podrá corregirla. | Must | D-45, D-48, D-91, D-94, D-102 |
| RF-17 | La sesión guiada deberá intercalar repasos pendientes y palabras nuevas, respetando el límite de palabras nuevas al día y los minutos objetivo. | Must | D-13, D-42, D-46 |
| RF-18 | El sistema deberá permitir practicar libremente un módulo o una lista concreta fuera de la sesión guiada. | Must | D-42 |
| RF-19 | El sistema deberá permitir mostrar, ocultar o ajustar la opacidad del pinyin. | Must | D-18 |
| RF-20 | En la práctica de pronunciación, el usuario deberá poder elegir cómo responder: escribir el pinyin con número de tono, elegir entre opciones o hablar (si el navegador admite reconocimiento de voz). | Must | D-19, D-20, D-34 |
| RF-21 | El sistema deberá permitir crear tarjetas propias (caracteres, pinyin, significado y notas) y agruparlas en listas. | Should | D-22 |
| RF-88 | El usuario podrá importar sus propios conjuntos de caracteres o palabras pegando una lista o subiendo un CSV o JSON. El sistema completará pinyin, trazos y componentes con los datos de la app (CC-CEDICT y Make Me a Hanzi) y pedirá el significado en español de lo que no lo tenga. Cada elemento se estudiará con las mismas prácticas que el contenido común. Los conjuntos serán privados: solo los ve quien los crea. | Should | D-22, D-126 |
| RF-89 | Cada uno de los 246 caracteres del HSK 1 será un elemento de estudio propio, con ficha (carácter, lectura común, significado suelto, trazos, radical y componentes) y las tres prácticas, igual que una palabra. Una palabra de dos o más caracteres (出租车, taxi = 出 + 租 + 车) solo entrará como nueva cuando todos sus caracteres se hayan introducido antes, en una sesión anterior o en la misma justo antes que ella. Los caracteres cuentan para el límite de elementos nuevos al día. Una palabra de un solo carácter (好) comparte ficha y progreso con ese carácter. | Must | D-83, D-127 |
| RF-77 | La tarjeta de significado deberá mostrar solo el significado de la entrada tal cual (un carácter suelto, su significado suelto). Los significados que solo aparecen en combinación pertenecen a esas palabras, que tienen su propia tarjeta; no se listan en la del carácter. | Must | D-83 |
| RF-78 | Cada carácter se enseñará con su lectura común; cuando en una palabra se lea distinto, la ficha y las tarjetas de esa palabra deberán destacar el carácter y su lectura en esa palabra. | Must | D-84 |
| RF-79 | El pinyin se mostrará siempre alineado con cada carácter (anotación ruby), debajo por defecto, en tarjetas, fichas, ejemplos, lecturas y ejercicios. | Must | D-85 |
| RF-80 | Toda pantalla de estudio deberá tener un botón "Ajustes de estudio" que abra, sin salir de la sesión, los ajustes de pinyin, opacidad, tamaño de caracteres, colores de tono y audio automático. | Must | D-87 |
| RF-83 | En Ajustes de estudio, el usuario podrá elegir la letra de los caracteres chinos: caligrafía Kai (por defecto), Sans (Hei) o Song. El pinyin y la interfaz no cambian. | Should | D-106 |
| RF-84 | El sistema deberá adaptar la dificultad de los ejercicios de cada palabra y de cada punto de gramática a su nivel de dominio, en 4 niveles: 1, reconocer entre pocas opciones con el pinyin visible; 2, más opciones y más parecidas entre sí; 3, producir con ayuda (ordenar, completar, escribir con contorno); 4, producir sin ayuda (traducir, escribir sin guía). Sube un nivel tras 3 aciertos seguidos con «Bien» o «Fácil» (valor ajustable) y baja uno al fallar, hasta volver a acertar; nunca baja del nivel 1. FSRS decide cuándo se repasa y el nivel decide cómo se pregunta. Las ayudas que el usuario active en Ajustes se respetan siempre. | Must | D-110 |

**Tabla 3.2.1 · Valoración automática**

| Práctica y modo | Otra vez | Difícil | Bien | Fácil |
| --- | --- | --- | --- | --- |
| Escritura | 3 o más trazos fallados, o pista usada | 1 o 2 trazos fallados | Sin fallos | Sin fallos y en menos de 2 s por trazo |
| Pronunciación: escribir pinyin | Sílabas incorrectas | Sílabas bien, algún tono mal | Todo correcto | Todo correcto en menos de 5 s |
| Pronunciación: opciones | Fallo | — | Acierto | Acierto en menos de 3 s |
| Pronunciación: hablar | No reconocido tras 2 intentos | Reconocido al segundo intento | Reconocido al primer intento | — |

Una práctica se considera **dominada** cuando su estabilidad FSRS es de 21 días o más: la palabra se recuerda con un 90 % de probabilidad durante al menos tres semanas.

### 3.3 Escritura de caracteres

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-22 | El sistema deberá mantener dos progresos de escritura separados: uno por palabra y otro por carácter, compartido entre todas las palabras que contienen ese carácter. | Must | D-50 |
| RF-23 | La práctica de escritura de un carácter deberá activarse cuando se active la de escritura de la primera palabra que lo contiene. | Must | D-43, D-50 |
| RF-24 | El sistema deberá corregir cada trazo mientras se escribe con el dedo o el ratón, comprobando forma, dirección y orden. | Must | D-02 |
| RF-25 | El usuario deberá poder elegir el modo de guía: sin guía, contorno completo o siguiente trazo uno a uno. La elección se guardará entre sesiones y se podrá cambiar en cualquier momento. | Must | D-49 |
| RF-26 | El botón de pista deberá resaltar el siguiente trazo (inicio y dirección). Usarlo cuenta como "Otra vez" en la valoración automática. | Must | D-48, D-51 |
| RF-27 | El sistema deberá poder reproducir la animación del orden de trazos de cualquier carácter. | Must | D-44 |
| RF-28 | La ficha de cada carácter deberá mostrar su radical, sus componentes y el significado de cada uno. | Should | D-52 |
| RF-29 | El sistema deberá incluir un conjunto extra de caracteres fuera del HSK 1 (unos 50 radicales básicos y unos 200 caracteres de alta frecuencia), estudiados con las tres prácticas, que el usuario podrá activar o desactivar en los ajustes. | Should | D-50, D-55 |
| RF-82 | En la escritura, los trazos del usuario se mostrarán en azul bolígrafo. Un ajuste («Escribir en azul bolígrafo», activado por defecto) permitirá mostrarlos en tinta. | Could | D-105 |
| RF-86 | El sistema deberá incluir el conjunto «Componentes del HSK 1» con todas las piezas que forman los 246 caracteres del nivel y que no son a su vez caracteres del HSK 1 (unas 186: radicales, formas laterales como 亻, 氵 o 扌 y sus subcomponentes). Cada componente tendrá ficha (nombre, significado o función, caracteres del HSK 1 en los que aparece y orden de trazos) y prácticas de significado y escritura; la de pronunciación solo si también se usa como carácter suelto. Un componente se introduce justo antes del primer carácter que lo contiene (RF-89). El conjunto viene activado y se puede desactivar en ajustes; un componente que esté también en el conjunto extra (RF-29) comparte progreso con él. | Should | D-52, D-125 |

### 3.4 Tonos y pronunciación

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-30 | El sistema deberá ofrecer un ejercicio de identificar el tono: se escucha una sílaba y se elige su tono (1.º a 4.º o neutro). | Must | D-53 |
| RF-31 | El sistema deberá ofrecer un ejercicio de pares mínimos: distinguir dos sílabas o palabras que solo se diferencian en el tono. | Must | D-53 |
| RF-32 | El sistema deberá ofrecer práctica de combinaciones de dos tonos, incluidos los cambios de tono (sandhi) del 3.º tono, de 不 y de 一. | Must | D-53 |
| RF-33 | El sistema deberá incluir una tabla de pinyin interactiva para escuchar cada sílaba en cada tono. | Should | D-53 |
| RF-34 | El sistema deberá colorear el pinyin y los caracteres según su tono, con opción de desactivarlo. El color nunca será la única pista: siempre se mostrará también la marca de tono, y la paleta será apta para daltonismo. | Must | D-32, D-54 |
| RF-35 | El sistema deberá reproducir la grabación nativa de una sílaba o palabra cuando exista y, si no, la voz sintética del navegador. | Must | D-21 |
| RF-36 | El sistema deberá permitir repetir el audio y reproducirlo a velocidad reducida. | Should | D-21 |
| RF-37 | El modo de respuesta "hablar" solo se ofrecerá cuando el navegador admita reconocimiento de voz; si no, el sistema explicará cómo usarlo (por ejemplo, abrir la app en Safari en el iPhone). | Must | D-20, D-34 |
| RF-38 | El sistema deberá guardar el resultado de cada respuesta de tono (tono correcto y tono elegido) para la futura estadística de acierto por tono. | Could | D-26 |
| RF-39 | La sesión guiada deberá empezar con un calentamiento de tonos de 1 a 2 minutos, que el usuario podrá desactivar en los ajustes. | Should | D-56 |

### 3.5 Gramática y construcción de frases

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-40 | El sistema deberá organizar la gramática en lecciones ordenadas según la lista oficial de puntos gramaticales del HSK 1 3.0. | Must | D-03, D-57 |
| RF-41 | Cada lección deberá mostrar una explicación breve en español, la estructura de la frase y ejemplos con pinyin, traducción y audio. | Must | D-57 |
| RF-42 | Tras completar una lección, sus ejercicios deberán volver como repasos programados con FSRS, con un progreso propio por punto gramatical. | Must | D-06, D-57 |
| RF-43 | Las frases de los ejercicios deberán usar solo palabras que el usuario ya ha introducido. Si no hay suficientes, el sistema avisará de qué palabras faltan. | Must | D-58 |
| RF-44 | El sistema deberá corregir cada ejercicio automáticamente, mostrar la respuesta correcta y explicar el error relacionándolo con el punto gramatical. | Must | D-45, D-57 |
| RF-45 | El sistema deberá ofrecer los tipos de ejercicio de la tabla 3.5.1. | Según tabla | D-59 |

**Tabla 3.5.1 · Tipos de ejercicio de gramática**

| Ejercicio | En qué consiste | Prioridad |
| --- | --- | --- |
| Ordenar palabras | Formar la frase con bloques desordenados | Must |
| Completar el hueco | Elegir la partícula o palabra que falta | Must |
| Traducir español → chino | Construir la frase con un banco de bloques o escribiendo pinyin | Must |
| Transformar la frase | Pasar de afirmativa a negativa o a pregunta | Must |
| Traducir chino → español | Elegir o escribir el significado de una frase china | Should |
| Dictado con bloques | Escuchar la frase y ordenarla sin verla | Should |
| Emparejar | Unir frases con su traducción o preguntas con su respuesta | Should |
| Detectar el error | Elegir la frase correcta entre varias, o señalar la palabra mal colocada | Should |
| Responder en un diálogo | Elegir la respuesta adecuada a una pregunta | Could |
| Dictado escrito | Escuchar y escribir la frase en pinyin | Could |
| Decir la frase | Leer la frase en voz alta con reconocimiento de voz, donde el navegador lo permita | Could |

### 3.6 Lecturas graduadas

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-46 | El sistema deberá incluir varias lecturas de nivel HSK 1, de 50 a 150 caracteres cada una, sobre temas cotidianos (familia, comida, compras, escuela…) y con personajes variados. | Must | D-31, D-63 |
| RF-47 | Las lecturas se mostrarán como texto, sin audio, en esta versión. | Must | D-60 |
| RF-48 | Al tocar una palabra de la lectura, el sistema deberá mostrar su pinyin, significado y audio, y permitir añadirla a las tarjetas. | Must | D-31 |
| RF-49 | Todas las lecturas estarán disponibles desde el principio. Cada una deberá mostrar el porcentaje de sus palabras y caracteres que el usuario ya conoce, y el sistema recomendará las que estén entre el 85 % y el 95 %. | Must | D-62 |
| RF-50 | Al terminar una lectura, el sistema deberá plantear de 3 a 4 preguntas de comprensión con corrección automática. | Must | D-61 |
| RF-51 | El sistema deberá registrar cada lectura completada, su resultado de comprensión y el tiempo de lectura. | Must | D-26 |
| RF-52 | Los ajustes de pinyin (mostrar, ocultar u opacidad) y de colores por tono deberán aplicarse también a las lecturas. | Must | D-18, D-54 |
| RF-53 | Audio de las lecturas con resaltado de cada frase mientras suena. | Won't (versión futura) | D-60 |
| RF-87 | El usuario podrá añadir sus propias lecturas pegando un texto en chino de hasta 2.000 caracteres. El sistema lo separará en palabras, mostrará el pinyin y el porcentaje de palabras conocidas y permitirá tocar cada palabra y añadirla a las tarjetas, como en las lecturas de la app, sin preguntas de comprensión. Las lecturas propias serán privadas: solo las ve quien las crea y nunca se publican ni se comparten. | Could | D-126 |

### 3.7 Inicio y estadísticas

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-54 | Al abrir la app, el sistema deberá mostrar un panel de inicio con el botón "Estudiar hoy", los repasos pendientes, la racha y el progreso del HSK. | Must | D-64 |
| RF-55 | El sistema deberá calcular la racha contando los días de descanso permitidos: no se rompe mientras los días sin estudiar de la semana no superen los configurados. | Must | D-36 |
| RF-56 | El sistema deberá mostrar la racha actual, la mejor racha y un calendario de actividad por días. | Must | D-26 |
| RF-57 | El sistema deberá mostrar el progreso de cada curso: palabras y caracteres nuevos, en aprendizaje y dominados, y el porcentaje completado, por separado para cada práctica. | Must | D-26, D-43 |
| RF-58 | El sistema deberá mostrar el tiempo estudiado por día y por semana. | Must | D-26 |
| RF-59 | El sistema deberá mostrar la tasa de acierto global y por práctica (significado, escritura, pronunciación). | Must | D-26 |
| RF-60 | El sistema deberá listar las palabras más difíciles (las más falladas) y permitir practicarlas directamente. | Must | D-26 |
| RF-61 | El sistema deberá mostrar los caracteres escritos y los errores de trazo. | Must | D-26 |
| RF-62 | El sistema deberá mostrar las lecturas completadas y la velocidad de lectura (caracteres por minuto). | Must | D-26 |
| RF-63 | Acierto por tono (con matriz de confusión) y previsión de repasos de los próximos 7 y 30 días. | Won't (versión futura) | D-26 |
| RF-81 | La navegación tendrá la misma estructura en móvil y escritorio: Hoy, Practicar (Tarjetas, Escritura, Tonos, Gramática, Lecturas, Mis listas), Progreso y Perfil con Ajustes. En escritorio, el menú lateral se podrá ocultar y quedar como barra de iconos, recordándose entre sesiones. | Must | D-86 |
| RF-85 | El sistema mostrará animaciones breves de celebración (menos de 1 segundo, sin sonido obligatorio y sin bloquear la pantalla) al sumar un día de racha y en sus hitos (7, 30 y 100 días), al completar el día, al terminar una sesión, lección o lectura y al desbloquear palabras. Con «reducir movimiento» activado en el sistema se mostrará un aviso sin movimiento. | Won't (versión posterior) | D-111 |

### 3.8 Recordatorios

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-64 | El sistema deberá ofrecer cuatro tipos de notificación: recordatorio diario, racha en riesgo, resumen semanal y repasos acumulados. | Must | D-30, D-65 |
| RF-65 | El usuario deberá poder activar o desactivar cada tipo y elegir su hora. | Must | D-65 |
| RF-66 | El sistema deberá elegir qué notificación enviar según la situación: no avisar si ya se ha estudiado ese día; no enviar "racha en riesgo" en días de descanso; "repasos acumulados" solo tras 3 o más días sin entrar; como máximo 2 notificaciones al día; y espaciar los avisos si el usuario no vuelve. | Must | D-65 |
| RF-67 | Tras configurar las metas, un diálogo propondrá el recordatorio diario con su hora y pedirá el permiso de notificaciones al pulsar "Activar" (nunca al abrir la app). En iPhone explicará que hace falta instalar la app en la pantalla de inicio. | Must | D-29, D-30 |
| RF-68 | Las horas de las notificaciones deberán respetar la zona horaria del usuario. | Must | D-65 |

### 3.9 Panel de administración

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RF-69 | Solo los usuarios con rol de administrador deberán poder acceder al panel y modificar el contenido común; las reglas de seguridad lo comprobarán en el servidor. | Must | D-33, D-40 |
| RF-70 | El administrador deberá poder crear, editar, ordenar y publicar cursos: niveles HSK, cursos temáticos de vocabulario y el conjunto extra de caracteres. | Must | D-15, D-68 |
| RF-71 | El administrador deberá poder gestionar vocabulario y caracteres: caracteres, pinyin, significado, frases de ejemplo, radicales y componentes. | Must | D-68 |
| RF-72 | El administrador deberá poder gestionar las lecciones de gramática y sus ejercicios. | Must | D-68 |
| RF-73 | El administrador deberá poder gestionar las lecturas y sus preguntas de comprensión. | Must | D-68 |
| RF-74 | El administrador deberá poder listar usuarios, bloquear o desbloquear cuentas y conceder o retirar el rol de administrador. | Must | D-68 |
| RF-75 | El contenido se podrá crear con formularios o importar en bloque desde CSV o JSON. La importación validará los datos antes de guardarlos y mostrará un informe de errores. | Must | D-69 |
| RF-76 | El panel deberá ofrecer las funciones adicionales de la tabla 3.9.1. | Según tabla | D-70 |

**Tabla 3.9.1 · Funciones adicionales del panel**

| Función | Para qué sirve | Prioridad |
| --- | --- | --- |
| Borrador y publicado, con vista previa | Preparar contenido sin que lo vean los estudiantes hasta que esté listo | Should |
| Validador de nivel | Avisar si una lectura o frase usa palabras de fuera de su nivel | Should |
| Reportes de errores | Los estudiantes marcan un error de contenido y el administrador lo revisa | Should |
| Registro de auditoría | Guardar quién hizo qué y cuándo, con el valor anterior y el nuevo, en todos los cambios de contenido y en las acciones sobre cuentas (bloqueos, roles, borrados). Permite deshacer y no se puede modificar desde la app | Must |
| Métricas anónimas | Qué palabras y ejercicios se fallan más, sin datos personales | Could |
| Exportar contenido | Copia de seguridad de todo el contenido en JSON | Should |

## 4. Requisitos no funcionales

Todos los valores están confirmados por el autor (D-73 a D-77).

### 4.1 Rendimiento

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-01 | La primera carga deberá mostrar contenido útil en menos de 3 s con una conexión 4G (LCP < 3 s). | Must | D-73 |
| RNF-02 | Cada interacción (tocar, girar tarjeta, trazar) deberá responder en menos de 100 ms. | Must | D-73 |
| RNF-03 | La app instalada deberá abrirse y mostrar el inicio en menos de 1 s. | Must | D-73 |
| RNF-04 | La puntuación de rendimiento de Lighthouse deberá ser de 90 o más. | Must | D-73 |

### 4.2 Funcionamiento sin conexión y disponibilidad

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-05 | Todas las funciones de estudio deberán funcionar sin conexión una vez descargado el contenido del curso. | Must | D-16 |
| RNF-06 | Al recuperar la conexión, los cambios locales deberán sincronizarse sin pérdida ni duplicados. | Must | D-72 |
| RNF-07 | Un ping diario deberá evitar que el proyecto de Supabase se pause. | Must | D-71 |

### 4.3 Seguridad

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-08 | La aplicación deberá cumplir OWASP ASVS nivel 2, verificado con una lista de comprobación antes de cada versión. | Must | D-33 |
| RNF-09 | Todas las tablas deberán tener RLS activado, denegando por defecto; cada política deberá tener tests automáticos. | Must | D-33, D-67 |
| RNF-10 | El registro y el inicio de sesión deberán estar protegidos con CAPTCHA (Cloudflare Turnstile) y límite de intentos. | Must | D-33, D-122 |
| RNF-11 | Las contraseñas deberán tener al menos 12 caracteres, según ASVS. | Must | D-33 |
| RNF-12 | Todo el tráfico irá por HTTPS, con cabeceras de seguridad (CSP, HSTS, X-Content-Type-Options). | Must | D-33 |
| RNF-13 | Ningún secreto (clave de servicio, claves VAPID, clave de cifrado) estará en el repositorio ni en el código del cliente; se guardarán en los secretos de GitHub y de Supabase. | Must | D-24, D-33 |
| RNF-14 | El registro de auditoría no podrá modificarse ni borrarse desde la app, tampoco por un administrador. | Must | D-70 |
| RNF-15 | Las dependencias se revisarán automáticamente en busca de vulnerabilidades (Dependabot). | Must | D-33 |

### 4.4 Privacidad y copias de seguridad

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-16 | Los datos se alojarán en la Unión Europea. | Must | D-33 |
| RNF-17 | Solo se guardarán los datos personales necesarios: email, nombre de usuario, ajustes y progreso de estudio. No habrá analítica de terceros. Única excepción: el registro de errores con Sentry, sin IP, email ni datos de estudio. | Must | D-37, D-123 |
| RNF-18 | La política de privacidad deberá explicar qué datos se guardan, para qué, dónde, durante cuánto tiempo y cómo ejercer los derechos. | Must | D-37 |
| RNF-19 | Se hará una copia de seguridad semanal de la base de datos, cifrada antes de salir del servidor. | Must | D-74 |
| RNF-20 | Se conservarán las 4 últimas copias; los datos de una cuenta borrada desaparecerán de las copias como máximo en ese plazo, y así se indicará en la política de privacidad. | Must | D-37, D-74 |

### 4.5 Accesibilidad

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-21 | La interfaz deberá cumplir WCAG 2.2 nivel AA. | Must | D-32 |
| RNF-22 | Deberá poder usarse entera con teclado y con lector de pantalla (VoiceOver), salvo el trazado de caracteres, que tendrá una alternativa de elegir el carácter correcto. | Must | D-32 |
| RNF-23 | Deberá tener modo oscuro y admitir texto ampliado hasta el 200 % sin perder contenido. | Must | D-32 |
| RNF-24 | Cada versión deberá pasar tests automáticos de accesibilidad (axe) sin errores. | Must | D-32 |

### 4.6 Compatibilidad

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-25 | La app deberá funcionar en las 2 últimas versiones de Safari (iOS y macOS) y de Chrome (ordenador y Android). | Must | D-29, D-73 |
| RNF-26 | La interfaz deberá adaptarse a pantallas desde 320 px de ancho hasta escritorio. | Must | D-02 |

### 4.7 Calidad y mantenibilidad

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-27 | El código usará TypeScript en modo estricto, ESLint y Prettier. | Must | D-75 |
| RNF-28 | La lógica principal (FSRS, valoración automática, sincronización, racha, notificaciones) tendrá al menos un 80 % de cobertura de tests. | Must | D-75 |
| RNF-29 | Los flujos principales tendrán tests de extremo a extremo (Playwright). | Must | D-75 |
| RNF-30 | Los commits seguirán Conventional Commits y se publicarán desde la cuenta del autor. | Must | D-04, D-75 |
| RNF-31 | Un CI en GitHub Actions deberá bloquear cualquier cambio que no pase lint, tests, accesibilidad y build. | Must | D-75 |
| RNF-32 | SonarQube Cloud analizará cada cambio y su quality gate formará parte del CI. | Must | D-76 |
| RNF-35 | El CI de cada pull request deberá terminar en menos de 10 minutos. Para ello: trabajos en paralelo, caché de dependencias y navegadores, E2E de humo solo en Chromium en cada PR, y la suite E2E completa (Chromium y WebKit) cada noche y antes de cada versión. | Must | D-77 |

### 4.8 Internacionalización

| ID | Requisito | Prioridad | Origen |
| --- | --- | --- | --- |
| RNF-33 | Ningún texto de la interfaz estará escrito en el código: todos vendrán de archivos de traducción. | Must | D-14 |
| RNF-34 | El contenido de estudio guardará el significado por idioma, para poder añadir traducciones sin cambiar el modelo de datos. | Must | D-14 |
