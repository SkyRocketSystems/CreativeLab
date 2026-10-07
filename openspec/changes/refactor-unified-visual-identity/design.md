# Diseño: `refactor-unified-visual-identity`

## Contexto

Astro 5 sin dependencias de runtime (vanilla JS). Dos páginas: `/` compuesta desde `Layout.astro` + `global.css`, y `/caja-creativelab` renderizada por `CajaCreativelab.astro`, un componente autónomo con `<style is:global>` que declara sus propios `:root`, sus fuentes (Fraunces + DM Sans), modo oscuro y chrome. La guía de estilo es `SKILL.md` (diseño Apple traducido a la web).

## Objetivos

1. Una sola fuente de verdad visual para ambas páginas.
2. Tipografía, materiales y movimiento alineados con SKILL.md §12, §15, §1/§3/§4/§14.
3. Migración incremental verificable: el site debe compilar y verse correcto tras cada tarea.

## No objetivos

- No añadir gestos de arrastre ni librerías de resortes JS (hoy no hay drag): el movimiento se resuelve con CSS puro; si más adelante hay gestos, se introduce una librería de resortes (Motion) como cambio aparte.
- No rediseñar contenido, IA ni precios.
- No modo oscuro (decisión del producto).
- No tocar los mockups SVG paramétricos ni sus texturas.

## Decisiones

### D1 — Tokens únicos con mapa de migración

Todo token vive en `:root` de `global.css`. Mapa de equivalencias caja → global (los Δ de color son ≤ 3 %):

| Caja (actual) | Global (canónico) | Nota |
| --- | --- | --- |
| `--bg #F4EFE3` | `--crema #faf8f3` | fondo |
| `--sand #e6dec9` | `--beige` | idéntico |
| `--clay #ad8470` | `--taupe` | idéntico |
| `--terra #c86b45` | `--terracota` | idéntico |
| `--terra-text #A4502D` | `--terracota-texto` (nuevo) | texto terracota legible sobre crema |
| `--olive #b8d3ae` | `--salvia` | idéntico |
| `--rose #EFE9D9` | `--beige-suave` | Δ mínimo |
| `--ink #3B2B22`, `--btn` | `--carbon` | tinta y botón oscuro |
| `--btnink` | `--crema` | texto sobre oscuro |
| `--mute #7A6656` | `--carbon-60` | texto secundario |
| `--line #d6cbb2` | `--beige-linea` | Δ mínimo |
| `--card #FAF7EF` | `--crema` | Δ mínimo |
| literales `#2A1B13`, `#3B2B22` | `--carbon` | texto sobre bandas de color |
| literales `#FAF6EE`, `#fff` | `--crema` | texto claro |

Durante la migración, `global.css` puede declarar alias temporales (`--terra: var(--terracota)`…); se eliminan al cerrar el cambio.

### D2 — Tipografía (SKILL.md §15)

| Rol | Hoy portada | Hoy caja | Unificado |
| --- | --- | --- | --- |
| Display / titulares | Manrope 800 (implícito) | Fraunces 500 | **Fraunces** (`opsz 9..144`, 400/500/600) con `font-optical-sizing: auto` |
| UI / cuerpo | Manrope | DM Sans | **`system-ui`** (fuente del sistema; ya viene con tablas de tracking y legibilidad) |
| Producto (configurador) | Caveat, Playfair | — | **se conservan intactas** (son contenido, no chrome) |

Escala con tracking y leading apareados (regla inversa):

| Nivel | Tamaño | Fuente/peso | Tracking | Leading |
| --- | --- | --- | --- | --- |
| Display `h1` | 40 → 56 px (1080+) | Fraunces 600 | `-0.02em` | `1.05` |
| `h2` | 30 → 40 px | Fraunces 600 | `-0.015em` | `1.15` |
| `h3` | 22 px | Fraunces 600 | `-0.01em` | `1.2` |
| Cuerpo | 16 px | sistema 400 | `0` | `1.6` |
| Microetiqueta | 12 px | sistema 700 | `+0.14em` | `1.3` |

