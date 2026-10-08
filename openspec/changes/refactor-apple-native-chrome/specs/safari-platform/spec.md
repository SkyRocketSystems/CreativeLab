## ADDED Requirements

### Requirement: Instalable a pantalla de inicio

`Layout.astro` SHALL declarar los metas de instalación de Safari: `apple-mobile-web-app-capable: yes`, `mobile-web-app-capable: yes`, `apple-mobile-web-app-status-bar-style: default`, `apple-mobile-web-app-title: CreativeLab` y `format-detection: telephone=no`. Junto al manifest existente (`display: standalone`), al añadir el sitio a la pantalla de inicio este SHALL abrirse a pantalla completa como aplicación independiente, con la barra de estado por defecto.

#### Scenario: Añadir a pantalla de inicio

- **CUANDO** el usuario añade el sitio a la pantalla de inicio en iOS Safari y lo abre
- **ENTONCES** se ejecuta standalone, sin chrome del navegador, con título «CreativeLab»

#### Scenario: Teléfonos no detectados

- **CUANDO** la página contiene texto con dígitos
- **ENTONCES** Safari no lo convierte en enlace telefónico

### Requirement: Sin tap highlight

El documento SHALL declarar `-webkit-tap-highlight-color: transparent` de forma que ningún control muestre el rectángulo gris de tap por defecto de iOS; el feedback táctivo lo dan los estados `:active` existentes.

#### Scenario: Toque sobre un botón en iOS

- **CUANDO** se toca un botón o control
- **ENTONCES** no aparece el highlight gris del sistema; solo la animación de presión existente

### Requirement: Safe areas en horizontal

Los elementos fijos que flotan cerca de los bordes (barra móvil `#barra-movil`) SHALL respetar los insets laterales del notch/Dynamic Island en landscape usando `max()` con `env(safe-area-inset-left/right)`.

#### Scenario: Barra móvil en landscape con notch

- **CUANDO** el iPhone está en horizontal
- **ENTONCES** la barra móvil no queda oculta tras el notch ni toca el borde redondeado

### Requirement: Scroll sin rebote encadenado

Las superficies que hacen scroll dentro de capas flotantes — menú móvil (`.menu-panel`), modal (`.modal-caja`) y paneles con scroll interno — SHALL declarar `overscroll-behavior: contain` para que el rebote de Safari no arrastre la página de atrás.

#### Scenario: Rebote al final del modal

- **CUANDO** el contenido del modal llega a su tope superior o inferior
- **ENTONCES** el rebote no desplaza la página subyacente

### Requirement: Hover solo con puntero real

Los estados `:hover` de controles (botones, pestañas, segmentos, muestras, enlaces de navegación, botones de icono) SHALL estar protegidos con `@media (hover: hover)` para evitar el hover pegajoso en iOS Safari.

#### Scenario: Toque en iOS sin hover pegajoso

- **CUANDO** se toca una pestaña o enlace en iOS
- **ENTONCES** el estado de hover no queda aplicado tras el toque

### Requirement: Scrollbars tipo overlay

El documento SHALL usar scrollbars finas tipo overlay: `::-webkit-scrollbar` de 8px con pulgar redondeado en alfa de carbón 0.12 y pista transparente, y equivalentes estándar (`scrollbar-width: thin`, `scrollbar-color`).

#### Scenario: Scroll en desktop Safari

- **CUANDO** una zona hace scroll en macOS Safari
- **ENTONCES** la scrollbar es fina, redondeada y discreta sobre la crema

### Requirement: Controles no seleccionables y accent-color

Los controles (botones, pestañas, segmentos, navegación) SHALL declarar `user-select: none`; el contenido textual del sitio permanece seleccionable. Los inputs nativos reciben `accent-color: var(--terracota)`.

#### Scenario: Selección de texto

- **CUANDO** el usuario arrastra sobre un párrafo de contenido
- **ENTONCES** el texto se selecciona; los botones no

#### Scenario: Checkbox nativo

- **CUANDO** se renderiza un input nativo con acento (p. ej. checkbox)
- **ENTONCES** su acento es terracota
