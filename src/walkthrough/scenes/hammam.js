import * as THREE from 'three';
import { createSkyDome, createWater, createLightShaft, createParticles, createHalo, createLightPool } from '../fx';
import { domeOrnament, lattice } from '../textures';

export default {
  scroll: 820,
  exposure: 1.1,
  background: 0x080a0e,
  fog: { color: 0x120d09, density: 0.009 },
  fov: 52,
  env: {
    top: 0x1d2838,
    horizon: 0x8a6240,
    ground: 0x15110a,
    panels: [
      { p: [0, 12, 0], s: [10, 10], c: 0xffe0a0, i: 4.5 },
      { p: [0, 4, 8], s: [12, 6], c: 0xffa050, i: 2.0 },
    ],
  },
  envIntensity: 0.75,
  bloom: { strength: 0.44, radius: 0.52, threshold: 0.82 },
  grade: { vignette: 0.48, warmth: [1.05, 1.0, 0.94], saturation: 1.1, contrast: 1.08 },
  audio: { notes: [65.4, 98, 130.8, 196], water: 0.7, wind: 0.1, shimmer: 0.6 },

  path: [
    { p: [0, 4.2, 18], l: [0, 2.0, 0] },     // 0.00 Outer vaulted vestibule
    { p: [0, 2.2, 11], l: [0, 1.6, 0] },     // 0.18 Passing under monumental arch
    { p: [0, 1.8, 5], l: [0, 1.5, 0] },      // 0.35 Stepping onto pool perimeter deck
    { p: [-3.8, 1.7, 0], l: [0, 1.4, 0] },    // 0.52 Circling the octagonal water mirror
    { p: [0, 1.65, -0.2], l: [0, 6.5, 0] },   // 0.70 Standing before central plinth looking UP at Oculus
    { p: [4.2, 1.75, -4.5], l: [0, 1.6, 0] },// 0.86 Mashrabiya alcove with brass lanterns
    { p: [0, 7.5, 12], l: [0, 1.6, 0] },     // 1.00 High aerial view of the illuminated dome & pool
  ],

  chapters: [
    {
      id: 'vestibule',
      no: '01',
      start: 0.0,
      hero: true,
      nameAr: 'الرواق التمهيدي',
      nameEn: 'Vaulted Vestibule',
      titleAr: 'حمّام الواحة وقبة النور',
      titleEn: 'The Oasis Hammam Sanctuary',
      textAr: 'ممر مقنطر من الحجر الترافيرتين يقودك إلى قلب بهو الاستشفاء والاسترخاء الملكي.',
      textEn: 'An arched travertine corridor preparing the senses for the grand octagonal wellness rotunda.',
      target: 0.0,
    },
    {
      id: 'arch',
      no: '02',
      start: 0.18,
      nameAr: 'بوابة الأقواس والزليج',
      nameEn: 'Zellige Archways',
      titleAr: 'حوار الطين والرخام والنور',
      titleEn: 'Craftsmanship & Symmetry',
      textAr: 'جدران مكسوة بفسيفساء الزليج اليدوي بألوان الفيروز والبرونز، تعلوها أقواس ترافيرتين منقوشة بدقة.',
      textEn: 'Hand-cut Moroccan zellige mosaic in turquoise and bronze, framed by monumental travertine arches.',
      target: 0.22,
    },
    {
      id: 'pool',
      no: '03',
      start: 0.38,
      nameAr: 'البركة العاكسة الساكنة',
      nameEn: 'Still Water Basin',
      titleAr: 'مرآة تعكس هندسة القبة',
      titleEn: 'The Reflecting Basin',
      textAr: 'حوض مائي ساكن يحيط بالمنصة المركزية ليعكس كامل تفاصيل القبة المزخرفة وأضواء الفوانيس المعلقة.',
      textEn: 'A tranquil perimeter water basin echoing the intricate dome tracery and suspended brass lanterns.',
      target: 0.44,
    },
    {
      id: 'oculus',
      no: '04',
      start: 0.65,
      nameAr: 'الفتحة السماوية والمنصة',
      nameEn: 'Celestial Oculus & Plinth',
      titleAr: 'عمود الضوء المقدس',
      titleEn: 'The Golden Oculus Beam',
      textAr: 'منصة ترافيرتين دافئة مسلط عليها شعاع ضوء ذهبي طبيعي يهبط من الفتحة السماوية وسط بخار ناعم.',
      textEn: 'A radiant heated travertine plinth bathed in a celestial shaft of daylight amidst drifting warm steam.',
      target: 0.72,
    },
    {
      id: 'mashrabiya',
      no: '05',
      start: 0.85,
      end: true,
      nameAr: 'مجالس المشربية الخاصة',
      nameEn: 'Private Mashrabiya Alcoves',
      titleAr: 'سكينة الخصوصية المطلقة',
      titleEn: 'Sanctuary of Seclusion',
      textAr: 'أروقة استراحة خلف مشربيات خشب الجوز المفرغة، مع فوانيس نحاسية تضفي سكينة مسائية تامة.',
      textEn: 'Intimate relaxation loggias screened by walnut wood mashrabiyas with soft lantern illumination.',
      target: 0.88,
    },
  ],

  hotspots: [
    {
      id: 'h-oculus',
      range: [0.55, 0.80],
      pos: [0, 5.8, 0],
      tagAr: 'الفتحة السماوية (Oculus)',
      tagEn: 'The Celestial Oculus',
      descAr: 'فتحة دائرية بقطر 3 أمتار توجه مسار ضوء الشمس المباشر نحو المركز.',
      descEn: 'A 3-meter circular skylight funneling dramatic natural sunbeams into the rotunda.',
    },
    {
      id: 'h-plinth',
      range: [0.35, 0.75],
      pos: [0, 0.9, 0],
      tagAr: 'منصة الترافيرتين الدافئة',
      tagEn: 'Heated Travertine Plinth',
      descAr: 'حجر ترافيرتين بيج دافئ بنظام تدفئة باطني مدمج مع نقوش إسلامية معاصرة.',
      descEn: 'Underfloor-heated octagonal travertine island for supreme spa relaxation.',
    },
    {
      id: 'h-zellige',
      range: [0.15, 0.45],
      pos: [-5.2, 1.8, 5.2],
      tagAr: 'فسيفساء زليج يدوية',
      tagEn: 'Artisan Zellige Mosaic',
      descAr: 'قطع خزفية مرصوفة يدوياً بتدرجات التيل والبرونز والذهب المطفي.',
      descEn: 'Authentic handcrafted glazed terracotta tiles in deep teal and gold tones.',
    },
  ],

  async build(ctx) {
    const { kit, tex, add, quality, tick } = ctx;

    // 1. Procedural PBR Textures
    await tick(0.15, 'textures');
    const travTex = tex.travertine({ base: 0xe0d0b0, bands: 45, polish: 0.32, seed: 14 });
    const zelligeTex = tex.zellige({ cells: 4, a: 0x1d6a74, b: 0xe8d9ba, c: 0xb57c32, d: 0x123652, seed: 7 });
    const basaltTex = tex.stoneTile({ base: 0x181a1f, tiles: 4, polish: 0.18, seed: 21 });
    const woodTex = tex.wood({ planks: 8, base: 0x482d1c, dark: 0x22130a, seed: 9 });

    // Materials
    const mTrav = kit.mat(travTex, { roughness: 0.48, metalness: 0.05, clearcoat: 0.3 });
    const mZellige = kit.mat(zelligeTex, { roughness: 0.24, metalness: 0.15, clearcoat: 0.6 });
    const mBasalt = kit.mat(basaltTex, { roughness: 0.22, metalness: 0.25, clearcoat: 0.5 });
    const mWood = kit.mat(woodTex, { roughness: 0.48 });
    const mBrass = kit.mat(null, { color: 0xd4a860, metalness: 0.92, roughness: 0.25 });
    const mWarmCove = kit.glow(0xffaf55, 1.9);
    const mDomeGold = kit.glow(0xffd588, 2.4);

    await tick(0.30, 'rotunda & dome');

    // 2. Octagonal Rotunda Architecture
    const R = 11.5; // Radius of octagonal hall
    const H = 7.5;  // Wall height
    const segs = 8;

    // Surrounding ground / ceiling
    kit.plane(80, 80, 0, 0, 0, mBasalt, { tile: 4 });
    kit.plane(80, 80, 0, H + 0.1, 0, mTrav, { rot: [Math.PI / 2, 0, 0], tile: 3 });

    // 8 Facets of the Octagon: Arches & Columns
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2 + Math.PI / 8;
      const nx = Math.cos(a) * R;
      const nz = Math.sin(a) * R;
      const angle = -a + Math.PI / 2;

      // Facet back wall with Zellige wainscot & Travertine upper
      const facetGroup = kit.group(nx, 0, nz, ctx.scene, angle);
      const fw = 2 * R * Math.tan(Math.PI / 8) + 0.2; // Width of octagonal facet

      // Zellige wainscot (lower 2.6m)
      kit.box(fw, 2.6, 0.4, 0, 1.3, -0.2, mZellige, { parent: facetGroup, tile: 1.5 });
      // Travertine upper wall (2.6m to H)
      kit.box(fw, H - 2.6, 0.4, 0, 2.6 + (H - 2.6) / 2, -0.2, mTrav, { parent: facetGroup, tile: 2 });
      // Gold relief belt between zellige and travertine
      kit.box(fw, 0.08, 0.46, 0, 2.6, -0.2, mBrass, { parent: facetGroup });

      // Classical Arches recessed into facet
      const archWall = kit.archWall({
        width: fw,
        height: 6.2,
        depth: 0.35,
        openings: [{ x: 0, w: fw * 0.65, h: 5.4 }],
        material: mTrav,
        x: 0,
        y: 0,
        z: 0.2,
        tile: 2,
      });
      facetGroup.add(archWall);

      // Warm LED cove strip inside each arch vault
      kit.box(fw * 0.62, 0.04, 0.06, 0, 5.35, 0.2, mWarmCove, { parent: facetGroup });

      // Mashrabiya screen in 4 alcoves
      if (i % 2 === 1) {
        const mashMat = kit.mat(null, {
          map: lattice({ cell: 48, cells: 8, color: '#3a2213' }),
          transparent: true,
          alphaTest: 0.35,
          side: THREE.DoubleSide,
          roughness: 0.65,
        });
        const mashMesh = new THREE.Mesh(kit.track(new THREE.PlaneGeometry(fw * 0.6, 3.8)), mashMat);
        mashMesh.position.set(0, 3.2, 0.05);
        facetGroup.add(mashMesh);
      }

      // Fluted travertine columns flanking each facet corner
      const colX = Math.cos(a + Math.PI / 8) * R * 0.98;
      const colZ = Math.sin(a + Math.PI / 8) * R * 0.98;
      kit.flutedColumn({
        r: 0.38,
        h: H,
        x: colX,
        z: colZ,
        shaft: mTrav,
        trim: mTrav,
        flutes: 24,
      });
    }

    // 3. The Grand Soaring Dome & Oculus
    const domeRadius = R * 0.92;
    const domeGeo = kit.track(new THREE.SphereGeometry(domeRadius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.3));
    const domeMat = kit.mat(null, {
      map: domeOrnament({ ribs: 24 }),
      roughness: 0.52,
      metalness: 0.15,
      side: THREE.BackSide,
      clearcoat: 0.3,
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.set(0, H - 0.2, 0);
    ctx.scene.add(domeMesh);

    // Oculus ring (the circular skylight opening)
    const oculusR = 2.4;
    kit.cyl(oculusR + 0.3, oculusR + 0.3, 0.5, 0, H + domeRadius * 0.68, 0, mBrass, { seg: 48, open: true });
    kit.cyl(oculusR, oculusR, 0.05, 0, H + domeRadius * 0.68, 0, mDomeGold, { seg: 48 });

    // Volumetric Celestial Light Shaft pouring from the Oculus
    const lightShaft = createLightShaft({
      radiusTop: oculusR * 0.95,
      radiusBottom: 4.8,
      height: H + domeRadius * 0.65,
      color: 0xffebbf,
      intensity: 0.68,
      fadeBottom: 0.12,
    });
    lightShaft.position.set(0, (H + domeRadius * 0.65) / 2, 0);
    add(lightShaft);

    // Light bounce pool decal on the central island
    const plinthGlow = createLightPool({ radius: 3.2, color: 0xffdb95, opacity: 0.55 });
    plinthGlow.position.set(0, 0.88, 0);
    add(plinthGlow);

    await tick(0.55, 'water & plinth');

    // 4. Central Heated Octagonal Travertine Plinth & Still Pool
    // Octagonal central plinth island (3.6m radius, 0.85m tall)
    const plinthGroup = kit.group(0, 0, 0, ctx.scene);
    const plinthR = 3.8;
    const plinthH = 0.85;
    const plinthGeo = kit.track(new THREE.CylinderGeometry(plinthR, plinthR + 0.15, plinthH, 8));
    const plinthMesh = new THREE.Mesh(plinthGeo, mTrav);
    plinthMesh.position.y = plinthH / 2;
    plinthMesh.castShadow = plinthMesh.receiveShadow = true;
    plinthGroup.add(plinthMesh);

    // Brass filigree trim around plinth top edge
    kit.cyl(plinthR + 0.04, plinthR + 0.04, 0.06, 0, plinthH, 0, mBrass, { seg: 8, open: true, parent: plinthGroup });

    // Stepping stones connecting plinth to the main portal
    for (let i = 0; i < 4; i++) {
      const stoneMesh = kit.rbox(2.0, 0.12, 1.2, 0.02, 0, 0.06, 4.8 + i * 1.5, mTrav, { tile: 1 });
      kit.box(2.02, 0.02, 0.04, 0, 0.02, 4.8 + i * 1.5 - 0.6, mWarmCove);
    }

    // Octagonal Reflective Water Basin surrounding the plinth
    const waterPool = createWater({
      w: 18,
      d: 18,
      color: 0x306677,
      deep: 0x05131a,
      reflectivity: 0.78,
      ripple: 0.003,
      res: quality.reflections ? 0.5 : 0.25,
    });
    waterPool.position.set(0, 0.02, 0);
    add(waterPool);

    // Floating water lily / lotus details on water
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.2;
      const r = plinthR + 1.2 + (i % 3) * 0.8;
      const padGeo = kit.track(new THREE.CircleGeometry(0.28, 16));
      padGeo.rotateX(-Math.PI / 2);
      const padMat = kit.mat(null, { color: 0x224832, roughness: 0.7 });
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r);
      ctx.scene.add(padMesh);
    }

    await tick(0.75, 'lanterns & steam');

    // 5. Hanging Brass Lanterns with Warm Candlelights
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const lx = Math.cos(a) * (R * 0.68);
      const lz = Math.sin(a) * (R * 0.68);
      const ly = 3.4;

      // Suspension chain
      kit.cyl(0.012, 0.012, H - ly, lx, ly + (H - ly) / 2, lz, mBrass, { seg: 6 });

      // Octagonal pierced brass lantern body
      const lantern = kit.group(lx, ly, lz, ctx.scene);
      kit.cyl(0.22, 0.28, 0.65, 0, 0, 0, mBrass, { seg: 8, parent: lantern });
      kit.cyl(0.04, 0.22, 0.25, 0, 0.45, 0, mBrass, { seg: 8, parent: lantern }); // Cap
      kit.sphere(0.08, 0, 0, 0, kit.glow(0xffbf60, 3.0), { parent: lantern });      // Internal candle core

      // Halos around lantern flame
      const halo = createHalo({ size: 1.8, color: 0xffaa40, opacity: 0.55 });
      halo.position.set(lx, ly, lz);
      add(halo);

      // Warm point light inside lantern
      kit.point(lx, ly, lz, 0xffa044, 18, 14, 2.0, { flicker: 0.18 });
    }

    // Floor standing brass candle lanterns around pool corners
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const lx = Math.cos(a) * (R * 0.88);
      const lz = Math.sin(a) * (R * 0.88);
      kit.cyl(0.22, 0.26, 0.75, lx, 0.38, lz, mBrass, { seg: 8 });
      kit.sphere(0.06, lx, 0.45, lz, kit.glow(0xffb555, 2.5));
      kit.point(lx, 0.6, lz, 0xff9933, 10, 8, 2.0, { flicker: 0.12 });
    }

    // 6. Volumetric Warm Steam Particles (Softly drifting & rising)
    const steam = createParticles({
      count: 220,
      box: [plinthR * 2.8, 3.5, plinthR * 2.8],
      center: [0, 1.8, 0],
      size: 0.35,
      color: 0xffe4cc,
      opacity: 0.24,
      additive: true,
      drift: 0.08,
      rise: 0.035,
    });
    add(steam);

    await tick(0.92, 'lighting');

    // 7. Lighting Balance
    // Sunlight shaft main spotlight piercing from Oculus
    kit.spot(0, H + domeRadius * 0.65, 0, 0, 0, 0, 0xfff0d0, 65, 0.42, 0.75, 25, 1.6, {
      shadow: quality.shadows,
      shadowMap: 2048,
    });

    // Indirect warm dome uplight ring
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      kit.spot(Math.cos(a) * (R * 0.75), H - 0.4, Math.sin(a) * (R * 0.75), 0, H + 4, 0, 0xffbf70, 25, 0.6, 0.8);
    }

    // Pool water teal glow fill
    kit.point(0, 0.5, 0, 0x338899, 22, 16, 1.8);

    await tick(1.0, 'ready');
  },
};
