# Carácter con pinyin

Cualquier texto en chino de la app: caracteres con su pinyin en ruby debajo de cada uno (D-85) y, si están activados, los colores de tono (D-54, D-104).

## Marcado

```html
<ruby class="lx-hz lx-hz--xl" lang="zh-Hans">
  <span class="t3">你</span><rt class="t3">nǐ</rt>
  <span class="t3">好</span><rt class="t3">hǎo</rt>
</ruby>
```

- Cada carácter va en un `<span class="tN">` seguido de su `<rt class="tN">`, donde N es el tono del 1 al 5 (5 = neutro).
- Tamaños: `lx-hz--hero` 96px (tarjeta), `--xl` 64px (ficha y escritura), `--lg` 32px (ejercicios) y `--read` 22px (lecturas).
- `lang="zh-Hans"` siempre, para que el lector de pantalla lo lea en chino.

## Ajustes del usuario (clases en un contenedor)

| Ajuste | Clase |
| --- | --- |
| Colores solo en el pinyin (por defecto) | ninguna |
| Colores en pinyin y caracteres | `lx-tones-all` |
| Sin colores | `lx-tones-off` |
| Fuente Hei o Song (Kai por defecto, D-106) | `lx-font-hei`, `lx-font-song` |
| Opacidad del pinyin | variable `--lx-pinyin-opacity` (de 0.1 a 1) |
| Pinyin oculto | quitar los `<rt>` del árbol, no solo ocultarlos |

- La marca del tono (ā á ǎ à) va siempre en el pinyin: el color nunca es la única pista.
- Si un carácter se lee distinto en esa palabra (D-84), su `<rt>` lleva además `lx-reading-change`, que lo subraya, y la ficha añade la nota «aquí se lee háng».
- Mientras se responde un ejercicio de tonos, se pinta sin color ni marca (D-94).
