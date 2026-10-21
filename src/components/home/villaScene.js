import * as THREE from 'three';
import { createKit } from '../../walkthrough/kit';
import * as tex from '../../walkthrough/textures';
import { createSkyDome, createWater, createFlame, createParticles } from '../../walkthrough/fx';

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
    descAr: 'مرآة مائية ممتدة تتلاشى في الأفق الجبلي مع أطراف حجرية داكنة وأحجار عبور طافية',
    descEn: 'Suspended water mirror blending with the canyon horizon & floating travertine stones',
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
    descAr: 'متحف خاص يعرض مسيرة التخطيط والإنشاء لأيقوناتنا المعمارية بإضاءة متحفية دقيقة',
    descEn: 'Private curation presenting blueprints and executed landmark estates under museum spots',
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
export function buildVilla(scene, projectTextures, renderer, quality = { shadows: false, tier: 0, reflections: false }) {
  const disposables = [];
  const kitCtx = { scene, disposables, quality };
  const kit = createKit(kitCtx);
  const add = (o) => {
    disposables.push(o);
    return kit.add(o);
  };

  // 1. Procedural PBR Physical Materials
  const marbleTex = tex.marble({ base: 0x0f1115, vein: 0xd6b478, sharp: 14, scale: 3.5, polish: 0.12, tilesX: 2, tilesY: 2 });
  const concTex = tex.concrete({ base: 0xc8c3b8, panelsX: 4, panelsY: 2, seed: 15 });
  const travTex = tex.travertine({ base: 0xd8caa8, bands: 36, tilesX: 3, tilesY: 2, polish: 0.35, seed: 14 });
  const woodTex = tex.wood({ planks: 7, base: 0x4a3222, dark: 0x22140c, seed: 8, rough: 0.42 });
  const stoneTex = tex.stoneBlocks({ rows: 5, cols: 3, base: 0xc8b594, mortar: 0x8a7758, seed: 6 });
  const basaltTex = tex.stoneBlocks({ rows: 8, cols: 4, base: 0x181a20, mortar: 0x101115, groove: 0.002, rough: 0.75, seed: 4 });
  const fabricTex = tex.fabric({ base: 0xdfd8ca, fiber: 90, seed: 2 });
  const darkFabTex = tex.fabric({ base: 0x161616, fiber: 100, seed: 5 });

  const mFloor = kit.mat(marbleTex, { roughness: 0.16, metalness: 0.35, clearcoat: 0.45, clearcoatRoughness: 0.08 });
  const mTravertine = kit.mat(travTex, { roughness: 0.55, metalness: 0.04 });
  const mConc = kit.mat(concTex, { roughness: 0.82, metalness: 0.05 });
  const mStone = kit.mat(stoneTex, { roughness: 0.94 });
  const mBasalt = kit.mat(basaltTex, { roughness: 0.65, metalness: 0.1 });
  const mTerrace = kit.mat(stoneTex, { roughness: 0.88, color: 0x6e6659 });
  const mWood = kit.mat(woodTex, { roughness: 0.38, metalness: 0.08 });
  const mBrass = kit.mat(null, { color: 0xc4a474, metalness: 0.88, roughness: 0.28 });
  const mDarkBronze = kit.mat(null, { color: 0x26221d, metalness: 0.85, roughness: 0.32 });
  const mGlass = kit.glass({ opacity: 0.18, roughness: 0.02, color: 0xb5d0e0 });
  const mFabBoucle = kit.mat(fabricTex, { roughness: 0.98 });
  const mDarkFab = kit.mat(darkFabTex, { roughness: 0.98 });

  // Warm architectural cove glow (Tone-mapped for soft natural bloom)
  const mWarmCove = kit.glow(0xff9e48, 1.4, true);
  const mStepGlow = kit.glow(0xffba6a, 1.1, true);

  // 2. Celestial Sky & Twilight Dusk Environment
  const sky = createSkyDome({
    top: 0x071126,
    mid: 0x15213d,
    horizon: 0x6a372c,
    sunDir: [0.65, 0.05, -0.75],
    sunColor: 0xff7e38,
    sunPow: 85,
    moonDir: [-0.45, 0.55, 0.7],
    stars: 1.2,
    milky: 1.0,
  });
  add(sky);

  // Cool twilight moonlight casting soft architectural shadows
  const moonLight = kit.sun(-35, 55, 30, 0x9eb8ff, 0.8, { shadow: true, size: 45, shadowMap: 1024 });

  // 3. Desert Ground & Surrounding Wadi Hanifa Canyon Cliffs
  kit.plane(800, 800, 0, -0.6, 0, kit.mat(null, { color: 0x0a0c10, roughness: 1 }));

  // Natural stepped limestone cliff formations flanking the entrance
  kit.beginZone([[0, 0.38], [0.88, 1]]);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 1.4 - 0.7;
    const r = 85 + (i % 3) * 20;
    kit.box(38, 28 + (i % 4) * 10, 36, Math.cos(a) * r, 8, Math.sin(a) * r, mStone, {
      rot: [0, a + 0.4, 0],
      tile: 3,
    });
  }
  kit.endZone();

  // Natural boulders framing the arrival approach with warm landscape uplights
  for (let i = 0; i < 6; i++) {
    const sign = i % 2 === 0 ? -1 : 1;
    const bx = sign * (14 + (i * 2.2));
    const bz = 22 + i * 2.5;
    const rock = kit.rbox(3.2 + (i % 3) * 0.8, 1.8 + (i % 2) * 0.9, 2.8, 0.4, bx, 0.6, bz, mStone, {
      rot: [0.1, i * 0.8, 0.05],
      tile: 1.5,
    });
    // Discreet warm landscape rock wash light
    if (i < 4) {
      kit.point(bx + sign * 1.2, 0.8, bz, 0xffbe72, 8, 8, 1.8);
    }
  }

  // 4. Main Architectural Volumes & Slabs
  // Interior Ground floor slab (Italian Nero Marquina marble)
  kit.box(34, 0.5, 30, 0, -0.25, -6, mFloor, { tile: 2 });
  // Front entrance terrace & Pool court
  kit.box(36, 0.4, 26, 0, -0.2, 21, mTerrace, { tile: 2 });
  // Cantilevered side cliff terrace
  kit.box(22, 0.45, 24, 22, -0.22, -2, mTerrace, { tile: 2 });

  // Cantilevered floating roofs (Massive off-form board-marked concrete slabs)
  kit.box(38, 0.6, 38, 0, 4.3, -2, mConc, { tile: 2 });
  kit.box(28, 0.55, 26, 2, 6.6, -9, mConc, { tile: 2 });

  // Recessed downward ceiling cove channels (Facing DOWNWARD onto the facade, no camera glare)
  // Concealed inside a 20cm ceiling pocket behind the fascia lip
  kit.box(34, 0.04, 0.08, 0, 3.96, 8.8, mWarmCove);
  kit.box(0.08, 0.04, 28, -16.5, 3.96, -6, mWarmCove);
  kit.box(0.08, 0.04, 28, 16.5, 3.96, -6, mWarmCove);

  // Ceiling soffit acoustic dark walnut panels
  kit.box(33.8, 0.04, 29.8, 0, 3.98, -6, mWood, { tile: 2 });

  // Monolithic perimeter walls
  kit.box(34.2, 4.2, 0.5, 0, 2.1, -20.5, mConc, { tile: 2 }); // Rear wall
  kit.box(0.5, 4.2, 30.5, -17, 2.1, -6, mStone, { tile: 2 });  // Left limestone cliff wall
  kit.box(0.5, 4.2, 14, 17, 2.1, -14, mStone, { tile: 2 });    // Right rear wall
  kit.box(0.5, 4.2, 9, 17, 2.1, 4.5, mStone, { tile: 2 });     // Right front wall

  // 5. Monumental Structural Glazing & Pivot Entrance Door
  // Ultra-slim dark bronze mullions (Sky-Frame style sightlines)
  kit.box(15, 4.0, 0.06, -9, 2.0, 8.5, mGlass);
  kit.box(15, 4.0, 0.06, 9, 2.0, 8.5, mGlass);
  kit.box(3.2, 0.9, 0.06, 0, 3.55, 8.5, mGlass); // Door transom

  for (let x = -16; x <= 16; x += 3.2) {
    if (Math.abs(x) < 1.8) continue;
    kit.box(0.06, 4.1, 0.14, x, 2.05, 8.5, mDarkBronze);
  }
  kit.box(34, 0.06, 0.16, 0, 4.05, 8.5, mDarkBronze);
  kit.box(0.08, 4.1, 0.16, -1.7, 2.05, 8.5, mDarkBronze);
  kit.box(0.08, 4.1, 0.16, 1.7, 2.05, 8.5, mDarkBronze);

  // Grand 3.8m Tall Pivot Entrance Door (Swung slightly ajar 15° to invite the visitor inside)
  const doorPivot = kit.group(1.6, 0, 8.5, scene, -0.26);
  kit.box(3.2, 3.9, 0.08, -1.55, 2.0, 0, mGlass, { parent: doorPivot });
  kit.box(3.24, 0.08, 0.12, -1.55, 3.96, 0, mBrass, { parent: doorPivot });
  kit.box(3.24, 0.08, 0.12, -1.55, 0.04, 0, mBrass, { parent: doorPivot });
  kit.box(0.08, 4.0, 0.12, -0.04, 2.0, 0, mBrass, { parent: doorPivot });
  kit.box(0.08, 4.0, 0.12, -3.16, 2.0, 0, mBrass, { parent: doorPivot });
  // Sculptural 2.6m tall cylindrical brushed bronze vertical pull handle
  kit.cyl(0.03, 0.03, 2.6, -2.9, 1.85, 0.08, mBrass, { parent: doorPivot, seg: 16 });
  kit.cyl(0.03, 0.03, 2.6, -2.9, 1.85, -0.08, mBrass, { parent: doorPivot, seg: 16 });

  kit.beginZone([0, 0.55]);
  // 6. Suspended Infinity Reflecting Pool & Water Court
  // Pool Basin (sunken -0.45m with dark basalt stone)
  kit.box(18.4, 0.5, 13.4, 0, -0.25, 20.5, mBasalt, { tile: 2 });

  // Physical Water Reflector with multi-frequency ripples and Fresnel reflections
  const pool = createWater({
    w: 18,
    d: 13,
    color: 0x3892be,
    deep: 0x02121e,
    reflectivity: 0.78,
    ripple: 0.0035,
    res: 0.5,
  });
  pool.position.set(0, 0.02, 20.5);
  add(pool);

  // Dark flamed basalt coping border with recessed infinity weir drop (NO harsh neon lines!)
  kit.box(18.6, 0.08, 0.45, 0, 0.04, 13.8, mBasalt);
  kit.box(18.6, 0.08, 0.45, 0, 0.04, 27.2, mBasalt);
  kit.box(0.45, 0.08, 13.8, -9.2, 0.04, 20.5, mBasalt);
  kit.box(0.45, 0.08, 13.8, 9.2, 0.04, 20.5, mBasalt);

  // Submerged fiber-optic pool lights casting subtle deep teal luminescence
  for (const pz of [16.5, 20.5, 24.5]) {
    kit.point(-5, -0.15, pz, 0x3aa0c8, 3.5, 6, 2);
    kit.point(5, -0.15, pz, 0x3aa0c8, 3.5, 6, 2);
  }

  // 7. Monolithic Floating Roman Travertine Stepping Stones
  // 7 monumental slabs crossing the pool to the glass entrance
  for (let i = 0; i < 7; i++) {
    const sz = 14.8 - i * 1.45;
    // Recessed dark plinth underneath (creates true cantilevered floating reveal)
    kit.box(2.8, 0.06, 0.9, 0, 0.03, sz, mBasalt);
    // Upper Roman Travertine slab
    kit.rbox(3.4, 0.12, 1.35, 0.03, 0, 0.09, sz, mTravertine, { tile: 1 });
    // Concealed architectural LED glow tucked strictly under the stone overhang
    // Facing downward onto the water, never pointing directly at the camera
    kit.box(2.8, 0.015, 0.02, 0, 0.04, sz - 0.55, mStepGlow);
    kit.box(2.8, 0.015, 0.02, 0, 0.04, sz + 0.55, mStepGlow);
    // Soft point wash on the water beneath each stepping stone
    kit.point(0, 0.03, sz, 0xffba6e, 2.2, 2.5, 2);
  }

  // Minimalist brushed bronze pathway bollards flanking the arrival approach
  for (let i = 0; i < 4; i++) {
    const bz = 15 + i * 3.5;
    // Left bollard
    kit.cyl(0.045, 0.045, 0.55, -9.8, 0.28, bz, mBrass, { seg: 12 });
    kit.sphere(0.02, -9.8, 0.52, bz, mWarmCove);
    kit.point(-9.8, 0.45, bz, 0xffbe72, 3.5, 3.0, 2);
    // Right bollard
    kit.cyl(0.045, 0.045, 0.55, 9.8, 0.28, bz, mBrass, { seg: 12 });
    kit.sphere(0.02, 9.8, 0.52, bz, mWarmCove);
    kit.point(9.8, 0.45, bz, 0xffbe72, 3.5, 3.0, 2);
  }

  kit.endZone();

  kit.beginZone([[0, 0.4], [0.72, 1]]);
  // 8. Architectural Landscaping: Olive Trees, Agaves & Desert Flora
  // Monolithic Travertine planter troughs flanking the terrace
  kit.box(1.2, 0.55, 6.5, -12, 0.28, 20, mTravertine);
  kit.box(1.2, 0.55, 6.5, 12, 0.28, 20, mTravertine);

  // Sculptural olive trees with gnarled trunks and silvery foliage
  kit.olive({ x: -12, z: 18.5, h: 2.8, potMat: mBasalt, seed: 1 });
  kit.olive({ x: 12, z: 21.5, h: 2.6, potMat: mBasalt, seed: 3 });
  kit.palm({ x: 28, z: 8, h: 8.5, lean: 0.35, seed: 1, scale: 1.1 });
  kit.palm({ x: 30, z: -12, h: 7.5, lean: -0.28, seed: 4, scale: 0.95 });

  // Blue desert agaves along terrace edges
  kit.agave({ x: -12, z: 22.5, s: 1.2, seed: 2 });
  kit.agave({ x: 12, z: 17.5, s: 1.1, seed: 4 });
  kit.agave({ x: 18, z: 8, s: 1.3, seed: 5 });
  kit.agave({ x: 25, z: 12, s: 0.9, seed: 6 });
  kit.endZone();

  // Warm landscape uplights washing the olive trees and palms
  kit.spot(-12, 0.2, 17, -12, 2.5, 18.5, 0xffd290, 18, 0.5, 0.5);
  kit.spot(12, 0.2, 23, 12, 2.5, 21.5, 0xffd290, 18, 0.5, 0.5);
  kit.spot(26, 0.2, 8, 28, 6.0, 8, 0xffd290, 24, 0.6, 0.5);

  kit.beginZone([0.32, 0.78]);
  // 9. Great Hall Interior (Monumental Fireplace & Living Suite)
  // Fluted acoustic American walnut feature wall (rear)
  const slatGeo = kit.track(new THREE.BoxGeometry(0.12, 4.0, 0.18));
  const slats = new THREE.InstancedMesh(slatGeo, mWood, 86);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 86; i++) {
    dummy.position.set(-16.2 + i * 0.38, 2.0, -20.2);
    dummy.updateMatrix();
    slats.setMatrixAt(i, dummy.matrix);
  }
  slats.castShadow = true;
  add(slats);

  // Concealed top grazing LED wash channel above walnut slats
  kit.box(32, 0.04, 0.06, 0, 3.96, -20.0, mWarmCove);

  // Monolithic Italian Nero Marquina Fireplace Block
  kit.box(9.6, 3.8, 0.7, 0, 1.9, -10.5, mFloor, { tile: 2 });
  // Solid rear stone barrier to guarantee 100% optical opacity from behind
  kit.box(9.8, 3.9, 0.25, 0, 1.9, -10.95, mStone, { tile: 2 });
  // Recessed dark bronze firebox cavity
  kit.box(7.6, 0.6, 0.35, 0, 1.05, -10.15, mDarkBronze);

  // Continuous linear living flame (strictly linear, parallel to wall, frontOnly)
  const flame = createFlame({
    width: 7.2,
    height: 0.48,
    planes: 3,
    freq: 5,
    power: 2.6,
    linear: true,
    frontOnly: true,
  });
  flame.position.set(0, 0.85, -10.05);
  add(flame);

  kit.box(7.6, 0.04, 0.26, 0, 1.1, -10.05, mBrass); // Brushed brass hearth mantel
  kit.box(8.2, 0.36, 0.7, 0, 0.18, -9.6, mWood);    // Low cantilevered walnut plinth

  // Italian Luxury Living Suite: Curved Bouclé Sectional & Armchair
  kit.cushionSofa({ x: 4.2, z: -6.5, ry: 0, len: 5.6, depth: 1.25, fabric: mFabBoucle, legs: mBrass });
  kit.cushionSofa({ x: 7.2, z: -3.8, ry: -Math.PI / 2, len: 4.0, depth: 1.25, fabric: mFabBoucle, legs: mBrass });
  kit.armchair({ x: -2.8, z: -7.5, ry: 0.35, fabric: mDarkFab, legs: mBrass, scale: 1.15 });

  // Minimalist Brushed Brass & Smoked Walnut Coffee Table
  kit.rbox(2.6, 0.08, 1.4, 0.04, 3.2, 0.44, -4.6, mBrass);
  kit.rbox(2.4, 0.36, 1.2, 0.04, 3.2, 0.18, -4.6, mWood);
  kit.bookStack({ x: 3.6, y: 0.48, z: -4.4, parent: scene });
  kit.vase({ x: 2.6, y: 0.48, z: -4.8, h: 0.38, r: 0.1, m: mBrass, branches: true });

  // Hand-knotted wool architectural area rug
  kit.rbox(11.5, 0.02, 9.5, 0.08, 1.5, 0.01, -6, kit.mat(fabricTex, { color: 0x1f1d1b, roughness: 1 }));

  // Atmospheric warm dust particles in Great Hall volume
  const dust = createParticles({ count: 180, box: [16, 5, 16], center: [0, 2.5, -6], color: 0xffd290, opacity: 0.45 });
  add(dust);

  // Suspended architectural bronze halo chandelier floating above the Great Hall
  const haloGeo = kit.track(new THREE.TorusGeometry(1.6, 0.03, 16, 48));
  const halo = new THREE.Mesh(haloGeo, mBrass);
  halo.rotation.x = Math.PI / 2;
  halo.position.set(2, 3.25, -6);
  add(halo);
  for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / 3) {
    const hx = 2 + Math.cos(a) * 1.6;
    const hz = -6 + Math.sin(a) * 1.6;
    kit.cyl(0.005, 0.005, 0.72, hx, 3.61, hz, mBrass, { seg: 6 });
  }
  kit.point(2, 3.15, -6, 0xffca86, 16, 12, 1.8);
  kit.endZone();

  kit.beginZone([0.5, 0.88]);
  // 10. Curated Architectural Blueprint & Art Gallery (Left Wing)
  // Dedicated gallery feature wall in dark limestone (NO glowing white billboard!)
  kit.box(0.18, 4.0, 24, -16.5, 2.0, -9.5, mStone, { tile: 2 });

  // 3 Signature Masterpiece Artworks in bespoke museum floating shadow-box frames
  const [tex1, tex2, tex3] = projectTextures;
  kit.artFrame({ w: 4.8, h: 2.8, x: -16.2, y: 2.2, z: -3.5, ry: Math.PI / 2, texture: tex1, frame: mBrass, emissive: 0.08 });
  kit.artFrame({ w: 4.8, h: 2.8, x: -16.2, y: 2.2, z: -9.8, ry: Math.PI / 2, texture: tex2, frame: mBrass, emissive: 0.08 });
  kit.artFrame({ w: 4.8, h: 2.8, x: -16.2, y: 2.2, z: -16.0, ry: Math.PI / 2, texture: tex3, frame: mBrass, emissive: 0.08 });

  // Dedicated Museum Ceiling Pin-Spotlights (Focused directly onto each artwork)
  kit.spot(-14, 3.8, -3.5, -16.2, 2.2, -3.5, 0xffe4bc, 24, 0.45, 0.6);
  kit.spot(-14, 3.8, -9.8, -16.2, 2.2, -9.8, 0xffe4bc, 24, 0.45, 0.6);
  kit.spot(-14, 3.8, -16.0, -16.2, 2.2, -16.0, 0xffe4bc, 24, 0.45, 0.6);

  // Sculptural Plinths with Golden Architectural Maquettes
  for (const z of [-6.5, -13.0]) {
    kit.box(1.0, 1.0, 1.0, -13.2, 0.5, z, mTerrace);
    kit.box(1.04, 0.04, 1.04, -13.2, 1.02, z, mBrass);
    const geom = kit.track(new THREE.DodecahedronGeometry(0.32, 0));
    const mMaq = new THREE.Mesh(geom, mBrass);
    mMaq.position.set(-13.2, 1.45, z);
    mMaq.rotation.set(0.4, 0.8, 0.2);
    add(mMaq);
    // Pin-spot on maquette
    kit.spot(-13.2, 3.8, z, -13.2, 1.45, z, 0xffe2b8, 16, 0.35, 0.5);
  }
  kit.endZone();

  kit.beginZone([0.62, 0.92]);
  // 11. Private Dining & Hospitality Suite (Right Wing)
  kit.box(7.2, 0.12, 2.4, 8.8, 0.86, -15, mWood);
  for (const sx of [-3.2, 3.2]) {
    for (const sz of [-0.95, 0.95]) {
      kit.box(0.1, 0.84, 0.1, 8.8 + sx, 0.42, -15 + sz, mBrass);
    }
  }
  // Dining chairs in charcoal wool
  for (let i = 0; i < 4; i++) {
    for (const sz of [-1.6, 1.6]) {
      kit.diningChair({ x: 7.2 + i * 1.15, z: -15 + sz, ry: sz > 0 ? Math.PI : 0, fabric: mDarkFab, legs: mBrass });
    }
  }
  // Tubular bronze pendant chandeliers
  for (let i = 0; i < 5; i++) {
    kit.cyl(0.04, 0.04, 1.2, 7.0 + i * 0.9, 2.8, -15, mBrass, { seg: 16 });
    kit.cyl(0.01, 0.01, 1.2, 7.0 + i * 0.9, 3.45, -15, mBrass, { seg: 8 }); // Suspension wire
    kit.sphere(0.05, 7.0 + i * 0.9, 2.15, -15, mWarmCove); // Crystal glowing tip
  }

  // Sheer wave-fold linen curtains on side glass facades
  const mCurtain = kit.mat(null, { color: 0xe8e4dc, roughness: 0.95, opacity: 0.5, transparent: true, side: THREE.DoubleSide });
  kit.curtain({ w: 8.5, h: 3.9, x: 15.8, y: 1.95, z: -2, ry: Math.PI / 2, m: mCurtain, folds: 16 });
  kit.endZone();

  kit.beginZone([0.72, 1]);
  // 12. Suspended Cliff Terrace & Sunken Fire Lounge
  const fireBase = kit.cyl(1.1, 1.25, 0.5, 22.5, 0.25, -2, mTerrace, { seg: 28 });
  const terraceFlame = createFlame({ width: 1.8, height: 0.75, planes: 4, freq: 4, power: 3.2 });
  terraceFlame.position.set(22.5, 0.55, -2);
  add(terraceFlame);

  // Circular curved sunken seating
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    kit.box(2.0, 0.45, 1.0, 22.5 + Math.cos(a) * 3.6, 0.22, -2 + Math.sin(a) * 3.6, mFabBoucle, {
      ry: -a + Math.PI / 2,
    });
  }
  kit.endZone();

  // 13. Calibrated Architectural Lighting Setup
  // Exterior ambient fill
  kit.sun(0, 5, 0, 0x445577, 0.38);

  // Interior warm point lights (2400K - 2700K luxury residential temperature)
  kit.point(0, 3.4, 3, 0xffd094, 26, 22, 1.8);
  kit.point(2, 3.4, -6, 0xffc27d, 30, 24, 1.8);

  // Fireplace dynamic flicker light (confined forward to Great Hall)
  const fireLight = kit.point(0, 1.1, -9.2, 0xff7a20, 20, 8.0, 2.0);

  // Terrace fire pit flicker light
  const terraceFireLight = kit.point(22.5, 2.0, -2, 0xff7a20, 28, 16, 1.8);

  // Dining suite warm chandelier wash
  kit.point(8.8, 2.8, -15, 0xffca86, 26, 18, 1.8);

  // Gallery warm ambient bounce
  kit.point(-12, 3.2, -9.5, 0xffcf94, 24, 18, 1.8);

  // Pool water subtle ambient bounce
  kit.point(0, 1.5, 20.5, 0x5aa2cc, 16, 18, 1.8);

  kit.capLights();
  kit.collectFar(scene);

  return {
    kit,
    shadowLight: kitCtx.shadowLight,
    update(time) {
      // Dynamic water ripples
      if (pool.userData?.tick) pool.userData.tick(time);
      // Dynamic flames
      if (flame.userData?.tick) flame.userData.tick(time);
      if (terraceFlame.userData?.tick) terraceFlame.userData.tick(time);
      // Sky & dust particles
      if (sky.userData?.tick) sky.userData.tick(time);
      if (dust.userData?.tick) dust.userData.tick(time);

      // Realistic organic firelight flicker
      fireLight.intensity = 22 + Math.sin(time * 9.5) * 3.5 + Math.cos(time * 14.2) * 1.8;
      terraceFireLight.intensity = 25 + Math.sin(time * 8.2) * 4.0 + Math.cos(time * 12.7) * 2.1;
    },
    dispose() {
      disposables.forEach((d) => {
        if (!d) return;
        if (typeof d.dispose === 'function') d.dispose();
        if (d.geometry && typeof d.geometry.dispose === 'function') d.geometry.dispose();
        if (d.material) {
          if (Array.isArray(d.material)) {
            d.material.forEach((m) => m && typeof m.dispose === 'function' && m.dispose());
          } else if (typeof d.material.dispose === 'function') {
            d.material.dispose();
          }
        }
      });
      renderer && renderer.renderLists?.dispose();
    },
  };
}
