# EP-09 · Panel de administración

## HU-51 · Entrar al panel como administrador

Must · RF-69

Como administrador, quiero un panel al que solo accedan los administradores, para que nadie más cambie el contenido.

- Dado que tengo rol de administrador, cuando abro el menú, entonces veo la entrada "Administración".
- Dado que soy estudiante sin rol, cuando intento leer o modificar datos de administración, incluso llamando directamente a la API, entonces el servidor lo rechaza.

## HU-52 · Gestionar cursos

Must · RF-70

Como administrador, quiero crear y ordenar cursos (niveles HSK, temáticos y el conjunto extra), para ampliar la app sin tocar el código.

- Dado que creo un curso con nombre, nivel y orden, cuando lo publico, entonces aparece a los estudiantes en ese orden.

## HU-53 · Gestionar vocabulario y caracteres

Must · RF-71

Como administrador, quiero crear y editar palabras y caracteres, para mantener el contenido correcto.

- Dado que edito una palabra (caracteres, pinyin, significado, ejemplo, radical, componentes), cuando la guardo, entonces los estudiantes ven el cambio en su siguiente sincronización y su progreso no se pierde.

## HU-54 · Gestionar la gramática

Must · RF-72

Como administrador, quiero crear lecciones y sus ejercicios, para completar la gramática de cada nivel.

- Dado que creo un ejercicio, cuando elijo su tipo de la tabla 3.5.1, entonces el formulario me pide solo los campos de ese tipo.

## HU-55 · Gestionar lecturas

Must · RF-73

Como administrador, quiero crear lecturas con sus preguntas, para ofrecer textos nuevos.

- Dado que guardo una lectura, cuando añado sus preguntas, entonces cada pregunta tiene una respuesta correcta marcada.

## HU-56 · Gestionar usuarios

Must · RF-74

Como administrador, quiero ver cuentas, bloquear abusos y gestionar roles, para mantener la app segura.

- Dado que bloqueo una cuenta, cuando su dueño intenta usar la app, entonces no puede acceder a sus datos ni iniciar sesión.
- Dado que concedo o retiro el rol de administrador, cuando se guarda, entonces el cambio queda en el registro de auditoría.
- Dado que soy el único administrador, cuando intento quitarme el rol, entonces la app no lo permite.

## HU-57 · Importar contenido en bloque

Must · RF-75

Como administrador, quiero importar un CSV o JSON, para cargar listas enteras de golpe.

- Dado que subo un archivo, cuando se valida, entonces veo un resumen de lo que se va a crear o cambiar y la lista de errores por fila, antes de guardar nada.
- Dado que hay errores, cuando confirmo, entonces solo se importa si el archivo entero es válido.

## HU-58 · Preparar contenido en borrador

Should · RF-76

Como administrador, quiero guardar contenido como borrador y previsualizarlo, para publicarlo solo cuando esté listo.

- Dado que guardo algo como borrador, cuando un estudiante abre la app, entonces no lo ve.
- Dado que pulso "Vista previa", cuando se abre, entonces lo veo tal como lo verá un estudiante.

## HU-59 · Validar el nivel del contenido

Should · RF-76

Como administrador, quiero que se me avise si un texto usa palabras de fuera de su nivel, para mantener la dificultad.

- Dado que guardo una lectura o frase de HSK 1, cuando contiene palabras de un nivel superior, entonces se señalan y puedo guardarla igualmente.

## HU-60 · Revisar errores reportados

Should · RF-76

Como estudiante, quiero reportar un error en el contenido, y como administrador, quiero revisarlos, para que el contenido mejore.

- Dado que veo un error en una tarjeta o lectura, cuando pulso "Reportar" y escribo qué falla, entonces se envía al panel.
- Dado que abro los reportes, cuando marco uno como resuelto, entonces desaparece de pendientes.

## HU-61 · Consultar y deshacer cambios

Must · RF-76, RNF-14

Como administrador, quiero ver quién cambió qué y cuándo, para responder de los cambios y deshacer errores.

- Dado que alguien modifica contenido o una cuenta, cuando se guarda, entonces se registran autor, fecha, valor anterior y valor nuevo.
- Dado que abro un cambio de contenido, cuando pulso "Deshacer", entonces se restaura el valor anterior y eso queda también registrado.
- Dado que soy administrador, cuando intento editar o borrar una entrada del registro, entonces no es posible.

## HU-62 · Exportar el contenido

Should · RF-76

Como administrador, quiero exportar todo el contenido en JSON, para tener una copia o migrarlo.

- Dado que pulso "Exportar", cuando termina, entonces obtengo un JSON con cursos, palabras, gramática y lecturas que se puede volver a importar.

## HU-63 · Ver qué contenido cuesta más

Could · RF-76

Como administrador, quiero métricas anónimas de acierto por palabra y por pregunta, para mejorar el contenido difícil.

- Dado que abro las métricas, cuando cargan, entonces veo tasas de acierto sumadas de todos los usuarios, sin datos que identifiquen a nadie.
