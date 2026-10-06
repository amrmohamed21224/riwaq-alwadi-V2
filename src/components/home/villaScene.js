import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { createMarbleTexture, createWoodTexture, createCanyonBackdrop } from './proceduralTextures';

/* ---------- Camera walkthrough path (scroll driven) ---------- */
export const WALKTHROUGH_PATH = [
  // [pos], [lookAt]
  // 0.00: High panoramic exterior aerial view (matches hero photo framing)
  [[0, 7.5, 38], [0, 2.5, 0]],
  // 0.15: Glide down toward the infinity pool & stepping stones
  [[0, 2.8, 25], [0, 2.0, 6]],
  // 0.28: Low glide on the terrace, approaching the grand pivot glass doors
  [[0, 1.85, 14], [0, 1.8, 0]],
  // 0.38: Step across the threshold into the Double-Height Great Hall
  [[0, 1.75, 5], [0, 1.7, -9]],
  // 0.48: Stand in the Great Hall, facing the monolithic marble fireplace
  [[1.2, 1.75, -2], [0, 1.6, -10]],
  // 0.58: Turn left into the Curated Architectural Gallery
  [[-5, 1.75, -4], [-14.5, 1.8, -9]],
  // 0.68: Walking alongside the gallery frames showcasing signature works
  [[-10.5, 1.75, -9.5], [-14.5, 1.8, -13]],
  // 0.78: Transition across the salon towards the private dining & hospitality wing
  [[-2, 1.75, -14], [8, 1.7, -15]],
  // 0.86: Approach the open glass corner heading toward the outdoor terrace
  [[6.5, 1.75, -9], [18, 1.8, -3]],
  // 0.93: Step out onto the cantilevered canyon cliff terrace & sunken fire lounge
  [[17, 2.2, -2], [23, 1.5, -2]],
  // 1.00: Ascend into the twilight sky for a cinematic aerial vista of the illuminated villa
  [[26, 12, 22], [0, 2, -5]],
];

export function createCameraRig() {
  const posCurve = new THREE.CatmullRomCurve3(
    WALKTHROUGH_PATH.map((p) => new THREE.Vector3(...p[0])),
    false,
    'catmullrom',
    0.35,
  );
  const lookCurve = new THREE.CatmullRomCurve3(
    WALKTHROUGH_PATH.map((p) => new THREE.Vector3(...p[1])),
    false,
    'catmullrom',
    0.35,
  );
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();

  return {
    at(t) {
      const k = Math.min(Math.max(t, 0), 1);
      posCurve.getPoint(k, pos);
      lookCurve.getPoint(k, look);
      return { position: pos, target: look };
    },
  };
}

export const HOTSPOTS = [
  {
    id: 'infinity_pool',
    tRange: [0.12, 0.32],
    worldPos: [0, 0.3, 19],
    tagAr: 'بركة إنفينيتي عاكسة',
    tagEn: 'Reflective Infinity Pool',
    descAr: 'مرآة مائية ممتدة تتلاشى في الأفق الجبلي مع أطراف نحاسية مذهبة',
    descEn: 'Suspended water mirror blending with the canyon horizon & brass edges',
  },
  {
    id: 'great_hall',
    tRange: [0.36, 0.54],
    worldPos: [0, 1.6, -9.6],
    tagAr: 'مدفأة رخام نيرو ماركينا',
    tagEn: 'Nero Marquina Hearth',
    descAr: 'جدار رخامي منحوت بلهب خطي مستمر وألواح خشب الجوز المعتق',
    descEn: 'Monolithic sculptural marble block with continuous linear flame',
  },
  {
    id: 'gallery',
    tRange: [0.55, 0.74],
    worldPos: [-14.4, 2.2, -9.5],
    tagAr: 'رواق المشاريع الملكية',
    tagEn: 'Signature Project Gallery',
    descAr: 'متحف خاص يعرض مسيرة التخطيط والإنشاء لأيقوناتنا المعمارية',
    descEn: 'Private curation presenting blueprints and executed landmark estates',
  },
  {
    id: 'dining',
    tRange: [0.73, 0.88],
    worldPos: [8, 1.4, -15],
    tagAr: 'جناح الضيافة والمائدة',
    tagEn: 'Private Hospitality Suite',
    descAr: 'مائدة خشب الجوز الطبيعي مع ثريات أنبوبية من النحاس الخالص',
    descEn: 'Solid smoked walnut dining slab with brushed tubular brass chandeliers',
  },
  {
    id: 'terrace',
    tRange: [0.89, 0.99],
    worldPos: [22.5, 1.1, -2],
    tagAr: 'شرفة الجرف وموقد النار',
    tagEn: 'Cliff Fire Lounge',
    descAr: 'جلسة غائرة محفورة في حافة الوادي لإطلالة مفتوحة على أضواء الرياض',
    descEn: 'Sunken seating around a bespoke stone hearth overlooking the valley',
  },
];

