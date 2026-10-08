import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { radial } from './textures';

/* =========================================================================
   Planar reflection surfaces
   ========================================================================= */
const REFL_VERT = /* glsl */ `
uniform mat4 textureMatrix;
varying vec4 vUv;
varying vec3 vWorld;
void main() {
  vUv = textureMatrix * vec4(position, 1.0);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const WATER_FRAG = /* glsl */ `
uniform vec3 color;
uniform sampler2D tDiffuse;
uniform float time;
uniform float ripple;
uniform float reflectivity;
uniform vec3 deep;
uniform float blur;
varying vec4 vUv;
varying vec3 vWorld;
void main() {
  vec2 w = vWorld.xz;
  float t = time;
  vec2 d = vec2(
    sin(w.x * 3.1 + t * 0.9) + sin(w.y * 2.3 - t * 0.7) + 0.5 * sin((w.x + w.y) * 5.0 + t * 1.3),
    cos(w.y * 3.3 + t * 0.8) + cos(w.x * 2.1 - t * 0.6) + 0.5 * cos((w.x - w.y) * 4.2 - t * 1.1));
  vec4 uv = vUv;
  uv.xy += d * ripple * uv.w;
  vec4 refl = texture2DProj(tDiffuse, uv);
  if (blur > 0.0) {
    refl += texture2DProj(tDiffuse, uv + vec4(blur, 0.0, 0.0, 0.0) * uv.w);
    refl += texture2DProj(tDiffuse, uv - vec4(blur, 0.0, 0.0, 0.0) * uv.w);
    refl += texture2DProj(tDiffuse, uv + vec4(0.0, blur, 0.0, 0.0) * uv.w);
    refl += texture2DProj(tDiffuse, uv - vec4(0.0, blur, 0.0, 0.0) * uv.w);
    refl /= 5.0;
  }
  vec3 V = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 4.0);
  float f = clamp(mix(reflectivity, 1.0, fres), 0.0, 1.0);
  vec3 col = mix(deep, refl.rgb * color, f);
  gl_FragColor = vec4(col, 1.0);
}`;

const MIRROR_FRAG = /* glsl */ `
uniform vec3 color;
uniform sampler2D tDiffuse;
uniform float strength;
uniform float blur;
varying vec4 vUv;
varying vec3 vWorld;
void main() {
  vec4 uv = vUv;
  vec4 refl = texture2DProj(tDiffuse, uv);
  refl += texture2DProj(tDiffuse, uv + vec4(blur, 0.0, 0.0, 0.0) * uv.w);
  refl += texture2DProj(tDiffuse, uv - vec4(blur, 0.0, 0.0, 0.0) * uv.w);
  refl += texture2DProj(tDiffuse, uv + vec4(0.0, blur, 0.0, 0.0) * uv.w);
  refl += texture2DProj(tDiffuse, uv - vec4(0.0, blur, 0.0, 0.0) * uv.w);
  refl /= 5.0;
  vec3 V = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 3.0);
  float a = clamp(mix(strength, 1.0, fres * 0.6), 0.0, 1.0);
  gl_FragColor = vec4(refl.rgb * color, a);
}`;

export function createWater({
  w = 10,
  d = 10,
  shape = null,
  color = 0xffffff,
  deep = 0x03131a,
  reflectivity = 0.62,
  ripple = 0.004,
  res = 0.5,
  blur = 0.0008,
  geometry = null,
} = {}) {
  const geo = geometry || shape || new THREE.PlaneGeometry(w, d);
  const refl = new Reflector(geo, {
    textureWidth: Math.floor(window.innerWidth * res),
    textureHeight: Math.floor(window.innerHeight * res),
    clipBias: 0.002,
    multisample: 2,
    shader: {
      name: 'WaterShader',
      uniforms: {
        color: { value: null },
        tDiffuse: { value: null },
        textureMatrix: { value: null },
        time: { value: 0 },
        ripple: { value: ripple },
        reflectivity: { value: reflectivity },
        deep: { value: new THREE.Color(deep) },
        blur: { value: blur },
      },
      vertexShader: REFL_VERT,
      fragmentShader: WATER_FRAG,
    },
  });
  refl.rotation.x = -Math.PI / 2;
  refl.material.uniforms.color.value = new THREE.Color(color);
  refl.userData.isReflector = true;
  refl.userData.tick = (t) => {
    refl.material.uniforms.time.value = t;
  };
  return refl;
}

/** Translucent mirror laid on top of a polished floor */
export function createMirrorFloor({
  w = 10,
  d = 10,
  geometry = null,
  strength = 0.3,
  tint = 0xffffff,
  res = 0.5,
  blur = 0.0016,
} = {}) {
  const geo = geometry || new THREE.PlaneGeometry(w, d);
  const refl = new Reflector(geo, {
    textureWidth: Math.floor(window.innerWidth * res),
    textureHeight: Math.floor(window.innerHeight * res),
    clipBias: 0.002,
    multisample: 0,
    shader: {
      name: 'MirrorFloorShader',
      uniforms: {
        color: { value: null },
        tDiffuse: { value: null },
        textureMatrix: { value: null },
        strength: { value: strength },
        blur: { value: blur },
      },
      vertexShader: REFL_VERT,
      fragmentShader: MIRROR_FRAG,
    },
  });
  refl.rotation.x = -Math.PI / 2;
  refl.material.uniforms.color.value = new THREE.Color(tint);
  refl.material.transparent = true;
  refl.material.depthWrite = false;
  refl.material.polygonOffset = true;
  refl.material.polygonOffsetFactor = -2;
  refl.renderOrder = 2;
  refl.userData.isReflector = true;
  return refl;
}

/* =========================================================================
   Procedural sky dome (gradient + sun glow + stars + milky way + moon)
   ========================================================================= */
export function createSkyDome({
  top = 0x050a1c,
  mid = 0x16224a,
  horizon = 0x7a4a52,
  sunDir = [0.6, 0.05, -0.8],
  sunColor = 0xff8a4a,
  sunPow = 90,
  moonDir = [-0.5, 0.55, -0.65],
  stars = 1,
  milky = 1,
} = {}) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      cTop: { value: new THREE.Color(top) },
      cMid: { value: new THREE.Color(mid) },
      cHor: { value: new THREE.Color(horizon) },
      sunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      sunCol: { value: new THREE.Color(sunColor) },
      sunPow: { value: sunPow },
      moonDir: { value: new THREE.Vector3(...moonDir).normalize() },
      stars: { value: stars },
      milky: { value: milky },
      time: { value: 0 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 cTop, cMid, cHor, sunDir, sunCol, moonDir;
      uniform float sunPow, stars, milky, time;
      varying vec3 vDir;
      float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
      float noise(vec3 p){
        vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x), mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x), f.y),
                   mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x), mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x), f.y), f.z);
      }
      void main(){
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 col = mix(cHor, cMid, smoothstep(0.0, 0.22, h));
        col = mix(col, cTop, smoothstep(0.12, 0.85, h));
        col = mix(col, cHor * 0.35, smoothstep(0.0, -0.25, h));
        float s = max(dot(d, sunDir), 0.0);
        col += sunCol * (pow(s, sunPow) * 0.85 + pow(s, 9.0) * 0.28);
        if (stars > 0.0) {
          vec3 sd = d * 240.0; vec3 id = floor(sd); vec3 f = fract(sd) - 0.5;
          float r = hash(id);
          float st = step(0.9962, r) * smoothstep(0.38, 0.0, length(f));
          float tw = 0.65 + 0.35 * sin(time * 2.0 + r * 60.0);
          col += vec3(0.9, 0.94, 1.0) * st * stars * tw * smoothstep(0.02, 0.35, h) * 1.4;
          vec3 sd2 = d * 90.0; vec3 id2 = floor(sd2); vec3 f2 = fract(sd2) - 0.5;
          float r2 = hash(id2 + 7.0);
          col += vec3(1.0, 0.9, 0.8) * step(0.9975, r2) * smoothstep(0.3, 0.0, length(f2)) * stars * smoothstep(0.05, 0.4, h);
        }
        if (milky > 0.0) {
          float band = abs(dot(d, normalize(vec3(0.38, 0.22, 0.9))));
          float cloud = noise(d * 7.0) * 0.6 + noise(d * 19.0) * 0.4;
          float mw = smoothstep(0.34, 0.0, band) * (0.35 + cloud);
          float dark = smoothstep(0.55, 0.75, noise(d * 13.0 + 4.0));
          col += vec3(0.45, 0.52, 0.85) * mw * 0.38 * milky * (1.0 - dark * 0.7) * smoothstep(0.02, 0.35, h);
        }
        float m = dot(d, moonDir);
        col += vec3(1.0, 0.97, 0.9) * smoothstep(0.99935, 0.99965, m) * 2.4;
        col += vec3(0.45, 0.55, 0.9) * pow(max(m, 0.0), 160.0) * 0.4;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 32), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  mesh.userData.followCamera = true;
  mesh.userData.tick = (t) => {
    mat.uniforms.time.value = t;
  };
  return mesh;
}

/* =========================================================================
   Volumetric light shaft (cone of dust-lit air)
   ========================================================================= */
export function createLightShaft({
  radiusTop = 0.6,
  radiusBottom = 1.6,
  height = 6,
  color = 0xffd9a0,
  intensity = 0.55,
  fadeBottom = 0.0,
} = {}) {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 48, 1, true);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    fog: false,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uInt: { value: intensity },
      uFadeB: { value: fadeBottom },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vV = -mv.xyz; vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uInt, uFadeB, time;
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      void main(){
        float ndv = abs(dot(normalize(vN), normalize(vV)));
        float edge = pow(ndv, 1.6);
        float along = mix(1.0, uFadeB, smoothstep(1.0, 0.0, vUv.y));
        float top = smoothstep(0.0, 0.12, 1.0 - vUv.y) ;
        float flick = 0.92 + 0.08 * sin(time * 0.7 + vUv.x * 6.2832 * 3.0);
        float a = edge * along * uInt * flick * (0.35 + 0.65 * vUv.y);
        gl_FragColor = vec4(uColor * a, a);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 5;
  mesh.userData.tick = (t) => {
    mat.uniforms.time.value = t;
  };
  return mesh;
}

/* =========================================================================
   Animated flame (fireplace strip / fire pit)
   ========================================================================= */
export function createFlame({
  width = 3,
  height = 0.5,
  planes = 1,
  freq = 5,
  c1 = 0xff5a10,
  c2 = 0xffd070,
  power = 2.2,
  linear = false,
  frontOnly = false,
} = {}) {
  const group = new THREE.Group();
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: frontOnly ? THREE.FrontSide : THREE.DoubleSide,
    fog: false,
    uniforms: {
      time: { value: 0 },
      c1: { value: new THREE.Color(c1) },
      c2: { value: new THREE.Color(c2) },
      freq: { value: freq * width },
      power: { value: power },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 c1, c2; uniform float time, freq, power;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      void main(){
        vec2 p = vUv;
        float n = noise(vec2(p.x * freq, p.y * 3.0 - time * 2.6)) * 0.6 + noise(vec2(p.x * freq * 2.3 + 7.0, p.y * 6.0 - time * 4.6)) * 0.4;
        float tongue = 0.55 + 0.45 * sin(p.x * freq * 3.14 + time * 3.0 + n * 4.0);
        float a = n * 0.9 + 0.55 * tongue - p.y * 1.35;
        float flame = smoothstep(0.0, 0.5, a);
        flame *= smoothstep(0.0, 0.08, p.x) * smoothstep(1.0, 0.92, p.x);
        flame *= smoothstep(0.0, 0.05, p.y);
        vec3 col = mix(c1, c2, smoothstep(0.25, 1.0, a));
        col += vec3(0.1, 0.2, 0.9) * smoothstep(0.12, 0.0, p.y) * 0.4;
        gl_FragColor = vec4(col * flame * power, flame);
      }`,
  });
  for (let i = 0; i < planes; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    m.position.y = height / 2;
    if (linear) {
      // Parallel sheets stacked along Z (strictly parallel to wall, 0 rotation)
      m.position.z = (i - (planes - 1) / 2) * 0.025;
      m.rotation.y = 0;
    } else {
      m.rotation.y = (i / planes) * Math.PI;
    }
    m.renderOrder = 2;
    group.add(m);
  }
  group.userData.tick = (t) => {
    mat.uniforms.time.value = t;
  };
  return group;
}

