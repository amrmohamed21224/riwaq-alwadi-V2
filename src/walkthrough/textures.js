import * as THREE from 'three';
import { fbm, hash2, vnoise, clamp01, smooth, mix } from './noise';

/**
 * Procedural PBR material-texture library.
 * Every generator returns { map, normalMap, roughnessMap } (tileable) so the
 * scenes can build physically based materials with real surface micro-detail.
 */

let TEX_SIZE = 512;
export const setTextureSize = (n) => {
  TEX_SIZE = n;
};

const cache = new Map();
const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];

function dataTex(data, size, srgb) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function synth(key, shade, normalStrength = 2.5) {
  if (cache.has(key)) return cache.get(key);
  const size = TEX_SIZE;
  const n = size * size;
  const albedo = new Uint8Array(n * 4);
  const rough = new Uint8Array(n * 4);
  const normal = new Uint8Array(n * 4);
  const hgt = new Float32Array(n);
  const o = { r: 0.5, g: 0.5, b: 0.5, h: 0, ro: 0.6 };
  let k = 0;
  for (let j = 0; j < size; j++) {
    const v = j / size;
    for (let i = 0; i < size; i++) {
      const u = i / size;
      shade(u, v, o);
      const p = k * 4;
      albedo[p] = clamp01(o.r) * 255;
      albedo[p + 1] = clamp01(o.g) * 255;
      albedo[p + 2] = clamp01(o.b) * 255;
      albedo[p + 3] = 255;
      const rv = clamp01(o.ro) * 255;
      rough[p] = rv;
      rough[p + 1] = rv;
      rough[p + 2] = rv;
      rough[p + 3] = 255;
      hgt[k] = o.h;
      k++;
    }
  }
  const at = (x, y) => hgt[((y + size) % size) * size + ((x + size) % size)];
  k = 0;
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const dx = (at(i + 1, j) - at(i - 1, j)) * normalStrength;
      const dy = (at(i, j + 1) - at(i, j - 1)) * normalStrength;
      const l = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const p = k * 4;
      normal[p] = (-dx * l * 0.5 + 0.5) * 255;
      normal[p + 1] = (-dy * l * 0.5 + 0.5) * 255;
      normal[p + 2] = (l * 0.5 + 0.5) * 255;
      normal[p + 3] = 255;
      k++;
    }
  }
  const res = {
    map: dataTex(albedo, size, true),
    normalMap: dataTex(normal, size, false),
    roughnessMap: dataTex(rough, size, false),
  };
  cache.set(key, res);
  return res;
}

const setc = (o, c, f = 1) => {
  o.r = c[0] * f;
  o.g = c[1] * f;
  o.b = c[2] * f;
};

/* ---------------- Masonry: Najdi limestone / ashlar blocks ---------------- */
export function stoneBlocks({
  rows = 6,
  cols = 3,
  base = 0xcdb38a,
  tone = 0.12,
  mortar = 0x8a7b62,
  groove = 0.0035,
  pit = 0.6,
  seed = 3,
  rough = 0.92,
  strength = 3.5,
} = {}) {
  const B = hex(base);
  const M = hex(mortar);
  return synth(`stone:${rows}:${cols}:${base}:${tone}:${seed}`, (u, v, o) => {
    const row = Math.floor(v * rows);
    const fv = v * rows - row;
    const off = hash2(row, 5, seed);
    const uu = u * cols + off;
    const col = Math.floor(uu);
    const fu = uu - col;
    const cm = ((col % cols) + cols) % cols;
    const bid = hash2(cm, row, seed + 3);
    const ed = Math.min(Math.min(fu, 1 - fu) / cols, Math.min(fv, 1 - fv) / rows);
    const n1 = fbm(u * 32, v * 32, 32, 32, 4, seed);
    const n2 = fbm(u * 8, v * 8, 8, 8, 3, seed + 9);
    const p = smooth(0.6, 0.7, fbm(u * 64, v * 64, 64, 64, 2, seed + 5));
    const bevel = smooth(0, groove * 4, ed);
    if (ed < groove) {
      setc(o, M, 0.78 + n1 * 0.4);
      o.h = -0.5;
      o.ro = 1;
    } else {
      const f = 1 + (bid - 0.5) * tone * 2 + (n2 - 0.5) * 0.25 + (n1 - 0.5) * 0.2 - p * 0.28 * pit;
      setc(o, B, f);
      o.h = bevel * 0.7 + n1 * 0.4 - p * 0.15;
      o.ro = rough - n1 * 0.12;
    }
  }, strength);
}

