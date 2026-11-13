---
name: registrar-decision
description: Registra una decisión de Lexis cuando se decide algo (un hueco resuelto, una elección de la desarrolladora). Añade la fila arriba de la tabla de docs/decisiones.md con el siguiente ID y actualiza el recuento. Marca las decisiones que sustituye, en todo o en parte. Si es de arquitectura del producto, crea además un ADR en docs/adr/ con su fila en el índice. Fuera de una issue, abre una issue de documentación para registrarla.
---

# registrar-decision

Registra decisiones en `docs/decisiones.md` y, si son de arquitectura, en un ADR. Decisiones D-138 y D-149. Lo usan las demás skills cuando se resuelve un hueco, y también se usa sola cuando se decide algo hablando.

## Reglas

- **No se inventa nada.** La decisión y su motivo salen de lo que ha dicho la desarrolladora. Si no está claro qué se ha decidido o por qué, pregunta.
- **Nada sin su «sí».** Antes de escribir, enseña el borrador (paso 5).
- **Una decisión no se borra.** Si cambia, se escribe una nueva que la sustituye (paso 3).
- **Un ADR aceptado no se edita.** Solo cambia su línea de estado cuando otro lo sustituye.
- **Sin firmas y nada directo a `main`** (D-04): todo va en una rama con PR.

## 1. Situarse

- **Dentro de una issue** (estás en su rama): la decisión va en esa misma rama y en su PR.
- **Fuera de una issue** (en `main`, o la decisión no tiene que ver con la rama actual): no la mezcles con otro trabajo (D-149).
  1. Crea la issue con la skill `crear-issue`: plantilla `5-documentacion.yml`, título «Docs: registrar D-xx …», archivo `docs/decisiones.md`.
  2. Empiézala con `empezar-issue`; la rama será `docs/<n>-registrar-d-xx`.
  3. Al terminar, abre la PR con `preparar-pr`.

## 2. Redactar la fila

Lee la cabecera y las primeras filas de `docs/decisiones.md`:

| Columna | Qué va |
| --- | --- |
| **ID** | El más alto de la tabla + 1 (la tabla va de la más nueva a la más antigua: el primero es el más alto) |
| **Fecha** | Hoy, `AAAA-MM-DD` |
| **Decisión** | Lo decidido, en frases completas y sin ambigüedad. Si son varios puntos, numerados: (1) …; (2) … |
| **Motivo** | Quién decide y por qué, con la issue: «Decisión de la desarrolladora al planificar la issue #N. …» |
| **Estado** | `Aceptada` |

Dentro de una celda, evita `|` y saltos de línea, que rompen la tabla.

## 3. ¿Sustituye a otra?

Busca decisiones y ADR del mismo tema:

```sh
grep -n -i "<palabra clave>" docs/decisiones.md docs/adr/*.md
```

- **La sustituye entera:**
  - la antigua pasa a Estado `Sustituida por D-xx`;
  - si tenía ADR, en el ADR antiguo solo cambia la línea `- **Estado:** Sustituido por ADR-xxx`, y también su fila del índice `docs/adr/README.md`.
- **Cambia una parte:** la antigua sigue `Aceptada`. La nueva lo dice en su texto: «Sustituye en parte a D-xx», como D-140 con D-138.
- **Choca con otra aceptada sin que se haya dicho que la sustituye:** es un hueco. Pregunta con opciones: la sustituye entera, en parte, o no choca porque es otra cosa.

## 4. ¿Lleva ADR?

Aplica la definición de «Qué es una decisión de arquitectura» de `docs/arquitectura/arquitectura.md`: arquitectura es la arquitectura del producto.

- Si cambia cómo está construido Lexis, lleva ADR. Por ejemplo: tecnologías y servicios, modelo de datos, sincronización, patrones de varios módulos, seguridad, rendimiento, estructura del repositorio, pruebas o convenciones de código.
- Si trata de qué hace el producto, cómo se ve o cómo se trabaja, no lleva ADR.

Si dudas, propón una de las dos y pregúntalo con el borrador.

## 5. Enseñar el borrador

Muestra, junto:

- la fila;
- el ADR completo, si lo lleva;
- las marcas de sustitución;
- los recuentos que cambian.

Espera el «sí». Si cambia algo, rehaz el borrador.

## 6. Escribir

1. **La fila**, justo debajo de la línea `| --- | --- | --- | --- | --- |` de la tabla.
2. **El recuento** de la cabecera: total, aceptadas, descartadas, sustituidas si las hay, y la fecha de hoy.
3. **Las marcas de sustitución** del paso 3.
4. **Si lleva ADR:**
   - `docs/adr/00NN-titulo-en-kebab-sin-tildes.md`, con el siguiente número del índice. Copia la forma de los existentes: título `# ADR-0NN · Título`; Estado, Fecha y Registro (la D); Contexto, Decisión y Consecuencias (formato de Michael Nygard); y un enlace al detalle si lo hay.
   - Su fila en `docs/adr/README.md`, con el área: Frontend, Backend, Datos, Dominio, Despliegue, Servicios, Repositorio o Calidad.
   - El rango «ADR-001 a ADR-0NN» de `docs/README.md`.
   - `docs/arquitectura/arquitectura.md`, si cambia la visión general o la lista de decisiones más consultadas.
5. **Otros documentos** que la decisión cambie (requisitos, historias, convenciones…): en la misma rama, o anótalos como trabajo de la issue.

## 7. Commit

- Dentro de una issue: junto al resto de la documentación de la issue, o solo con `docs(decisiones): registrar D-xx`.
- Fuera: `docs(decisiones): registrar D-xx …` en la rama `docs/<n>-…`, y la PR con `preparar-pr`.
