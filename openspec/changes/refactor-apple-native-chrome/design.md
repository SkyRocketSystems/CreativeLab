# Diseño: `refactor-apple-native-chrome`

## Contexto

Astro 5 sin dependencias de runtime. La identidad unificada previa (`refactor-unified-visual-identity`) dejó: paleta cálida estricta, Fraunces + system-ui, materiales translúcidos con fallbacks, tokens de movimiento tipo resorte, solo modo claro. La guía de estilo es `SKILL.md` (diseño Apple traducido a la web; sus `references/hig/*.md` no están en este repo, se citan sus lentes).

## Objetivos

1. Que el chrome (barras, botones, controles) lea «aplicación Apple» en Safari manteniendo la marca (SKILL.md branding: la identidad vive en color y tipografía; los controles siguen el lenguaje de la plataforma).
2. Corregir el fallo de contraste del texto del tab activo (terracota 13px/600 sobre `#E6DEC9` = 2.77:1).
3. Safari se comporta como anfitrión nativo: instalable, sin tap highlight, safe areas, scroll contenido, hover no pegajoso.

## No objetivos

- No cambiar paleta, tipografía de marca, materiales ni tokens de movimiento.
- No modo oscuro (decisión vigente «solo modo claro»).
- No tocar mockups SVG, precios ni lógica del configurador.
- No añadir dependencias npm ni JS nuevo (todo se resuelve en CSS y metas).

## Decisiones

### D1 — Control segmentado (tabs y segmentos)

Contenedor `--segmento-fondo: rgba(230,222,201,0.45)`, radio 12px, `padding: 2px`; el tab activo: fondo `--crema`, texto `--carbon`, `box-shadow: var(--sombra-tarjeta)`, sin borde de acento (UISegmentedControl: el texto activo usa el color de etiqueta, no el tinte). Inactivos: `rgba(30,26,24,0.6)`. Los tabs conservan el scroll horizontal en móvil (el contenedor segmentado hace scroll). `.segmento-grupo` adopta el mismo lenguaje: fondo del grupo `--segmento-fondo`, activo crema + sombra neutra + texto carbón (hoy ya era crema+terracota: se unifica el texto a carbón).

### D2 — Interruptor UISwitch

`.interruptor` 50×30 (pulgar 26, margen 2): apagado `--interruptor-off: rgba(30,26,24,0.16)` sin borde; encendido `--terracota`; pulgar blanco con sombra neutra `0 3px 8px rgba(30,26,24,0.15), 0 1px 1px rgba(30,26,24,0.16)`; transición `transform var(--mov-150) var(--curva-deceleracion)`. La fila `.extra` completa (≥44px) sigue siendo el target; el foco sigue en el anillo global sobre el input.

### D3 — Botones estilo Apple

- `.btn-primario`: sin `box-shadow` de color (el halo terracota es el «tell» de landing web); hover por oscurecimiento `color-mix(in srgb, var(--terracota) 88%, var(--carbon))` y ya no por sombra creciente. Contraste del rótulo se mantiene: crema sobre terracota = 3.50:1, ≥ 3:1 para etiquetas seminegritas (umbral HIG para negrita, SKILL.md lente 1).
- `.flecha-circulo`: fuera el `translateY(-1px)` al hover; solo cambio de fondo.
- `.muestra.is-selected .muestra-chip` y `.opcion-producto.is-selected`: fuera los `translateY(-2px)` y sombras terracota; anillo/borde terracota + `var(--sombra-tarjeta)`.

### D4 — Lista agrupada inset (extras)

`.extras-lista` pasa de grid de tarjetas a una sola columna dentro de un contenedor `--beige-suave`, radio 16, filas transparentes separadas por hairline 0.5px `rgba(30,26,24,0.12)` alineado tras el interruptor (`left: 74px` aprox. o `::before` inset). Se retira el container query de 2 columnas (las listas agrupadas de iOS son de una columna). El hover de fila pasa de borde a relleno sutil `rgba(30,26,24,0.03)`.

### D5 — Safari como anfitrión

- Metas en `Layout.astro`: `apple-mobile-web-app-capable`/`mobile-web-app-capable` `yes`, `apple-mobile-web-app-status-bar-style: default` (respeta la barra clara), `apple-mobile-web-app-title: CreativeLab`, `format-detection: telephone=no`. El manifest ya es standalone; no se duplica estado (sin `apple-touch-startup-image`: fuera de alcance).
- `global.css`: `html { -webkit-tap-highlight-color: transparent; -webkit-text-size-adjust: 100%; }`; `:root { accent-color: var(--terracota); }`; scrollbars overlay (8px, pulgar `--carbon-12`, pista transparente + `scrollbar-width: thin; scrollbar-color`); `button, .tab, nav, .icon-btn, .btn { user-select: none; -webkit-user-select: none; }`.
- Guardas `@media (hover: hover)` para todo `:hover` de controles en `global.css`, `Header`, `Configurator` y barrido.
- `#barra-movil`: `left/right: max(16px, env(safe-area-inset-left/right))`.
- `.menu-panel`, `.modal-caja`: `overscroll-behavior: contain`.

### D6 — Cabecera como toolbar

Nav links 13.5px/600 carbón-60 → hover relleno `rgba(30,26,24,0.06)` radio 8, activo carbón (sin subrayados ni elevaciones). Menú móvil: filas radio 10 con separadores hairline 0.5px entre ítems (inset desde el borde). El material translúcido y el borde-de-scroll existentes se conservan.

## Riesgos y contrapartidas

- **Lista de extras a una columna**: más alto del panel en desktop; aceptado por fidelidad al patrón iOS (registrado como cambio visible).
- **Perder el halo terracota**: el CTA principal gana sobriedad y pierde «pop» de landing; es el objetivo (craft: el atrevimiento se gasta en la marca, no en la sombra).
- **`color-mix`**: soportado en Safari 16.2+ (2023); fallback simple: si no se soporta, el hover no oscurece pero nada se rompe (la regla base queda en terracota).
- **`::-webkit-scrollbar`**: solo WebKit/Blink; los equivalentes estándar cubren Firefox.
