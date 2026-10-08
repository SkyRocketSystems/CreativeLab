# Proposal: `refactor-apple-native-chrome`

## Why

La identidad unificada (`refactor-unified-visual-identity`) es consistente pero su chrome lee «landing web», no «aplicación Apple»: botones con halo de color, elevaciones al hover, pestañas píldora en lugar de controles segmentados, un interruptor propio y estados seleccionados en terracota sobre beige con contraste 2.77:1 (por debajo incluso del umbral 3:1 para texto negrita, SKILL.md lente de accesibilidad). Además, Safari no recibe los comportamientos de plataforma que harían que el sitio se sienta como una app nativa (instalación a pantalla de inicio, sin tap highlight, safe areas en horizontal, scroll sin rebote encadenado, hover no pegajoso).

## What Changes

1. **Lenguaje de controles Apple** conservando la marca (Fraunces, terracota, paleta cálida, solo modo claro):
   - Pestañas del configurador y grupos de segmentos pasan a **control segmentado** (fondo beige translúcido, segmento activo crema elevado con texto carbón — corrige el 2.77:1).
   - Interruptor de extras pasa a **UISwitch** (pista 50×30, apagado alfa carbón 0.16, encendido terracota, pulgar blanco).
   - Lista de extras pasa a **lista agrupada inset** (contenedor único, separadores hairline de 0.5px; se retira la segunda columna del container query).
   - **Botones sin halo de color ni elevación al hover** (estilo filled de iOS: cápsula, sin `box-shadow` de color, hover por oscurecimiento `color-mix`, presión con `scale` existente).
   - Selecciones sin «lift» (`translateY`) en muestras y opciones de producto.
2. **Integración con Safari**:
   - Metas de instalación estilo app: `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: default`, `apple-mobile-web-app-title`, `format-detection` (el manifest ya es `standalone`).
   - `-webkit-tap-highlight-color: transparent`, `-webkit-text-size-adjust: 100%`, `accent-color: var(--terracota)`.
   - Scrollbars tipo overlay (finas, pulgar alfa carbón 0.12, pista transparente).
   - `overscroll-behavior: contain` en superficies que hacen scroll (menú móvil, modal, panel).
   - Safe areas horizontales para la barra móvil en landscape (`max(16px, env(safe-area-inset-*))`).
   - `:hover` de controles protegido con `@media (hover: hover)` (sin hover pegajoso en iOS).
   - `user-select: none` en controles (el contenido sigue siendo seleccionable).
3. **Cabecera como toolbar**: enlaces con relleno píldora al hover (sin elevaciones), filas del menú móvil con separadores hairline.

## Capabilities

### New Capabilities
- `apple-controls`: lenguaje de controles nativo Apple (control segmentado, interruptor, lista agrupada, botones sin halo, selección sin elevación) sobre la marca CreativeLab existente.
- `safari-platform`: comportamientos de plataforma para Safari (instalación a pantalla de inicio, sin tap highlight, safe areas, scroll contenido, hover solo con puntero, scrollbars overlay).

### Modified Capabilities

(ninguna: la paleta, tipografía, materiales y tokens de movimiento de `refactor-unified-visual-identity` no cambian)

## Impact

- `src/styles/global.css` — tokens nuevos (`--segmento-fondo`, `--interruptor-off`), base Safari (`tap-highlight`, `text-size-adjust`, `accent-color`, scrollbars), botones sin halo, `user-select` en controles.
- `src/layouts/Layout.astro` — metas de instalación y `format-detection`.
- `src/components/Header.astro` — enlaces tipo toolbar, separadores en el menú móvil, guardas `(hover: hover)`.
- `src/components/Configurator.astro` — control segmentado, interruptor UISwitch, lista agrupada inset, sin lifts.
- `src/pages/index.astro` y `src/styles/global.css` — modal con `overscroll-behavior`, barra móvil con safe areas horizontales.
- `src/components/{Hero,Catalogo,Empresas,Ferias,Resumen,Footer,CajaCreativelab}.astro` — barrido: halos de color → sombras neutras, hovers bajo `(hover: hover)`, sin lifts.
- `README.md` — nota breve del lenguaje de controles Apple.

**Cambios de comportamiento visibles**: pestañas/segmentos/interruptores/lista de extras cambian de apariencia hacia controles nativos iOS/macOS; el sitio pasa a poder instalarse a pantalla de inicio en Safari iOS/OS como app independiente (fullscreen). La lista de extras pasa a una sola columna.

**Fuera de alcance**: paleta y tipografía de marca, mockups SVG, precios y lógica del configurador, modo oscuro (se mantiene la decisión «solo modo claro»), tokens de movimiento y materiales de `refactor-unified-visual-identity`.
