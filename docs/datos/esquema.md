# Esquema de datos

> Origen: «Lexis · Esquema de datos» en claude.ai, exportado el 12 de noviembre de 2026. Desde ahora la fuente de verdad es este archivo.

El esquema tiene 24 tablas de Postgres en Supabase, en tres zonas: contenido, datos de cada estudiante y administración. Sustituye al modelo de 21 tablas de la fase 3 (D-81) e incorpora los componentes, el contenido privado, el orden componente → carácter → palabra y el nivel adaptativo.

## Convenciones

Todas las tablas siguen las mismas reglas. Son las habituales en Postgres y evitan migraciones dolorosas más adelante.

- **Normalización en tercera forma normal (3FN):** cada dato vive en un solo sitio y las relaciones son claves foráneas reales. La excepción son los textos por idioma y los datos de cada tipo de ejercicio, en JSON validado con Zod.
- **Claves primarias UUID v7**, creadas en el dispositivo. Así se puede crear una fila sin conexión sin chocar con otro dispositivo, y v7 las ordena por fecha. Excepciones: `audit_log` y `tombstone`, que usan un entero autoincremental porque solo los escribe el servidor.
- **Nada de claves polimórficas:** cuando una fila puede apuntar a una palabra, un carácter, un punto gramatical o una lectura, lleva una columna con clave foránea para cada uno y una restricción `CHECK (num_nonnulls(...) = 1)`. Así Postgres garantiza que la referencia existe.
- **Nombres en inglés y en `snake_case`**, tablas en singular (`word`, `review_log`).
- **Fechas en `timestamptz` (UTC)**: `created_at`, y `updated_at` mantenida por un trigger en las tablas que se editan. Las horas locales del usuario, como las de los recordatorios, van en `time` junto a su zona horaria IANA (`Europe/Madrid`).
- **Valores cerrados como tipos `enum`** de Postgres (estado, tipo de práctica, rol). Añadir un valor después es una línea (`ALTER TYPE … ADD VALUE`).
- **Textos por idioma en `jsonb`:** `{"es": "alquilar"}`. Añadir otro idioma no cambia ninguna tabla (RNF-34); para publicar, la clave `es` es obligatoria.
- **Pinyin guardado con número de tono** (`zu1`), que es lo que se busca y se compara; la app lo muestra con marcas (`zū`).
- **Contenido común y propio en las mismas tablas:** `owner_id` vacío es contenido de Lexis; con valor, es privado de ese usuario (D-126).

**Para la sincronización (ADR-023):** las tablas que edita el usuario (`profile`, `reminder`, `practice` y su contenido propio) llevan, además de `updated_at`, una columna `client_updated_at` que pone el dispositivo y decide quién gana un conflicto. El id de `practice` es un UUID v5 calculado de usuario, elemento y habilidad, para que dos dispositivos sin conexión creen la misma fila. La subida se hace con la función `sync_push(changes jsonb)`, que se ejecuta con los permisos del usuario.

## De un vistazo

Las tres zonas y sus tablas se detallan en las secciones siguientes. (El diagrama del documento original no se exporta.)

Cada flecha va de una tabla a la que depende de ella. `practice` apunta a una palabra, un carácter o un punto gramatical, y cada repaso queda en `review_log`; el estado FSRS, la racha y las estadísticas se calculan desde ahí.

## Contenido (12 tablas)

El contenido de Lexis lo editan Editor y Admin y lo leen todos los usuarios cuando está publicado. El contenido propio (`owner_id` con valor) solo lo ve y lo edita su dueño. Las tablas `custom_card` y `custom_list` de la fase 3 desaparecen: una tarjeta propia es una `word` con dueño, y una lista es un `course` con dueño.

