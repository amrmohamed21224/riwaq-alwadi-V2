import * as THREE from 'three';
import { createSkyDome, createWater, createParticles, createFlame } from '../fx';

export default {
  scroll: 860,
  exposure: 1.08,
  background: 0x05070d,
  fog: { color: 0x090a12, density: 0.005 },
  fov: 54,
  env: {
    top: 0x0e1b38,
    horizon: 0x582a20,
    ground: 0x120a06,
    panels: [
      { p: [0, 8, 20], s: [16, 8], c: 0xffa060, i: 2.5 },
      { p: [-15, 6, -5], s: [12, 8], c: 0xffd090, i: 2.0 },
    ],
  },
  envIntensity: 0.65,
  bloom: { strength: 0.42, radius: 0.5, threshold: 0.84 },
  grade: { vignette: 0.46, warmth: [1.04, 1.0, 0.95], saturation: 1.12, contrast: 1.09 },
  audio: { notes: [43.6, 65.4, 87.3, 130.8], water: 0.35, wind: 0.45, shimmer: 0.7 },

  path: [
    { p: [0, 8.5, 42], l: [0, 2.5, 0] },     // 0.00 High canyon approach under Milky Way
    { p: [0, 3.2, 28], l: [0, 1.8, 6] },     // 0.18 Stepping stones across the mirror pool
    { p: [0, 1.8, 14], l: [0, 1.7, 0] },     // 0.35 Low glide on the sandstone deck
    { p: [0, 1.75, 4], l: [0, 1.65, -8] },   // 0.52 Crossing into the transparent glass pavilion
    { p: [-5.2, 1.7, -5], l: [6, 1.7, -6] },  // 0.68 Facing bedroom suite & linear hearth
    { p: [6.5, 1.8, 0], l: [16, 2.0, 8] },   // 0.84 Stargazing terrace facing colossal red monoliths
    { p: [22, 12, 28], l: [0, 2.5, -2] },    // 1.00 Cinematic celestial night vista
  ],

  chapters: [
    {
      id: 'canyon',
      no: '01',
      start: 0.0,
      hero: true,
      nameAr: 'وادي عشار وسماء النجوم',
      nameEn: 'Ashar Valley Celestial Sky',
      titleAr: 'حديقة الصخور وملاذ العلا',
      titleEn: 'AlUla Lithic Sanctuary',
      textAr: 'أجنحة زجاجية مندمجة بنعومة في جوف صخور الحجر الرملي الأحمر تحت سماء العلا المرصعة بمجرة درب التبانة.',
      textEn: 'A low-impact glass sanctuary sunken between monumental red sandstone monoliths under the desert Milky Way.',
      target: 0.0,
    },
    {
      id: 'pool',
      no: '02',
      start: 0.18,
      nameAr: 'المرآة المائية العاكسة للصخور',
      nameEn: 'Monolith Reflection Pool',
      titleAr: 'انعكاس الجبال والنجوم',
      titleEn: 'Rock & Astronomy Reflections',
      textAr: 'مسطح مائي عاكس كمرآة زجاجية يضاعف عظمة الصخور الشاهقة ويحتضن الهدوء التام للصحراء.',
      textEn: 'An expansive obsidian reflecting pool mirroring the colossal cliffs and celestial night.',
      target: 0.24,
    },
    {
      id: 'pavilion',
      no: '03',
      start: 0.45,
      nameAr: 'الجناح الزجاجي الشفاف',
      nameEn: 'Transparent Glass Pavilion',
      titleAr: 'عمارة بلا حواجز بصرية',
      titleEn: 'Unbroken Panorama',
      textAr: 'واجهات زجاجية نقية ممتدة بدون أعمدة تمنحك شعوراً بأنك تجلس في الهواء الطلق في قلب الطبيعة الصامتة.',
      textEn: 'Column-free structural glazing dissolving all barriers between luxury interior and ancient desert.',
      target: 0.52,
    },
    {
      id: 'suite',
      no: '04',
      start: 0.68,
      nameAr: 'الجناح الملكي والمدفأة',
      nameEn: 'Royal Suite & Hearth',
      titleAr: 'دفء الخامات الطبيعية',
      titleEn: 'Sanctuary of Warm Earth',
      textAr: 'أرضيات من خشب الأرز المعالج ومدفأة حجرية محفورة في صخر الجبل ذات لهب هادئ متواصل.',
      textEn: 'Smoked cedar plank flooring and a linear stone hearth embedded directly into the living rock face.',
      target: 0.72,
    },
    {
      id: 'astronomy',
      no: '05',
      start: 0.86,
      end: true,
      nameAr: 'تراس الرصد الفلكي',
      nameEn: 'Astronomy Stargazing Terrace',
      titleAr: 'ملتقى الهدوء والأزل',
      titleEn: 'Eternal Desert Twilight',
      textAr: 'شرفة خارجية مفتوحة مجهزة بمناظير فلكية وأسرّة استرخاء صخرية لمشاهدة الشهب والنجوم.',
      textEn: 'Cantilevered observation deck designed for unobstructed dark-sky stargazing over Ashar Valley.',
      target: 0.92,
    },
  ],

  hotspots: [
    {
      id: 'h-monolith',
      range: [0.05, 0.35],
      pos: [-24, 14, 0],
      tagAr: 'صخور العلا الرملية الشاهقة',
      tagEn: 'Colossal Sandstone Monoliths',
      descAr: 'تكوينات جيولوجية طبيعية عمرها ملايين السنين تحتضن الجناح وتمنحه عزلة تامة.',
      descEn: 'Natural ancient sandstone geological formations embracing the villa in total secluded silence.',
    },
    {
      id: 'h-glass',
      range: [0.42, 0.65],
      pos: [0, 2.8, 8],
      tagAr: 'زجاج Low-E فائق الشفافية',
      tagEn: 'Structural Ultra-Clear Glazing',
      descAr: 'ألواح زجاجية بارتفاع 4.5 أمتار ذات معامل عزل حراري استثنائي.',
      descEn: '4.5-meter continuous glass panels providing 100% UV protection and thermal efficiency.',
    },
    {
      id: 'h-deck',
      range: [0.75, 0.96],
      pos: [14, 1.2, 4],
      tagAr: 'تراس الرصد الفلكي',
      tagEn: 'Stargazing Platform',
      descAr: 'إطلالة حرة خالية تماماً من التلوث الضوئي لرؤية مجرة درب التبانة بالعين المجردة.',
      descEn: 'Zero-light-pollution platform engineered for breathtaking naked-eye Milky Way observation.',
    },
  ],

  async build(ctx) {
    const { kit, tex, add, quality, tick } = ctx;

    // 1. Procedural PBR Textures
    await tick(0.14, 'textures');
    const sandTex = tex.sandstone({ seed: 33, strength: 6.5 });
    const woodTex = tex.wood({ planks: 6, base: 0x563824, dark: 0x28160c, seed: 12, rough: 0.45 });
    const floorTileTex = tex.stoneTile({ base: 0x1f1916, tiles: 3, polish: 0.24, seed: 19 });
    const desertGroundTex = tex.sand({ base: 0xb5825a, seed: 44 });
    const concTex = tex.concrete({ base: 0xbdb7ab, panelsX: 3, panelsY: 2, seed: 28 });
    const fabricTex = tex.fabric({ base: 0x483e36, fiber: 85, seed: 10 });

    // Materials
    const mSandstone = kit.mat(sandTex, { roughness: 0.95 });
    const mWood = kit.mat(woodTex, { roughness: 0.42, metalness: 0.08 });
    const mBasaltDeck = kit.mat(floorTileTex, { roughness: 0.35, metalness: 0.15, clearcoat: 0.3 });
    const mGround = kit.mat(desertGroundTex, { roughness: 1.0 });
    const mConc = kit.mat(concTex, { roughness: 0.86 });
    const mGlass = kit.glass({ opacity: 0.18, roughness: 0.02 });
    const mBrass = kit.mat(null, { color: 0xd6a868, metalness: 0.9, roughness: 0.26 });
    const mFab = kit.mat(fabricTex, { roughness: 0.98 });
    const mWarmCove = kit.glow(0xff9944, 2.0);

    await tick(0.32, 'canyon rocks');

    // 2. Majestic Starlit Desert Night Sky
    const sky = createSkyDome({
      top: 0x040816,
      mid: 0x101a35,
      horizon: 0x55281e,
      sunDir: [0.7, 0.04, -0.7],
      sunColor: 0xdd6633,
      stars: 1.6,       // Ultra vivid starfield for AlUla dark sky
      milky: 1.5,       // Prominent glowing Milky Way arch
      moonDir: [-0.45, 0.65, 0.55],
    });
    add(sky);

    // Starlight / Moon directional illumination
    kit.sun(-40, 60, 45, 0x90a8ff, 0.75, { shadow: quality.shadows, size: 50, shadowMap: 2048 });

    // 3. Colossal Red Sandstone Monoliths flanking the Valley
    // Left massive mountain wall
    for (let i = 0; i < 7; i++) {
      const z = -25 + i * 9;
      const h = 32 + (i % 3) * 8;
      const w = 24 + (i % 2) * 6;
      kit.box(w, h, 18, -32 - (i % 2) * 4, h / 2 - 2, z, mSandstone, {
        rot: [0.08, (i % 4) * 0.2, -0.05],
        tile: 4,
      });
    }

    // Right mountain wall
    for (let i = 0; i < 7; i++) {
      const z = -25 + i * 9;
      const h = 28 + (i % 4) * 9;
      const w = 22 + (i % 3) * 6;
      kit.box(w, h, 18, 34 + (i % 2) * 5, h / 2 - 2, z, mSandstone, {
        rot: [-0.06, -(i % 3) * 0.25, 0.08],
        tile: 4,
      });
    }

    // Rear mountain canyon closure
    kit.box(64, 45, 24, 0, 20, -38, mSandstone, { rot: [0.05, 0, 0], tile: 5 });

    // Ground plane
    kit.plane(800, 800, 0, -0.5, 0, mGround, { tile: 8 });

    await tick(0.55, 'pavilion & pool');

    // 4. Low-Profile Glass & Concrete Pavilion
    // Main deck foundation (Dark basalt stone)
    kit.box(32, 0.5, 24, 0, -0.25, -2, mBasaltDeck, { tile: 2 });
    // Front terrace extending towards pool
    kit.box(34, 0.4, 22, 0, -0.2, 19, mBasaltDeck, { tile: 2 });

    // Cantilevered thin roof slab (Smooth off-form concrete)
    kit.box(34, 0.45, 28, 0, 4.4, -1, mConc, { tile: 2 });
    // Warm recessed LED strip under roof overhang
    kit.box(34.1, 0.04, 0.06, 0, 4.15, 12.9, mWarmCove);
    kit.box(0.06, 0.04, 28, -17, 4.15, -1, mWarmCove);
    kit.box(0.06, 0.04, 28, 17, 4.15, -1, mWarmCove);

    // Floor-to-ceiling minimal structural glass walls
    kit.box(15, 4.1, 0.05, -8.5, 2.05, 9.5, mGlass);
    kit.box(15, 4.1, 0.05, 8.5, 2.05, 9.5, mGlass);
    kit.box(4, 0.9, 0.05, 0, 3.65, 9.5, mGlass); // Door transom
    // Side glass facades
    kit.box(0.05, 4.1, 22, -15.5, 2.05, -2, mGlass);
    kit.box(0.05, 4.1, 22, 15.5, 2.05, -2, mGlass);
    // Bronze slim structural mullions
    for (let x = -15; x <= 15; x += 3.75) {
      if (Math.abs(x) < 1.5) continue;
      kit.box(0.06, 4.2, 0.12, x, 2.1, 9.5, mBrass);
    }
    kit.box(32, 0.06, 0.14, 0, 4.18, 9.5, mBrass);

    // 5. Expansive Obsidian Reflecting Pool
    const mirrorPool = createWater({
      w: 22,
      d: 14,
      color: 0x224455,
      deep: 0x040810,
      reflectivity: 0.85,
      ripple: 0.002, // Ultra-calm glass water
      res: quality.reflections ? 0.5 : 0.25,
    });
    mirrorPool.position.set(0, 0.02, 19.5);
    add(mirrorPool);

    // Stepping stones floating over the mirror pool
    for (let i = 0; i < 6; i++) {
      kit.rbox(3.4, 0.08, 1.4, 0.03, 0, 0.04, 13.5 - i * 1.6, mBasaltDeck, { tile: 1 });
      kit.box(3.42, 0.02, 0.04, 0, 0.02, 13.5 - i * 1.6 - 0.7, mWarmCove);
    }

    await tick(0.75, 'interior suite');

    // 6. Royal Suite Interior (Living rock back wall + linear flame)
    // Mountain rock protruding into the interior
    kit.box(26, 4.2, 4.5, 0, 2.1, -12, mSandstone, { rot: [0.04, 0, 0], tile: 2 });

    // Smoked cedar wood platform
    kit.rbox(16, 0.08, 12, 0.04, 0, 0.04, -4, mWood, { tile: 2 });

    // Built-in stone linear hearth carved into the rock
    kit.box(8.5, 0.8, 0.9, 0, 0.4, -9.5, mBasaltDeck);
    const flame = createFlame({ width: 6.5, height: 0.45, planes: 3, freq: 5, power: 2.6 });
    flame.position.set(0, 0.8, -9.5);
    add(flame);

    // Low minimalist lounge furniture
    kit.cushionSofa({ x: 0, z: -4.5, ry: Math.PI, len: 5.2, depth: 1.3, fabric: mFab, legs: mWood, modules: 3 });
    kit.armchair({ x: -4.5, z: -4.5, ry: Math.PI - 0.4, fabric: mFab, legs: mWood, scale: 1.1 });
    kit.armchair({ x: 4.5, z: -4.5, ry: Math.PI + 0.4, fabric: mFab, legs: mWood, scale: 1.1 });

    // Low solid walnut coffee slab
    kit.rbox(2.8, 0.1, 1.3, 0.04, 0, 0.38, -2.5, mWood);
    kit.bookStack({ x: 0.6, y: 0.44, z: -2.4, parent: ctx.scene });
    kit.vase({ x: -0.6, y: 0.44, z: -2.6, h: 0.35, r: 0.08, m: mBrass, branches: true });

    // 7. Desert Landscaping & Astronomy Platform
    // Sunken daybeds on pool terrace
    for (const sx of [-11, 11]) {
      kit.rbox(2.2, 0.35, 1.4, 0.06, sx, 0.18, 18, mFab);
      kit.rbox(2.2, 0.35, 1.4, 0.06, sx, 0.18, 22, mFab);
    }

    // Native desert date palms and dry acacia shrubs
    kit.palm({ x: -18, z: 12, h: 8.0, lean: 0.25, seed: 6, scale: 1.05 });
    kit.palm({ x: -22, z: 22, h: 9.5, lean: -0.32, seed: 9, scale: 1.15 });
    kit.palm({ x: 20, z: 14, h: 7.8, lean: -0.22, seed: 11, scale: 1.0 });
    kit.agave({ x: -14, z: 8, s: 1.3, seed: 7 });
    kit.agave({ x: 15, z: 10, s: 1.1, seed: 8 });

    // Starlight dust motes in the quiet desert night
    const stardust = createParticles({
      count: 160,
      box: [28, 6, 28],
      center: [0, 3, 4],
      color: 0xd8e8ff,
      size: 0.06,
      opacity: 0.5,
      drift: 0.04,
    });
    add(stardust);

    await tick(0.92, 'lighting');

    // 8. Warm Ambient Architectural Illumination
    kit.point(0, 3.2, 0, 0xffc482, 28, 24, 1.8);       // Main living warm point
    kit.point(0, 1.2, -9.2, 0xff6618, 22, 12, 1.8, { flicker: 0.22 }); // Hearth glow
    kit.point(0, 1.5, 19.5, 0x4488aa, 16, 22, 1.8);     // Pool deep reflection
    // Low pathway landscape ground lights
    for (let z = 10; z <= 26; z += 4) {
      kit.point(-7, 0.4, z, 0xffaa50, 6, 5, 2.0);
      kit.point(7, 0.4, z, 0xffaa50, 6, 5, 2.0);
    }

    await tick(1.0, 'ready');
  },
};