/* ---------- Scene Builder ---------- */
export function buildVilla(scene, projectTextures, renderer) {
  const disposables = [];
  const add = (o) => {
    scene.add(o);
    return o;
  };

  // Atmosphere & Fog (Deep midnight charcoal dusk)
  scene.fog = new THREE.FogExp2(0x0a0b10, 0.007);

  // Generate procedural architectural textures
  const marbleTex = createMarbleTexture();
  const woodTex = createWoodTexture();
  const canyonTex = createCanyonBackdrop();
  disposables.push(marbleTex, woodTex, canyonTex);

  // Materials
  const M = {
    marbleFloor: new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.18,
      metalness: 0.35,
      color: 0x1f2229,
    }),
    stoneTerrace: new THREE.MeshStandardMaterial({
      color: 0x22242a,
      roughness: 0.85,
      metalness: 0.1,
    }),
    darkWall: new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.92,
    }),
    limestoneWall: new THREE.MeshStandardMaterial({
      color: 0x2c2b29,
      roughness: 0.95,
    }),
    walnutWood: new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.45,
      metalness: 0.1,
      color: 0x5a3d28,
    }),
    darkWalnut: new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.4,
      metalness: 0.1,
      color: 0x2a1c12,
    }),
    brushedBrass: new THREE.MeshStandardMaterial({
      color: 0xc8a97e,
      roughness: 0.28,
      metalness: 0.88,
    }),
    fabricBoucle: new THREE.MeshStandardMaterial({
      color: 0x3d3935,
      roughness: 0.98,
    }),
    fabricDark: new THREE.MeshStandardMaterial({
      color: 0x181716,
      roughness: 0.98,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x8aa8be,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
    goldGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xf6d79e).multiplyScalar(1.8),
      toneMapped: false,
    }),
    coveWarm: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffb866).multiplyScalar(1.2),
      toneMapped: false,
    }),
    fireGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff6e1a).multiplyScalar(2.2),
      toneMapped: false,
    }),
  };
  Object.values(M).forEach((m) => disposables.push(m));

  const box = (w, h, d, x, y, z, mat, parent = scene) => {
    const g = new THREE.BoxGeometry(w, h, d);
    disposables.push(g);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  /* ---------- 1. Celestial Sky & Dusk Panorama ---------- */
  // Curved Panoramic Canyon Cyclorama
  const cycGeo = new THREE.CylinderGeometry(340, 340, 240, 48, 1, true);
  const cycMat = new THREE.MeshBasicMaterial({
    map: canyonTex,
    side: THREE.BackSide,
    fog: false,
    depthWrite: false,
  });
  disposables.push(cycGeo, cycMat);
  const cyclorama = new THREE.Mesh(cycGeo, cycMat);
  cyclorama.position.set(0, 70, 0);
  add(cyclorama);

  // Starfield
  const starPos = [];
  for (let i = 0; i < 750; i++) {
    const u = Math.random();
    const v = Math.random() * 0.75 + 0.25;
    const th = u * Math.PI * 2;
    const r = 320;
    const y = v * r;
    const rr = Math.sqrt(r * r - y * y);
    starPos.push(Math.cos(th) * rr, y, Math.sin(th) * rr);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.4,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.75,
    fog: false,
    depthWrite: false,
  });
  disposables.push(starGeo, starMat);
  add(new THREE.Points(starGeo, starMat));

  // Ground plane (Desert rocky bed)
  const groundGeo = new THREE.PlaneGeometry(700, 700);
  disposables.push(groundGeo);
  const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  add(ground);

  /* ---------- 2. Architectural Structure ---------- */
  // Main Ground Floor Slab (Polished Marquina Marble inside)
  box(32, 0.45, 28, 0, -0.22, -6, M.marbleFloor);

  // Front Entrance Terrace & Pool Court
  box(34, 0.4, 24, 0, -0.2, 20, M.stoneTerrace);

  // Side Canyon Overhang Terrace
  box(18, 0.4, 22, 22, -0.2, -2, M.stoneTerrace);

  // Reflective Infinity Pool
  const pool = new Reflector(new THREE.PlaneGeometry(16, 11), {
    textureWidth: Math.floor(window.innerWidth * 0.5),
    textureHeight: Math.floor(window.innerHeight * 0.5),
    color: 0x223545,
    clipBias: 0.003,
  });
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0.02, 19.5);
  add(pool);
  disposables.push(pool.geometry);

  // Pool perimeter coping with recessed gold glow channels
  box(16.8, 0.06, 0.4, 0, 0.03, 13.8, M.stoneTerrace);
  box(16.8, 0.06, 0.4, 0, 0.03, 25.2, M.stoneTerrace);
  box(0.4, 0.06, 11.8, -8.2, 0.03, 19.5, M.stoneTerrace);
  box(0.4, 0.06, 11.8, 8.2, 0.03, 19.5, M.stoneTerrace);
  // Gold waterlines
  box(16, 0.03, 0.04, 0, 0.07, 14.05, M.goldGlow);
  box(16, 0.03, 0.04, 0, 0.07, 24.95, M.goldGlow);

  // Stepping stones floating over water to front door
  for (let i = 0; i < 6; i++) {
    box(2.8, 0.08, 1.2, 0, 0.04, 13.5 - i * 1.35, M.marbleFloor);
  }

  // Monolithic Cantilevered Roofs
  box(36, 0.55, 36, 0, 4.25, -2, M.stoneTerrace); // Primary lower slab
  box(26, 0.5, 24, 2, 6.4, -9, M.stoneTerrace); // Secondary floating upper volume
  // Cove lighting under roof overhangs
  box(36.1, 0.04, 0.08, 0, 3.96, 15.9, M.coveWarm);
  box(0.08, 0.04, 36, -18, 3.96, -2, M.coveWarm);
  box(0.08, 0.04, 36, 18, 3.96, -2, M.coveWarm);

  // Outer Perimeter Walls
  box(32.4, 4, 0.4, 0, 2, -20, M.darkWall); // Rear wall
  box(0.4, 4, 28.4, -16, 2, -6, M.limestoneWall); // Left wall
  box(0.4, 4, 12, 16, 2, -14, M.limestoneWall); // Right rear wall
  box(0.4, 4, 8, 16, 2, 4, M.limestoneWall); // Right front wall

  // Panoramic Glass Facades (Front curtain wall)
  box(14, 3.9, 0.05, -8.5, 1.95, 8, M.glass);
  box(14, 3.9, 0.05, 8.5, 1.95, 8, M.glass);
  box(3, 0.9, 0.05, 0, 3.45, 8, M.glass); // Transom over door opening
  // Bronze Mullions
  for (let x = -15; x <= 15; x += 3) {
    if (Math.abs(x) < 1.6) continue;
    box(0.08, 4, 0.12, x, 2, 8, M.brushedBrass);
  }
  box(32, 0.08, 0.14, 0, 3.96, 8, M.brushedBrass);
  box(0.1, 4, 0.14, -1.5, 2, 8, M.brushedBrass);
  box(0.1, 4, 0.14, 1.5, 2, 8, M.brushedBrass);

  // Side glass pocket doors leading to outdoor terrace
  box(0.05, 3.9, 8.5, 15.95, 1.95, -2, M.glass);

  /* ---------- 3. Great Living Hall & Fireplace ---------- */
  // Fluted acoustic timber feature wall (rear)
  const slatGeo = new THREE.BoxGeometry(0.12, 3.8, 0.18);
  disposables.push(slatGeo);
  const slats = new THREE.InstancedMesh(slatGeo, M.darkWalnut, 80);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 80; i++) {
    dummy.position.set(-15 + i * 0.38, 1.95, -19.65);
    dummy.updateMatrix();
    slats.setMatrixAt(i, dummy.matrix);
  }
  add(slats);
  // Concealed cove LED strip behind slats
  box(30, 0.06, 0.06, 0, 3.85, -19.45, M.coveWarm);

  // Luxury Low-Profile Rug
  box(11, 0.02, 9, 1, 0.01, -6, new THREE.MeshStandardMaterial({ color: 0x1f1d1b, roughness: 1 }));

  // Monolithic Fireplace Feature Wall
  box(9, 3.6, 0.5, 0, 1.8, -10.2, M.limestoneWall);
  // Linear Flame Channel
  box(6.5, 0.25, 0.08, 0, 0.8, -9.92, M.fireGlow);
  box(7, 0.04, 0.22, 0, 1.05, -9.88, M.brushedBrass); // Brass mantel accent
  box(9.2, 0.04, 0.08, 0, 3.55, -9.92, M.goldGlow); // Top accent line
  // Cantilevered bench under fireplace
  box(7.5, 0.35, 0.6, 0, 0.18, -9.5, M.darkWalnut);

  // Designer Sectional Sofa (Italian Charcoal Fabric)
  const sofa = (x, z, ry, len) => {
    const g = new THREE.Group();
    box(len, 0.44, 1.3, 0, 0.28, 0, M.fabricBoucle, g); // Base seat
    box(len, 0.6, 0.35, 0, 0.72, -0.52, M.fabricBoucle, g); // Backrest
    box(0.35, 0.42, 1.3, -len / 2 + 0.18, 0.58, 0, M.fabricBoucle, g); // Left arm
    box(0.35, 0.42, 1.3, len / 2 - 0.18, 0.58, 0, M.fabricBoucle, g); // Right arm
    box(len, 0.08, 0.08, 0, 0.06, 0.55, M.brushedBrass, g); // Brass base plinth
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    add(g);
  };
  sofa(3.8, -6.8, 0, 5.4); // Main facing sofa
  sofa(6.2, -4.0, -Math.PI / 2, 3.8); // L-return chaise
  sofa(-2.6, -7.8, 0.35, 3.2); // Accent armchair set

  // Minimalist Brushed Brass Coffee Table
  box(2.4, 0.06, 1.3, 2.8, 0.42, -4.5, M.brushedBrass);
  box(2.2, 0.36, 1.1, 2.8, 0.18, -4.5, M.darkWalnut);

  /* ---------- 4. Signature Project Art Gallery (Left Wing) ---------- */
  box(0.15, 3.8, 22, -15.6, 1.95, -9.5, M.limestoneWall); // Gallery partition wall
  box(0.04, 3.6, 21.6, -15.48, 1.95, -9.5, M.coveWarm); // Wall illumination wash

  const frameGeo = new THREE.PlaneGeometry(1, 1);
  disposables.push(frameGeo);

  const addGalleryArtwork = (texture, zPos, width, height, title) => {
    // Brushed brass shadow frame
    box(0.12, height + 0.26, width + 0.26, -15.35, 1.95, zPos, M.brushedBrass);
    // Artwork canvas
    const artMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    disposables.push(artMat);
    const plane = new THREE.Mesh(frameGeo, artMat);
    plane.scale.set(width, height, 1);
    plane.rotation.y = Math.PI / 2;
    plane.position.set(-15.28, 1.95, zPos);
    add(plane);
    // Museum directional spotlight beam
    box(0.15, 0.04, width * 0.85, -15.15, 1.95 + height / 2 + 0.5, zPos, M.goldGlow);
    // Golden description plaque below frame
    box(0.04, 0.12, 0.7, -15.28, 1.95 - height / 2 - 0.25, zPos, M.brushedBrass);
  };

  const [tex1, tex2, tex3] = projectTextures;
  addGalleryArtwork(tex1, -3.2, 4.6, 2.8, 'قصر الوادي المعلق');
  addGalleryArtwork(tex2, -9.5, 4.6, 2.8, 'المخطط البارامتري الأيقوني');
  addGalleryArtwork(tex3, -15.8, 4.6, 2.8, 'البرج السكني المستدام');

  // Sculptural Plinths with Golden Architectural Maquettes
  for (const z of [-6.2, -12.8]) {
    box(0.9, 0.95, 0.9, -12.5, 0.47, z, M.stoneTerrace);
    box(0.94, 0.03, 0.94, -12.5, 0.96, z, M.brushedBrass);
    const sculpture = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), M.brushedBrass);
    sculpture.position.set(-12.5, 1.35, z);
    sculpture.rotation.set(0.4, 0.8, 0.2);
    disposables.push(sculpture.geometry);
    add(sculpture);
  }

  /* ---------- 5. Private Dining & Hospitality Suite (Right Wing) ---------- */
  // Solid Smoked Walnut Dining Table
  box(7.2, 0.12, 2.4, 8.8, 0.86, -15, M.walnutWood);
  box(6.8, 0.04, 0.06, 8.8, 0.94, -15, M.goldGlow); // Center brass runner
  for (const sx of [-3.2, 3.2]) {
    for (const sz of [-0.95, 0.95]) {
      box(0.1, 0.84, 0.1, 8.8 + sx, 0.42, -15 + sz, M.brushedBrass);
    }
  }
  // Dining chairs
  for (let i = 0; i < 4; i++) {
    for (const sz of [-1.6, 1.6]) {
      box(0.52, 0.06, 0.52, 7.2 + i * 1.15, 0.5, -15 + sz, M.fabricDark);
      box(0.52, 0.55, 0.06, 7.2 + i * 1.15, 0.8, -15 + sz + (sz > 0 ? 0.24 : -0.24), M.fabricDark);
      box(0.05, 0.5, 0.05, 7.2 + i * 1.15, 0.25, -15 + sz, M.brushedBrass);
    }
  }
  // Suspended Brass Tubular Chandeliers
  const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
  disposables.push(tubeGeo);
  for (let i = 0; i < 5; i++) {
    const tube = new THREE.Mesh(tubeGeo, M.brushedBrass);
    tube.position.set(7.0 + i * 0.9, 2.8, -15);
    add(tube);
    box(0.02, 1.2, 0.02, 7.0 + i * 0.9, 3.45, -15, M.brushedBrass); // Suspension cable
    box(0.08, 0.08, 0.08, 7.0 + i * 0.9, 2.15, -15, M.goldGlow); // Light emitter tip
  }

  /* ---------- 6. Suspended Cliff Terrace & Sunken Fire Lounge ---------- */
  // Circular Stone Fire Pit
  const fireBase = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 0.45, 24), M.stoneTerrace);
  fireBase.position.set(22.5, 0.22, -2);
  disposables.push(fireBase.geometry);
  add(fireBase);
  // Burning Fire Core
  const fireFlame = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 12), M.fireGlow);
  fireFlame.position.set(22.5, 0.95, -2);
  disposables.push(fireFlame.geometry);
  add(fireFlame);

  // Sunken Circular Curved Lounge Seating
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const bench = box(1.8, 0.42, 0.95, 22.5 + Math.cos(a) * 3.4, 0.21, -2 + Math.sin(a) * 3.4, M.fabricBoucle);
    bench.rotation.y = -a + Math.PI / 2;
  }
  // Low ambient terrace perimeter gold markers
  for (let i = 0; i < 6; i++) {
    box(0.08, 0.45, 0.08, 30.5, 0.22, -10 + i * 3.2, M.goldGlow);
  }

  /* ---------- 7. Architectural Lighting Setup ---------- */
  scene.add(new THREE.AmbientLight(0x454e68, 0.45));
  scene.add(new THREE.HemisphereLight(0x5a688d, 0x0c0e14, 0.4));

  // Moon light (subtle cool blue fill)
  const moon = new THREE.DirectionalLight(0x9cb0ff, 0.45);
  moon.position.set(-40, 50, 40);
  scene.add(moon);

  // Interior Architectural Point Lights
  const warmLights = [];
  const addWarmPoint = (x, y, z, color, intensity, distance) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.8);
    l.position.set(x, y, z);
    scene.add(l);
    warmLights.push(l);
    return l;
  };

  addWarmPoint(0, 3.2, 4, 0xffd29d, 28, 20); // Entrance portal
  addWarmPoint(2, 3.2, -6, 0xffc482, 32, 22); // Living hall center
  const fireLight = addWarmPoint(0, 1.2, -9.5, 0xff7e24, 20, 12); // Living fireplace
  addWarmPoint(-12, 3.2, -9, 0xffcf94, 30, 20); // Gallery lighting
  addWarmPoint(8.8, 3.0, -15, 0xffca86, 28, 18); // Dining suite
  const terraceFireLight = addWarmPoint(22.5, 1.8, -2, 0xff7e24, 22, 14); // Terrace fire pit
  addWarmPoint(0, 1.8, 19.5, 0x6ca3c2, 16, 20); // Pool water glow

  return {
    update(time) {
      // Gentle twinkle & organic flame flicker
      starMat.opacity = 0.65 + Math.sin(time * 0.9) * 0.12;
      fireFlame.scale.set(
        1 + Math.sin(time * 8.5) * 0.12,
        1 + Math.sin(time * 6.8) * 0.18,
        1 + Math.cos(time * 7.9) * 0.12,
      );
      fireLight.intensity = 18 + Math.sin(time * 10) * 3;
      terraceFireLight.intensity = 20 + Math.sin(time * 8.7) * 3.5;
    },
    dispose() {
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer && renderer.renderLists.dispose();
    },
  };
}
