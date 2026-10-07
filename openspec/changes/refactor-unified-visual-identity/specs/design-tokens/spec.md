## ADDED Requirements

### Requirement: Fuente única de tokens
El sistema SHALL definir la totalidad de los tokens visuales compartidos (color, elevación, radios, tipografía, material y movimiento) en el bloque `:root` de `src/styles/global.css`. Ninguna página o componente SHALL declarar su propio bloque `:root` con tokens visuales.

#### Scenario: La página de la caja consume los tokens globales
- **CUANDO** se renderiza `/caja-creativelab`
- **ENTONCES** sus colores, sombras, radios y tipografías se resuelven desde las variables de `global.css`
- **Y** `CajaCreativelab.astro` ya no declara un bloque `:root` propio con tokens (`--bg`, `--terra`, `--olive`, …)

### Requirement: Paleta estricta
El sistema SHALL limitar sus colores de marca a la paleta de seis tonos — crema `#faf8f3`, beige `#e6dec9`, taupe `#ad8470`, terracota `#c86b45`, salvia `#b8d3ae` y carbón `#1e1a18` — más los tonos derivados documentados (beige suave, beige línea, alphas de carbón y `--terracota-texto` para texto sobre fondos claros).

#### Scenario: Sin colores de marca huérfanos
- **CUANDO** se inspeccionan las hojas de estilo de ambas páginas tras la migración
- **ENTONCES** no quedan literales de la identidad antigua de la caja (`#F4EFE3`, `#A4502D`, `#FAF7EF`, `#EFE9D9`, `#3B2B22`, `#2A1B13`, `#FAF6EE`) fuera de los tokens

### Requirement: Alias de migración temporales
Durante la migración, el sistema MAY declarar alias en `global.css` que traduzcan los nombres antiguos de la caja (`--terra`, `--olive`, `--clay`, `--sand`, `--bg`, `--rose`, `--ink`, `--mute`, `--line`, `--card`, `--btn`, `--btnink`, `--terra-text`) a los tokens canónicos; al completar el cambio, los alias SHALL estar eliminados.

#### Scenario: Fin de la migración sin alias
- **CUANDO** el cambio está completo
- **ENTONCES** `global.css` y los componentes no contienen definiciones de los nombres antiguos de la caja

### Requirement: Tokens de texto accesibles
El sistema SHALL incluir un token derivado `--terracota-texto` (terracota oscurecida) para usar terracota como color de texto sobre fondos claros, manteniendo el contraste de lectura.

#### Scenario: Texto terracota sobre crema
- **CUANDO** un texto destacado usa la voz terracota sobre fondo crema o beige claro
- **ENTONCES** el color aplicado es `--terracota-texto` y no `--terracota` sin ajustar