| Tabla | Para qué | Columnas clave |
| --- | --- | --- |
| `course` | Curso, conjunto o lista | `owner_id`, `kind` (hsk, thematic, extra, components, user_list, user_import), `level`, `title` jsonb, `sort_order`, `status` (draft, published) |
| `course_item` | Elemento de un curso, en orden | `course_id`, una de `word_id`, `character_id`, `grammar_point_id`, `reading_id`, `sort_order`; único por curso y elemento |
| `character` | Carácter o componente | `owner_id`, `hanzi`, `kind` (character, component), `standalone` (el componente se usa también como carácter), `pinyin` (lectura común), `meaning` jsonb, `radical_id`, `stroke_count`, `strokes_key` (archivo de trazos en Vercel), `status` |
| `character_component` | Qué piezas forman cada carácter | `character_id`, `component_id`, `role` (meaning, sound, form), `position` |
| `word` | Palabra | `owner_id`, `hanzi`, `pinyin`, `hsk_level`, `audio_key`, `status`; única por `hanzi` y `pinyin` en el contenido común |
| `word_sense` | Acepciones de una palabra (D-83) | `word_id`, `sort_order`, `part_of_speech`, `meaning` jsonb, `example_hanzi`, `example_pinyin`, `example_translation` jsonb |
| `word_character` | Caracteres de cada palabra, en orden (D-84) | `word_id`, `position`, `character_id`, `pinyin` (lectura en esa palabra) |
| `grammar_point` | Punto gramatical | `hsk_level`, `sort_order`, `title` jsonb, `structure`, `explanation` jsonb, `status` |
| `grammar_point_word` | Vocabulario que desbloquea un punto | `grammar_point_id`, `word_id` |
| `exercise` | Ejercicio de gramática | `grammar_point_id`, `type` (los 11 de la tabla 3.5.1), `level` 1 a 4 (D-110), `payload` jsonb validado con Zod, `status` |
| `reading` | Lectura de Lexis o texto propio | `owner_id`, `title`, `topic`, `body`, `sentence_translations` jsonb, `char_count` (calculado), `status` |
| `reading_question` | Pregunta de comprensión | `reading_id`, `sort_order`, `prompt` jsonb, `options` jsonb, `correct_index`, `evidence_sentence` |

**Orden componente → carácter → palabra (D-127):** sale de `word_character` y `character_component`. Para introducir 出租车, la app busca sus caracteres y, de cada uno, sus componentes; introduce primero los que el usuario aún no tiene en `practice`. Ningún orden se guarda dos veces.

**Una palabra de un carácter (好)** tiene su fila en `word` y otra en `character`. La app las muestra como una sola ficha y solo crea prácticas para el carácter, así el progreso no se duplica.

## Datos de cada estudiante (9 tablas)

Cada fila lleva `user_id` y solo la ve su dueño. Los historiales (`review_log`, `reading_attempt`, `tone_attempt`) solo crecen: nunca se editan ni se borran, salvo al borrar la cuenta. Sincronizarlos es juntar filas, sin conflictos (D-72).

| Tabla | Para qué | Columnas clave |
| --- | --- | --- |
| `profile` | Uno por cuenta de Auth | `id` (= `auth.users.id`), `username` único sin distinguir mayúsculas, `age_confirmed_at`, `privacy_accepted_at`, `timezone`, `minutes_per_day`, `new_per_day`, `rest_days_per_week`, `study_settings` jsonb, `updated_at` |
| `reminder` | Los 4 recordatorios (RF-64) | `user_id`, `type` (daily, streak_risk, weekly, backlog), `enabled`, `local_time`; clave `(user_id, type)` |
| `practice` | Una por elemento y habilidad | `user_id`, una de `word_id`, `character_id`, `grammar_point_id`; `skill` (meaning, writing, pronunciation, grammar); caché FSRS: `state`, `stability`, `difficulty`, `due_at`, `last_review_at`, `reps`, `lapses`; nivel adaptativo: `level` 1 a 4, `streak`; `introduced_at`, `unlocked_at` |
| `review_log` | Cada repaso, solo se añade | `practice_id`, `user_id`, `reviewed_at`, `rating` 1 a 4, `rating_source` (user, auto, auto_corrected), `answer_mode`, `level`, `duration_ms`, `details` jsonb (trazos fallados, pista usada) |
| `reading_attempt` | Cada lectura terminada | `reading_id`, `completed_at`, `correct`, `total`, `duration_s`; velocidad calculada |
| `tone_attempt` | Cada respuesta de tono (RF-38) | `syllable`, `expected_tone`, `chosen_tone`, `exercise_type`, `answered_at` |
| `push_subscription` | Un navegador suscrito a Web Push | `endpoint` único, `p256dh`, `auth`, `user_agent` |
| `notification_log` | Avisos enviados, para el máximo de 2 al día | `type`, `sent_at`; solo la escribe la Edge Function |
| `content_report` | Error de contenido reportado | `reporter_id`, uno de `word_id`, `character_id`, `grammar_point_id`, `reading_id`, `exercise_id`; `reason`, `message`, `status` (open, resolved), `reply`, `resolved_by` |

