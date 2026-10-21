import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { palmFrond, palmTrunk } from './textures';
import { createContactShadow } from './fx';

/**
 * Scene-building kit: world-scaled UVs (so any procedural texture tiles at
 * real-world meters), shadow-aware primitives, furniture & vegetation props.
 */
export function createKit(ctx) {
  const scene = ctx.scene;
  const disposables = ctx.disposables || [];
  if (!ctx.lights) ctx.lights = [];
  if (!ctx.quality) ctx.quality = { shadows: false };
  if (!ctx.registerFx) ctx.registerFx = () => {};
  const zones = [];
  const farMeshes = [];
  let host = scene;
  function zoneVisible(spec, k) {
    const ranges = Array.isArray(spec[0]) ? spec : [spec];
    for (let i = 0; i < ranges.length; i++) {
      const [a, b] = ranges[i];
      if (k >= a - 0.12 && k <= b + 0.12) return true;
    }
    return false;
  }
  function beginZone(range) {
    const g = new THREE.Group();
    g.userData.zone = range;
    scene.add(g);
    zones.push(g);
    host = g;
    return g;
  }
  function endZone() {
    host = scene;
  }
  const track = (o) => {
    disposables.push(o);
    return o;
  };

  /* ---------------- materials ---------------- */
  function mat(set, o = {}) {
    const {
      color = 0xffffff,
      metalness = 0,
      roughness = 1,
      clearcoat = 0,
      clearcoatRoughness = 0.08,
      normalScale = 1,
      envMapIntensity = 1,
      emissive,
      emissiveIntensity = 1,
      ...rest
    } = o;
    const p = {
      color,
      metalness,
      roughness,
      envMapIntensity,
      ...rest,
    };
    if (set) {
      p.map = set.map;
      p.normalMap = set.normalMap;
      p.roughnessMap = set.roughnessMap;
      p.normalScale = new THREE.Vector2(normalScale, normalScale);
    }
    if (emissive !== undefined) {
      p.emissive = new THREE.Color(emissive);
      p.emissiveIntensity = emissiveIntensity;
    }
    let m;
    if (clearcoat > 0) {
      m = new THREE.MeshPhysicalMaterial({ ...p, clearcoat, clearcoatRoughness });
    } else {
      m = new THREE.MeshStandardMaterial(p);
    }
    return track(m);
  }

  const glow = (color, intensity = 1.4, toneMapped = true) =>
    track(new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), toneMapped, fog: false }));

  const glass = (o = {}) =>
    track(
      new THREE.MeshPhysicalMaterial({
        color: o.color ?? 0xaecbd8,
        roughness: o.roughness ?? 0.03,
        metalness: 0,
        transparent: true,
        opacity: o.opacity ?? 0.16,
        envMapIntensity: o.env ?? 1.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );

  /* ---------------- geometry helpers (world scaled UVs) ---------------- */
  function scaleUV(g, su, sv = su, ou = 0, ov = 0) {
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su + ou, uv.getY(i) * sv + ov);
    uv.needsUpdate = true;
    return g;
  }

  function boxGeom(w, h, d, tile = 1, off = [0, 0]) {
    const g = new THREE.BoxGeometry(w, h, d);
    const uv = g.attributes.uv;
    const dims = [
      [d, h],
      [d, h],
      [w, d],
      [w, d],
      [w, h],
      [w, h],
    ];
    for (let f = 0; f < 6; f++) {
      for (let i = 0; i < 4; i++) {
        const idx = f * 4 + i;
        uv.setXY(idx, (uv.getX(idx) * dims[f][0]) / tile + off[0], (uv.getY(idx) * dims[f][1]) / tile + off[1]);
      }
    }
    return track(g);
  }

  function place(m, x, y, z, o = {}) {
    m.position.set(x, y, z);
    if (o.rot) m.rotation.set(...o.rot);
    if (o.ry) m.rotation.y = o.ry;
    m.castShadow = o.cast !== false;
    m.receiveShadow = o.receive !== false;
    (o.parent || host).add(m);
    return m;
  }

  const box = (w, h, d, x, y, z, m, o = {}) =>
    place(new THREE.Mesh(boxGeom(w, h, d, o.tile || 1, o.off || [Math.random(), Math.random()]), m), x, y, z, o);

  function rbox(w, h, d, r, x, y, z, m, o = {}) {
    const g = track(new RoundedBoxGeometry(w, h, d, o.seg || 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)));
    scaleUV(g, (o.tile ? 1 / o.tile : 1) * Math.max(w, d), (o.tile ? 1 / o.tile : 1) * Math.max(h, d));
    return place(new THREE.Mesh(g, m), x, y, z, o);
  }

  function cyl(rt, rb, h, x, y, z, m, o = {}) {
    const g = track(new THREE.CylinderGeometry(rt, rb, h, o.seg || 16, 1, !!o.open));
    const tile = o.tile || 1;
    scaleUV(g, (Math.PI * 2 * Math.max(rt, rb)) / tile, h / tile);
    return place(new THREE.Mesh(g, m), x, y, z, o);
  }

  function sphere(r, x, y, z, m, o = {}) {
    const g = track(new THREE.SphereGeometry(r, o.seg || 16, o.seg ? Math.max(8, o.seg / 2) : 12));
    return place(new THREE.Mesh(g, m), x, y, z, o);
  }

  function plane(w, d, x, y, z, m, o = {}) {
    const g = track(new THREE.PlaneGeometry(w, d));
    const tile = o.tile || 1;
    scaleUV(g, w / tile, d / tile, o.off?.[0] || 0, o.off?.[1] || 0);
    const mesh = place(new THREE.Mesh(g, m), x, y, z, { ...o, rot: o.rot || [-Math.PI / 2, 0, 0] });
    mesh.castShadow = false;
    return mesh;
  }

  function group(x = 0, y = 0, z = 0, parent, ry = 0) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = ry;
    (parent || host).add(g);
    return g;
  }

  function add(obj, x, y, z, parent) {
    if (!obj) return obj;
    if (x !== undefined && y !== undefined && z !== undefined) obj.position.set(x, y, z);
    const target = parent || host;
    if (obj.parent !== target) target.add(obj);
    ctx.registerFx(obj);
    return obj;
  }

  /* ---------------- lights ---------------- */
  function point(x, y, z, color, intensity, distance = 0, decay = 2, o = {}) {
    const l = new THREE.PointLight(color, intensity, distance, decay);
    l.position.set(x, y, z);
    (o.parent || scene).add(l);
    ctx.lights.push({ light: l, base: intensity, range: o.range, flicker: o.flicker });
    return l;
  }

  function spot(x, y, z, tx, ty, tz, color, intensity, angle = 0.6, penumbra = 0.6, distance = 0, decay = 2, o = {}) {
    const l = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    l.position.set(x, y, z);
    l.target.position.set(tx, ty, tz);
    scene.add(l);
    scene.add(l.target);
    ctx.lights.push({ light: l, base: intensity, range: o.range, flicker: o.flicker });
    return l;
  }

  function sun(x, y, z, color, intensity, o = {}) {
    const l = new THREE.DirectionalLight(color, intensity);
    l.position.set(x, y, z);
    l.target.position.set(o.tx || 0, o.ty || 0, o.tz || 0);
    scene.add(l);
    scene.add(l.target);
    ctx.lights.push({ light: l, base: intensity });
    if (o.shadow) {
      const s = o.size || 30;
      l.shadow.camera.left = -s;
      l.shadow.camera.right = s;
      l.shadow.camera.top = s;
      l.shadow.camera.bottom = -s;
      l.shadow.camera.near = o.near || 1;
      l.shadow.camera.far = o.far || 160;
      l.shadow.mapSize.set(1024, 1024);
      l.shadow.bias = -0.0005;
      l.shadow.normalBias = 0.04;
      l.shadow.radius = 2;
      l.castShadow = false;
      if (!ctx.shadowLight) ctx.shadowLight = l;
    }
    return l;
  }

  function rectLight(x, y, z, w, h, color, intensity, lookAt = [x, y - 1, z]) {
    const l = new THREE.RectAreaLight(color, intensity, w, h);
    l.position.set(x, y, z);
    l.lookAt(...lookAt);
    scene.add(l);
    ctx.lights.push({ light: l, base: intensity });
    return l;
  }

  /* ---------------- architectural parts ---------------- */
  /** Extruded wall with arched openings. openings: [{x, w, h}] (x center, h = spring+rise) */
  function archWall({ width, height, depth, openings, tile = 1, material, x = 0, y = 0, z = 0, ry = 0, segments = 28 }) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.lineTo(-width / 2, 0);
    openings.forEach((op) => {
      const hole = new THREE.Path();
      const r = op.w / 2;
      const spring = op.h - r;
      hole.moveTo(op.x - r, 0);
      hole.lineTo(op.x - r, spring);
      for (let i = 1; i < segments; i++) {
        const a = Math.PI - (i / segments) * Math.PI;
        hole.lineTo(op.x + Math.cos(a) * r, spring + Math.sin(a) * r);
      }
      hole.lineTo(op.x + r, spring);
      hole.lineTo(op.x + r, 0);
      hole.lineTo(op.x - r, 0);
      shape.holes.push(hole);
    });
    const g = track(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: segments }));
    g.translate(0, 0, -depth / 2);
    scaleUV(g, 1 / tile);
    return place(new THREE.Mesh(g, material), x, y, z, { ry });
  }

  /** Fluted column (shaft extruded from scalloped section) + base + capital */
  function flutedColumn({ r = 0.32, h = 4, x = 0, z = 0, y = 0, flutes = 20, shaft, trim, parent, capital = true }) {
    const g = group(x, y, z, parent);
    const shape = new THREE.Shape();
    const N = flutes * 6;
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2;
      const rr = r * (1 - 0.055 * Math.pow(0.5 + 0.5 * Math.cos(th * flutes), 0.6));
      const px = Math.cos(th) * rr;
      const py = Math.sin(th) * rr;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    const sg = track(new THREE.ExtrudeGeometry(shape, { depth: h - 0.7, bevelEnabled: false, curveSegments: 1, steps: 1 }));
    sg.rotateX(-Math.PI / 2);
    scaleUV(sg, 0.8);
    const shaftMesh = new THREE.Mesh(sg, shaft);
    shaftMesh.position.y = 0.3;
    shaftMesh.castShadow = shaftMesh.receiveShadow = true;
    g.add(shaftMesh);
    // base plinth
    box(r * 2.9, 0.16, r * 2.9, 0, 0.08, 0, trim, { parent: g });
    cyl(r * 1.22, r * 1.3, 0.12, 0, 0.22, 0, trim, { parent: g, seg: 32 });
    // capital
    if (capital) {
      cyl(r * 1.15, r * 1.0, 0.16, 0, h - 0.62, 0, trim, { parent: g, seg: 32 });
      cyl(r * 1.45, r * 1.15, 0.26, 0, h - 0.41, 0, trim, { parent: g, seg: 32 });
      box(r * 3.3, 0.14, r * 3.3, 0, h - 0.2, 0, trim, { parent: g });
      box(r * 3.7, 0.12, r * 3.7, 0, h - 0.07, 0, trim, { parent: g });
    }
    return g;
  }

  /* ---------------- furniture ---------------- */
  function cushionSofa({ x, z, ry = 0, len = 3, depth = 1.0, fabric, legs, seatH = 0.42, arms = true, modules = 3, parent }) {
    const g = group(x, 0, z, parent, ry);
    rbox(len, 0.18, depth, 0.05, 0, 0.21, 0, legs, { parent: g });
    rbox(len - 0.1, 0.1, depth - 0.1, 0.02, 0, 0.14, 0, fabric, { parent: g });
    const mw = (len - (arms ? 0.36 : 0)) / modules;
    for (let i = 0; i < modules; i++) {
      const cx = -len / 2 + (arms ? 0.18 : 0) + mw * (i + 0.5);
      rbox(mw - 0.02, 0.2, depth - 0.18, 0.08, cx, seatH - 0.05, 0.05, fabric, { parent: g });
      rbox(mw - 0.03, 0.46, 0.22, 0.09, cx, seatH + 0.28, -depth / 2 + 0.22, fabric, { parent: g, rot: [-0.14, 0, 0] });
    }
    rbox(len, 0.62, 0.18, 0.06, 0, seatH + 0.12, -depth / 2 + 0.07, fabric, { parent: g });
    if (arms) {
      rbox(0.2, 0.5, depth, 0.08, -len / 2 + 0.1, seatH + 0.03, 0, fabric, { parent: g });
      rbox(0.2, 0.5, depth, 0.08, len / 2 - 0.1, seatH + 0.03, 0, fabric, { parent: g });
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(0.025, 0.018, 0.12, sx * (len / 2 - 0.1), 0.06, sz * (depth / 2 - 0.1), legs, { parent: g, seg: 12 });
    return g;
  }

  function armchair({ x, z, ry = 0, fabric, legs, parent, scale = 1 }) {
    const g = group(x, 0, z, parent, ry);
    g.scale.setScalar(scale);
    rbox(0.78, 0.16, 0.76, 0.05, 0, 0.26, 0, legs, { parent: g });
    rbox(0.66, 0.18, 0.62, 0.08, 0, 0.42, 0.04, fabric, { parent: g });
    rbox(0.78, 0.5, 0.2, 0.09, 0, 0.7, -0.33, fabric, { parent: g, rot: [-0.18, 0, 0] });
    rbox(0.14, 0.34, 0.7, 0.06, -0.37, 0.5, 0, fabric, { parent: g });
    rbox(0.14, 0.34, 0.7, 0.06, 0.37, 0.5, 0, fabric, { parent: g });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(0.022, 0.015, 0.2, sx * 0.32, 0.1, sz * 0.3, legs, { parent: g, seg: 10 });
    return g;
  }

  function roundTable({ x, z, r = 0.55, h = 0.38, top, base, parent }) {
    const g = group(x, 0, z, parent);
    cyl(r, r, 0.035, 0, h, 0, top, { parent: g, seg: 48 });
    cyl(r * 0.5, r * 0.55, h - 0.04, 0, (h - 0.04) / 2, 0, base, { parent: g, seg: 40 });
    return g;
  }

  function diningChair({ x, z, ry = 0, fabric, frame, parent }) {
    const g = group(x, 0, z, parent, ry);
    rbox(0.46, 0.06, 0.46, 0.02, 0, 0.46, 0, fabric, { parent: g });
    rbox(0.46, 0.5, 0.05, 0.03, 0, 0.72, -0.21, fabric, { parent: g, rot: [-0.08, 0, 0] });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.03, 0.46, 0.03, sx * 0.2, 0.23, sz * 0.2, frame, { parent: g });
    return g;
  }

  function bookStack({ x, y, z, parent, colors = [0x8b3a2a, 0x2a3b4a, 0xd9c7a0, 0x1c1c1c], ry = 0 }) {
    const g = group(x, y, z, parent, ry);
    let h = 0;
    colors.forEach((c, i) => {
      const t = 0.025 + (i % 3) * 0.008;
      const m = mat(null, { color: c, roughness: 0.7 });
      rbox(0.26 - i * 0.015, t, 0.19, 0.003, (i % 2) * 0.01, h + t / 2, 0, m, { parent: g, ry: i * 0.18 });
      h += t;
    });
    return g;
  }

  function vase({ x, y, z, h = 0.3, r = 0.08, m, parent, branches = false }) {
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      pts.push(new THREE.Vector2(r * (0.35 + Math.sin(t * Math.PI * 0.9 + 0.2) * 0.65) * (t > 0.85 ? 0.6 : 1), t * h));
    }
    const g = track(new THREE.LatheGeometry(pts, 28));
    const v = place(new THREE.Mesh(g, m), x, y, z, { parent });
    if (branches) {
      const bm = mat(null, { color: 0x3a2a1a, roughness: 0.9 });
      const lm = mat(null, { color: 0x6a7a3a, roughness: 0.8 });
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const br = cyl(0.004, 0.006, 0.7, x + Math.cos(a) * 0.04, y + h + 0.3, z + Math.sin(a) * 0.04, bm, { parent, seg: 5 });
        br.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35);
        sphere(0.05, br.position.x + Math.cos(a) * 0.14, y + h + 0.62, br.position.z + Math.sin(a) * 0.14, lm, { parent, seg: 8 });
      }
    }
    return v;
  }

  function artFrame({ w, h, x, y, z, ry = 0, texture, color = 0x1a1a1a, frame, parent, emissive = 0, plaque = true }) {
    const g = group(x, y, z, parent, ry);
    // Shadow box backing panel
    box(w + 0.16, h + 0.16, 0.05, 0, 0, 0, frame, { parent: g });
    // Outer floating frame lips
    box(w + 0.16, 0.04, 0.08, 0, h / 2 + 0.06, 0.02, frame, { parent: g });
    box(w + 0.16, 0.04, 0.08, 0, -h / 2 - 0.06, 0.02, frame, { parent: g });
    box(0.04, h + 0.08, 0.08, -w / 2 - 0.06, 0, 0.02, frame, { parent: g });
    box(0.04, h + 0.08, 0.08, w / 2 + 0.06, 0, 0.02, frame, { parent: g });
    // Artwork canvas recessed inside shadow box
    const m = texture
      ? track(new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.45,
          metalness: 0.05,
          emissive: new THREE.Color(0xfff2dc),
          emissiveMap: texture,
          emissiveIntensity: emissive,
        }))
      : mat(null, { color, roughness: 0.6 });
    const p = new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), m);
    p.position.z = 0.028;
    g.add(p);
    // Museum identity brass plaque
    if (plaque) {
      box(Math.min(w * 0.4, 0.8), 0.1, 0.02, 0, -h / 2 - 0.22, 0.02, frame, { parent: g });
    }
    return g;
  }

  /** soft sheer curtain with folds */
  function curtain({ w, h, x, y, z, ry = 0, m, folds = 12, depth = 0.08, parent }) {
    const g = track(new THREE.PlaneGeometry(w, h, folds * 6, 1));
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) / w + 0.5;
      p.setZ(i, Math.sin(u * folds * Math.PI * 2) * depth);
    }
    g.computeVertexNormals();
    const mesh = place(new THREE.Mesh(g, m), x, y, z, { parent, ry });
    mesh.castShadow = false;
    return mesh;
  }

  /* ---------------- vegetation ---------------- */
  function palm({ x, z, h = 7, lean = 0.3, parent, seed = 1, scale = 1, trunkTex = true }) {
    const g = group(x, 0, z, parent, seed * 2.1);
    const dir = new THREE.Vector3(Math.cos(seed) * lean, 0, Math.sin(seed) * lean);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(dir.x * 0.3, h * 0.35, dir.z * 0.3),
      new THREE.Vector3(dir.x * 0.75, h * 0.7, dir.z * 0.75),
      new THREE.Vector3(dir.x * 1.3, h, dir.z * 1.3),
    ]);
    const tg = track(new THREE.TubeGeometry(curve, 24, 0.16 * scale, 10, false));
    scaleUV(tg, 1, 6);
    const tmat = mat(null, { color: 0xffffff, roughness: 0.95 });
    if (trunkTex) {
      tmat.map = palmTrunk();
      tmat.map.wrapS = tmat.map.wrapT = THREE.RepeatWrapping;
    }
    const trunk = new THREE.Mesh(tg, tmat);
    trunk.castShadow = true;
    g.add(trunk);
    const top = curve.getPoint(1);
    const fm = track(
      new THREE.MeshStandardMaterial({
        map: palmFrond(),
        alphaTest: 0.45,
        side: THREE.DoubleSide,
        roughness: 0.75,
        color: 0xb8d89a,
      }),
    );
    const geos = [];
    const n = 15;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + seed;
      const phi0 = 0.75 + (i % 3) * 0.32;
      const bend = 1.7 + (i % 4) * 0.45;
      const len = (3.0 + (i % 4) * 0.4) * scale;
      const pg = new THREE.PlaneGeometry(1.7 * scale, len, 1, 12);
      const pp = pg.attributes.position;
      for (let k = 0; k < pp.count; k++) {
        const t = (pp.getY(k) + len / 2) / len;
        pp.setZ(k, (len * (Math.sin(phi0) - Math.sin(phi0 - bend * t))) / bend);
        pp.setY(k, (len * (Math.cos(phi0 - bend * t) - Math.cos(phi0))) / bend);
      }
      pg.rotateY(a);
      pg.translate(top.x, top.y, top.z);
      geos.push(pg);
    }
    const mg = track(mergeGeometries(geos));
    const fronds = new THREE.Mesh(mg, fm);
    fronds.castShadow = true;
    g.add(fronds);
    return g;
  }

  function olive({ x, z, h = 2.4, parent, seed = 2, potMat }) {
    const g = group(x, 0, z, parent, seed);
    const pot = track(new THREE.CylinderGeometry(0.45, 0.34, 0.6, 28));
    place(new THREE.Mesh(pot, potMat), 0, 0.3, 0, { parent: g });
    const bark = mat(null, { color: 0x4d4033, roughness: 0.95 });
    const trunk = cyl(0.045, 0.07, h * 0.6, 0, 0.6 + h * 0.3, 0, bark, { parent: g, seg: 8 });
    trunk.rotation.z = 0.06;
    const lm = mat(null, { color: 0x7d8f5a, roughness: 0.65 });
    const ig = track(new THREE.IcosahedronGeometry(0.2, 0));
    const im = new THREE.InstancedMesh(ig, lm, 140);
    const d = new THREE.Object3D();
    for (let i = 0; i < 140; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = Math.random() * 0.75;
      d.position.set(Math.cos(a) * rr, 0.6 + h * 0.58 + Math.random() * h * 0.42, Math.sin(a) * rr);
      d.scale.set(0.9 + Math.random() * 0.6, 0.35 + Math.random() * 0.25, 0.9 + Math.random() * 0.6);
      d.rotation.set(Math.random(), Math.random() * 6, Math.random());
      d.updateMatrix();
      im.setMatrixAt(i, d.matrix);
    }
    im.castShadow = true;
    g.add(im);
    return g;
  }

  function agave({ x, z, s = 1, parent, seed = 1 }) {
    const g = group(x, 0, z, parent, seed);
    const m = mat(null, { color: 0x6f8c6a, roughness: 0.7 });
    const cg = track(new THREE.ConeGeometry(0.1, 1, 6));
    cg.translate(0, 0.5, 0);
    const im = new THREE.InstancedMesh(cg, m, 18);
    const d = new THREE.Object3D();
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const lean = 0.5 + (i % 3) * 0.3;
      d.position.set(0, 0, 0);
      d.rotation.set(0, a, 0);
      d.rotateZ(lean);
      d.scale.set(0.8, 0.55 + (i % 4) * 0.12, 0.4);
      d.scale.multiplyScalar(s);
      d.updateMatrix();
      im.setMatrixAt(i, d.matrix);
    }
    im.castShadow = true;
    g.add(im);
    return g;
  }

  function contactShadow(x, z, w, d, opacity = 0.5, y = 0.004, ry = 0) {
    const m = createContactShadow({ w, d, opacity });
    m.position.set(x, y, z);
    m.rotation.z = ry;
    host.add(m);
    return m;
  }

  function capLights() {
    const dirs = [];
    const locals = [];
    for (let i = 0; i < ctx.lights.length; i++) {
      const entry = ctx.lights[i];
      if (entry.light.isDirectionalLight) dirs.push(entry);
      else if (entry.light.isPointLight || entry.light.isSpotLight) locals.push(entry);
    }
    dirs.forEach((entry, i) => {
      entry.light.visible = i === 0;
      if (entry.light.target) entry.light.target.visible = i === 0;
    });
    locals.sort((a, b) => b.base - a.base);
    locals.forEach((entry, i) => {
      const on = i < 4;
      entry.light.visible = on;
      if (entry.light.target) entry.light.target.visible = on;
    });
  }

  const farProbe = new THREE.Vector3();
  function hasZone(obj) {
    let node = obj;
    while (node) {
      if (node.userData && node.userData.zone) return true;
      node = node.parent;
    }
    return false;
  }
  function collectFar(root) {
    root.traverse((obj) => {
      if (!obj.isMesh || obj.userData.followCamera || hasZone(obj)) return;
      obj.getWorldPosition(farProbe);
      if (Math.hypot(farProbe.x, farProbe.z) > 55) farMeshes.push(obj);
    });
  }
  function updateVisibility(k) {
    for (let i = 0; i < zones.length; i++) {
      zones[i].visible = zoneVisible(zones[i].userData.zone, k);
    }
    const farOn = k < 0.42 || k > 0.9;
    for (let i = 0; i < farMeshes.length; i++) farMeshes[i].visible = farOn;
  }

  return {
    mat,
    glow,
    glass,
    box,
    rbox,
    cyl,
    sphere,
    plane,
    group,
    add,
    point,
    spot,
    sun,
    rectLight,
    archWall,
    flutedColumn,
    cushionSofa,
    armchair,
    roundTable,
    diningChair,
    bookStack,
    vase,
    artFrame,
    curtain,
    palm,
    olive,
    agave,
    contactShadow,
    boxGeom,
    scaleUV,
    track,
    place,
    beginZone,
    endZone,
    capLights,
    collectFar,
    updateVisibility,
  };
}