/* ---------------- Travertine slab (banded, pitted) ---------------- */
export function travertine({
  base = 0xe3d3b4,
  bands = 40,
  tilesX = 2,
  tilesY = 2,
  grout = 0.003,
  polish = 0.38,
  seed = 11,
} = {}) {
  const B = hex(base);
  const D = hex(0xb79b73);
  return synth(`trav:${base}:${bands}:${tilesX}:${tilesY}:${polish}:${seed}`, (u, v, o) => {
    const band = 0.5 + 0.5 * Math.sin(v * bands * 6.2832 + fbm(u * 4, v * 8, 4, 8, 3, seed) * 7);
    const fine = fbm(u * 3, v * bands * 2, 3, bands * 2, 4, seed + 2);
    const pore = smooth(0.66, 0.76, fbm(u * 14, v * 120, 14, 120, 3, seed + 7));
    const t = band * 0.35 + fine * 0.65;
    const col = [mix(B[0], D[0], t * 0.55), mix(B[1], D[1], t * 0.55), mix(B[2], D[2], t * 0.55)];
    const fu = (u * tilesX) % 1;
    const fv = (v * tilesY) % 1;
    const ed = Math.min(Math.min(fu, 1 - fu) / tilesX, Math.min(fv, 1 - fv) / tilesY);
    const tile = hash2(Math.floor(u * tilesX), Math.floor(v * tilesY), seed) - 0.5;
    const f = 1 + tile * 0.07 - pore * 0.22;
    setc(o, col, f);
    o.h = fine * 0.35 - pore * 0.6;
    o.ro = polish + pore * 0.4 + (1 - fine) * 0.08;
    if (ed < grout) {
      setc(o, [0.45, 0.4, 0.33], 1);
      o.h = -0.8;
      o.ro = 0.95;
    }
  }, 2);
}

/* ---------------- Veined marble (Nero Marquina, Carrara, ...) ---------------- */
export function marble({
  base = 0x0e0f12,
  vein = 0xd9b57a,
  veinStrength = 1,
  sharp = 12,
  scale = 3,
  seed = 21,
  polish = 0.1,
  cloud = 0.12,
  tilesX = 1,
  tilesY = 1,
  grout = 0.0015,
} = {}) {
  const B = hex(base);
  const V = hex(vein);
  const S = Math.round(scale);
  return synth(`marble:${base}:${vein}:${sharp}:${S}:${seed}:${tilesX}:${tilesY}`, (u, v, o) => {
    const fu0 = (u * tilesX) % 1;
    const fv0 = (v * tilesY) % 1;
    const tid = hash2(Math.floor(u * tilesX), Math.floor(v * tilesY), seed);
    const uu = fu0 + tid * 3;
    const vv = fv0 + tid * 5;
    const w = fbm(uu * S, vv * S, 997, 997, 4, seed);
    const w2 = fbm(uu * S * 1.7 + w * 2.2, vv * S * 1.7 - w * 2.2, 997, 997, 5, seed + 2);
    const vn = Math.pow(1 - Math.abs(2 * w2 - 1), sharp);
    const w3 = fbm(uu * S * 3.1 - w * 3, vv * S * 3.1 + w * 3, 997, 997, 4, seed + 9);
    const vn2 = Math.pow(1 - Math.abs(2 * w3 - 1), sharp * 1.6) * 0.55;
    const cl = fbm(uu * 2, vv * 2, 997, 997, 4, seed + 4);
    const vt = clamp01((vn + vn2) * veinStrength);
    o.r = mix(B[0] * (1 + (cl - 0.5) * cloud * 6), V[0], vt);
    o.g = mix(B[1] * (1 + (cl - 0.5) * cloud * 6), V[1], vt);
    o.b = mix(B[2] * (1 + (cl - 0.5) * cloud * 6), V[2], vt);
    o.h = cl * 0.1 + vt * 0.05;
    o.ro = polish + (1 - vt) * 0.04 + cl * 0.06;
    if (tilesX > 1 || tilesY > 1) {
      const ed = Math.min(Math.min(fu0, 1 - fu0) / tilesX, Math.min(fv0, 1 - fv0) / tilesY);
      if (ed < grout) {
        setc(o, [0.05, 0.05, 0.05]);
        o.h = -0.9;
        o.ro = 0.9;
      }
    }
  }, 1);
}

