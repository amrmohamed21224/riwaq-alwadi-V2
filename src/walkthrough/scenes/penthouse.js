import * as THREE from 'three';
import { createFlame, createParticles, createLightPool } from '../fx';
import { skyline } from '../textures';

export default {
  scroll: 340,
  exposure: 1.08,
  background: 0x07090e,
  fog: { color: 0x090c14, density: 0.005 },
  fov: 52,
  env: {
    top: 0x162238,
    horizon: 0x824c3d,
    ground: 0x140e0a,
    panels: [
      { p: [0, 6, 14], s: [18, 10], c: 0xffa050, i: 3.5 },
      { p: [0, 4, -12], s: [14, 8], c: 0xffd090, i: 2.2 },
    ],
  },
  envIntensity: 0.8,
  bloom: { strength: 0.44, radius: 0.5, threshold: 0.82 },
  grade: { vignette: 0.45, warmth: [1.04, 1.0, 0.95], saturation: 1.1, contrast: 1.09 },
  audio: { notes: [58.3, 87.3, 116.5, 174.6], water: 0.1, wind: 0.15, shimmer: 0.7 },

  path: [
    { p: [0, 3.8, 16], l: [0, 2.8, -4] },     // 0.00 High entry view over double-height volume
    { p: [0, 1.8, 10], l: [0, 2.2, -6] },     // 0.18 Descending into the living room lounge
    { p: [0, 1.75, 2], l: [-4.5, 2.2, -8] },  // 0.35 Standing before the monumental Nero Marquina fireplace
    { p: [4.5, 1.8, -2], l: [5.8, 3.8, -6] }, // 0.52 Looking up at the floating cantilevered illuminated stairs
    { p: [5.2, 3.6, -7], l: [0, 2.5, 2] },    // 0.70 Ascending to the mezzanine bridge
    { p: [0, 3.7, -4], l: [0, 3.0, 14] },     // 0.86 Standing on glass bridge facing the panoramic dusk city skyline
    { p: [0, 5.8, 8], l: [0, 2.4, -4] },      // 1.00 Final dramatic high angle of the entire penthouse interior
  ],

  chapters: [
    {
      id: 'doubleheight',
      no: '01',
      start: 0.0,
      hero: true,
      nameAr: 'الفراغ مزدوج الارتفاع',
      nameEn: 'Double-Height Grand Volume',
      titleAr: 'صياغة الضوء الصامت',
      titleEn: 'The Celestial Penthouse',
      textAr: 'فضاء سكني شاهق بارتفاع 7 أمتار تتناغم فيه فخامة الخامات الطبيعية مع أفق المدينة المتلألئ وقت الشفق.',
      textEn: 'A soaring 7-meter double-height volume harmonizing monolithic stone with twilight city panoramas.',
      target: 0.0,
    },
    {
      id: 'marble',
      no: '02',
      start: 0.20,
      nameAr: 'جدار رخام نيرو ماركينا',
      nameEn: 'Nero Marquina Hearth Wall',
      titleAr: 'سحر العروق الذهبية والحرارة',
      titleEn: 'Bookmatched Stone & Living Flame',
      textAr: 'جدار رخامي إيطالي شاهق بعروق ذهبية متطابقة يحتضن مدفأة خطية ممتدة وألواح خشب الجوز المخدد.',
      textEn: 'Italian bookmatched Nero Marquina marble with golden veins housing an integrated linear hearth.',
      target: 0.28,
    },
    {
      id: 'staircase',
      no: '03',
      start: 0.45,
      nameAr: 'الدرج الخشبي العائم المضيء',
      nameEn: 'Floating Illuminated Staircase',
      titleAr: 'منحوتة معمارية ترتقي بالأفق',
      titleEn: 'Cantilevered Timber Sculpture',
      textAr: 'درجات عائمة من خشب الجوز الأمريكي مصحوبة بإنارة خطية خافتة ودرابزين زجاجي فائق الشفافية.',
      textEn: 'American walnut cantilevered treads accented with warm recessed LEDs and structural glass balustrades.',
      target: 0.54,
    },
    {
      id: 'mezzanine',
      no: '04',
      start: 0.72,
      nameAr: 'جسر الميزانين المعلق',
      nameEn: 'Suspended Mezzanine Bridge',
      titleAr: 'إطلالة عابرة للأفق',
      titleEn: 'Skyline Overlook Bridge',
      textAr: 'ممر علوي زجاجي يربط الأجنحة الخاصة ويطل مباشرة على الصالون الرئيسي وأفق المدينة الخارجي.',
      textEn: 'An elevated glass bridge connecting private suites with sweeping views of the grand salon below.',
      target: 0.78,
    },
    {
      id: 'skyline',
      no: '05',
      start: 0.88,
      end: true,
      nameAr: 'بانوراما الشفق والمدينة',
      nameEn: 'Twilight Skyline Vista',
      titleAr: 'سكينة المساء فوق الغيوم',
      titleEn: 'Quiet Evening Above the City',
      textAr: 'واجهة زجاجية عملاقة تفتح لك أبواب المساء وأضواء الأبراج من أعلى قمة المبنى.',
      textEn: 'A colossal 7-meter glass curtain wall framing the glowing twilight skyline of the metropolis.',
      target: 0.94,
    },
  ],

  hotspots: [
    {
      id: 'h-fireplace',
      range: [0.18, 0.45],
      pos: [-4.2, 1.8, -8.2],
      tagAr: 'مدفأة خطية مدمجة',
      tagEn: 'Linear Ribbon Fireplace',
      descAr: 'لهب خطي حي بطول 5 أمتار بدون انبعاثات يعمل بالإيثانول الحيوي الصديق للبيئة.',
      descEn: 'A 5-meter bio-ethanol living ribbon flame set flush into sculpted black marble.',
    },
    {
      id: 'h-stairs',
      range: [0.42, 0.72],
      pos: [5.2, 2.5, -6.0],
      tagAr: 'سلالم عائمة بإنارة مخفية',
      tagEn: 'Floating Illuminated Steps',
      descAr: 'تثبيت مخفي داخل الجدار الخرساني يمنح الدرجات انسيابية وخفة بصرية كاملة.',
      descEn: 'Concealed cantilevered steel stringers giving the timber treads a zero-gravity appearance.',
    },
    {
      id: 'h-chandelier',
      range: [0.05, 0.35],
      pos: [0, 5.2, 0],
      tagAr: 'ثريا الكريستال والبرونز المعلقة',
      tagEn: 'Suspended Geometric Chandelier',
      descAr: 'حلقات هندسية من الكريستال المصقول والنحاس الخالص تتوسط رحاب الفراغ المزدوج.',
      descEn: 'Tiered geometric rings of faceted crystal and brushed champagne brass crown the salon.',
    },
  ],

  async build(ctx) {
    const { kit, tex, add, quality, tick } = ctx;

    // 1. Procedural PBR Textures
    await tick(0.14, 'textures');
    const marbleTex = tex.marble({ base: 0x090a0d, vein: 0xd9b36d, sharp: 16, scale: 3.2, polish: 0.08 });
    const woodFloorTex = tex.wood({ planks: 6, base: 0x3d2719, dark: 0x1b1008, seed: 17, rough: 0.38 });
    const flutedWallTex = tex.wood({ planks: 10, base: 0x482d1c, dark: 0x1f1107, seed: 8, rough: 0.42 });
    const fabricLightTex = tex.fabric({ base: 0x4a433c, fiber: 90, seed: 7 });
    const fabricDarkTex = tex.fabric({ base: 0x181818, fiber: 100, seed: 9 });

    // Materials
    const mNero = kit.mat(marbleTex, { roughness: 0.12, metalness: 0.3, clearcoat: 0.5 });
    const mHardwood = kit.mat(woodFloorTex, { roughness: 0.32, metalness: 0.08, clearcoat: 0.4 });
    const mFluted = kit.mat(flutedWallTex, { roughness: 0.45 });
    const mBrass = kit.mat(null, { color: 0xd8af6b, metalness: 0.92, roughness: 0.22 });
    const mGlass = kit.glass({ opacity: 0.16, roughness: 0.02 });
    const mBalustrade = kit.glass({ opacity: 0.25, roughness: 0.01 });
    const mFabLight = kit.mat(fabricLightTex, { roughness: 0.98 });
    const mFabDark = kit.mat(fabricDarkTex, { roughness: 0.98 });
    const mWarmCove = kit.glow(0xffb25a, 2.0);
    const mFlameLight = kit.glow(0xff7722, 2.8);

    await tick(0.30, 'double height structure');

    // 2. Room Envelope (7.2m tall double-height volume)
    const W = 22;
    const D = 26;
    const H = 7.4;

    // Floor (Dark Smoked Hardwood Parquet)
    kit.plane(W, D, 0, 0, 0, mHardwood, { tile: 2.5 });
    // Ceiling with recessed architectural light channels
    kit.plane(W, D, 0, H, 0, kit.mat(null, { color: 0x12141a, roughness: 0.9 }), {
      rot: [Math.PI / 2, 0, 0],
      tile: 2,
    });

    // Perimeter Walls
    kit.box(0.4, H, D, -W / 2, H / 2, 0, mFluted, { tile: 2 }); // Left feature wall
    kit.box(0.4, H, D, W / 2, H / 2, 0, kit.mat(null, { color: 0x16181f, roughness: 0.9 })); // Right wall
    kit.box(W, H, 0.4, 0, H / 2, -D / 2, kit.mat(null, { color: 0x13151b, roughness: 0.9 })); // Rear wall

    // 3. Colossal Double-Height Glass Curtain Wall (Facing Twilight City Skyline)
    kit.box(W - 0.2, H - 0.1, 0.06, 0, H / 2, D / 2 - 0.1, mGlass);
    // Dark bronze structural mullions
    for (let x = -W / 2 + 3.5; x < W / 2; x += 3.6) {
      kit.box(0.1, H, 0.18, x, H / 2, D / 2 - 0.1, mBrass);
    }
    kit.box(W, 0.12, 0.2, 0, H / 2, D / 2 - 0.1, mBrass); // Horizontal transom beam

    // City Skyline Panoramic Backdrop behind the glass curtain
    const skyTex = skyline({ warm: true, density: 1.2 });
    const skyMat = kit.mat(null, {
      map: skyTex,
      toneMapped: false,
      fog: false,
    });
    const skyMesh = new THREE.Mesh(kit.track(new THREE.PlaneGeometry(80, 26)), skyMat);
    skyMesh.position.set(0, 10, D / 2 + 18);
    ctx.scene.add(skyMesh);

    await tick(0.52, 'monolithic marble fireplace');

    // 4. Bookmatched Nero Marquina Fireplace Wall (Left Side)
    // Monumental 6.8m tall marble feature wall
    kit.box(0.6, 6.8, 12, -W / 2 + 0.5, 3.4, -4, mNero, { tile: 3 });
    // Recessed linear fireplace opening (5m wide)
    kit.box(0.4, 0.8, 5.6, -W / 2 + 0.65, 1.2, -4, kit.mat(null, { color: 0x050505, roughness: 0.95 }));

    // Continuous ribbon flame
    const flame = createFlame({ width: 5.2, height: 0.52, planes: 3, freq: 5, power: 2.8 });
    flame.position.set(-W / 2 + 0.68, 1.0, -4);
    flame.rotation.y = Math.PI / 2;
    add(flame);

    // Warm hearth mantel & glow plinth
    kit.box(0.8, 0.35, 13.5, -W / 2 + 0.7, 0.18, -4, kit.mat(woodFloorTex, { roughness: 0.4 }));
    kit.box(0.04, 0.04, 13.5, -W / 2 + 0.95, 0.36, -4, mWarmCove);

    // 5. Designer Living Room Furniture
    // Curved Italian sectional sofa
    kit.cushionSofa({ x: -1.0, z: -1.5, ry: Math.PI / 2 + 0.25, len: 5.8, depth: 1.35, fabric: mFabDark, legs: mBrass, modules: 4 });
    kit.armchair({ x: 3.8, z: 2.2, ry: -Math.PI / 2 - 0.4, fabric: mFabLight, legs: mBrass, scale: 1.15 });
    kit.armchair({ x: 3.2, z: -4.2, ry: -Math.PI / 2 + 0.3, fabric: mFabLight, legs: mBrass, scale: 1.15 });

    // Brushed champagne brass coffee cocktail table
    kit.rbox(2.8, 0.44, 1.4, 0.06, 0.8, 0.22, -1.2, mBrass);
    kit.bookStack({ x: 1.2, y: 0.46, z: -1.2, parent: ctx.scene });
    kit.vase({ x: 0.2, y: 0.46, z: -1.3, h: 0.35, r: 0.09, m: mBrass, branches: true });

    // High-pile neutral wool rug
    kit.rbox(9.5, 0.02, 9.5, 0.08, 0.5, 0.01, -1.5, kit.mat(fabricLightTex, { color: 0xd0c4b2, roughness: 1.0 }));

    await tick(0.72, 'floating staircase & mezzanine');

    kit.beginZone([0.28, 1]);
    // 6. Floating Illuminated Cantilevered Timber Staircase
    const stairX = W / 2 - 2.5;
    const stairZ = -D / 2 + 4.5;
    const steps = 18;
    const stepH = 0.2;
    const stepW = 1.6;
    const stepD = 0.42;

    for (let i = 0; i < steps; i++) {
      const sy = (i + 1) * stepH;
      const sz = stairZ + i * (stepD * 0.85);

      // Cantilevered solid walnut tread
      kit.rbox(stepW, 0.08, stepD, 0.01, stairX, sy - 0.04, sz, mFluted);
      // Recessed warm LED strip beneath tread edge
      kit.box(stepW - 0.1, 0.015, 0.02, stairX, sy - 0.085, sz + stepD / 2 - 0.02, mWarmCove);
    }

    // Structural Glass Balustrade alongside the stairs
    const balustradeGeo = kit.track(new THREE.PlaneGeometry(stepW * 0.1, Math.hypot(steps * stepH, steps * stepD * 0.85)));
    const balustradeMesh = new THREE.Mesh(balustradeGeo, mBalustrade);
    balustradeMesh.position.set(stairX - stepW / 2, (steps * stepH) / 2 + 0.4, stairZ + (steps * stepD * 0.85) / 2);
    balustradeMesh.rotation.set(-Math.atan2(steps * stepH, steps * stepD * 0.85), Math.PI / 2, 0);
    add(balustradeMesh);
    // Brass top cap rail
    kit.cyl(0.025, 0.025, steps * stepD * 1.1, stairX - stepW / 2, steps * stepH + 0.45, stairZ + (steps * stepD * 0.85) / 2, mBrass, {
      rot: [-Math.atan2(steps * stepH, steps * stepD * 0.85), 0, 0],
    });

    // 7. Suspended Mezzanine Bridge
    const bridgeY = steps * stepH;
    kit.rbox(W * 0.75, 0.35, 3.2, 0.04, -1.5, bridgeY - 0.18, -D / 2 + 4.5, mHardwood);
    // Glass railing for the bridge overlooking the salon
    kit.box(W * 0.75, 1.0, 0.04, -1.5, bridgeY + 0.5, -D / 2 + 6.0, mBalustrade);
    kit.box(W * 0.75, 0.04, 0.08, -1.5, bridgeY + 1.0, -D / 2 + 6.0, mBrass);
    kit.endZone();

    // 8. Multi-Tier Geometric Crystal Chandelier (Crown of the volume)
    const chanY = H - 1.8;
    for (let r = 0; r < 3; r++) {
      const radius = 2.2 - r * 0.65;
      const cy = chanY - r * 0.45;
      kit.cyl(radius, radius, 0.18, 0, cy, 0, mBrass, { seg: 32, open: true });
      kit.cyl(radius - 0.08, radius - 0.08, 0.22, 0, cy, 0, mWarmCove, { seg: 32, open: true });
      // Suspension brass wires
      kit.cyl(0.008, 0.008, H - cy, radius * 0.7, cy + (H - cy) / 2, radius * 0.7, mBrass);
      kit.cyl(0.008, 0.008, H - cy, -radius * 0.7, cy + (H - cy) / 2, -radius * 0.7, mBrass);
    }

    // Atmospheric warm particles floating in the light
    const motes = createParticles({
      count: 140,
      box: [16, 5, 16],
      center: [0, 3.2, 0],
      color: 0xffdca8,
      size: 0.05,
      opacity: 0.4,
    });
    add(motes);

    await tick(0.92, 'lighting');

    // 9. Precision Architectural Interior Lighting
    // Chandelier warm illumination center
    kit.point(0, chanY - 0.2, 0, 0xffd290, 45, 25, 1.8);
    // Fireplace flicker light
    kit.point(-W / 2 + 1.2, 1.4, -4, 0xff7218, 30, 16, 1.8, { flicker: 0.28 });
    // Staircase warm runner light
    kit.point(stairX - 0.8, 2.2, stairZ + 3.5, 0xffbe7a, 18, 12, 1.8);
    // Mezzanine bridge point
    kit.point(-1.5, bridgeY + 2.0, -D / 2 + 4.5, 0xffcc88, 22, 15, 1.8);

    await tick(1.0, 'ready');
  },
};
