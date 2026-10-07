## ADDED Requirements

### Requirement: Tokens de movimiento
Todas las transiciones del chrome y los controles SHALL usar los tokens de movimiento de `global.css` (`--mov-100`, `--mov-150`, `--mov-300`, `--mov-400` y las curvas `--curva-deceleracion` / `--curva-aceleracion`), que aproximan resortes críticamente amortiguados (amortiguación 1.0, respuesta 0.1–0.4 s). Las duraciones literales quedan reservadas a excepciones de carácter documentadas (p. ej. la tapa de la caja).

#### Scenario: Sin duraciones ad hoc en el chrome
- **CUANDO** se inspeccionan las transiciones de cabecera, menú, tabs, barra sticky y modal
- **ENTONCES** sus duraciones y curvas provienen de los tokens de movimiento

### Requirement: Feedback de presión inmediato
Todo control interactivo (botones, tabs, segmentos, planes, interruptores, la caja de muestra) SHALL mostrar feedback visual al presionar (`:active`, pointer-down) con una compresión breve (~`--mov-100`), no solo al soltar ni solo al hacer hover.

#### Scenario: Presión visible en la caja
- **CUANDO** el usuario presiona un plan, el toggle de duración o la caja de muestra en `/caja-creativelab`
- **ENTONCES** el control reacciona de inmediato con una compresión sutil antes del soltado

### Requirement: Simetría de entrada y salida
Los paneles y modales SHALL entrar y salir por el mismo camino con curvas espejo (deceleración al entrar, aceleración al salir), y ningún cierre SHALL ocultar la superficie antes de que su transición termine.

#### Scenario: El modal se despide
- **CUANDO** se cierra el modal de vista ampliada
- **ENTONCES** la animación de salida es visible en su totalidad antes de que el diálogo quede oculto

### Requirement: Rebote solo con momento
El rebote u overshoot SHALL limitarse a interacciones donde el gesto del usuario llevaba momento; las superficies de chrome y los controles estáticos usan asentamiento sin rebote (amortiguación crítica).

#### Scenario: Chrome sin rebote
- **CUANDO** se abre el menú móvil o se materializa una cabecera
- **ENTONCES** la superficie se asienta sin oscilar

### Requirement: Política de movimiento reducido
Con `prefers-reduced-motion: reduce`, el sistema SHALL reemplazar deslizamientos, escalas y resortes por fundidos breves de opacidad (≤ 150 ms) en ambas páginas, conservando los cambios de color y estado que ayudan a la comprensión.

#### Scenario: Menú sin deslizamiento
- **CUANDO** el usuario tiene movimiento reducido activo y abre el menú móvil
- **ENTONCES** el panel aparece con un fundido, sin transform de deslizamiento

### Requirement: Sin dependencias de animación
El lenguaje de movimiento SHALL implementarse solo con CSS (transiciones y keyframes) más APIs nativas del navegador para la orquestación; el cambio no añade librerías de animación a `package.json`.

#### Scenario: Dependencias sin cambios
- **CUANDO** se compara `package.json` antes y después del cambio
- **ENTONCES** la lista de dependencias es idéntica
