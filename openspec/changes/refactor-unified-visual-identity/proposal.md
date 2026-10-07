# Cambio: `refactor-unified-visual-identity`

## Por qué

El prototipo publica dos páginas con identidades visuales divergentes:

| Aspecto | `/` (index.astro → Layout + global.css) | `/caja-creativelab` (autónoma) |
| --- | --- | --- |
| Tokens | `--crema/--beige/--taupe/--terracota/--salvia/--carbon` | `--bg/--sand/--clay/--terra/--olive/--rose/--ink/--mute/--line/--card` |
| Tipografía | Manrope (UI) + Caveat + Playfair Display | Fraunces + DM Sans (enlace propio) |
| Cabecera | Translúcida `blur(12px)` + hairline 1px | Opaca + borde 1px |
| Foco | Outline 2px terracota, offset 2 | Outline 3px, offset 3 |
| Modo oscuro | No | Sí (`prefers-color-scheme` + `data-theme`) |
| Movimiento | Duraciones dispersas 0.15–0.3 s; `:active` solo en `.btn` | Duraciones dispersas 0.25–1 s; `:active` en casi nada |

La misma familia cromática vive con dos nombres y valores distintos, y el modal de vista ampliada cambia de estado sin transición alguna. Eso rompe los principios de consistencia y acabado (SKILL.md §16.4 «Familiaridad», §16.7 «Acabado») y duplica el mantenimiento de cada decisión visual.

## Qué cambia

1. **Un solo sistema de diseño** en `src/styles/global.css` + `src/layouts/Layout.astro`, consumido por ambas páginas.
2. **Tipografía re-ajustada** (SKILL.md §15): Fraunces con eje de tamaño óptico para titulares (`font-optical-sizing: auto`), pila `system-ui` para texto de interfaz, tracking específico por tamaño y leading inverso al tamaño. Caveat y Playfair Display se conservan como tipografías de *producto* del configurador (texto bordado/impreso en los mockups), no como chrome del sitio.
3. **Materiales translúcidos** (SKILL.md §12): cabeceras, menú móvil, barra sticky y modal como capas flotantes con `backdrop-filter`; efectos de borde-de-scroll en lugar de divisores duros; peso del material según jerarquía; fallbacks para `prefers-reduced-transparency`.
4. **Lenguaje de movimiento unificado** (SKILL.md §1, §3, §4, §14): tokens de duración/curva que aproximan resortes críticamente amortiguados, feedback de presión al pointer-down en todo control, entrada/salida simétricas y política global de `prefers-reduced-motion`.
5. **Shell compartido**: `caja-creativelab.astro` adopta `Layout.astro` (metadatos, favicons, manifest, `theme-color`, `print.css`, fuentes) y pierde su bloque `:root`, su enlace de fuentes propio y su modo oscuro.
6. La **paleta cálida estricta se conserva** (crema, beige, taupe, terracota, salvia, carbón) y **no se añaden dependencias npm**.

## Impacto

- `src/styles/global.css` — capa de tokens ampliada (tipografía, movimiento, material), escala tipográfica global, políticas de accesibilidad (movimiento y transparencia reducidos).
- `src/layouts/Layout.astro` — enlace de fuentes unificado (fuera Manrope y DM Sans; entra Fraunces).
- `src/pages/caja-creativelab.astro` — adopta `Layout`.
- `src/components/CajaCreativelab.astro` — migración de tokens, retiro de modo oscuro, materiales translúcidos, movimiento re-tokenizado.
- `src/components/{Header,Hero,Configurator,PromoCaja,Resumen,Footer}.astro` y `src/pages/index.astro` — barrido de literales hacia tokens.
- `src/scripts/configurator.js` — el cierre del modal espera el fin de la transición (simetría entrada/salida).
- `README.md` — documentación del sistema unificado.

**Cambios de comportamiento visibles**: `/caja-creativelab` deja de responder a `prefers-color-scheme: dark` (decisión explícita: solo modo claro); su texto de interfaz pasa de DM Sans a la fuente del sistema; los titulares de la portada pasan de Manrope 800 a Fraunces.

**Fuera de alcance**: contenido e IA de las páginas, precios y lógica del configurador, mockups SVG paramétricos, iconografía, despliegue en Hostinger.
