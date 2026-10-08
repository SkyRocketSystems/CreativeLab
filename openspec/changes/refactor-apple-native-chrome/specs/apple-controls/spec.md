## ADDED Requirements

### Requirement: Control segmentado nativo

Las pestañas del configurador (`.panel-tabs .tab`) y los grupos de segmentos (`.segmento-grupo`) SHALL renderizar como un control segmentado estilo Apple, con el segmento activo legible sin depender del color de acento.

#### Scenario: Contenedor segmentado

- **CUANDO** se renderiza la barra de pestañas o un grupo de segmentos
- **ENTONCES** el contenedor usa fondo `--segmento-fondo` (beige translúcido), radio continuo y relleno interior de 2px

#### Scenario: Contraste del segmento activo

- **CUANDO** una pestaña o segmento está seleccionado
- **ENTONCES** usa fondo `--crema` elevado con texto `--carbon` (≥ 3:1), no terracota sobre beige (2.77:1)

#### Scenario: Selección sin borde de acento

- **CUANDO** una pestaña está activa
- **ENTONCES** no lleva borde terracota ni halo de color; la elevación la da una sombra neutra

### Requirement: Interruptor estilo UISwitch

El interruptor de extras (`.interruptor`) SHALL medir 50×30px con pulgar blanco de 26px: apagado con fondo `--interruptor-off` (alfa de carbón 0.16, sin borde), encendido con fondo `--terracota`. La transición del pulgar usa los tokens de movimiento existentes. La fila completa sigue siendo el objetivo táctil (mín. 44px de alto) y el anillo de foco global sigue visible al navegar por teclado.

#### Scenario: Estado apagado

- **CUANDO** el extra no está seleccionado
- **ENTONCES** la pista es alfa de carbón 0.16 sin borde y el pulgar descansa a la izquierda

#### Scenario: Estado encendido

- **CUANDO** el extra está seleccionado
- **ENTONCES** la pista es terracota y el pulgar viaja al extremo derecho con la curva de desaceleración

### Requirement: Botones sin halo de color

Los botones (`--btn-primario` y variantes) SHALL proyectar solo sombras neutras o ninguna; los halos de color tipo `box-shadow: 0 10px 24px rgba(200,107,69,0.28)` quedan eliminados. El hover de botones llenos SHALL resolverse por oscurecimiento (`color-mix` hacia carbón) y NO por crecimiento de sombra. Ningún control SHALL elevarse (`translateY`) al hover.

#### Scenario: Sin sombras de color en botones

- **CUANDO** se inspeccionan las hojas de estilo tras el cambio
- **ENTONCES** no existen `box-shadow` con componentes de color de marca (terracota) salvo sombras neutras basadas en carbón

#### Scenario: Hover sin elevación

- **CUANDO** un puntero pasa sobre un botón, flecha circular o muestra de color
- **ENTONCES** el feedback es cambio de fondo/color, sin `translateY`

### Requirement: Lista agrupada inset

La lista de extras (`.extras-lista`) SHALL renderizar como lista agrupada estilo iOS: un único contenedor con fondo `--beige-suave`, radio 16px y filas separadas por hairlines de 0.5px (alfa carbón 0.12) alineados tras la columna del interruptor. La segunda columna del container query (≥ 560px cqw) se retira: la lista es de una columna a todos los anchos.

#### Scenario: Filas con separador hairline

- **CUANDO** la lista muestra dos o más extras
- **ENTONCES** entre filas existe un separador de 0.5px que no cruza la zona del interruptor

#### Scenario: Una sola columna

- **CUANDO** el panel del configurador mide ≥ 560px de ancho
- **ENTONCES** la lista de extras sigue en una sola columna

### Requirement: Selección sin lift

Los estados de selección de muestras de color (`.muestra.is-selected`) y opciones de producto (`.opcion-producto.is-selected`) SHALL marcar la selección con anillo/borde terracota y sombra neutra, sin desplazamientos verticales.

#### Scenario: Muestra seleccionada

- **CUANDO** se selecciona una muestra de color
- **ENTONCES** el chip muestra anillo terracota y permanece en su posición vertical
