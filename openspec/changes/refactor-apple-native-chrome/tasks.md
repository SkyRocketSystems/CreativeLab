# Tareas: `refactor-apple-native-chrome`

## 1. Base global (`global.css`)

- [x] 1.1 Tokens nuevos: `--segmento-fondo`, `--interruptor-off`; `accent-color: var(--terracota)` en `:root`.
- [x] 1.2 Base Safari en `html`: `-webkit-tap-highlight-color: transparent`, `-webkit-text-size-adjust: 100%`.
- [x] 1.3 `user-select: none` (con prefijo webkit) en controles: `button`, `.btn`, `.tab`, `nav a`, `.icon-btn`.
- [x] 1.4 Scrollbars overlay: `::-webkit-scrollbar` 8px pulgar `--carbon-12` redondeado, pista transparente; `scrollbar-width: thin; scrollbar-color`.
- [x] 1.5 Botones: `.btn-primario` sin halo de color (hover por `color-mix` hacia carbón, bajo `@media (hover: hover)`); `.flecha-circulo` sin `translateY` al hover.
- [x] 1.6 Modal `.modal-caja` con `overscroll-behavior: contain`.
- [x] 1.7 `#barra-movil` con safe areas laterales: `left/right: max(16px, env(safe-area-inset-*))`.

## 2. Shell (`Layout.astro`)

- [x] 2.1 Metas de instalación: `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: default`, `apple-mobile-web-app-title: CreativeLab`, `format-detection: telephone=no`.

## 3. Cabecera (`Header.astro`)

- [x] 3.1 Nav links tipo toolbar: hover relleno `rgba(30,26,24,0.06)` radio 8 bajo `@media (hover: hover)`, activo carbón.
- [x] 3.2 Menú móvil: filas radio 10, separadores hairline 0.5px entre ítems; hover bajo `(hover: hover)`.

## 4. Configurador (`Configurator.astro`)

- [x] 4.1 `.panel-tabs` → control segmentado (contenedor `--segmento-fondo`, radio 12, padding 2; activo crema + `--sombra-tarjeta` + texto carbón, sin borde terracota).
- [x] 4.2 `.segmento-grupo` unificado al mismo lenguaje (activo texto carbón, contenedor `--segmento-fondo`).
- [x] 4.3 `.interruptor` → UISwitch 50×30, pulgar 26, off `--interruptor-off` sin borde, on terracota.
- [x] 4.4 `.extras-lista` → lista agrupada inset (contenedor `--beige-suave` radio 16, una columna, hairlines 0.5px alineados tras el interruptor); retirar el container query de 2 columnas.
- [x] 4.5 Sin lifts: `.muestra.is-selected` y `.opcion-producto.is-selected` sin `translateY` ni sombras de color; hovers bajo `(hover: hover)`.

## 5. Barrido de componentes

- [x] 5.1 `Hero.astro` (preset sin lift, preview-ampliar sin escala, mini-enlace), `Footer.astro` y `PromoCaja.astro` (hovers bajo `(hover: hover)`); `Catalogo/Empresas/Ferias/Resumen` sin hovers ni sombras de color (verificado por grep).
- [x] 5.2 `CajaCreativelab.astro`: verificado por grep — sombras neutras, sin hovers; la animación de la tapa es la excepción documentada del cambio anterior.

## 6. Documentación

- [x] 6.1 `README.md`: nota breve del lenguaje de controles Apple y la instalación a pantalla de inicio.

## 7. Verificación

- [x] 7.1 `openspec validate refactor-apple-native-chrome --strict` en verde.
- [x] 7.2 `npm run build` sin errores; `npm run preview` sirve ambas páginas (`/` y `/caja-creativelab/` → 200).
- [x] 7.3 Greps sin remanentes: sin `box-shadow` con terracota, sin `translateY(-` en `:hover`, 18 bloques `(hover: hover)`, metas de instalación y tokens nuevos presentes en `dist/`.
