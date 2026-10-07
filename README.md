# CreativeLab

Landing page única con configurador visual en tiempo real para tote bags, organizadores y productos decorativos. Construida con [Astro](https://astro.build).

## ✨ Qué incluye

- Hero en **Bento Grid de 12 columnas** (una sola página, navegación por anclas).
- **Configurador "Crea el tuyo"**: producto, color, material, frase (25 chars), tipografía, ubicación y extras.
- **Mockups SVG paramétricos** que reaccionan en tiempo real (color, textura, texto, bolsillo, etiqueta).
- Precio estimado en COP recalculado al instante + progreso "X de 5 detalles".
- Pedido por **WhatsApp** con mensaje prellenado, guardar diseño en `localStorage`, diseños recientes (presets).
- Secciones: cómo funciona, catálogo, impacto, empresas (cotización) y ferias.
- Mobile first: barra sticky inferior, menú lateral, tabs con scroll horizontal.

## 🧞 Comandos

| Comando           | Acción                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Instala las dependencias                     |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`   |
| `npm run build`   | Build de producción en `./dist/`             |
| `npm run preview` | Previsualiza el build de producción          |

## ⚙️ Configuración

- **Número de WhatsApp**: define `WHATSAPP_NUMBER` al inicio de `src/scripts/configurator.js`
  (formato internacional sin `+`, ej. `573001234567`). Mientras esté vacío, el botón opera en
  modo demo: copia el mensaje al portapapeles y muestra un toast.
- **Precios y presets**: constantes `PRECIOS` y `PRESETS` en el mismo archivo.
- **Sistema de diseño unificado**: variables en `src/styles/global.css`, compartidas por ambas
  páginas (`/` y `/caja-creativelab`). Paleta estricta (crema, beige, taupe, terracota, salvia,
  carbón), tipografía Fraunces (display, con tamaño óptico) + pila del sistema (UI), Caveat y
  Playfair Display como tipografías de producto del configurador, materiales translúcidos y
  tokens de movimiento (`--mov-*`, curvas decel/acel). Ver
  `openspec/changes/refactor-unified-visual-identity/` para las decisiones de diseño.

## 🚀 Despliegue en Hostinger

El sitio es 100 % estático: se publica el **contenido de `dist/`** en la carpeta `public_html` del dominio (raíz del dominio, sin subruta).

1. Compila localmente: `npm install && npm run build`.
2. En hPanel → **Archivos → Administrador de archivos**, entra a `public_html` del dominio elegido.
3. Sube el **contenido** de `dist/` (no la carpeta en sí): `index.html`, `404.html`, `_astro/`, favicons, `site.webmanifest` y `.htaccess`.
   - En el administrador de archivos activa **"Mostrar archivos ocultos"** para ver `.htaccess`; con FTP/FileZilla no hace falta.
4. Tras cada nuevo deploy, limpia la caché de LiteSpeed: hPanel → **Avanzado → Administración de caché → Purge All**.

Notas:

- El `.htaccess` incluido (vía `public/.htaccess`) ya configura: `ErrorDocument 404`, compresión gzip, caché **inmutable de 1 año** para los assets con hash de `_astro/`, `no-cache` para el HTML, cabeceras de seguridad y una regla de redirección a HTTPS lista para descomentar cuando actives el SSL en hPanel.
- Si usas un subdominio o subcarpeta distinta de la raíz, avisa a Astro con `base` en `astro.config.mjs`.
- Cambia `site` en `astro.config.mjs` por tu dominio real (útil si luego se agrega `@astrojs/sitemap` o URLs canónicas).
- El hosting compartido de Hostinger **no ejecuta el build**: siempre compila localmente (o en tu CI favorito, p. ej. GitHub Actions → artifact → descarga) y sube el `dist/` resultante.

## 📁 Estructura

```
src/
├── components/
│   ├── Header.astro        # Header fijo + menú móvil
│   ├── Hero.astro          # Bento grid: marca, preview, valor, recientes, resumen
│   ├── Configurator.astro  # Panel flotante con 5 tabs
│   ├── ProductMockup.astro # Mockup SVG paramétrico (3 productos)
│   ├── Resumen.astro       # Resumen ampliado + desglose + conversión
│   ├── PromoCaja.astro      # Banner superior cerrable que promociona la Caja
│   ├── CajaCreativelab.astro # "Caja con Propósito" (prototipo convertido a componente)
│   └── ...                 # ComoFunciona, Catalogo, Impacto, Empresas, Ferias, Footer
├── layouts/Layout.astro    # Fuentes + defs SVG (texturas y sombras)
├── pages/index.astro       # Landing: compone todo (+ banner PromoCaja)
├── pages/caja-creativelab.astro # URL /caja-creativelab/: suscripción de cajas
├── scripts/configurator.js # Estado, precio, WhatsApp, modal, formularios
└── styles/global.css       # Sistema de diseño (paleta, botones, toast, modal)
```

