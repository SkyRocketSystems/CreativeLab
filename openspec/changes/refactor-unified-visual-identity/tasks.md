# Tareas: `refactor-unified-visual-identity`

## 1. Capa de tokens (`design-tokens`)

- [x] 1.1 Ampliar `:root` en `global.css`: añadir `--terracota-texto`, tokens de movimiento (`--mov-100/150/300/400`, curvas decel/acel) y valores de material (cabecera, panel, scrim).
- [x] 1.2 Añadir capa de alias de migración para los nombres antiguos de la caja. *(No fue necesaria: la migración fue atómica, aplicando directamente los tokens canónicos; verificado sin remanentes en 7.3.)*
- [x] 1.3 Eliminar la capa de alias cuando la migración de la caja termine (verificado por grep).

## 2. Tipografía (`typography`)

- [x] 2.1 `Layout.astro`: enlace de fuentes → `Caveat 600 · Fraunces opsz 9..144 (400/500/600) · Playfair Display 600` (fuera Manrope).
- [x] 2.2 `global.css`: `--fuente-ui` → pila `system-ui`; añadir `--fuente-display: 'Fraunces'`.
- [x] 2.3 Reescribir `h1/h2/h3` globales con fuente display, `font-optical-sizing: auto` y pares tracking/leading de design.md D2; revisar `.etiqueta-seccion`.
- [x] 2.4 `CajaCreativelab.astro`: reemplazar literales `'Fraunces'`/`'DM Sans'` por `var(--fuente-display)`/`var(--fuente-ui)`.

## 3. Materiales (`materials`)

- [x] 3.1 `Header.astro`: `saturate(180%)` en el material; sustituir el hairline `0 1px 0` por borde-de-scroll (`::after` gradiente, `pointer-events: none`); re-tokenizar duraciones.
- [x] 3.2 `CajaCreativelab.astro`: cabecera opaca+borde → material translúcido compartido + borde-de-scroll.
- [x] 3.3 Menú móvil (`.menu-panel`) y barra sticky (`#barra-movil`) como materiales translúcidos re-tokenizados.
- [x] 3.4 Modal `#modal-vista`: entrada materializándose (keyframes opacidad+escala+blur) y salida simétrica (transición con curva acel).
- [x] 3.5 Fallbacks `prefers-reduced-transparency: reduce` (materiales sólidos) en `global.css`.

## 4. Movimiento (`motion`)

- [x] 4.1 Sustituir duraciones literales por tokens en `global.css`, `Header.astro`, `Configurator.astro`, `PromoCaja.astro`.
- [x] 4.2 Feedback `:active` (`scale(0.97)` + `--mov-100`) en todos los controles: `.icon-btn`, `.tab`, segmentos del configurador; y en la caja: `.btn`, `.plan`, `.toggle button`, `.box`, `#go`.
- [x] 4.3 `configurator.js`: `cerrarModal` espera `transitionend` (con tope de seguridad) antes de `hidden = true`.
- [x] 4.4 Política global `prefers-reduced-motion: reduce` en `global.css` (fundidos ≤ 150 ms, sin transforms en chrome/sheets/modal).
- [x] 4.5 Re-tokenizar la transición de la tapa de la caja manteniendo sus 800 ms (excepción documentada).

## 5. Migración de la caja (`site-shell`)

- [x] 5.1 `caja-creativelab.astro`: renderizar dentro de `Layout` con título y descripción propios; eliminar `<head>` manual y enlace de fuentes.
- [x] 5.2 `CajaCreativelab.astro`: eliminar el bloque `:root` de tokens, los bloques `prefers-color-scheme: dark` y `[data-theme]`, y las reglas `html{}` redundantes (scroll-padding/behavior).
- [x] 5.3 Aplicar el mapa de tokens de design.md D1 (incluye literales `#2A1B13`, `#3B2B22`, `#FAF6EE`, `#fff` → tokens) y retirar la regla `:focus-visible` propia a favor del anillo global.
- [x] 5.4 Verificar anillos de foco y primitivas compartidas en ambas páginas.

## 6. Barrido y documentación

- [x] 6.1 Sustituir hex/timings literales restantes en `Hero.astro`, `Resumen.astro`, `Footer.astro`, `index.astro` por tokens donde corresponda.
- [x] 6.2 `README.md`: actualizar la sección de configuración (paleta y tipografía) al sistema unificado.
- [x] 6.3 Marcar las tareas completadas en este archivo.

## 7. Verificación

- [x] 7.1 `openspec validate refactor-unified-visual-identity --strict` en verde.
- [x] 7.2 `npm run build` sin errores; `npm run preview` sirve `/` y `/caja-creativelab/`.
- [x] 7.3 Greps sin remanentes: `DM Sans`, `Manrope`, `--terra`, `prefers-color-scheme` en la caja, duraciones literales en chrome.
