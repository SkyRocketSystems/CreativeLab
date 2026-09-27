#!/usr/bin/env node
/* ============================================================
   CreativeLab — Generador de iconos PNG (Retina / touch)
   Dibuja el logo (mismo diseño que public/favicon.svg) con
   campos de distancia firmados (SDF) → anti-aliasing perfecto
   en cualquier densidad de píxeles. Sin dependencias externas.
   Uso: node scripts/generate-icons.mjs
   ============================================================ */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

/* ---------- Codificador PNG mínimo (RGBA 8-bit) ---------- */
const CRC_TABLE = (() => {
  const tabla = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c >>> 0;
  }
  return tabla;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(tipo, datos) {
  const out = Buffer.alloc(8 + datos.length + 4);
  out.writeUInt32BE(datos.length, 0);
  out.write(tipo, 4, 'ascii');
  datos.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + datos.length)), out.length - 4);
  return out;
}

function codificarPNG(ancho, alto, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8; // profundidad de bits
  ihdr[9] = 6; // color tipo RGBA
  const stride = ancho * 4;
  const raw = Buffer.alloc((stride + 1) * alto);
  for (let y = 0; y < alto; y++) {
    raw[y * (stride + 1)] = 0; // filtro "None"
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- Geometría SDF (coordenadas del viewBox 128×128) ---------- */
const sdRoundBox = (px, py, cx, cy, hx, hy, r) => {
  const qx = Math.abs(px - cx) - hx + r;
  const qy = Math.abs(py - cy) - hy + r;
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
};
const sdCircle = (px, py, cx, cy, r) => Math.hypot(px - cx, py - cy) - r;
/** Cobertura anti-aliaseada: 1 dentro, 0 fuera, degradado en el borde */
const cobertura = (sd) => Math.max(0, Math.min(1, 0.5 - sd));

const CAPAS = [
  // [RGB, distancia] — pintadas de atrás hacia adelante
  [[30, 26, 24], (x, y) => sdRoundBox(x, y, 64, 64, 64, 64, 30)], // carbón
  [[230, 222, 201], (x, y) => sdRoundBox(x, y, 64, 64, 40, 40, 22)], // beige
  [[200, 107, 69], (x, y) => sdCircle(x, y, 52, 64, 17)], // terracota
  [[184, 211, 174], (x, y) => sdRoundBox(x, y, 81.5, 64, 8.5, 17, 8.5)], // salvia
];

function renderizarIcono(tamano) {
  const escala = tamano / 128;
  const buf = Buffer.alloc(tamano * tamano * 4);
  for (let j = 0; j < tamano; j++) {
    for (let i = 0; i < tamano; i++) {
      // Centro del píxel llevado al espacio del viewBox
      const x = (i + 0.5) / escala;
      const y = (j + 0.5) / escala;
      let dr = 0;
      let dg = 0;
      let db = 0;
      let da = 0;
      for (const [rgb, sdf] of CAPAS) {
        const a = cobertura(sdf(x, y));
        if (a <= 0) continue;
        const inv = 1 - a;
        dr = rgb[0] * a + dr * inv;
        dg = rgb[1] * a + dg * inv;
        db = rgb[2] * a + db * inv;
        da = a + da * inv;
      }
      const o = (j * tamano + i) * 4;
      buf[o] = Math.round(dr);
      buf[o + 1] = Math.round(dg);
      buf[o + 2] = Math.round(db);
      buf[o + 3] = Math.round(da * 255);
    }
  }
  return codificarPNG(tamano, tamano, buf);
}

const OBJETIVOS = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['favicon-192.png', 192],
  ['favicon-512.png', 512],
];

mkdirSync(PUBLIC_DIR, { recursive: true });
for (const [nombre, tamano] of OBJETIVOS) {
  writeFileSync(join(PUBLIC_DIR, nombre), renderizarIcono(tamano));
  console.log(`✓ public/${nombre} (${tamano}×${tamano})`);
}