/* ---------------- Timber (planks with grain, gaps and end joints) ---------------- */
export function wood({
  planks = 6,
  base = 0x7a5233,
  dark = 0x3a2314,
  rings = 16,
  seed = 5,
  rough = 0.5,
  joints = 2,
} = {}) {
  const B = hex(base);
  const D = hex(dark);
  return synth(`wood:${planks}:${base}:${dark}:${seed}:${joints}`, (u, v, o) => {
    const pk = Math.floor(v * planks);
    const fv = v * planks - pk;
    const ph = hash2(pk, 3, seed);
    const gx = u * 3;
    const warp = fbm(gx, pk + fv * 1.5, 3, planks + 2, 3, seed) * 6;
    const ringv = 0.5 + 0.5 * Math.sin(fv * rings * 0.6 + warp * 2 + ph * 40);
    const streak = fbm(u * 6, (pk + fv) * 14, 6, (planks + 1) * 14, 4, seed + 1);
    const fine = vnoise(u * 400, (pk + fv) * 6, 400, (planks + 1) * 6, seed + 4);
    const g = clamp01(ringv * 0.45 + streak * 0.5 + fine * 0.12);
    const shade = 0.82 + 0.3 * ph;
    o.r = mix(B[0], D[0], g * 0.8) * shade;
    o.g = mix(B[1], D[1], g * 0.8) * shade;
    o.b = mix(B[2], D[2], g * 0.8) * shade;
    o.h = streak * 0.3 + fine * 0.18 + ringv * 0.08;
    o.ro = rough + (streak - 0.5) * 0.18;
    const ju = (u * joints + ph * 4) % 1;
    const ed = Math.min(fv, 1 - fv);
    if (ed < 0.012 || ju < 0.006) {
      setc(o, D, 0.35);
      o.h = -0.9;
      o.ro = 0.9;
    }
  }, 2.2);
}

/* ---------------- Red sandstone strata (AlUla canyons) ---------------- */
export function sandstone({ seed = 31, strength = 6 } = {}) {
  const C = [hex(0x6f2f22), hex(0xa4533a), hex(0xc77f55), hex(0xd8a577)];
  return synth(`sand:${seed}`, (u, v, o) => {
    const warp = fbm(u * 3, v * 6, 3, 6, 4, seed) * 5;
    const band = 0.5 + 0.5 * Math.sin(v * 38 * 6.2832 * 0.5 + warp);
    const band2 = 0.5 + 0.5 * Math.sin(v * 91 * 6.2832 * 0.5 + warp * 1.7 + 2);
    const n = fbm(u * 24, v * 24, 24, 24, 5, seed + 1);
    const pit = smooth(0.62, 0.72, fbm(u * 60, v * 60, 60, 60, 3, seed + 3));
    const streak = fbm(u * 10, v * 1, 10, 1, 3, seed + 6);
    let t = band * 0.55 + band2 * 0.2 + n * 0.35;
    t = clamp01(t);
    const i = Math.min(2, Math.floor(t * 3));
    const f = t * 3 - i;
    const a = C[i];
    const b = C[i + 1];
    o.r = mix(a[0], b[0], f) * (1 - pit * 0.3) * (0.9 + streak * 0.14);
    o.g = mix(a[1], b[1], f) * (1 - pit * 0.3) * (0.9 + streak * 0.14);
    o.b = mix(a[2], b[2], f) * (1 - pit * 0.3) * (0.9 + streak * 0.14);
    o.h = band * 0.6 + band2 * 0.2 + n * 0.5 - pit * 0.5;
    o.ro = 0.93;
  }, strength);
}

