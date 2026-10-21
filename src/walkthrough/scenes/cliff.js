import * as THREE from 'three';
import { createSkyDome, createWater, createFlame, createParticles, createLightPool } from '../fx';

export default {
  scroll: 340,
  exposure: 1.05,
  background: 0x07090f,
  fog: { color: 0x080c14, density: 0.007 },
  fov: 54,
  env: {
    top: 0x162444,
    horizon: 0x7a4a40,
    ground: 0x120f0d,
    panels: [
      { p: [0, 10, 20], s: [14, 8], c: 0xffd290, i: 2.8 },
      { p: [0, 8, -15], s: [16, 6], c: 0xff9040, i: 2.2 },
    ],
  },
  envIntensity: 0.7,
  bloom: { strength: 0.38, radius: 0.48, threshold: 0.86 },
  grade: { vignette: 0.45, warmth: [1.03, 1.0, 0.96], saturation: 1.08, contrast: 1.07 },
  audio: { notes: [55, 82.4, 110, 130.8], water: 0.5, wind: 0.25, shimmer: 0.4 },

  path: [
    { p: [0, 7.8, 36], l: [0, 2.2, 0] },     // 0.00 Arrival exterior
    { p: [0, 2.8, 24], l: [0, 1.8, 5] },     // 0.16 Approaching infinity pool
    { p: [0, 1.75, 12], l: [0, 1.7, -4] },    // 0.32 Crossing stepping stones into portal
    { p: [0, 1.7, 3], l: [0, 1.65, -10] },    // 0.48 Double-height Great Hall & hearth
    { p: [-4.5, 1.7, -6], l: [-12, 1.75, -8] },// 0.64 Architectural gallery
    { p: [6.8, 1.7, -7], l: [16, 1.6, -4] },  // 0.80 Transitioning to canyon terrace
    { p: [18, 2.0, -2], l: [23, 1.4, -2] },   // 0.92 Sunken cliff fire pit
    { p: [25, 9.5, 18], l: [0, 2.5, -4] },    // 1.00 Twilight aerial overlook
  ],

  chapters: [
    {
      id: 'arrival',
      no: '01',
      start: 0.0,
      hero: true,
      nameAr: 'الوصول والأفق',
      nameEn: 'Arrival',
      titleAr: 'قصر صخر الوادي المعلق',
      titleEn: 'The Cliff Sanctuary',
      textAr: 'كتل معمارية خرسانية بيضاء تطفو فوق جرف وادي حنيفة وتتلاحم مع الصخر الطبيعي.',
      textEn: 'Monolithic raw architectural concrete cantilevered over the limestone bluffs of Wadi Hanifa.',
      target: 0.0,
    },
    {
      id: 'pool',
      no: '02',
      start: 0.16,
      nameAr: 'حوض الإنفينيتي المعلق',
      nameEn: 'Infinity Water Mirror',
      titleAr: 'مرآة تعكس سكون الشفق',
      titleEn: 'Dusk Reflecting Horizon',
      textAr: 'مسطح مائي معلق بطول 22 متراً، تتوسطه أحجار عبور حجرية تقودك مباشرة نحو البوابة البانورامية.',
      textEn: 'A 22-meter suspended infinity pool with floating basalt stepping stones leading across twilight water.',
      target: 0.22,
    },
    {
      id: 'greathall',
      no: '03',
      start: 0.40,
      nameAr: 'البهو العظيم والمدفأة',
      nameEn: 'Double-Height Great Hall',
      titleAr: 'صياغة الفراغ المزدوج',
      titleEn: 'Monumental Hearth & Marble',
      textAr: 'جدران بارتفاع 7 أمتار من خشب الجوز المخدد ومدفأة خطية حية مدمجة برخام نيرو ماركينا الإيطالي.',
      textEn: 'A 7-meter soaring volume clad in fluted American walnut, anchored by a living linear flame in Nero Marquina.',
      target: 0.48,
    },
    {
      id: 'gallery',
      no: '04',
      start: 0.62,
      nameAr: 'رواق المخططات المعمارية',
      nameEn: 'Curated Blueprint Gallery',
      titleAr: 'أرشيف الإبداع الهندسي',
      titleEn: 'The Masterpiece Archives',
      textAr: 'إضاءات متحفية مسلّطة بدقة متناهية على تفاصيل الإنشاء والمجسمات النحتية المصنوعة من البرونز.',
      textEn: 'Museum-calibrated pin spots highlighting hand-finished maquettes and technical CAD blueprints.',
      target: 0.68,
    },
    {
      id: 'terrace',
      no: '05',
      start: 0.82,
      end: true,
      nameAr: 'جلسة موقد الجرف الصخري',
      nameEn: 'Sunken Cliff Fire Lounge',
      titleAr: 'ملتقى النار وسماء الرياض',
      titleEn: 'Open Valley Hearth Vista',
      textAr: 'جلسة غائرة محفورة في صخر الجرف تحيط بموقد نار حجري مفتوح يطل على كامل امتداد الوادي.',
      textEn: 'A subterranean sunken lounge sculpted into living rock, centered around an open fire overlooking the expanse.',
      target: 0.92,
    },
  ],

  hotspots: [
    {
      id: 'h-pool',
      range: [0.12, 0.35],
      pos: [0, 0.4, 18],
      tagAr: 'مسبح إنفينيتي معلق',
      tagEn: 'Cantilevered Infinity Pool',
      descAr: 'مياه هادئة بنظام تدوير خفي يمنح سطحاً عاكساً نقياً كالمرآة.',
      descEn: 'Concealed weir circulation delivering an uninterrupted glass-like water mirror.',
    },
    {
      id: 'h-hearth',
      range: [0.38, 0.60],
      pos: [0, 1.5, -9.8],
      tagAr: 'مدفأة نيرو ماركينا',
      tagEn: 'Nero Marquina Linear Fireplace',
      descAr: 'رخام أسود إيطالي بعروق ذهبية محفور بلهب حي ممتد 6 أمتار.',
      descEn: 'Bookmatched Italian marble block inset with a 6-meter continuous ribbon fire.',
    },
    {
      id: 'h-firepit',
      range: [0.82, 0.98],
      pos: [22.5, 0.9, -2],
      tagAr: 'موقد الجرف الصخري',
      tagEn: 'Monolithic Fire Pit',
      descAr: 'كتلة ترافيرتين خام محفورة يدويًا لتكون مركز الجلسة الغائرة.',
      descEn: 'Hand-chiseled travertine block forming the centerpiece of the sunken lounge.',
    },
  ],

  async build(ctx) {
    const { kit, tex, add, quality, tick } = ctx;

    // 1. Procedural PBR textures
    await tick(0.12, 'materials');
    const marbleTex = tex.marble({ base: 0x0f1115, vein: 0xd6b478, sharp: 14, scale: 3.5, polish: 0.12 });
    const concTex = tex.concrete({ base: 0xc8c3b8, panelsX: 4, panelsY: 2, seed: 15 });
    const travTex = tex.travertine({ base: 0xd8caa8, bands: 36, tilesX: 3, tilesY: 2, polish: 0.35, seed: 14 });
    const woodTex = tex.wood({ planks: 7, base: 0x4a3222, dark: 0x22140c, seed: 8, rough: 0.42 });
    const stoneTex = tex.stoneBlocks({ rows: 5, cols: 3, base: 0xc8b594, mortar: 0x8a7758, seed: 6 });
    const basaltTex = tex.stoneBlocks({ rows: 8, cols: 4, base: 0x181a20, mortar: 0x101115, groove: 0.002, rough: 0.75, seed: 4 });
    const fabricTex = tex.fabric({ base: 0xdfd8ca, fiber: 90, seed: 2 });
    const darkFabTex = tex.fabric({ base: 0x161616, fiber: 100, seed: 5 });

    // Materials
    const mConc = kit.mat(concTex, { roughness: 0.82, metalness: 0.05 });
    const mStone = kit.mat(stoneTex, { roughness: 0.94 });
    const mFloor = kit.mat(marbleTex, { roughness: 0.16, metalness: 0.35, clearcoat: 0.45, clearcoatRoughness: 0.08 });
    const mTravertine = kit.mat(travTex, { roughness: 0.55, metalness: 0.04 });
    const mBasalt = kit.mat(basaltTex, { roughness: 0.65, metalness: 0.1 });
    const mTerrace = kit.mat(stoneTex, { roughness: 0.88, color: 0x6e6659 });
    const mWood = kit.mat(woodTex, { roughness: 0.38, metalness: 0.08 });
    const mBrass = kit.mat(null, { color: 0xc4a474, metalness: 0.88, roughness: 0.28 });
    const mDarkBronze = kit.mat(null, { color: 0x26221d, metalness: 0.85, roughness: 0.32 });
    const mGlass = kit.glass({ opacity: 0.18, roughness: 0.02, color: 0xb5d0e0 });
    const mFab = kit.mat(fabricTex, { roughness: 0.98 });
    const mDarkFab = kit.mat(darkFabTex, { roughness: 0.98 });
    const mWarmCove = kit.glow(0xff9e48, 1.4, true);
    const mStepGlow = kit.glow(0xffba6a, 1.1, true);

    await tick(0.28, 'architecture');

    // 2. Sky & Environment
    const sky = createSkyDome({
      top: 0x081024,
      mid: 0x182648,
      horizon: 0x6a382e,
      sunDir: [0.65, 0.08, -0.75],
      sunColor: 0xff8844,
      stars: 1.2,
      milky: 1.0,
      moonDir: [-0.4, 0.6, 0.7],
    });
    add(sky);

    // Moonlight
    kit.sun(-35, 55, 30, 0xa0b8ff, 0.85, { shadow: true, size: 45, shadowMap: 2048 });

    // 3. Ground & Surrounding Desert Cliffs
    kit.plane(800, 800, 0, -0.6, 0, kit.mat(null, { color: 0x0a0c10, roughness: 1 }));
    // Cliff rock massings (steep stepped plateaus flanking the villa)
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

    // 4. Main Architectural Volumes
    // Ground floor slab (Marble inside)
    kit.box(34, 0.5, 30, 0, -0.25, -6, mFloor, { tile: 2 });
    // Front terrace & Pool court
    kit.box(36, 0.4, 26, 0, -0.2, 21, mTerrace, { tile: 2 });
    // Cantilevered side cliff terrace
    kit.box(22, 0.45, 24, 22, -0.22, -2, mTerrace, { tile: 2 });

    // Cantilevered floating roofs (Massive off-form concrete slabs)
    kit.box(38, 0.6, 38, 0, 4.3, -2, mConc, { tile: 2 });
    kit.box(28, 0.55, 26, 2, 6.6, -9, mConc, { tile: 2 });

    // Recessed downward ceiling cove channels (Facing downward onto the facade)
    kit.box(34, 0.04, 0.08, 0, 3.96, 8.8, mWarmCove);
    kit.box(0.08, 0.04, 28, -16.5, 3.96, -6, mWarmCove);
    kit.box(0.08, 0.04, 28, 16.5, 3.96, -6, mWarmCove);

    // Monolithic perimeter walls
    kit.box(34.2, 4.2, 0.5, 0, 2.1, -20.5, mConc, { tile: 2 }); // Rear wall
    kit.box(0.5, 4.2, 30.5, -17, 2.1, -6, mStone, { tile: 2 });  // Left limestone cliff wall
    kit.box(0.5, 4.2, 14, 17, 2.1, -14, mStone, { tile: 2 });    // Right rear wall
    kit.box(0.5, 4.2, 9, 17, 2.1, 4.5, mStone, { tile: 2 });     // Right front wall

    // Massive panoramic glass facade with bronze slim mullions
    kit.box(15, 4.0, 0.06, -9, 2.0, 8.5, mGlass);
    kit.box(15, 4.0, 0.06, 9, 2.0, 8.5, mGlass);
    kit.box(3.2, 0.9, 0.06, 0, 3.55, 8.5, mGlass); // Pivot door transom
    for (let x = -16; x <= 16; x += 3.2) {
      if (Math.abs(x) < 1.8) continue;
      kit.box(0.06, 4.1, 0.14, x, 2.05, 8.5, mDarkBronze);
    }
    kit.box(34, 0.06, 0.16, 0, 4.05, 8.5, mDarkBronze);

    await tick(0.50, 'pool & fire');

    kit.beginZone([0, 0.55]);
    // 5. Planar Infinity Pool & Stepping Stones
    kit.box(18.4, 0.5, 13.4, 0, -0.25, 20.5, mBasalt, { tile: 2 });
    const pool = createWater({
      w: 18,
      d: 13,
      color: 0x3892be,
      deep: 0x02121e,
      reflectivity: 0.78,
      ripple: 0.0035,
      res: quality.reflections ? 0.5 : 0.25,
    });
    pool.position.set(0, 0.02, 20.5);
    add(pool);

    // Dark flamed basalt coping border with infinity weir drop (NO harsh neon lines!)
    kit.box(18.6, 0.08, 0.45, 0, 0.04, 13.8, mBasalt);
    kit.box(18.6, 0.08, 0.45, 0, 0.04, 27.2, mBasalt);
    kit.box(0.45, 0.08, 13.8, -9.2, 0.04, 20.5, mBasalt);
    kit.box(0.45, 0.08, 13.8, 9.2, 0.04, 20.5, mBasalt);

    // Floating Roman Travertine stepping stones with concealed under-glow
    for (let i = 0; i < 7; i++) {
      const sz = 14.8 - i * 1.45;
      kit.box(2.8, 0.06, 0.9, 0, 0.03, sz, mBasalt);
      kit.rbox(3.4, 0.12, 1.35, 0.03, 0, 0.09, sz, mTravertine, { tile: 1 });
      kit.box(2.8, 0.015, 0.02, 0, 0.04, sz - 0.55, mStepGlow);
      kit.box(2.8, 0.015, 0.02, 0, 0.04, sz + 0.55, mStepGlow);
      kit.point(0, 0.03, sz, 0xffba6e, 2.2, 2.5, 2);
    }

    // Landscaping flanking pool
    kit.olive({ x: -12, z: 18.5, h: 2.8, potMat: mBasalt, seed: 1 });
    kit.olive({ x: 12, z: 21.5, h: 2.6, potMat: mBasalt, seed: 3 });
    kit.endZone();

    kit.beginZone([0.32, 0.78]);
    // 6. Great Hall Interior
    // Fluted acoustic walnut slats back wall
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

    // Monolithic Nero Marquina fireplace block
    kit.box(9.6, 3.8, 0.7, 0, 1.9, -10.5, mFloor, { tile: 2 });
    // Solid rear barrier to guarantee 100% opacity from behind
    kit.box(9.8, 3.9, 0.25, 0, 1.9, -10.95, mStone, { tile: 2 });
    // Linear continuous fire (strictly parallel to wall, frontOnly)
    const flame = createFlame({ width: 7.2, height: 0.48, planes: 3, freq: 5, power: 2.6, linear: true, frontOnly: true });
    flame.position.set(0, 0.85, -10.05);
    add(flame);
    kit.box(7.6, 0.04, 0.26, 0, 1.1, -10.05, mBrass); // Brass hearth lip
    kit.box(8.2, 0.36, 0.7, 0, 0.18, -9.6, mWood);   // Low cantilevered hearth plinth

    // Luxury Italian sectionals & coffee table
    kit.cushionSofa({ x: 4.2, z: -6.5, ry: 0, len: 5.6, depth: 1.25, fabric: mFab, legs: mBrass });
    kit.cushionSofa({ x: 7.2, z: -3.8, ry: -Math.PI / 2, len: 4.0, depth: 1.25, fabric: mFab, legs: mBrass });
    kit.armchair({ x: -2.8, z: -7.5, ry: 0.35, fabric: mDarkFab, legs: mBrass, scale: 1.15 });

    // Sculptural brass & dark walnut coffee table
    kit.rbox(2.6, 0.08, 1.4, 0.04, 3.2, 0.44, -4.6, mBrass);
    kit.rbox(2.4, 0.36, 1.2, 0.04, 3.2, 0.18, -4.6, mWood);
    kit.bookStack({ x: 3.6, y: 0.48, z: -4.4 });
    kit.vase({ x: 2.6, y: 0.48, z: -4.8, h: 0.38, r: 0.1, m: mBrass, branches: true });

    // Architectural rug
    kit.rbox(11.5, 0.02, 9.5, 0.08, 1.5, 0.01, -6, kit.mat(fabricTex, { color: 0x1f1d1b, roughness: 1 }));
    kit.endZone();

    await tick(0.72, 'gallery & dining');

    kit.beginZone([0.5, 0.88]);
    // 7. Architectural Blueprint Gallery (Left Wing)
    kit.box(0.18, 4.0, 24, -16.5, 2.0, -9.5, mStone, { tile: 2 });
    const artLoader = new THREE.TextureLoader();
    const tArt1 = artLoader.load('/images/hero.jpg');
    const tArt2 = artLoader.load('/images/blueprint.jpg');
    const tArt3 = artLoader.load('/images/upcoming_landmark.jpg');
    tArt1.colorSpace = tArt2.colorSpace = tArt3.colorSpace = THREE.SRGBColorSpace;

    // Art frames showcasing blueprints & signature works
    kit.artFrame({ w: 4.8, h: 2.8, x: -16.2, y: 2.2, z: -3.5, ry: Math.PI / 2, frame: mBrass, texture: tArt1, emissive: 0.08 });
    kit.artFrame({ w: 4.8, h: 2.8, x: -16.2, y: 2.2, z: -9.8, ry: Math.PI / 2, frame: mBrass, texture: tArt2, emissive: 0.08 });
    kit.artFrame({ w: 4.8, h: 2.8, x: -16.2, y: 2.2, z: -16.0, ry: Math.PI / 2, frame: mBrass, texture: tArt3, emissive: 0.08 });

    // Plinths with golden architectural dodecahedron maquettes
    for (const z of [-6.5, -13.0]) {
      kit.box(1.0, 1.0, 1.0, -13.2, 0.5, z, mTerrace);
      kit.box(1.04, 0.04, 1.04, -13.2, 1.02, z, mBrass);
      const geom = kit.track(new THREE.DodecahedronGeometry(0.32, 0));
      const mMaq = new THREE.Mesh(geom, mBrass);
      mMaq.position.set(-13.2, 1.45, z);
      mMaq.rotation.set(0.4, 0.8, 0.2);
      add(mMaq);
    }
    kit.endZone();

    kit.beginZone([0.72, 1]);
    // 8. Suspended Cliff Terrace & Sunken Fire Lounge
    const fireBase = kit.cyl(1.1, 1.25, 0.5, 22.5, 0.25, -2, mTerrace, { seg: 28 });
    const terraceFlame = createFlame({ width: 1.8, height: 0.75, planes: 4, freq: 4, power: 3.2 });
    terraceFlame.position.set(22.5, 0.55, -2);
    add(terraceFlame);

    // Circular curved sunken seating
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      const b = kit.box(2.0, 0.45, 1.0, 22.5 + Math.cos(a) * 3.6, 0.22, -2 + Math.sin(a) * 3.6, mFab, {
        ry: -a + Math.PI / 2,
      });
    }

    kit.endZone();
    kit.beginZone([[0, 0.35], [0.72, 1]]);
    // Landscaping: Palms & desert agaves along terrace edge
    kit.palm({ x: 28, z: 8, h: 8.5, lean: 0.35, seed: 1, scale: 1.1 });
    kit.palm({ x: 30, z: -12, h: 7.5, lean: -0.28, seed: 4, scale: 0.95 });
    kit.agave({ x: 19, z: 8, s: 1.2, seed: 2 });
    kit.agave({ x: 26, z: 12, s: 0.9, seed: 3 });
    kit.endZone();

    // Atmospheric warm dust particles in Great Hall
    const dust = createParticles({ count: 180, box: [16, 5, 16], center: [0, 2.5, -6], color: 0xffd290, opacity: 0.45 });
    add(dust);

    await tick(0.88, 'lighting');

    // 9. Precision Architectural Lighting
    kit.sun(0, 5, 0, 0x445577, 0.4); // Subtle ambient
    // Interior warm glow points
    kit.point(0, 3.4, 3, 0xffd094, 26, 22, 1.8);
    kit.point(2, 3.4, -6, 0xffc27d, 30, 24, 1.8);
    // Fireplace flicker light
    kit.point(0, 1.4, -9.6, 0xff7a20, 24, 14, 1.8, { flicker: 0.25 });
    // Terrace fire pit flicker light
    kit.point(22.5, 2.0, -2, 0xff7a20, 28, 16, 1.8, { flicker: 0.3 });
    // Gallery spot track
    kit.spot(-14, 3.8, -3.5, -16.2, 2.2, -3.5, 0xffe2b8, 22, 0.45, 0.6);
    kit.spot(-14, 3.8, -9.8, -16.2, 2.2, -9.8, 0xffe2b8, 22, 0.45, 0.6);
    kit.spot(-14, 3.8, -16.0, -16.2, 2.2, -16.0, 0xffe2b8, 22, 0.45, 0.6);
    // Pool water ambient bounce
    kit.point(0, 1.5, 20.5, 0x5aa2cc, 18, 20, 1.8);

    await tick(1.0, 'ready');
  },
};
