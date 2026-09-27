// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages publica los sitios de proyecto en https://<usuario>.github.io/<repo>/
// → la ruta base debe coincidir con el nombre del repositorio.
// Si publicas en un dominio propio o en <usuario>.github.io, cambia BASE a '/'.
const BASE = '/creativeLab-proto';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://johan.github.io/creativeLab-proto',
  base: BASE,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});