El espaciado de layout relevante se expresa en `rem`/`em` para que la escala de texto del usuario no rompa la composición. Las fuentes se cargan una sola vez desde `Layout.astro` (fuera Manrope y DM Sans).

### D3 — Materiales (SKILL.md §12)

- **Cabecera (ambas páginas)**: `rgba(250,248,243,.72)` + `backdrop-filter: blur(12px) saturate(180%)`; la caja sustituye su fondo opaco y su borde 1px.
- **Borde-de-scroll**: bajo chrome flotante, fundido de gradiente (~16 px, `rgba(30,26,24,.07) → transparente`, `pointer-events: none`) en lugar de hairlines; la portada retira su `box-shadow: 0 1px 0`.
- **Menú móvil / barra sticky inferior / panel del configurador**: materiales translúcidos ya existentes, re-tokenizados; la barra móvil pasa de `rgba(30,26,24,.96)` a `.8` + blur (material oscuro, jerarquía estructural).
- **Jerarquía por peso**: nunca apilar dos translúcidos claros; el modal usa scrim atenuante + panel materializándose.
- **`prefers-reduced-transparency: reduce`**: materiales sólidos (opacidad 1, sin blur).

### D4 — Movimiento (SKILL.md §1, §3, §4, §14)

Tokens que aproximan resortes críticamente amortiguados (amortiguación 1.0, respuesta 0.1–0.4 s):

```css
--mov-100: 100ms;  /* respuesta táctil al pointer-down */
--mov-150: 150ms;  /* micro-feedback (hover, color, borde) */
--mov-300: 300ms;  /* respuesta 0.3: chrome, sheets, modal */
--mov-400: 400ms;  /* respuesta 0.4: reposición de superficies */
--curva-deceleracion: cubic-bezier(0.32, 0.72, 0, 1);  /* entradas */
--curva-aceleracion: cubic-bezier(0.68, 0.28, 1, 1);   /* salidas (espejo) */
```

Aplicación: `:active` en todo control con `scale(0.97)` y `--mov-100`; hover/cambios de color con `--mov-150`; menú móvil, barra sticky, tabs y modal con `--mov-300` (entrada decel / salida acel); la **tapa de la caja** conserva sus 800 ms `cubic-bezier(.25,.8,.3,1)` como carácter de «delicia» documentado (excepción única). El **modal** entra materializándose (keyframes: opacidad + escala 0.98→1 + blur 8→0) y su cierre en JS espera `transitionend` antes de `hidden = true` para que la salida sea visible y simétrica. Política global `prefers-reduced-motion: reduce`: fundidos de opacidad ≤ 150 ms, sin transforms.

### D5 — Shell del sitio

`caja-creativelab.astro` renderiza dentro de `Layout.astro` (título + descripción propios). `CajaCreativelab.astro` conserva su navegación simple y su composición, pero pierde `:root`, `prefers-color-scheme`/`data-theme`, su `html{}` redundante y su carga de fuentes; usa las primitivas compartidas y el anillo de foco global (`:focus-visible` 2px terracota, offset 2). `theme-color` y `404.astro` heredan el sistema automáticamente.

## Riesgos y contrapartidas

- **Pérdida de modo oscuro en la caja**: decisión del producto (solo modo claro); registrada aquí y en la propuesta.
- **Manrope → sistema / DM Sans → sistema**: cambia el cuerpo de texto; mitigado porque la pila del sistema ya era el fallback de ambas familias.
- **Fraunces en titulares de la portada**: cambio visible de identidad buscado (voz de marca en display); Caveat/Playfair siguen idénticas como producto.
- **Transiciones del modal con `display`**: se resuelven con keyframes de entrada + espera de `transitionend` en la salida; sin cambios de arquitectura.