/* =========================================================================
   Particles: dust motes / steam
   ========================================================================= */
export function createParticles({
  count = 200,
  box = [4, 4, 4],
  center = [0, 2, 0],
  size = 0.05,
  color = 0xfff0d0,
  opacity = 0.6,
  additive = true,
  drift = 0.05,
  rise = 0.02,
  texture = null,
} = {}) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = center[0] + (Math.random() - 0.5) * box[0];
    pos[i * 3 + 1] = center[1] + (Math.random() - 0.5) * box[1];
    pos[i * 3 + 2] = center[2] + (Math.random() - 0.5) * box[2];
    seed[i * 3] = Math.random() * 6.28;
    seed[i * 3 + 1] = Math.random() * 6.28;
    seed[i * 3 + 2] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tex = texture || radial({ inner: 'rgba(255,255,255,1)', outer: 'rgba(255,255,255,0)', size: 64, power: 1.2 });
  const mat = new THREE.PointsMaterial({
    size,
    map: tex,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    sizeAttenuation: true,
    fog: false,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const base = pos.slice();
  pts.userData.tick = (t) => {
    const a = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const sx = seed[i * 3];
      const sy = seed[i * 3 + 1];
      const sp = seed[i * 3 + 2];
      let y = base[i * 3 + 1] + ((t * rise * (0.4 + sp)) % box[1]);
      if (y > center[1] + box[1] / 2) y -= box[1];
      a[i * 3] = base[i * 3] + Math.sin(t * 0.3 + sx) * drift * (0.5 + sp);
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.27 + sy) * drift * (0.5 + sp);
    }
    geo.attributes.position.needsUpdate = true;
  };
  return pts;
}

/* =========================================================================
   Light-pool decals & halos (fake bounce light / soft contact shadow)
   ========================================================================= */
export function createLightPool({ radius = 2, color = 0xffc880, opacity = 0.35, w, d } = {}) {
  const tex = radial({ inner: 'rgba(255,255,255,1)', outer: 'rgba(255,255,255,0)', size: 256, power: 1.4 });
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w || radius * 2, d || radius * 2), mat);
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 3;
  return m;
}

export function createContactShadow({ w = 2, d = 2, opacity = 0.5 } = {}) {
  const tex = radial({ inner: 'rgba(0,0,0,1)', outer: 'rgba(0,0,0,0)', size: 128, power: 0.8 });
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    fog: false,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 1;
  return m;
}

export function createHalo({ size = 1.5, color = 0xffcc88, opacity = 0.6 } = {}) {
  const tex = radial({ inner: 'rgba(255,255,255,1)', outer: 'rgba(255,255,255,0)', size: 128, power: 2 });
  const mat = new THREE.SpriteMaterial({
    map: tex,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(size, size, 1);
  s.renderOrder = 7;
  return s;
}
