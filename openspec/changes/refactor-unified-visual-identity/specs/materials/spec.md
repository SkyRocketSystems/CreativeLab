## ADDED Requirements

### Requirement: Chrome flotante translúcido
Las cabeceras fijas/sticky, el menú móvil, la barra sticky inferior y el panel del configurador SHALL presentarse como materiales translúcidos (fondo semitransparente + `backdrop-filter` con desenfoque y saturación) que dejan ver el contenido desplazarse debajo, con peso creciente según la jerarquía de la superficie.

#### Scenario: Cabecera de la caja translúcida
- **CUANDO** se desplaza `/caja-creativelab`
- **ENTONCES** su cabecera sticky es un material translúcido (desenfoque ≥ 12px con saturación) y ya no un fondo opaco con borde de 1px

#### Scenario: Contenido bajo el chrome
- **CUANDO** el contenido pasa por debajo de una cabecera o barra materializada
- **ENTONCES** se percibe difuminado a través del material, no cortado por una banda opaca

### Requirement: Efectos de borde-de-scroll en vez de divisores duros
Bajo el chrome flotante, el sistema SHALL separar mediante un fundido de gradiente corto (borde-de-scroll) en lugar de líneas de 1px.

#### Scenario: Portada sin hairline
- **CUANDO** la cabecera de `/` se materializa al hacer scroll
- **ENTONCES** no proyecta una sombra de línea dura de 1px; la separación la da un fundido de gradiente con `pointer-events: none`

### Requirement: Sin apilar translúcidos claros
El sistema SHALL evitar montar una superficie translúcida clara sobre otra translúcida clara, para no colapsar la legibilidad.

#### Scenario: Panel sobre fondo sólido
- **CUANDO** un panel translúcido claro (configurador, menú) está visible
- **ENTONCES** descansa sobre el fondo de página o sobre un scrim, nunca sobre otro material translúcido claro

### Requirement: Materialización del modal
El modal de vista ampliada SHALL entrar y salir por la misma trayectoria visual — opacidad + escala reducida + desenfoque decreciente — con scrim atenuante, de modo que el panel lea como un material que llega y se retira, no como un cambio de visibilidad.

#### Scenario: Entrada y salida simétricas
- **CUANDO** se abre y luego se cierra el modal
- **ENTONCES** la salida recorre el camino inverso de la entrada con curva espejo, y el cierre espera el fin de la transición antes de ocultar el diálogo

### Requirement: Fallback de transparencia reducida
Con `prefers-reduced-transparency: reduce`, los materiales translúcidos SHALL volverse sólidos (opacidad alta o total, sin `backdrop-filter`) manteniendo el contraste del texto.

#### Scenario: Chrome sólido a demanda del usuario
- **CUANDO** el usuario activa transparencia reducida en su sistema
- **ENTONCES** cabeceras, menú, barra y panel del configurador se renderizan sólidos y legibles
