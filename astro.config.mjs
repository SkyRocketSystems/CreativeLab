// @ts-check
import { defineConfig } from 'astro/config';

// Despliegue en Hostinger (hosting compartido, Apache/LiteSpeed):
// el contenido de dist/ se publica en la RAÍZ del dominio (public_html),
// sin subruta → no se necesita `base` (por defecto '/').
//
// Cambia `site` por tu dominio real cuando lo tengas (se usa para
// canonical/sitemap si algún día se agregan):
export default defineConfig({
  site: 'https://creativelab.example.com',
});


