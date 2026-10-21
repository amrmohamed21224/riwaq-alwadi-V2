import * as THREE from 'three';
import { createSkyDome, createWater, createFlame, createParticles } from '../fx';

export default {
  scroll: 340,
  exposure: 1.06,
  background: 0x06070b,
  fog: { color: 0x0d0b12, density: 0.007 },
  fov: 54,
  env: {
    top: 0x182440,
    horizon: 0x8a523a,
    ground: 0x1a120b,
    panels: [
      { p: [0, 8, 22], s: [16, 8], c: 0xffa855, i: 2.8 },
      { p: [0, 6, -10], s: [14, 6], c: 0xffc480, i: 2.2 },
    ],
  },
  envIntensity: 0.72,
  bloom: { strength: 0.4, radius: 0.5, threshold: 0.85 },
  grade: { vignette: 0.44, warmth: [1.05, 1.0, 0.94], saturation: 1.1, contrast: 1.08 },
  audio: { notes: [55, 73.4, 98, 110], water: 0.55, wind: 0.2, shimmer: 0.45 },

  path: [
    { p: [0, 7.2, 38], l: [0, 2.2, 0] },      // 0.00 High dusk approach across palm grove
    { p: [0, 3.0, 24], l: [0, 1.6, 6] },      // 0.18 Descending to the perimeter water mirror
    { p: [0, 1.7, 10], l: [0, 1.5, -4] },     // 0.35 Stepping onto the sunken fire pit island
    { p: [0, 1.1, 3.5], l: [0, 0.9, 0] },     // 0.52 Sitting inside the sunken fire lounge surrounded by water
    { p: [0, 1.75, -5], l: [0, 1.7, -14] },   // 0.68 Moving into the Najdi grand majlis
    { p: [-5.5, 1.75, -12], l: [6, 1.7, -12] },// 0.84 Najdi reception hall with bronze mashrabiyas
    { p: [24, 10.5, 20], l: [0, 2.0, -2] },   // 1.00 Twilight aerial overlook over the illuminated manor
  ],

  chapters: [
    {
      id: 'approach',
      no: '01',
      start: 0.0,
      hero: true,
      nameAr: 'إشراقة الأفق والدرعية',
      nameEn: 'Diriyah Dusk Horizon',
      titleAr: 'قصر الأفق والمسابح العائمة',
      titleEn: 'The Diriyah Horizon Manor',
      textAr: 'كتل معمارية مستلهمة من أصالة التراث النجدي، تعانق واحات النخيل ومياه المسابح العاكسة عند الغروب.',
      textEn: 'Contemporary sculptural Najdi stone volumes rising above desert palm groves and vast twilight waters.',
      target: 0.0,
    },
    {
      id: 'water',
      no: '02',
      start: 0.18,
      nameAr: 'المسابح العائمة الممتدة',
      nameEn: 'Expansive Floating Pools',
      titleAr: 'المياه كعنصر تكوين معماري',
      titleEn: 'Water as Living Canvas',
      textAr: 'حوض مائي عملاق ممتد يلتحم مع الأفق، تتخلله ممرات حجرية تؤدي للجلسة الغائرة ومجلس القصر.',
      textEn: 'A vast reflecting pool blending seamlessly into the desert horizon, bisected by floating stone paths.',
      target: 0.22,
    },
    {
      id: 'firepit',
      no: '03',
      start: 0.40,
      nameAr: 'جلسة الموقد الغائرة في الماء',
      nameEn: 'Sunken Hearth Oasis',
      titleAr: 'دفء النار وسط صفاء الماء',
      titleEn: 'Fire Embraced by Water',
      textAr: 'جلسة غائرة محفورة بعمق 1.2 متر داخل قلب المسبح، يتوسطها موقد نار صخري مع إطلالة مفتوحة على النخيل.',
      textEn: 'A subterranean lounge sunken 1.2m below pool water level, centered around a bespoke limestone fire pit.',
      target: 0.52,
    },
    {
      id: 'majlis',
      no: '04',
      start: 0.68,
      nameAr: 'المجلس النجدي المعاصر',
      nameEn: 'Contemporary Najdi Majlis',
      titleAr: 'هيبة الفراغ وتفاصيل التراث',
      titleEn: 'Heirloom Monumentality',
      textAr: 'جدران من الحجر الجيري النجدي المنحوت بفتحات هندسية مثلثة ومشربيات برونزية تضبط الضوء بشاعرية.',
      textEn: 'Chiseled Riyadh limestone walls with triangular Najdi perforations and cast bronze latticework.',
      target: 0.74,
    },
    {
      id: 'nocturne',
      no: '05',
      start: 0.88,
      end: true,
      nameAr: 'مشهد الشفق والسكينة',
      nameEn: 'Twilight Nocturne',
      titleAr: 'انسجام النور والظل',
      titleEn: 'Sovereign Heritage Living',
      textAr: 'أضواء ذهبية مخفية تنساب على حواف الكتل الحجرية وأشجار النخيل الباسقة، عنوان الفخامة النجدية الخالدة.',
      textEn: 'Concealed linear illumination accentuating textured stone facades and statuesque date palms.',
      target: 0.94,
    },
  ],

  hotspots: [
    {
      id: 'h-sunken',
      range: [0.38, 0.62],
      pos: [0, 0.6, 1],
      tagAr: 'جلسة موقد النار الغائرة',
      tagEn: 'Sunken Hearth Lounge',
      descAr: 'جلسة مربعة بكسوة أقمشة فاخرة تحت مستوى سطح الماء محاطة بشلالات هادئة.',
      descEn: 'Sunken seating pod resting below water level with panoramic views across the palms.',
    },
    {
      id: 'h-najdi',
      range: [0.65, 0.85],
      pos: [-6, 2.4, -12],
      tagAr: 'فتحات المثلثات النجدية',
      tagEn: 'Traditional Najdi Crenellations',
      descAr: 'صياغة حديثة للزخارف المثلثية النجدية التي توفر تهوية طبيعية وإنارة مسائية ساحرة.',
      descEn: 'Modern interpretation of historic Najdi triangular motifs delivering passive climate modulation.',
    },
    {
      id: 'h-palms',
      range: [0.08, 0.32],
      pos: [-14, 3.5, 18],
      tagAr: 'واحة نخيل الدرعية',
      tagEn: 'Diriyah Date Palm Grove',
      descAr: 'أشجار نخيل عالية منتقاة بعناية لتعكس روح مزارع وادي حنيفة التاريخية.',
      descEn: 'Mature native date palms harmonizing with historic Wadi Hanifa agriculture.',
    },
  ],

  async build(ctx) {
    const { kit, tex, add, quality, tick } = ctx;

    // 1. Procedural PBR Textures
    await tick(0.12, 'textures');
    const najdiStoneTex = tex.stoneBlocks({ rows: 5, cols: 3, base: 0xd2ba92, tone: 0.15, mortar: 0x8a7250, seed: 18 });
    const travertineTex = tex.travertine({ base: 0xdecbb0, bands: 35, polish: 0.35, seed: 15 });
    const woodTex = tex.wood({ planks: 7, base: 0x483220, dark: 0x221308, seed: 11 });
    const sandGroundTex = tex.sand({ base: 0xb58c60, seed: 23 });
    const fabricTex = tex.fabric({ base: 0x423a32, fiber: 90, seed: 4 });

    // Materials
    const mNajdi = kit.mat(najdiStoneTex, { roughness: 0.94 });
    const mTrav = kit.mat(travertineTex, { roughness: 0.42, metalness: 0.1, clearcoat: 0.35 });
    const mWood = kit.mat(woodTex, { roughness: 0.45 });
    const mGround = kit.mat(sandGroundTex, { roughness: 1.0 });
    const mBrass = kit.mat(null, { color: 0xc89e60, metalness: 0.9, roughness: 0.28 });
    const mGlass = kit.glass({ opacity: 0.22, roughness: 0.03 });
    const mFab = kit.mat(fabricTex, { roughness: 0.98 });
    const mWarmCove = kit.glow(0xffa54d, 2.2);

    await tick(0.30, 'sky & terrain');

    // 2. Dusk Sky & Environment
    const sky = createSkyDome({
      top: 0x091428,
      mid: 0x222544,
      horizon: 0x7c4232,
      sunDir: [0.65, 0.06, -0.75],
      sunColor: 0xff7c38,
      stars: 1.1,
      moonDir: [-0.35, 0.65, 0.65],
    });
    add(sky);

    // Warm Sunset directional fill
    kit.sun(35, 25, -45, 0xff9955, 0.85, { shadow: true, size: 45, shadowMap: 2048 });

    // Surrounding Desert Ground
    kit.plane(800, 800, 0, -0.6, 0, mGround, { tile: 8 });

    // 3. Contemporary Najdi Palace Volumes
    // Main Palace Plinth (Polished Travertine floors inside)
    kit.box(36, 0.6, 28, 0, -0.3, -12, mTrav, { tile: 2 });
    // Expansive Pool Terrace
    kit.box(40, 0.5, 34, 0, -0.25, 14, mTrav, { tile: 2 });

    // Najdi Architectural Masses (Sculpted cubes with horizontal reveals)
    // Left palace block
    kit.box(16, 8.5, 18, -12, 4.0, -12, mNajdi, { tile: 2 });
    // Right cantilevered pavilion block
    kit.box(18, 7.5, 16, 12, 3.5, -10, mNajdi, { tile: 2 });
    // Central connecting glass bridge & double-height majlis
    kit.box(12, 6.5, 14, 0, 3.0, -14, mGlass);

    // Triangular Najdi Crenellations along rooflines
    for (let x = -19; x <= -5; x += 1.2) {
      const g = kit.track(new THREE.ConeGeometry(0.4, 0.8, 3));
      const m = new THREE.Mesh(g, mNajdi);
      m.position.set(x, 8.6, -3.2);
      ctx.scene.add(m);
    }
    for (let x = 4; x <= 20; x += 1.2) {
      const g = kit.track(new THREE.ConeGeometry(0.4, 0.8, 3));
      const m = new THREE.Mesh(g, mNajdi);
      m.position.set(x, 7.6, -2.2);
      ctx.scene.add(m);
    }

    // Warm architectural LED continuous ribbons under cantilevered volumes
    kit.box(16.1, 0.05, 0.08, -12, 8.2, -3.0, mWarmCove);
    kit.box(18.1, 0.05, 0.08, 12, 7.2, -2.0, mWarmCove);
    kit.box(18.1, 0.05, 0.08, 12, 3.8, -2.0, mWarmCove);

    await tick(0.55, 'infinity pool & sunken hearth');

    kit.beginZone([0, 0.72]);
    // 4. Giant Infinity Pool (28m x 20m)
    const pool = createWater({
      w: 28,
      d: 22,
      color: 0x3d82a6,
      deep: 0x051824,
      reflectivity: 0.76,
      ripple: 0.004,
      res: quality.reflections ? 0.5 : 0.25,
    });
    pool.position.set(0, 0.02, 14);
    add(pool);

    // 5. Sunken Fire Pit Lounge Island (Submerged inside the pool)
    const loungeW = 7.6;
    const loungeD = 7.6;
    const loungeDepth = 1.35; // Sunken below pool level

    // Sunken enclosure walls & floor
    kit.box(loungeW + 0.6, 0.4, loungeD + 0.6, 0, -loungeDepth - 0.2, 3.5, mTrav);
    // Outer perimeter coping retaining the pool water
    kit.box(loungeW + 0.5, loungeDepth + 0.4, 0.35, 0, -loungeDepth / 2 + 0.1, 3.5 + loungeD / 2 + 0.18, mTrav);
    kit.box(loungeW + 0.5, loungeDepth + 0.4, 0.35, 0, -loungeDepth / 2 + 0.1, 3.5 - loungeD / 2 - 0.18, mTrav);
    kit.box(0.35, loungeDepth + 0.4, loungeD + 0.5, loungeW / 2 + 0.18, -loungeDepth / 2 + 0.1, 3.5, mTrav);
    kit.box(0.35, loungeDepth + 0.4, loungeD + 0.5, -loungeW / 2 - 0.18, -loungeDepth / 2 + 0.1, 3.5, mTrav);

    // LED underwater glowing strip around the sunken coping
    kit.box(loungeW + 0.6, 0.04, 0.04, 0, 0.01, 3.5 + loungeD / 2 + 0.38, mWarmCove);
    kit.box(loungeW + 0.6, 0.04, 0.04, 0, 0.01, 3.5 - loungeD / 2 - 0.38, mWarmCove);

    // Stepping stones bridging from terrace to the sunken lounge
    for (let i = 0; i < 5; i++) {
      kit.rbox(2.4, 0.1, 1.2, 0.02, 0, 0.05, 10.5 - i * 1.4, mTrav, { tile: 1 });
      kit.box(2.42, 0.02, 0.04, 0, 0.02, 10.5 - i * 1.4 - 0.6, mWarmCove);
    }

    // Sunken U-shaped seating inside the pit
    const seatW = loungeW - 1.2;
    kit.rbox(seatW, 0.45, 1.2, 0.06, 0, -loungeDepth + 0.22, 3.5 + loungeD / 2 - 0.9, mFab); // Back bench
    kit.rbox(1.2, 0.45, loungeD - 2.4, 0.06, -seatW / 2 + 0.6, -loungeDepth + 0.22, 3.5, mFab); // Left return
    kit.rbox(1.2, 0.45, loungeD - 2.4, 0.06, seatW / 2 - 0.6, -loungeDepth + 0.22, 3.5, mFab);  // Right return

    // Central Monolithic Najdi Stone Fire Pit Table
    kit.box(2.4, 0.55, 2.4, 0, -loungeDepth + 0.28, 3.5, mNajdi);
    const fire = createFlame({ width: 1.6, height: 0.7, planes: 4, freq: 5, power: 3.4 });
    fire.position.set(0, -loungeDepth + 0.58, 3.5);
    add(fire);
    kit.endZone();

    await tick(0.75, 'majlis & palms');

    kit.beginZone([0.48, 1]);
    // 6. Contemporary Najdi Majlis Interior
    // Fluted timber walls and bronze triangular mashrabiya panels
    kit.box(0.2, 5.5, 18, -4.5, 2.75, -12, mNajdi);
    kit.box(0.2, 5.5, 18, 4.5, 2.75, -12, mNajdi);

    // Sculptural Majlis sectional seating
    kit.cushionSofa({ x: 0, z: -14, ry: 0, len: 6.8, depth: 1.35, fabric: mFab, legs: mWood, modules: 4 });
    kit.cushionSofa({ x: -3.8, z: -11, ry: Math.PI / 2, len: 4.8, depth: 1.35, fabric: mFab, legs: mWood, modules: 3 });
    kit.cushionSofa({ x: 3.8, z: -11, ry: -Math.PI / 2, len: 4.8, depth: 1.35, fabric: mFab, legs: mWood, modules: 3 });

    // Center brass tea & dallah table
    kit.rbox(2.8, 0.42, 1.6, 0.05, 0, 0.21, -11, mBrass);
    kit.endZone();

    kit.beginZone([[0, 0.45], [0.7, 1]]);
    // 7. Lush Diriyah Date Palm Groves flanking the pool
    for (let i = 0; i < 5; i++) {
      kit.palm({ x: -16 - (i % 2) * 3, z: 2 + i * 6, h: 9.0 + (i % 3) * 1.5, lean: 0.28, seed: 15 + i, scale: 1.15 });
    }
    for (let i = 0; i < 5; i++) {
      kit.palm({ x: 17 + (i % 2) * 3, z: 2 + i * 6, h: 8.5 + (i % 2) * 1.8, lean: -0.25, seed: 30 + i, scale: 1.1 });
    }

    // Agaves and desert grasses in planter beds
    for (let i = 0; i < 6; i++) {
      kit.agave({ x: -13, z: 4 + i * 5, s: 1.1, seed: i * 3 });
      kit.agave({ x: 14, z: 4 + i * 5, s: 1.1, seed: i * 5 });
    }
    kit.endZone();

    // Warm dusk particles
    const duskMotes = createParticles({
      count: 150,
      box: [24, 6, 24],
      center: [0, 2.5, 4],
      color: 0xffcaa0,
      opacity: 0.4,
      drift: 0.05,
    });
    add(duskMotes);

    await tick(0.92, 'lighting');

    // 8. Balanced Lighting Setup
    // Sunken Fire Pit flicker point
    kit.point(0, -loungeDepth + 1.2, 3.5, 0xff7218, 32, 16, 1.8, { flicker: 0.28 });
    // Majlis interior warm illumination
    kit.point(0, 3.8, -12, 0xffbe7a, 32, 22, 1.8);
    // Pool reflection glow
    kit.point(0, 1.2, 14, 0x4896ba, 20, 24, 1.8);
    // Uplights on palms
    for (let i = 0; i < 5; i++) {
      kit.spot(-16, 0.2, 2 + i * 6, -16, 8, 2 + i * 6, 0xff9940, 18, 0.4, 0.8, 14);
      kit.spot(17, 0.2, 2 + i * 6, 17, 8, 2 + i * 6, 0xff9940, 18, 0.4, 0.8, 14);
    }

    await tick(1.0, 'ready');
  },
};
