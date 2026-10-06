import * as THREE from 'three';
import { createSkyDome, createWater, createParticles, createHalo } from '../fx';
import { lattice } from '../textures';

export default {
  scroll: 850,
  exposure: 1.06,
  background: 0x07080d,
  fog: { color: 0x0d0c14, density: 0.007 },
  fov: 50,
  env: {
    top: 0x182442,
    horizon: 0x7a4c3e,
    ground: 0x14100c,
    panels: [
      { p: [0, 8, -25], s: [14, 8], c: 0xffb870, i: 3.2 },
      { p: [0, 6, 25], s: [14, 8], c: 0xffa050, i: 2.2 },
    ],
  },
  envIntensity: 0.75,
  bloom: { strength: 0.42, radius: 0.52, threshold: 0.82 },
  grade: { vignette: 0.46, warmth: [1.05, 1.0, 0.94], saturation: 1.1, contrast: 1.08 },
  audio: { notes: [55, 82.4, 110, 146.8], water: 0.65, wind: 0.1, shimmer: 0.6 },

  path: [
    { p: [0, 2.6, 28], l: [0, 2.2, 0] },     // 0.00 Entrance axial perspective down the grand colonnade
    { p: [0, 2.0, 18], l: [0, 1.8, -10] },   // 0.18 Gliding over the reflecting water canal
    { p: [0, 1.7, 8], l: [0, 1.7, -18] },    // 0.36 Walking between sequential illuminated arches
    { p: [-3.8, 1.7, 0], l: [0, 1.7, -4] },  // 0.54 Side arcade looking at the fluted columns and courtyard
    { p: [3.8, 1.7, -8], l: [0, 1.7, -16] }, // 0.72 Opposite arcade enjoying the reflection of the arches
    { p: [0, 1.75, -20], l: [0, 2.5, -34] }, // 0.88 Terminal arched sanctuary gate and fountain head
    { p: [0, 8.5, 6], l: [0, 1.8, -15] },    // 1.00 High dramatic perspective of the entire illuminated gallery
  ],

  chapters: [
    {
      id: 'portal',
      no: '01',
      start: 0.0,
      hero: true,
      nameAr: 'المنظور المحوري للرواق',
      nameEn: 'Axial Monumental Vista',
      titleAr: 'رواق الرخام والأقواس المضيئة',
      titleEn: 'The Grand Marble Colonnade',
      textAr: 'تتابع إيقاعي مهيب للأقواس الترافيرتين والأعمدة الرخامية المخددة التي تحتضن قناة مائية هادئة بروح أندلسية معاصرة.',
      textEn: 'A rhythmic sequence of monumental travertine arches and fluted marble pillars framing a tranquil water rill.',
      target: 0.0,
    },
    {
      id: 'waterrill',
      no: '02',
      start: 0.18,
      nameAr: 'القناة المائية العاكسة',
      nameEn: 'Central Reflecting Canal',
      titleAr: 'جريان الماء وسكون الليل',
      titleEn: 'Basalt Water Rill & Light',
      textAr: 'قناة مائية من حجر البازلت الأسود تعكس أقواس النور المتتالية وتمنح المكان خريراً هادئاً يبعث على التأمل.',
      textEn: 'A black basalt water channel mirroring the receding arches and indirect golden illumination.',
      target: 0.22,
    },
    {
      id: 'colonnade',
      no: '03',
      start: 0.40,
      nameAr: 'الأعمدة الرخامية المخددة',
      nameEn: 'Fluted Marble Colonnade',
      titleAr: 'صراحة النحت والتفاصيل',
      titleEn: 'Chiseled Classical Harmony',
      textAr: 'أعمدة رخامية مخددة من حجر كرارا الإيطالي بتيجان كلاسيكية معاصرة وقواعد ترافيرتين مصقولة.',
      textEn: 'Italian Carrara marble columns with bespoke contemporary capitals and polished plinths.',
      target: 0.50,
    },
    {
      id: 'courtyard',
      no: '04',
      start: 0.68,
      nameAr: 'فناء الواحة والمشربيات',
      nameEn: 'Courtyard Loggia & Garden',
      titleAr: 'حوار الظل والشجر والرياح',
      titleEn: 'Courtyard Mashrabiya Cloister',
      textAr: 'أروقة جانبية مفتوحة على فناء داخلي تتخلله نباتات استوائية ومشربيات خشبية داكنة تحجب الشمس بحرفية.',
      textEn: 'Side arcades opening into a lush sunken cloister garden with dark timber lattice screens.',
      target: 0.72,
    },
    {
      id: 'sanctuary',
      no: '05',
      start: 0.88,
      end: true,
      nameAr: 'بوابة الملاذ الختامية',
      nameEn: 'Terminal Sanctuary Gate',
      titleAr: 'سكينة الضوء الشعري الخالد',
      titleEn: 'Poetic Nocturne Finale',
      textAr: 'خاتمة المسار حيث تلتقي القناة المائية بنافورة رخامية غائرة تحت قوس مهيب مضاء بنور دافئ متناغم.',
      textEn: 'The culmination of the walkthrough: a monumental terminal arch and quiet cascading marble fountain.',
      target: 0.92,
    },
  ],

  hotspots: [
    {
      id: 'h-canal',
      range: [0.15, 0.42],
      pos: [0, 0.4, 12],
      tagAr: 'قناة البازلت المائية العاكسة',
      tagEn: 'Basalt Reflecting Water Rill',
      descAr: 'مجرى مائي ممتد بطول 55 متراً يعكس تناظر الأقواس والإضاءات الخفية.',
      descEn: 'A 55-meter linear water mirror reflecting the architectural symmetry and cove lighting.',
    },
    {
      id: 'h-columns',
      range: [0.38, 0.68],
      pos: [-4.2, 2.5, 0],
      tagAr: 'أعمدة رخام كرارا مخددة',
      tagEn: 'Fluted Carrara Marble Pillars',
      descAr: 'نحت بارامتري دقيق لـ 24 أخدوداً على محيط كل عمود يوزع الظل والضوء برقة متناهية.',
      descEn: '24 precision-carved flutes distributing delicate shadow gradients across the marble shaft.',
    },
    {
      id: 'h-arches',
      range: [0.65, 0.95],
      pos: [0, 5.8, -14],
      tagAr: 'أقواس الترافيرتين المتتابعة',
      tagEn: 'Sequential Travertine Arches',
      descAr: 'هندسة فراغية تخلق عمقاً بصرياً لا نهائياً يرمز للخلود والهدوء الداخلي.',
      descEn: 'Monumental arches engineered to establish an infinite poetic perspective tunnel.',
    },
  ],

  async build(ctx) {
    const { kit, tex, add, quality, tick } = ctx;

    // 1. Procedural PBR Textures
    await tick(0.12, 'textures');
    const travTex = tex.travertine({ base: 0xe5d8be, bands: 40, polish: 0.35, seed: 11 });
    const carraraTex = tex.marble({ base: 0xf5f3ee, vein: 0x8a929e, sharp: 12, scale: 3.5, polish: 0.15 });
    const basaltTex = tex.stoneTile({ base: 0x16181d, tiles: 4, polish: 0.22, seed: 26 });
    const woodTex = tex.wood({ planks: 8, base: 0x3d2616, dark: 0x1c0f08, seed: 14 });

    // Materials
    const mTrav = kit.mat(travTex, { roughness: 0.52, metalness: 0.05, clearcoat: 0.3 });
    const mCarrara = kit.mat(carraraTex, { roughness: 0.18, metalness: 0.2, clearcoat: 0.5 });
    const mBasalt = kit.mat(basaltTex, { roughness: 0.25, metalness: 0.25, clearcoat: 0.4 });
    const mWood = kit.mat(woodTex, { roughness: 0.5 });
    const mBrass = kit.mat(null, { color: 0xd4a860, metalness: 0.92, roughness: 0.24 });
    const mWarmCove = kit.glow(0xffaf55, 2.0);
    const mFloorGlow = kit.glow(0xffd588, 1.8);

    await tick(0.30, 'sky & arcade base');

    // 2. Dusk Sky & Environment
    const sky = createSkyDome({
      top: 0x081226,
      mid: 0x1a2244,
      horizon: 0x784435,
      sunDir: [0.65, 0.05, -0.75],
      sunColor: 0xff8844,
      stars: 1.2,
      moonDir: [-0.4, 0.65, 0.65],
    });
    add(sky);

    // Warm Directional Sunlight penetrating between columns
    kit.sun(35, 40, -25, 0xffaa66, 0.8, { shadow: quality.shadows, size: 50, shadowMap: 2048 });

    // 3. Colonnade Gallery Floor & Ceiling
    const galleryL = 72; // Length of the colonnade gallery
    const galleryW = 18; // Width of the colonnade
    const archH = 6.8;   // Height of the arches

    // Polished Travertine & Carrara Floor
    kit.plane(galleryW, galleryL, 0, 0, 0, mTrav, { tile: 3 });
    // Vaulted Ceiling
    kit.plane(galleryW, galleryL, 0, archH + 0.1, 0, mTrav, { rot: [Math.PI / 2, 0, 0], tile: 3 });

    await tick(0.55, 'central reflecting canal');

    // 4. Central Linear Reflecting Canal (Basalt Water Rill)
    const canalW = 4.2;
    const canalL = 58;

    // Recessed basalt canal trough
    kit.box(canalW + 0.6, 0.35, canalL + 0.6, 0, -0.18, -2, mBasalt);
    // Travertine perimeter coping
    kit.box(canalW + 0.8, 0.06, 0.4, 0, 0.03, -2 + canalL / 2 + 0.2, mTrav);
    kit.box(canalW + 0.8, 0.06, 0.4, 0, 0.03, -2 - canalL / 2 - 0.2, mTrav);
    kit.box(0.4, 0.06, canalL + 0.8, canalW / 2 + 0.2, 0.03, -2, mTrav);
    kit.box(0.4, 0.06, canalL + 0.8, -canalW / 2 - 0.2, 0.03, -2, mTrav);

    // Golden LED waterline strip running along the canal edge
    kit.box(canalW + 0.6, 0.02, 0.03, 0, 0.04, -2 + canalL / 2 + 0.02, mFloorGlow);
    kit.box(canalW + 0.6, 0.02, 0.03, 0, 0.04, -2 - canalL / 2 - 0.02, mFloorGlow);
    kit.box(0.03, 0.02, canalL + 0.6, canalW / 2 + 0.02, 0.04, -2, mFloorGlow);
    kit.box(0.03, 0.02, canalL + 0.6, -canalW / 2 - 0.02, 0.04, -2, mFloorGlow);

    // Planar Reflecting Water Surface
    const canalWater = createWater({
      w: canalW,
      d: canalL,
      color: 0x306677,
      deep: 0x051118,
      reflectivity: 0.82,
      ripple: 0.002, // Tranquil glass water
      res: quality.reflections ? 0.5 : 0.25,
    });
    canalWater.position.set(0, 0.02, -2);
    add(canalWater);

    // Stepping stones crossing the canal at intervals
    for (const z of [14, 0, -14]) {
      kit.rbox(canalW + 1.2, 0.08, 1.4, 0.02, 0, 0.04, z, mTrav, { tile: 1 });
      kit.box(canalW + 1.22, 0.02, 0.04, 0, 0.02, z - 0.7, mFloorGlow);
    }

    await tick(0.72, 'sequential arches & fluted pillars');

    // 5. Sequential Receding Monumental Arches & Fluted Pillars
    const numBays = 11;
    const baySpacing = 5.6;

    for (let i = 0; i < numBays; i++) {
      const z = 26 - i * baySpacing;

      // Travertine Arch Wall across the gallery
      const arch = kit.archWall({
        width: galleryW,
        height: archH,
        depth: 0.45,
        openings: [{ x: 0, w: 7.2, h: 5.6 }],
        material: mTrav,
        x: 0,
        y: 0,
        z,
        tile: 2,
      });

      // Warm indirect LED cove light strip lining the inner arch curve
      kit.box(7.0, 0.04, 0.06, 0, 5.55, z, mWarmCove);

      // Fluted Carrara Marble Columns flanking the arch opening on both sides
      kit.flutedColumn({
        r: 0.36,
        h: 5.4,
        x: -4.1,
        z,
        shaft: mCarrara,
        trim: mTrav,
        flutes: 24,
      });
      kit.flutedColumn({
        r: 0.36,
        h: 5.4,
        x: 4.1,
        z,
        shaft: mCarrara,
        trim: mTrav,
        flutes: 24,
      });

      // Outer arcade columns along the garden walls
      kit.flutedColumn({
        r: 0.32,
        h: 5.4,
        x: -galleryW / 2 + 1.2,
        z,
        shaft: mCarrara,
        trim: mTrav,
        flutes: 20,
      });
      kit.flutedColumn({
        r: 0.32,
        h: 5.4,
        x: galleryW / 2 - 1.2,
        z,
        shaft: mCarrara,
        trim: mTrav,
        flutes: 20,
      });

      // Side mashrabiya arched screens on odd bays
      if (i % 2 === 1) {
        const mashMat = kit.mat(null, {
          map: lattice({ cell: 42, cells: 8, color: '#321c10' }),
          transparent: true,
          alphaTest: 0.35,
          side: THREE.DoubleSide,
        });
        const m1 = new THREE.Mesh(kit.track(new THREE.PlaneGeometry(3.6, 4.5)), mashMat);
        m1.position.set(-galleryW / 2 + 0.1, 2.5, z);
        m1.rotation.y = Math.PI / 2;
        ctx.scene.add(m1);

        const m2 = new THREE.Mesh(kit.track(new THREE.PlaneGeometry(3.6, 4.5)), mashMat);
        m2.position.set(galleryW / 2 - 0.1, 2.5, z);
        m2.rotation.y = -Math.PI / 2;
        ctx.scene.add(m2);
      }
    }

    // 6. Terminal Sanctuary Wall & Water Feature (At the far end)
    const endZ = 26 - numBays * baySpacing - 1;
    kit.box(galleryW + 0.5, archH + 1, 0.8, 0, (archH + 1) / 2, endZ, mTrav, { tile: 2 });
    // Recessed sanctuary niche
    kit.box(4.8, 4.6, 0.4, 0, 2.3, endZ + 0.3, kit.mat(carraraTex, { roughness: 0.2 }));
    kit.box(4.2, 0.04, 0.06, 0, 4.55, endZ + 0.45, mWarmCove); // Niche uplight

    // Terminal cascading fountain bowl
    const fountainBowl = kit.cyl(1.4, 1.1, 0.7, 0, 0.35, endZ + 1.8, mCarrara, { seg: 28 });
    kit.cyl(1.3, 1.3, 0.04, 0, 0.68, endZ + 1.8, mFloorGlow, { seg: 28 });

    // 7. Lush Courtyard Landscaping flanking the colonnade
    for (let i = 0; i < 6; i++) {
      const z = 22 - i * 9.5;
      kit.palm({ x: -galleryW / 2 - 4.5, z, h: 8.5 + (i % 2) * 1.5, lean: 0.22, seed: 20 + i, scale: 1.05 });
      kit.palm({ x: galleryW / 2 + 4.5, z, h: 8.0 + (i % 3) * 1.2, lean: -0.25, seed: 40 + i, scale: 1.0 });
    }

    // Atmospheric warm floating particles
    const motes = createParticles({
      count: 180,
      box: [canalW * 1.8, 4.5, canalL * 0.9],
      center: [0, 2.4, -2],
      color: 0xffdca8,
      size: 0.06,
      opacity: 0.38,
      rise: 0.02,
    });
    add(motes);

    await tick(0.92, 'lighting');

    // 8. Balanced Lighting Setup
    // Central canal ambient water glow
    kit.point(0, 1.0, 12, 0x4896aa, 22, 16, 1.8);
    kit.point(0, 1.0, -8, 0x4896aa, 22, 16, 1.8);
    kit.point(0, 1.0, -26, 0x4896aa, 24, 16, 1.8);

    // Warm arch glow points along the colonnade spine
    for (let i = 0; i < numBays; i += 2) {
      const z = 26 - i * baySpacing;
      kit.point(0, 5.2, z, 0xffbe72, 26, 14, 1.8);
    }

    // Terminal sanctuary fountain accent
    kit.spot(0, 6.0, endZ + 6, 0, 0.5, endZ + 1.8, 0xffe2a4, 38, 0.45, 0.65, 16);

    await tick(1.0, 'ready');
  },
};
