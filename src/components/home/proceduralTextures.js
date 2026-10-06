import * as THREE from 'three';

/**
 * Procedural luxury architectural textures generator
 * Lightweight, zero-dependency, instant load.
 */

// 1. Polished Nero Marquina / Black Travertine Marble
export function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Dark slate base
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, '#15171c');
  bgGrad.addColorStop(0.5, '#101216');
  bgGrad.addColorStop(1, '#0b0c0f');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle mineral noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  // Elegant golden and white marble veins
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(200, 169, 126, 0.18)'; // Gold vein
  drawVein(ctx, 120, 0, 850, 1024, 6);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'; // White vein
  drawVein(ctx, 600, 0, 200, 1024, 8);
  drawVein(ctx, 0, 400, 1024, 700, 7);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function drawVein(ctx, x1, y1, x2, y2, branches) {
  ctx.beginPath();
  let cx = x1;
  let cy = y1;
  ctx.moveTo(cx, cy);
  const steps = 40;
  const dx = (x2 - x1) / steps;
  const dy = (y2 - y1) / steps;

  for (let i = 0; i < steps; i++) {
    cx += dx + (Math.random() - 0.5) * 25;
    cy += dy + (Math.random() - 0.5) * 20;
    ctx.lineTo(cx, cy);
    if (Math.random() < 0.2 && branches > 0) {
      branches--;
      ctx.stroke();
      drawVein(ctx, cx, cy, cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.5) * 200, 0);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
    }
  }
  ctx.stroke();
}

// 2. Fluted Smoked Walnut Wood Texture
export function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2d1e14';
  ctx.fillRect(0, 0, 512, 512);

  // Vertical wood grain
  for (let x = 0; x < 512; x += 2) {
    const alpha = 0.05 + Math.random() * 0.15;
    const isDark = Math.random() > 0.5;
    ctx.strokeStyle = isDark ? `rgba(18, 11, 7, ${alpha})` : `rgba(74, 48, 29, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 3. Desert Canyon Horizon Backdrop
export function createCanyonBackdrop() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dusk Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 360);
  skyGrad.addColorStop(0, '#06070c');
  skyGrad.addColorStop(0.4, '#12111d');
  skyGrad.addColorStop(0.7, '#2f1a26');
  skyGrad.addColorStop(0.92, '#6c3a2f');
  skyGrad.addColorStop(1, '#a15b3c');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 2048, 360);

  // Far distant mountain layer (warm haze)
  ctx.fillStyle = '#22141a';
  drawMountainSilhouette(ctx, 220, 280, 12, 2048);

  // Mid mountain layer (canyon cliff plateau)
  ctx.fillStyle = '#140e14';
  drawCanyonPlateaus(ctx, 270, 330, 2048);

  // Close mountain layer (deep monolithic rocks)
  ctx.fillStyle = '#0b0c10';
  drawCanyonPlateaus(ctx, 330, 420, 2048);

  // Ground base
  ctx.fillStyle = '#07080a';
  ctx.fillRect(0, 420, 2048, 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function drawMountainSilhouette(ctx, minY, maxY, peaks, width) {
  ctx.beginPath();
  ctx.moveTo(0, maxY);
  const seg = width / peaks;
  for (let i = 0; i <= peaks; i++) {
    const x = i * seg;
    const y = minY + Math.sin(i * 1.8) * 35 + (Math.random() - 0.5) * 20;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, 512);
  ctx.lineTo(0, 512);
  ctx.closePath();
  ctx.fill();
}

function drawCanyonPlateaus(ctx, minY, maxY, width) {
  ctx.beginPath();
  ctx.moveTo(0, 512);
  let x = 0;
  while (x < width) {
    const plateauWidth = 80 + Math.random() * 160;
    const height = minY + Math.random() * (maxY - minY);
    ctx.lineTo(x, height);
    ctx.lineTo(x + plateauWidth, height);
    x += plateauWidth;
    // Step down or ravine
    if (Math.random() > 0.4) {
      x += 20 + Math.random() * 40;
    }
  }
  ctx.lineTo(width, 512);
  ctx.closePath();
  ctx.fill();
}