/* ---------------- Board-formed architectural concrete ---------------- */
export function concrete({ base = 0xb7b4ad, panelsX = 3, panelsY = 2, seed = 41 } = {}) {
  const B = hex(base);
  return synth(`conc:${base}:${panelsX}:${panelsY}:${seed}`, (u, v, o) => {
    const n = fbm(u * 40, v * 40, 40, 40, 5, seed);
    const m = fbm(u * 5, v * 5, 5, 5, 3, seed + 2);
    const bug = smooth(0.74, 0.8, fbm(u * 90, v * 90, 90, 90, 2, seed + 4));
    const boards = vnoise(u * 2, v * 40, 2, 40, seed + 8);
    const fu = (u * panelsX) % 1;
    const fv = (v * panelsY) % 1;
    const ed = Math.min(Math.min(fu, 1 - fu) / panelsX, Math.min(fv, 1 - fv) / panelsY);
    const tx = (fu - 0.5) * panelsX;
    const ty = (fv - 0.5) * panelsY;
    const tie = smooth(0.012, 0.008, Math.hypot(((fu * panelsX) % 0.5) - 0.25, ((fv * panelsY) % 0.5) - 0.25) / 4);
    let f = 0.84 + n * 0.22 + (m - 0.5) * 0.2 - bug * 0.25 + (boards - 0.5) * 0.05;
    if (ed < 0.0016) f *= 0.55;
    setc(o, B, f * (1 - tie * 0.55));
    o.h = n * 0.3 + boards * 0.18 - bug * 0.45 - (ed < 0.0016 ? 0.7 : 0) - tie * 0.5;
    o.ro = 0.86 - n * 0.1;
    void tx;
    void ty;
  }, 2);
}

/* ---------------- Fine plaster / render ---------------- */
export function plaster({ base = 0xe8dccb, seed = 51, strength = 1.6 } = {}) {
  const B = hex(base);
  return synth(`plaster:${base}:${seed}`, (u, v, o) => {
    const n = fbm(u * 28, v * 28, 28, 28, 5, seed);
    const m = fbm(u * 4, v * 4, 4, 4, 3, seed + 3);
    setc(o, B, 0.9 + n * 0.16 + (m - 0.5) * 0.12);
    o.h = n * 0.5;
    o.ro = 0.88 - n * 0.08;
  }, strength);
}

/* ---------------- Polished stone floor tile (basalt / slate) ---------------- */
export function stoneTile({ base = 0x1e2025, tiles = 4, grout = 0x0a0a0c, polish = 0.2, seed = 61, speck = 0.9 } = {}) {
  const B = hex(base);
  const G = hex(grout);
  return synth(`tile:${base}:${tiles}:${polish}:${seed}`, (u, v, o) => {
    const fu = (u * tiles) % 1;
    const fv = (v * tiles) % 1;
    const ed = Math.min(Math.min(fu, 1 - fu), Math.min(fv, 1 - fv)) / tiles;
    const tid = hash2(Math.floor(u * tiles), Math.floor(v * tiles), seed);
    const n = fbm(u * 30, v * 30, 30, 30, 5, seed);
    const sp = smooth(0.7, 0.78, vnoise(u * 220, v * 220, 220, 220, seed)) * speck;
    const cl = fbm(u * 3, v * 3, 3, 3, 4, seed + 2);
    setc(o, B, 0.8 + n * 0.3 + (tid - 0.5) * 0.14 + (cl - 0.5) * 0.2 + sp * 0.3);
    o.h = n * 0.2;
    o.ro = polish + n * 0.12;
    if (ed < 0.0016) {
      setc(o, G);
      o.h = -0.9;
      o.ro = 0.9;
    }
  }, 1.4);
}

/* ---------------- Zellige / geometric mosaic ---------------- */
export function zellige({ cells = 4, a = 0x1d6a73, b = 0xe6d7b8, c = 0xb07c3a, d = 0x143f66, seed = 71 } = {}) {
  const A = hex(a);
  const Bc = hex(b);
  const C = hex(c);
  const Dc = hex(d);
  return synth(`zel:${cells}:${a}:${b}:${c}:${d}:${seed}`, (u, v, o) => {
    const cu = u * cells;
    const cv = v * cells;
    const x = (cu % 1) * 2 - 1;
    const y = (cv % 1) * 2 - 1;
    const r = Math.hypot(x, y);
    const th = Math.atan2(y, x);
    const starR = 0.46 + 0.34 * Math.pow(Math.abs(Math.cos(th * 4)), 1.4);
    const ring = Math.abs(r - starR);
    let col = Bc;
    if (Math.abs(x) + Math.abs(y) > 1.52) col = Dc;
    else if (r < 0.22) col = C;
    else if (r < starR) col = A;
    // small glazed tiles
    const tiles = cells * 8;
    const tu = (u * tiles) % 1;
    const tv = (v * tiles) % 1;
    const ed = Math.min(Math.min(tu, 1 - tu), Math.min(tv, 1 - tv));
    const tid = hash2(Math.floor(u * tiles), Math.floor(v * tiles), seed);
    const glaze = 0.9 + tid * 0.2 + fbm(u * 20, v * 20, 20, 20, 3, seed) * 0.1;
    setc(o, col, glaze);
    o.h = 0.3;
    o.ro = 0.22 + tid * 0.15;
    if (ring < 0.035) {
      setc(o, C, 0.9);
    }
    if (ed < 0.07) {
      setc(o, [0.85, 0.8, 0.7], 0.5);
      o.h = -0.9;
      o.ro = 0.9;
    }
  }, 2.5);
}

