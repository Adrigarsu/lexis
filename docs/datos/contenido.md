# Contenido y datos

> Origen: «Lexis · Contenido y datos» en claude.ai, exportado el 12 de noviembre de 2026. Desde ahora la fuente de verdad es este archivo.

Fase 3 del proyecto: de dónde sale el contenido, con qué licencias y cómo se guarda. Requisitos de origen en el documento «Lexis · Especificación de requisitos (SRS)».

## 1. Vocabulario HSK 1 (estándar 3.0)

El HSK 1 vigente tiene **300 palabras**, no 500. La cifra de 500 era del estándar de 2021; el temario oficial publicado en noviembre de 2025 la rebajó y es el que se examina desde julio de 2026 ([Wikipedia](https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi)).

| Nivel 1 (temario 2025) | Cantidad |
| --- | --- |
| Palabras | 300 |
| Caracteres para reconocer | 246 |
| Caracteres para escribir a mano | 0 (empiezan en el nivel 2, con 100) |
| Puntos gramaticales | 70 |

Fuente de las cifras: tabla del temario reproducida en [ofou/hsk](https://github.com/ofou/hsk), un espejo en CSV del sistema oficial de consulta.

- **Fuente oficial:** el sistema de consulta del temario en [chinesetest.cn](https://www.chinesetest.cn/syllabus), publicado por el Centro de Intercambio y Cooperación Lingüística (CLEC) y Chinese Testing International.
- **Datos que usaremos de la lista oficial:** solo palabra, pinyin, categoría gramatical y nivel. Los significados en español, las frases de ejemplo y las lecturas serán contenido propio.
- **Espejo en CSV:** [ofou/hsk](https://github.com/ofou/hsk) ofrece los archivos de vocabulario, caracteres, caracteres de escritura y gramática en CSV. Su página no indica una licencia visible, así que lo usaremos solo para contrastar, cargando los datos desde la fuente oficial.
- **Escritura:** el HSK 1 no exige escribir a mano, pero la app enseña a escribir desde el principio (D-43, D-50). La lista oficial de caracteres de escritura del nivel 2 nos dirá cuáles priorizar.

## 2. Gramática HSK 1

El temario de 2025 fija **70 puntos gramaticales** para el nivel 1, frente a los 48 del estándar de 2021, que queda sustituido ([ofou/hsk](https://github.com/ofou/hsk)).

- La lista se descargará del sistema oficial de consulta y cada punto será una lección (RF-40).
- Las explicaciones en español y los ejercicios serán contenido propio; de la fuente oficial solo se toma el nombre y el orden de cada punto.
- Con 70 puntos, la gramática es el bloque de contenido más grande que hay que redactar a mano. Conviene escribirla por tandas: primero los puntos que necesitan las lecturas.

## 3. Fuentes de datos y licencias

Todas las fuentes permiten su uso en un proyecto público, pero tres de ellas son *copyleft*: lo que derivemos de ellas debe publicarse con la misma licencia. Por eso el código va con MIT y los datos en una carpeta aparte con sus propias licencias (D-24).

| Dato | Fuente | Licencia | Obligación para nosotros |
| --- | --- | --- | --- |
| Lista HSK (palabra, pinyin, categoría, nivel) | [Temario oficial, chinesetest.cn](https://www.chinesetest.cn/syllabus) | Documento oficial; sin licencia abierta expresa | Usar solo los datos de la lista, citar la fuente, no copiar textos ni ejemplos del temario |
| Significados en inglés (referencia) | [CC-CEDICT](https://cc-cedict.org/wiki/) | CC BY-SA 3.0 | Atribuir; las traducciones derivadas se publican con CC BY-SA |
| Trazos y animación | [Hanzi Writer](https://hanziwriter.org/license.html) (código) + hanzi-writer-data (datos de Make Me a Hanzi) | Código MIT; datos Arphic Public License | Incluir ARPHICPL.TXT sin modificar junto a los datos |
| Radical y componentes | Make Me a Hanzi, dictionary.txt ([fuente](https://hanyuguide.com/open-source)) | LGPL v3 | Atribuir y publicar los cambios que hagamos al archivo |
| Audio de palabras y sílabas | [audio-cmn](https://github.com/hugolpz/audio-cmn) | CC BY-SA | Atribuir a quienes grabaron los audios (Chen Wang y Yue Tan); basado en la lista HSK de 2000, así que algunas palabras del temario 2025 faltarán y usarán voz sintética |
| Significados en español, frases de ejemplo, lecturas y gramática | Contenido propio | CC BY-SA 4.0 (propuesta) | Compatible con CC-CEDICT y permite que otros reutilicen nuestro contenido |

**No hay un diccionario chino-español con licencia abierta** equivalente a CC-CEDICT. Los significados en español de las 300 palabras se redactarán desde el panel de administración, usando CC-CEDICT como referencia.

**Frases de Tatoeba:** sus textos son CC BY, pero cada audio tiene la licencia que eligió quien lo grabó ([Tatoeba](https://www.tatoeba.org/en/faq)). Si las usamos, solo con audios CC BY o CC BY-SA, nunca NC ni sin licencia.

## 4. Modelo de datos

El modelo separa el contenido común, que solo edita el administrador, de los datos de cada estudiante, que solo ve su dueño. La pieza central es review_log: un historial de repasos al que solo se añaden filas.

*[Diagrama del modelo de datos (21 tablas en 3 zonas): está en el documento original «Lexis · Contenido y datos».]*

Las flechas van de cada tabla a la que depende de ella. practice apunta a una palabra, carácter o punto gramatical del contenido común.

**Por qué el historial es la pieza clave (D-72):**

- Cada repaso se guarda como una fila nueva en review_log, con un id creado en el propio dispositivo (UUID). Dos dispositivos nunca escriben la misma fila, así que sincronizar es juntar filas: no hay conflictos que resolver.
- El estado FSRS de cada práctica (estabilidad, dificultad, próximo repaso) se calcula repasando su historial en orden de fecha. practice solo lo guarda como caché para no recalcularlo cada vez.
- Este patrón se llama *event sourcing*: el historial es la verdad y el estado se deriva de él.

**Otras decisiones del modelo:**

- **course_item une cursos con cualquier contenido** (palabra, carácter, gramática o lectura). Así un HSK 2 o un curso temático es solo un curso nuevo con sus elementos (D-15).
- **Textos por idioma en columnas JSON** ({"es": "hola", "en": "hello"}), para añadir idiomas sin cambiar tablas (RNF-34).
- **audit_log se rellena con triggers de la base de datos**, no desde la app; ni el administrador puede modificarlo (RNF-14).
- **Nombres de tablas y columnas en inglés**, la convención habitual en bases de datos y código.
- **Varias acepciones por palabra (word_sense, D-83):** cada acepción con su categoría, significado por idioma, ejemplo y orden (la principal primero). La tarjeta de significado las muestra todas, numeradas.
- **Lectura de cada carácter dentro de cada palabra (word_character.reading, D-84):** character guarda la lectura común, y si en una palabra el carácter se lee distinto (行 *xíng* → 银行 *yínháng*), la tarjeta de esa palabra lo destaca.
- **Nivel de dificultad de cada práctica (practice.level y practice.streak, D-110):** nivel de 1 a 4 y aciertos seguidos, para la dificultad adaptativa (RF-84). Cada fila de review_log guarda el nivel con el que se preguntó, y el nivel actual se calcula repasando el historial en orden, como el estado FSRS; así también se sincroniza sin conflictos.

## 5. Decisiones y tareas pendientes

**Confirmado por el autor (D-80, D-81):**

- Licencia del contenido propio (significados, frases, lecturas, gramática): CC BY-SA 4.0.
- Modelo de datos de la sección 4.

**Tareas de contenido (se convertirán en issues):**

- [ ] Descargar del sistema oficial la lista de 300 palabras, los 246 caracteres y los 70 puntos gramaticales del nivel 1.
- [ ] Escribir un script que importe la lista oficial al formato del panel (CSV o JSON, RF-75).
- [ ] Redactar en español los significados de las 300 palabras, usando CC-CEDICT como referencia.
- [ ] Comprobar qué palabras del HSK 1 tienen audio en audio-cmn; el resto usará voz sintética.
- [ ] Redactar las 70 lecciones de gramática y sus ejercicios, por tandas.
- [ ] Escribir las primeras lecturas y comprobar con el validador de nivel que solo usan vocabulario HSK 1.
- [ ] Elegir el conjunto extra: unos 50 radicales y unos 200 caracteres frecuentes fuera del HSK 1 (D-55).
- [ ] Preparar el archivo NOTICE con todas las atribuciones e incluir ARPHICPL.TXT y la licencia LGPL junto a los datos.
