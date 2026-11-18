# Roadmap

Orden de los milestones decidido en la fase 6 (D-166). Cada milestone es una iteración que deja algo usable. Los milestones 0 y 1 ya existen en GitHub; los siguientes, con sus issues, se crean más adelante con la skill `crear-issue`. Sin fechas: se planifica por esfuerzo, a 1 hora al día (D-38).

| Milestone                             | Qué entrega                                                                                                                        | Historias                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 0 · Organización del repositorio      | Documentación, plantillas, skills y autoría (D-139)                                                                                | Tareas, cerrado                                                                                       |
| 1 · Cimientos técnicos                | Monorepo, herramientas, pruebas, CI y Supabase en local (D-139)                                                                    | Tareas                                                                                                |
| 2 · Base y cuenta                     | La plataforma de la app e iniciar sesión con registro cerrado (D-163) y roles                                                      | EP-12 salvo HU-86 (HU-74 a HU-85); HU-03 sin el CAPTCHA; HU-51                                        |
| 3 · Panel y contenido                 | Panel de administración sencillo y los datos del HSK 1 cargados: lista, trazos y componentes (D-164)                               | HU-53, HU-57 y la parte de publicar de HU-58, para palabras y caracteres                              |
| 4 · Primera sesión de estudio         | Ficha, «Estudiar hoy», la práctica de significado con FSRS (D-162), el orden componente → carácter → palabra, metas y sin conexión | HU-05, HU-06, HU-10, HU-11, HU-12, HU-73, HU-86                                                       |
| 5 · Sincronización y registro abierto | Sincronizar entre dispositivos y abrir el registro con Turnstile, SMTP propio, privacidad y RGPD (ADR-014, ADR-015)                | EP-10 (HU-64 a HU-67); resto de EP-01: HU-01, HU-02, HU-04, HU-07, HU-08, HU-09 y el CAPTCHA de HU-03 |
| 6 en adelante                         | Escritura y pronunciación, tonos, gramática y lecturas, inicio, estadísticas y recordatorios                                       | EP-03 a EP-08 y el resto de EP-02, EP-09 y EP-11; el orden entre ellas se decide al llegar            |

## Notas

- **HU-86** (app instalable y sin conexión) es de EP-12, pero va en el milestone 4, porque la primera sesión de estudio tiene que funcionar sin conexión (D-162).
- **HU-51** (entrar al panel como administrador) va en el milestone 2 con los roles; el rol Admin se asigna a mano en `user_role` (D-67, ADR-027).
- **HU-61** (registro de auditoría): los triggers llegan con las tablas de contenido (HU-83); la pantalla y «Deshacer», más tarde (D-164).
- Si una historia no cabe en su milestone o cambia de orden, se decide con una decisión nueva y se actualiza esta tabla en la misma PR.
