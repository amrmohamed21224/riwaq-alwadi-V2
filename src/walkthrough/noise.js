/* Tileable value-noise primitives (periodic lattice => seamless textures) */

export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function hash2(x, y, s = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const mod = (a, n) => ((a % n) + n) % n;

export function vnoise(x, y, px, py, s = 0) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const X0 = mod(x0, px);
  const X1 = mod(x0 + 1, px);
  const Y0 = mod(y0, py);
  const Y1 = mod(y0 + 1, py);
  const a = hash2(X0, Y0, s);
  const b = hash2(X1, Y0, s);
  const c = hash2(X0, Y1, s);
  const d = hash2(X1, Y1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x, y, px, py, oct = 4, s = 0, lac = 2, gain = 0.5) {
  let amp = 1;
  let f = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * vnoise(x * f, y * f, px * f, py * f, s + i * 17);
    norm += amp;
    amp *= gain;
    f *= lac;
  }
  return sum / norm;
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const mix = (a, b, t) => a + (b - a) * t;
