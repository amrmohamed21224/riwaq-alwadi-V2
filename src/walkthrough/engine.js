import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import * as TEX from './textures';
import { createKit } from './kit';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const nextPaint = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

/** Cinematic grade: soft S-curve, vignette, film grain, edge chromatic aberration */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    vignette: { value: 0.42 },
    grain: { value: 0.035 },
    warmth: { value: new THREE.Vector3(1.02, 1.0, 0.97) },
    contrast: { value: 1.06 },
    saturation: { value: 1.06 },
    aberration: { value: 0.0016 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float time, vignette, grain, contrast, saturation, aberration; uniform vec3 warmth;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + time) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      float r2 = dot(c,c);
      vec2 off = c * r2 * aberration * 6.0;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - off).b;
      col *= warmth;
      float l = dot(col, vec3(0.2126,0.7152,0.0722));
      col = mix(vec3(l), col, saturation);
      col = (col - 0.5) * contrast + 0.5;
      col *= 1.0 - vignette * smoothstep(0.18, 0.95, r2 * 2.2);
      col += (hash(vUv * 1024.0) - 0.5) * grain;
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};

/** Build a tiny HDR "studio" scene used for image based lighting */
export function buildEnvScene({ top = 0x1a2340, horizon = 0x8a5a4a, ground = 0x15110e, panels = [] } = {}) {
  const s = new THREE.Scene();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { t: { value: new THREE.Color(top) }, h: { value: new THREE.Color(horizon) }, g: { value: new THREE.Color(ground) } },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 t,h,g; varying vec3 vP; void main(){ float y = normalize(vP).y; vec3 c = y > 0.0 ? mix(h, t, pow(y, 0.6)) : mix(h, g, smoothstep(0.0, -0.4, y)); gl_FragColor = vec4(c, 1.0); }`,
    }),
  );
  s.add(sky);
  panels.forEach((p) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(p.s[0], p.s[1]),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(p.c).multiplyScalar(p.i ?? 4), side: THREE.DoubleSide, toneMapped: false }),
    );
    m.position.set(...p.p);
    m.lookAt(0, 0, 0);
    s.add(m);
  });
  return s;
}

function detectTier() {
  const mobile = window.innerWidth < 820 || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 8;
  if (mobile) return 0;
  if (cores <= 4 || mem <= 4) return 1;
  return 2;
}

export async function createEngine({ canvas, def, onLoadProgress = () => {}, onFrame = () => {} }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
  } catch (e) {
    throw new Error('WEBGL_UNAVAILABLE');
  }

  const tier0 = detectTier();
  const quality = { tier: tier0, shadows: tier0 >= 1, bloom: tier0 >= 1, reflections: tier0 >= 1, dpr: [1, 1.25, 1.75][tier0], texSize: tier0 >= 2 ? 768 : 512 };
  TEX.setTextureSize(quality.texSize);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = def.exposure ?? 1;
  renderer.shadowMap.enabled = quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(def.background ?? 0x07080b);
  if (def.fog) scene.fog = new THREE.FogExp2(def.fog.color, def.fog.density);

  const camera = new THREE.PerspectiveCamera(def.fov ?? 56, window.innerWidth / window.innerHeight, 0.05, 2200);

  // ---------- context handed to scene builders ----------
  const ticks = [];
  const follow = [];
  const reflectors = [];
  const disposables = [];
  const ctx = {
    THREE,
    scene,
    camera,
    renderer,
    quality,
    tex: TEX,
    lights: [],
    disposables,
    updaters: [],
    reflectors,
    registerFx(obj) {
      if (!obj || !obj.traverse) return;
      obj.traverse((o) => {
        if (o.userData && o.userData.tick) ticks.push(o.userData.tick);
        if (o.userData && o.userData.followCamera) follow.push(o);
        if (o.userData && o.userData.isReflector) reflectors.push(o);
      });
    },
    async tick(p, label) {
      onLoadProgress(p, label);
      await nextPaint();
    },
  };
  ctx.kit = createKit(ctx);
  ctx.add = (obj, x, y, z, parent) => ctx.kit.add(obj, x, y, z, parent);

  // ---------- image based lighting ----------
  const pmrem = new THREE.PMREMGenerator(renderer);
  if (def.env) {
    const es = buildEnvScene(def.env);
    const rt = pmrem.fromScene(es, 0.03);
    scene.environment = rt.texture;
    scene.environmentIntensity = def.envIntensity ?? 0.6;
    es.traverse((o) => {
      o.geometry && o.geometry.dispose();
      o.material && o.material.dispose();
    });
    disposables.push(rt);
  }

  // ---------- build the scene ----------
  await ctx.tick(0.04, 'init');
  await def.build(ctx);
  await ctx.tick(0.9, 'compile');

  // ---------- post processing ----------
  const size = new THREE.Vector2();
  renderer.getDrawingBufferSize(size);
  const rtTarget = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: quality.tier >= 1 ? 4 : 0 });
  const composer = new EffectComposer(renderer, rtTarget);
  composer.addPass(new RenderPass(scene, camera));
  const b = def.bloom || { strength: 0.35, radius: 0.5, threshold: 0.9 };
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), b.strength, b.radius, b.threshold);
  bloom.enabled = quality.bloom;
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  if (def.grade) {
    if (def.grade.vignette !== undefined) grade.uniforms.vignette.value = def.grade.vignette;
    if (def.grade.warmth) grade.uniforms.warmth.value.set(...def.grade.warmth);
    if (def.grade.saturation !== undefined) grade.uniforms.saturation.value = def.grade.saturation;
    if (def.grade.contrast !== undefined) grade.uniforms.contrast.value = def.grade.contrast;
  }
  composer.addPass(grade);

  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* optional */
  }

  // ---------- camera rig ----------
  const posCurve = new THREE.CatmullRomCurve3(def.path.map((p) => new THREE.Vector3(...p.p)), false, 'centripetal', 0.5);
  const lookCurve = new THREE.CatmullRomCurve3(def.path.map((p) => new THREE.Vector3(...p.l)), false, 'centripetal', 0.5);
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const right = new THREE.Vector3();
  const upv = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  let target = 0;
  let current = 0;
  let lastCurrent = 0;
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let running = true;
  let visible = true;
  let animId = 0;
  const t0 = performance.now();
  let lastT = t0;
  let slow = 0;
  let bob = 0;

  function applyQuality() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr));
    composer.setSize(window.innerWidth, window.innerHeight);
    bloom.enabled = quality.bloom;
    renderer.shadowMap.enabled = quality.shadows;
    ctx.lights.forEach(({ light }) => {
      if (light.castShadow && !quality.shadows) light.castShadow = false;
    });
    reflectors.forEach((r) => (r.visible = quality.reflections || !r.userData.optional));
    scene.traverse((o) => {
      if (o.material) {
        const arr = Array.isArray(o.material) ? o.material : [o.material];
        arr.forEach((m) => (m.needsUpdate = true));
      }
    });
  }
  applyQuality();

  function degrade() {
    if (quality.tier <= 0) return;
    quality.tier -= 1;
    quality.dpr = [1, 1.25, 1.75][quality.tier];
    if (quality.tier === 1) quality.reflections = true;
    if (quality.tier === 0) {
      quality.shadows = false;
      quality.reflections = false;
      quality.bloom = false;
    }
    applyQuality();
  }

  function frame() {
    animId = requestAnimationFrame(frame);
    if (!running || !visible) return;
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.1);
    lastT = now;
    const t = (now - t0) / 1000;

    // adaptive quality
    if (dt > 0.034) slow++;
    else slow = Math.max(0, slow - 2);
    if (slow > 80) {
      slow = 0;
      degrade();
    }

    current += (target - current) * (1 - Math.pow(0.0009, dt));
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(0.02, dt));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(0.02, dt));

    const k = clamp(current, 0, 1);
    posCurve.getPoint(k, pos);
    lookCurve.getPoint(k, look);

    const vel = Math.abs(current - lastCurrent) / Math.max(dt, 0.001);
    lastCurrent = current;
    bob += dt * (3 + vel * 140);
    const walk = def.bob === false ? 0 : clamp(vel * 60, 0, 1);

    camera.position.copy(pos);
    camera.position.y += Math.sin(bob * 2.1) * 0.014 * walk + Math.sin(t * 0.6) * 0.004;
    camera.position.x += Math.cos(bob) * 0.006 * walk;

    // look target with pointer parallax (in camera space)
    camera.lookAt(look);
    camera.updateMatrixWorld();
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    upv.setFromMatrixColumn(camera.matrixWorld, 1);
    const dist = pos.distanceTo(look);
    tmp.copy(look).addScaledVector(right, mouse.sx * dist * 0.1).addScaledVector(upv, -mouse.sy * dist * 0.055);
    camera.lookAt(tmp);

    // follow-camera meshes (sky domes)
    for (let i = 0; i < follow.length; i++) follow[i].position.copy(camera.position);

    // lights: range-fade + flicker
    for (let i = 0; i < ctx.lights.length; i++) {
      const L = ctx.lights[i];
      let f = 1;
      if (L.range) {
        const [a, bb] = L.range;
        const m = 0.07;
        f = clamp((k - (a - m)) / m, 0, 1) * clamp(((bb + m) - k) / m, 0, 1);
      }
      if (L.flicker) f *= 1 + Math.sin(t * 9.1 + i) * L.flicker * 0.5 + Math.sin(t * 15.3 + i * 2.3) * L.flicker * 0.5;
      L.light.intensity = L.base * f;
    }

    for (let i = 0; i < ticks.length; i++) ticks[i](t, dt);
    def.update && def.update(t, dt, k, ctx);
    for (let i = 0; i < ctx.updaters.length; i++) ctx.updaters[i](t, dt, k);

    grade.uniforms.time.value = t % 100;
    composer.render(dt);
    onFrame({ progress: k, camera });
  }
  frame();

  const tmpV = new THREE.Vector3();
  return {
    quality,
    setProgress(p) {
      target = clamp(p, 0, 1);
    },
    jump(p) {
      target = current = clamp(p, 0, 1);
    },
    setPointer(x, y) {
      mouse.x = x;
      mouse.y = y;
    },
    project(arr) {
      tmpV.set(arr[0], arr[1], arr[2]).project(camera);
      return {
        x: (tmpV.x * 0.5 + 0.5) * window.innerWidth,
        y: (-tmpV.y * 0.5 + 0.5) * window.innerHeight,
        visible: tmpV.z < 1 && tmpV.z > -1 && Math.abs(tmpV.x) < 1.15 && Math.abs(tmpV.y) < 1.15,
      };
    },
    setVisible(v) {
      visible = v;
    },
    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = (def.fov ?? 56) * (w < 800 ? 1.25 : 1);
      camera.updateProjectionMatrix();
    },
    dispose() {
      running = false;
      cancelAnimationFrame(animId);
      reflectors.forEach((r) => r.dispose && r.dispose());
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      disposables.forEach((d) => d.dispose && d.dispose());
      composer.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss && renderer.forceContextLoss();
    },
  };
}