/* ---------------- Fabric / bouclé / shag ---------------- */
export function fabric({ base = 0x3d3935, fiber = 90, curl = 1, seed = 81, rough = 0.97, strength = 3 } = {}) {
  const B = hex(base);
  return synth(`fab:${base}:${fiber}:${seed}`, (u, v, o) => {
    const f1 = fbm(u * fiber, v * fiber, fiber, fiber, 3, seed);
    const f2 = vnoise(u * fiber * 2, v * fiber * 2, fiber * 2, fiber * 2, seed + 2);
    const w = fbm(u * 6, v * 6, 6, 6, 3, seed + 5);
    const loop = Math.abs(f1 - 0.5) * 2 * curl;
    setc(o, B, 0.78 + f1 * 0.3 + f2 * 0.14 + (w - 0.5) * 0.1);
    o.h = loop + f2 * 0.5;
    o.ro = rough;
  }, strength);
}

/* ---------------- Sand / desert ground ---------------- */
export function sand({ base = 0xd1b58a, seed = 91 } = {}) {
  const B = hex(base);
  return synth(`sandg:${base}:${seed}`, (u, v, o) => {
    const w = fbm(u * 4, v * 4, 4, 4, 4, seed);
    const ripple = 0.5 + 0.5 * Math.sin(u * 60 * 6.2832 * 0.5 + w * 12);
    const grain = vnoise(u * 300, v * 300, 300, 300, seed + 3);
    const pebble = smooth(0.78, 0.84, fbm(u * 50, v * 50, 50, 50, 2, seed + 5));
    setc(o, B, 0.82 + w * 0.2 + ripple * 0.08 + grain * 0.07 - pebble * 0.18);
    o.h = ripple * 0.4 + grain * 0.12 + pebble * 0.6;
    o.ro = 0.96;
  }, 2.2);
}

/* ---------------- Brushed metal roughness streaks ---------------- */
export function brushed({ seed = 101 } = {}) {
  return synth(`brush:${seed}`, (u, v, o) => {
    const s = vnoise(u * 3, v * 380, 3, 380, seed);
    const s2 = vnoise(u * 7, v * 160, 7, 160, seed + 1);
    o.r = o.g = o.b = 0.9 + s * 0.1;
    o.h = s * 0.4 + s2 * 0.2;
    o.ro = 0.26 + s * 0.14 + s2 * 0.06;
  }, 0.7);
}

