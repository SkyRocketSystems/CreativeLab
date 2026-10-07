## ADDED Requirements

### Requirement: Shell compartido por ambas páginas
Ambas páginas (`/` y `/caja-creativelab`) SHALL renderizarse dentro de `src/layouts/Layout.astro`, heredando metadatos, favicons, manifest, `theme-color`, `print.css`, defs SVG y la carga de fuentes.

#### Scenario: La caja hereda el shell
- **CUANDO** se solicita `/caja-creativelab`
- **ENTONCES** el HTML incluye el `<head>` del Layout (meta description, favicons, manifest, theme-color) y ya no declara su propio `<head>` con fuentes propias

### Requirement: Primitivas y foco unificados
Ambas páginas SHALL compartir las primitivas visuales del sistema (`.btn`, `.campo`, `.chip`, anillo de foco) y un único `:focus-visible` global (2px terracota, offset 2); ninguna página redefine su propio estilo de foco.

#### Scenario: Foco idéntico en ambas páginas
- **CUANDO** se navega con teclado `/` y `/caja-creativelab`
- **ENTONCES** todos los enfocables muestran el mismo anillo de foco global

### Requirement: Solo modo claro
El sitio SHALL publicarse en modo claro únicamente: sin bloques `prefers-color-scheme: dark` ni mecanismos de alternancia `data-theme` en ninguna página.

#### Scenario: La caja sin esquema oscuro
- **CUANDO** el sistema del usuario pide esquema oscuro y se visita `/caja-creativelab`
- **ENTONCES** la página se renderiza con la paleta clara compartida

### Requirement: Navegación propia de la caja con sistema compartido
La página de la caja conserva su navegación reducida y su composición de secciones, pero SHALL usar los tokens, materiales, tipografía y primitivas del sistema compartido en lugar de estilos de chrome propios divergentes.

#### Scenario: Mismo lenguaje, distinta composición
- **CUANDO** se comparan las cabeceras de ambas páginas
- **ENTONCES** comparten material translúcido, tokens y anillo de foco, aunque difieren en enlaces y composición