**Ajustes mixtos (D-135):** `study_settings` guarda en la cuenta lo que se sincroniza: pinyin y opacidad, tamaño de los caracteres, colores de tono, audio automático, letra, guía de escritura, azul bolígrafo, valoración automática, calentamiento y conjuntos activados. La apariencia (tema y tamaño del texto) se queda en el dispositivo, en IndexedDB, y nunca sube.

**Lo que no se guarda porque se calcula:** la racha y el calendario salen de las fechas de `review_log` y de los días de descanso; el tiempo estudiado, de `duration_ms`; las palabras difíciles, de los fallos; el porcentaje conocido de una lectura, de `practice`. El estado FSRS y el nivel de `practice` también se pueden recalcular desde el historial: si alguna vez no cuadran, manda el historial.

## Administración y sincronización (3 tablas)

| Tabla | Para qué | Columnas clave |
| --- | --- | --- |
| `user_role` | Rol y bloqueo de una cuenta (D-67) | `user_id`, `role` (editor, admin; vacío = estudiante), `blocked_at`, `blocked_reason`, `granted_by` |
| `audit_log` | Quién cambió qué y cuándo (RNF-14) | `id` entero, `at`, `actor_id`, `action`, `table_name`, `row_id`, `old` y `new` jsonb |
| `tombstone` | Avisa a los demás dispositivos de lo que se ha borrado | `id` entero, `table_name`, `row_id`, `user_id`, `deleted_at` |

**Auditoría:** la rellenan triggers en las tablas de contenido y en `user_role`, nunca la app. Ningún rol, ni Admin, tiene permiso para editarla o borrarla. Guarda quién tocó el contenido y las cuentas, nunca datos de estudio (RGPD).

**Borrado inmediato (D-135):** al borrar una lista, un conjunto importado o un texto propio, la fila desaparece al momento, junto con sus elementos y sus prácticas. Un trigger anota el borrado en `tombstone`, para que tus otros dispositivos lo borren al sincronizar aunque estuvieran sin conexión. Las anotaciones de más de 90 días se purgan; un dispositivo que lleve más tiempo sin conectarse descarga todo de nuevo.

**Borrar la cuenta (RF-07):** la Edge Function `delete-account` borra el usuario de Auth, y las claves foráneas con `ON DELETE CASCADE` se llevan todas sus filas, también los historiales y el contenido propio. Solo queda en `audit_log` el rastro de los cambios que hizo como Editor o Admin.

## Seguridad: permisos y RLS

Hay dos cerrojos y los dos deben abrirse para que la app lea una fila. En los proyectos de Supabase creados desde el 30 de mayo de 2026, las tablas nuevas de `public` no son visibles para la API hasta que se les da un `GRANT` explícito ([Supabase](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)). Ese es el primer cerrojo: qué tablas ve la API. El segundo es RLS: qué filas de esas tablas ve cada usuario.

- **Ningún permiso para `anon`:** la app exige cuenta (D-39), así que sin sesión la API no ve ninguna tabla.
- **Cada migración que crea una tabla incluye en el mismo archivo** `ENABLE ROW LEVEL SECURITY`, sus políticas y sus `GRANT` para `authenticated`. Una prueba de pgTAP falla si alguna tabla de `public` no tiene RLS.
- **Las funciones de rol** (`is_editor()`, `is_admin()`, `is_blocked()`) son `SECURITY DEFINER` y leen `user_role`, para que las políticas no dependan de lo que diga el cliente.