/* =============================================================
   CANVAS-BASED ARTWORK TEXTURES
   ============================================================= */
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Mashrabiya (turned-timber lattice) with alpha holes */
export function lattice({ cell = 64, cells = 8, color = '#4a2d1a', hole = 'star' } = {}) {
  const key = `lat:${cell}:${cells}:${color}:${hole}`;
  if (cache.has(key)) return cache.get(key);
  const size = cell * cells;
  const t = canvasTex(size, size, (ctx) => {
    ctx.clearRect(0, 0, size, size);
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, color);
    g.addColorStop(0.5, '#6a4128');
    g.addColorStop(1, color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    // wood grain
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 260; i++) {
      ctx.strokeStyle = Math.random() > 0.5 ? '#1c0f07' : '#8a5a36';
      ctx.beginPath();
      const y = Math.random() * size;
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'destination-out';
    for (let cy = 0; cy < cells; cy++) {
      for (let cx = 0; cx < cells; cx++) {
        const x = cx * cell + cell / 2;
        const y = cy * cell + cell / 2;
        ctx.beginPath();
        if (hole === 'star') {
          const R = cell * 0.4;
          for (let k = 0; k < 16; k++) {
            const a = (k / 16) * Math.PI * 2;
            const r = k % 2 === 0 ? R : R * 0.58;
            ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
          }
        } else {
          const R = cell * 0.38;
          ctx.moveTo(x, y - R);
          ctx.lineTo(x + R, y);
          ctx.lineTo(x, y + R);
          ctx.lineTo(x - R, y);
        }
        ctx.closePath();
        ctx.fill();
        // small diamonds between stars
        ctx.beginPath();
        const rr = cell * 0.1;
        ctx.moveTo(x + cell / 2, y + cell / 2 - rr);
        ctx.lineTo(x + cell / 2 + rr, y + cell / 2);
        ctx.lineTo(x + cell / 2, y + cell / 2 + rr);
        ctx.lineTo(x + cell / 2 - rr, y + cell / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  });
  cache.set(key, t);
  return t;
}

/** Dusk skyline panorama with lit windows (for penthouse windows) */
export function skyline({ seed = 7, warm = true, density = 1 } = {}) {
  const key = `sky:${seed}:${warm}:${density}`;
  if (cache.has(key)) return cache.get(key);
  const t = canvasTex(2048, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0e1530');
    g.addColorStop(0.3, '#2a2c5c');
    g.addColorStop(0.55, '#a8556c');
    g.addColorStop(0.72, '#f08a4a');
    g.addColorStop(0.8, '#ffc072');
    g.addColorStop(1, '#2a1a26');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // sun halo
    const rg = ctx.createRadialGradient(w * 0.42, h * 0.78, 4, w * 0.42, h * 0.78, 340);
    rg.addColorStop(0, 'rgba(255,230,170,0.95)');
    rg.addColorStop(0.2, 'rgba(255,170,90,0.55)');
    rg.addColorStop(1, 'rgba(255,120,60,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    // clouds
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * w;
      const cy = h * (0.25 + Math.random() * 0.4);
      const cg = ctx.createRadialGradient(cx, cy, 2, cx, cy, 90 + Math.random() * 120);
      cg.addColorStop(0, 'rgba(255,170,120,0.16)');
      cg.addColorStop(1, 'rgba(255,170,120,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(cx - 220, cy - 120, 440, 240);
    }
    // layered buildings
    const layers = [
      { base: h * 0.82, hmax: 70, col: '#2c2740', win: 0.12, n: 70 },
      { base: h * 0.9, hmax: 120, col: '#1d1a2c', win: 0.3, n: 55 },
      { base: h, hmax: 200, col: '#0f0d18', win: 0.55, n: 34 },
    ];
    layers.forEach((L, li) => {
      let x = -20;
      while (x < w) {
        const bw = 22 + Math.random() * (li === 2 ? 90 : 50);
        const bh = 20 + Math.random() * L.hmax * (Math.random() > 0.9 ? 1.8 : 1);
        ctx.fillStyle = L.col;
        ctx.fillRect(x, L.base - bh, bw, bh + 4);
        const step = li === 2 ? 9 : 6;
        for (let wy = L.base - bh + 6; wy < L.base - 4; wy += step) {
          for (let wx = x + 4; wx < x + bw - 4; wx += step - 1) {
            if (Math.random() < L.win * density) {
              ctx.fillStyle = Math.random() > 0.2 ? (warm ? '#ffd28a' : '#cfe6ff') : '#fff4d6';
              ctx.globalAlpha = 0.55 + Math.random() * 0.45;
              ctx.fillRect(wx, wy, li === 2 ? 3 : 2, li === 2 ? 4 : 3);
              ctx.globalAlpha = 1;
            }
          }
        }
        x += bw + 2 + Math.random() * 6;
      }
    });
    // atmospheric haze at horizon
    const hz = ctx.createLinearGradient(0, h * 0.65, 0, h);
    hz.addColorStop(0, 'rgba(255,170,100,0)');
    hz.addColorStop(1, 'rgba(255,150,90,0.22)');
    ctx.fillStyle = hz;
    ctx.fillRect(0, h * 0.65, w, h * 0.35);
  });
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  cache.set(key, t);
  return t;
}

/** Palm frond with leaflets (alpha-tested) */
export function palmFrond() {
  if (cache.has('palmfrond')) return cache.get('palmfrond');
  const t = canvasTex(256, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const rib = ctx.createLinearGradient(0, h, 0, 0);
    rib.addColorStop(0, '#6a7a2a');
    rib.addColorStop(1, '#3a5a1a');
    ctx.strokeStyle = rib;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(w / 2, h);
    ctx.lineTo(w / 2, 4);
    ctx.stroke();
    for (let i = 0; i < 60; i++) {
      const y = h - 24 - (i / 60) * (h - 40);
      const len = (w / 2 - 6) * Math.sin(Math.min(1, (i / 60) * 1.15 + 0.12) * Math.PI * 0.56);
      const drop = 24 + (1 - i / 60) * 20;
      for (const s of [-1, 1]) {
        const lg = ctx.createLinearGradient(w / 2, y, w / 2 + s * len, y - drop);
        lg.addColorStop(0, '#4a7a22');
        lg.addColorStop(1, i % 2 ? '#2c5a1a' : '#6a8a2a');
        ctx.strokeStyle = lg;
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(w / 2, y);
        ctx.quadraticCurveTo(w / 2 + s * len * 0.5, y - drop * 0.1, w / 2 + s * len, y - drop);
        ctx.stroke();
      }
    }
  });
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  cache.set('palmfrond', t);
  return t;
}

/** Palm trunk rings (cross-hatched diamond scars) */
export function palmTrunk() {
  if (cache.has('palmtrunk')) return cache.get('palmtrunk');
  const t = canvasTex(256, 512, (ctx, w, h) => {
    ctx.fillStyle = '#6b5436';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 14) {
      for (let x = -14; x < w + 14; x += 28) {
        const ox = (Math.floor(y / 14) % 2) * 14;
        ctx.fillStyle = Math.random() > 0.4 ? '#43331f' : '#85693f';
        ctx.beginPath();
        ctx.moveTo(x + ox, y);
        ctx.lineTo(x + ox + 14, y + 7);
        ctx.lineTo(x + ox, y + 14);
        ctx.lineTo(x + ox - 14, y + 7);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#a58a5a';
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 8);
    }
  });
  cache.set('palmtrunk', t);
  return t;
}

/** Soft radial sprite: light pools, halos, contact shadows */
export function radial({ inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 256, power = 1 } = {}) {
  const key = `rad:${inner}:${outer}:${size}:${power}`;
  if (cache.has(key)) return cache.get(key);
  const t = canvasTex(size, size, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    const stops = 12;
    const parse = (c) => c.match(/[\d.]+/g).map(Number);
    const a = parse(inner);
    const b = parse(outer);
    for (let i = 0; i <= stops; i++) {
      const f = i / stops;
      const k = Math.pow(f, power);
      g.addColorStop(
        f,
        `rgba(${Math.round(mix(a[0], b[0], k))},${Math.round(mix(a[1], b[1], k))},${Math.round(mix(a[2], b[2], k))},${mix(a[3], b[3], k).toFixed(3)})`,
      );
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  cache.set(key, t);
  return t;
}

/** Ceiling dome ornament (radial geometric tracery) for hammam */
export function domeOrnament({ ribs = 16 } = {}) {
  const key = `dome:${ribs}`;
  if (cache.has(key)) return cache.get(key);
  const t = canvasTex(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#d9c7a0';
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#f2e4c0');
    g.addColorStop(0.5, '#c9b07a');
    g.addColorStop(1, '#8b6f45');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    for (let ring = 1; ring <= 5; ring++) {
      const R = ring * 90;
      ctx.strokeStyle = ring % 2 ? 'rgba(20,90,100,0.85)' : 'rgba(110,70,30,0.8)';
      ctx.lineWidth = 6 - ring * 0.6;
      for (let k = 0; k < ribs; k++) {
        const a0 = (k / ribs) * Math.PI * 2;
        const a1 = ((k + 1) / ribs) * Math.PI * 2;
        const am = (a0 + a1) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * R, Math.sin(a0) * R);
        ctx.lineTo(Math.cos(am) * (R + 70), Math.sin(am) * (R + 70));
        ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R);
        ctx.stroke();
        ctx.fillStyle = ring % 2 ? 'rgba(24,110,120,0.35)' : 'rgba(150,100,45,0.3)';
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * R, Math.sin(a0) * R);
        ctx.lineTo(Math.cos(am) * (R + 70), Math.sin(am) * (R + 70));
        ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R);
        ctx.lineTo(Math.cos(am) * (R - 40), Math.sin(am) * (R - 40));
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  cache.set(key, t);
  return t;
}
