## ADDED Requirements

### Requirement: Sistema tipográfico dual
El sitio SHALL usar dos voces tipográficas: una serif variable con eje de tamaño óptico (Fraunces) para titulares y cifras destacadas con `font-optical-sizing: auto`, y la pila `system-ui` para el texto de interfaz y cuerpo.

#### Scenario: Titulares con tamaño óptico
- **CUANDO** se renderiza un `h1`, `h2` o `h3` en cualquiera de las dos páginas
- **ENTONCES** usa la fuente display compartida (`--fuente-display`) con `font-optical-sizing: auto`

#### Scenario: Cuerpo en fuente del sistema
- **CUANDO** se renderiza texto de párrafo, de control o de etiqueta
- **ENTONCES** usa la pila declarada en `--fuente-ui` (`system-ui`), sin familias de marca retiradas (Manrope/DM Sans)

### Requirement: Tracking específico por tamaño
El letter-spacing SHALL variar con el tamaño: negativo en titulares grandes (≈ `-0.02em` en display), cercano a cero en cuerpo, y ligeramente positivo en microetiquetas en mayúsculas (≈ `+0.14em`). Ninguna familia aplica un tracking fijo único para todos los tamaños.

#### Scenario: Titulares apretados
- **CUANDO** se renderiza el nivel display
- **ENTONCES** su `letter-spacing` es negativo y su tamaño crece con el viewport

#### Scenario: Microetiquetas con aire
- **CUANDO** se renderiza una etiqueta de sección en versalitas
- **ENTONCES** su `letter-spacing` es positivo (≥ `+0.1em`)

### Requirement: Leading inverso al tamaño
El line-height SHALL ser más ajustado cuanto mayor es el texto (display ≈ `1.05`, secciones ≈ `1.15`, cuerpo ≈ `1.6`), y la jerarquía se construye con peso + tamaño + leading como conjunto.

#### Scenario: Jerarquía de titulares
- **CUANDO** se comparan `h1`, `h2` y `h3` de una misma página
- **ENTONCES** cada nivel reduce tamaño y leading de forma apareada

### Requirement: Tipografías de producto preservadas
El configurador SHALL seguir ofreciendo Caveat (manuscrita) y Playfair Display (clásica) como estilos de texto del producto en los mockups; estas familias pertenecen al contenido del producto y no al chrome del sitio.

#### Scenario: El mockup conserva sus fuentes
- **CUANDO** el usuario elige «Manuscrita» o «Clásica» en el configurador
- **ENTONCES** el texto del mockup se renderiza con Caveat o Playfair Display respectivamente, igual que antes del cambio

### Requirement: Carga única de fuentes
Ambas páginas SHALL cargar las fuentes web exclusivamente desde `src/layouts/Layout.astro`; ninguna página o componente añade su propio enlace de fuentes.

#### Scenario: La caja no carga fuentes propias
- **CUANDO** se solicita `/caja-creativelab`
- **ENTONCES** el HTML no contiene un `<link>` de Google Fonts propio y las familias se resuelven desde la carga del Layout