| Tablas | `GRANT` a `authenticated` | Política RLS |
| --- | --- | --- |
| Contenido (`course`, `character`, `word`, `reading` y sus tablas hijas) | select, insert, update, delete | Leer: publicado y sin dueño, o `owner_id = auth.uid()`, o Editor. Escribir: Editor en lo común; el dueño en lo suyo |
| `grammar_point`, `grammar_point_word`, `exercise` | select, insert, update, delete | Leer: publicado, o Editor. Escribir: solo Editor |
| `profile`, `reminder`, `practice` | select, insert, update | Solo `user_id = auth.uid()` y cuenta no bloqueada |
| `review_log`, `reading_attempt`, `tone_attempt` | select, insert | Solo las propias; sin update ni delete, el historial no se reescribe |
| `push_subscription` | select, insert, delete | Solo las propias |
| `content_report` | select, insert, update | El autor crea y ve las suyas; Editor las ve todas y las resuelve |
| `user_role` | select | Cada uno ve la suya; Admin ve todas. Los cambios, solo por la Edge Function de cuentas |
| `audit_log` | select | Solo Editor y Admin pueden leer; nadie puede escribir desde la API |
| `notification_log` | ninguno | Solo `service_role` (Edge Function de avisos) |
| `tombstone` | select | Solo las propias y las del contenido común |

## Límites, índices y espacio

**Límites del contenido propio (D-135).** Los comprueba un trigger antes de insertar, y la app avisa antes de llegar:

| Qué | Máximo por usuario |
| --- | --- |
| Listas y conjuntos (`course` con dueño) | 50 |
| Palabras y caracteres importados o creados | 2.000 |
| Textos propios (`reading` con dueño) | 100, de hasta 2.000 caracteres cada uno |

**Índices** (además de las claves primarias y únicas):

- `practice (user_id, due_at)`: qué toca repasar hoy.
- `review_log (user_id, reviewed_at)` y `review_log (practice_id, reviewed_at)`: racha, estadísticas y recalcular FSRS.
- `updated_at` en cada tabla de contenido y `tombstone (user_id, deleted_at)`: descargar solo lo que cambió desde la última sincronización.
- Un índice en cada clave foránea, porque Postgres no los crea solo y sin ellos los borrados en cascada son lentos.

**Espacio en el plan gratuito (500 MB).** Lo que más crece es `review_log`. Cálculo aproximado:

- **Prácticas de un usuario que completa el HSK 1:** unas 2.100 (palabras, caracteres y componentes en sus habilidades, más 70 puntos de gramática).
- **Repasos el primer año:** unos 12 por práctica, es decir, unas 25.000 filas.
- **Tamaño por fila:** unos 220 bytes con sus índices.
- **Total:** unos 5,5 MB por usuario muy activo al año. El contenido común ocupa menos de 10 MB.

Da para unos 80 años-usuario muy activos, de sobra para uso personal y un grupo pequeño. Si el proyecto crece, se archivan los repasos de más de un año en un archivo comprimido de Storage. `practice` ya guarda el estado, así que no se pierde nada. El panel de Supabase avisa al acercarse al límite.

## Qué cambia respecto a la fase 3

De 21 tablas se pasa a 24. La idea central no cambia: el historial manda y el resto se calcula (D-81).

| Cambio | Por qué |
| --- | --- |
| Salen `custom_card` y `custom_list`; entra `owner_id` en `course`, `word`, `character` y `reading` | El contenido propio usa las mismas tablas, las mismas pantallas y el mismo código que el común (D-126) |
| Entra `character_component` y `character.kind` | Los 186 componentes son elementos de estudio con ficha y prácticas (D-125) |
| Entra `grammar_point_word` | Saber qué vocabulario desbloquea cada punto gramatical sin leer los ejemplos (RF-43) |
| Entra `tone_attempt` | Guardar cada respuesta de tono para la estadística futura (RF-38) |
| `reading_progress` pasa a ser `reading_attempt`, que solo crece | Se sincroniza como `review_log`, sin conflictos |
| Entran `reminder` y `tombstone` | Recordatorios con su hora local, y borrados que llegan a todos los dispositivos (D-135) |
| `practice` gana `level`, `streak` y `unlocked_at`; `review_log` gana `level`, `rating_source` y `details` | Nivel adaptativo (D-110) y valoración del usuario o automática (D-91) |
| Las referencias a «cualquier contenido» son columnas con clave foránea y `CHECK`, no un tipo y un id sueltos | Postgres garantiza que lo referenciado existe |

**Siguiente paso:** escribir la primera migración (`supabase/migrations/…_init.sql`) con TDD. Primero van las pruebas de pgTAP de las políticas, luego las tablas que las hacen pasar.
