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
- **Paleta y tipografía**: variables en `src/styles/global.css` (Manrope, Caveat, Playfair Display).

## 🚀 Despliegue en GitHub Pages

1. Sube el repositorio a GitHub (rama `main`).
2. En el repo: **Settings → Pages → Source: GitHub Actions**.
3. Cada push a `main` ejecuta `.github/workflows/deploy.yml` (build oficial de Astro + deploy de Pages).
4. El sitio queda publicado en `https://<tu-usuario>.github.io/creativeLab-proto/`.

Notas:
- La ruta base se define en `astro.config.mjs` (`base`). Si publicas en un dominio propio o en `<usuario>.github.io`, cámbiala a `'/'`.
- `public/.nojekyll` evita el procesamiento de Jekyll; `src/pages/404.astro` genera una página 404 propia.
- Con la base configurada, en desarrollo el sitio se sirve en `http://localhost:4321/creativeLab-proto/` (refleja la URL de producción).

## 📁 Estructura

```
src/
├── components/
│   ├── Header.astro        # Header fijo + menú móvil
│   ├── Hero.astro          # Bento grid: marca, preview, valor, recientes, resumen
│   ├── Configurator.astro  # Panel flotante con 5 tabs
│   ├── ProductMockup.astro # Mockup SVG paramétrico (3 productos)
│   ├── Resumen.astro       # Resumen ampliado + desglose + conversión
│   └── ...                 # ComoFunciona, Catalogo, Impacto, Empresas, Ferias, Footer
├── layouts/Layout.astro    # Fuentes + defs SVG (texturas y sombras)
├── pages/index.astro       # Única página: compone todo
├── scripts/configurator.js # Estado, precio, WhatsApp, modal, formularios
└── styles/global.css       # Sistema de diseño (paleta, botones, toast, modal)
```

