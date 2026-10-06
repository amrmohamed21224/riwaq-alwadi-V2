import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  ArrowUpRight,
  ChevronDown,
  Volume2,
  VolumeX,
  Compass,
  Info,
  X,
  Eye,
} from 'lucide-react';
import { useSoundscape } from '../../context/SoundscapeContext';
import { buildVilla, createCameraRig, HOTSPOTS } from './villaScene';
import './ImmersiveIntro.css';

const CHAPTERS = [
  {
    id: 'hero',
    start: 0,
    end: 0.12,
    nameAr: 'الواجهة الرئيسية',
    nameEn: 'Arrival',
    isHero: true,
  },
  {
    id: 'entrance',
    start: 0.13,
    end: 0.32,
    no: '01',
    nameAr: 'المدخل والأفق المائي',
    nameEn: 'The Entrance & Horizon Pool',
    titleAr: 'مرآة تعكس سكون المساء',
    titleEn: 'A Water Mirror Reflecting Dusk',
    textAr: 'تنساب الكتل الحجرية المعلقة فوق مسطح مائي عاكس، لتبدأ التجربة بانسجام تام مع الطبيعة.',
    textEn: 'Monolithic stone volumes hover over a reflective water plane, beginning the journey in harmony with nature.',
    targetScroll: 0.22,
  },
  {
    id: 'greathall',
    start: 0.33,
    end: 0.52,
    no: '02',
    nameAr: 'البهو الرئيسي والمدفأة',
    nameEn: 'The Grand Living Hall',
    titleAr: 'فخامة الفراغ المزدوج',
    titleEn: 'Double-Height Monumentality',
    textAr: 'أرضيات من رخام نيرو ماركينا الإيطالي ومدفأة خطية حية محفورة في كتلة صخرية شاهقة.',
    textEn: 'Italian Nero Marquina marble, fluted walnut walls, and a living linear flame carved into stone.',
    targetScroll: 0.42,
  },
  {
    id: 'gallery',
    start: 0.53,
    end: 0.72,
    no: '03',
    nameAr: 'رواق المشاريع الملكية',
    nameEn: 'Masterpiece Exhibition Gallery',
    titleAr: 'معرض يروي قصة الإنجاز',
    titleEn: 'A Gallery Sculpting Legacy',
    textAr: 'ممر فني مكرس لعرض مخططات ونماذج مشاريعنا الأيقونية بإضاءة متحفية دقيقة.',
    textEn: 'A private curation presenting architectural blueprints and models under museum-grade illumination.',
    targetScroll: 0.62,
  },
  {
    id: 'dining',
    start: 0.73,
    end: 0.88,
    no: '04',
    nameAr: 'جناح الضيافة والمائدة',
    nameEn: 'Private Hospitality Suite',
    titleAr: 'أصالة الترحيب الرفيع',
    titleEn: 'Sanctuary of Sovereign Dining',
    textAr: 'مائدة ضخمة من خشب الجوز المعتق وثريات أنبوبية من النحاس الخالص تتوسط رحاب الاستقبال.',
    textEn: 'Solid smoked walnut dining slab crowned with suspended tubular brass chandeliers.',
    targetScroll: 0.8,
  },
  {
    id: 'terrace',
    start: 0.89,
    end: 1.0,
    no: '05',
    nameAr: 'شرفة الجرف وموقد النار',
    nameEn: 'Cliffside Fire Lounge',
    titleAr: 'إطلالة حرة على الأفق',
    titleEn: 'Open Horizon Over the Valley',
    textAr: 'جلسة غائرة محفورة في حافة الجرف تحت سماء نجد الصافية، ختام الجولة وبداية استكشاف أعمالنا.',
    textEn: 'A sunken cliffside lounge around an open hearth — the culmination before stepping into our portfolio.',
    targetScroll: 0.94,
    isEnd: true,
  },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function ImmersiveIntro({ lang }) {
  const isAr = lang === 'ar';
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const { isSoundPlaying, toggleAmbientSound } = useSoundscape();

  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroZoom, setHeroZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [visibleHotspots, setVisibleHotspots] = useState([]);

  // Scroll to room
  const scrollToChapter = (targetScroll) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight;
    const targetY = window.scrollY + rect.top + targetScroll * totalScrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Main Three.js Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 800;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 70 : 56,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const rig = createCameraRig();

    // Post-processing Bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.35, // Subtle luxury bloom strength
      0.45, // Soft radius
      0.88, // Only glow brightest elements (fire, cove LEDs, brass)
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // Headlight tracking camera
    const headLight = new THREE.PointLight(0xffdfb5, 6, 8, 1.8);
    scene.add(headLight);

    // Textures loader
    let villa = null;
    let disposed = false;
    const manager = new THREE.LoadingManager(() => {
      if (!disposed) setLoaded(true);
    });
    const loader = new THREE.TextureLoader(manager);
    const projectTextures = [
      '/images/hero.jpg',
      '/images/blueprint.jpg',
      '/images/upcoming_landmark.jpg',
    ].map((src) => {
      const tex = loader.load(src);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
    });

    villa = buildVilla(scene, projectTextures, renderer);

    // Scroll & Mouse Tracking
    let targetProgress = 0;
    let currentProgress = 0;
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      targetProgress = clamp(-rect.top / totalScrollable, 0, 1);
    };
    handleScroll();
    currentProgress = targetProgress;

    const handlePointerMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      composer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = window.innerWidth < 800 ? 70 : 56;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Visibility Observer
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(section);

    const startTime = performance.now();
    const tempLookAt = new THREE.Vector3();
    let animId = 0;
    let lastChapter = -1;

    const tempScreenPos = new THREE.Vector3();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (!isVisible) return;

      const time = (performance.now() - startTime) * 0.001;

      // Smooth camera interpolation
      currentProgress += (targetProgress - currentProgress) * 0.055;
      mouse.sx += (mouse.x - mouse.sx) * 0.045;
      mouse.sy += (mouse.y - mouse.sy) * 0.045;

      const { position, target: lookTarget } = rig.at(currentProgress);
      camera.position.copy(position);

      // Subtle natural breathing / walking dynamics
      const isWalking = currentProgress > 0.15 && currentProgress < 0.88;
      if (isWalking) {
        camera.position.y += Math.sin(time * 1.8) * 0.012;
      }

      // Parallax look-around with mouse
      tempLookAt.copy(lookTarget);
      tempLookAt.x += mouse.sx * 1.5;
      tempLookAt.y -= mouse.sy * 0.8;
      camera.lookAt(tempLookAt);

      headLight.position.copy(camera.position);

      // Update animated elements
      villa.update(time);
      composer.render();

      // Hero image zoom & crossfade calculation (0 -> 0.14)
      const heroFadeProgress = clamp(currentProgress / 0.12, 0, 1);
      setHeroOpacity(1 - heroFadeProgress);
      setHeroZoom(1 + heroFadeProgress * 0.28);
      setScrollProgress(Math.round(currentProgress * 100));

      // Calculate active chapter
      let currentChIdx = 0;
      for (let i = 0; i < CHAPTERS.length; i++) {
        if (currentProgress >= CHAPTERS[i].start && currentProgress <= CHAPTERS[i].end) {
          currentChIdx = i;
          break;
        }
      }
      if (currentChIdx !== lastChapter) {
        lastChapter = currentChIdx;
        setActiveChapterIdx(currentChIdx);
      }

      // Calculate screen positions for active 3D Hotspots
      const activeSpots = [];
      HOTSPOTS.forEach((spot) => {
        if (currentProgress >= spot.tRange[0] && currentProgress <= spot.tRange[1]) {
          tempScreenPos.set(...spot.worldPos);
          tempScreenPos.project(camera);
          // Check if in front of camera
          if (tempScreenPos.z < 1) {
            const x = (tempScreenPos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(tempScreenPos.y * 0.5) + 0.5) * window.innerHeight;
            activeSpots.push({ ...spot, screenX: x, screenY: y });
          }
        }
      });
      setVisibleHotspots(activeSpots);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      villa && villa.dispose();
      projectTextures.forEach((t) => t.dispose());
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  const activeChapter = CHAPTERS[activeChapterIdx] || CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      className="immersive-intro"
      aria-label={isAr ? 'جولة ثلاثية الأبعاد داخل التحفة المعمارية' : '3D Architectural Walkthrough'}
    >
      <div className="immersive-sticky">
        {/* Three.js 3D Canvas */}
        <canvas ref={canvasRef} className="immersive-canvas" />

        {/* Cinematic Hero Photograph Overlay (Seamless Morph Layer) */}
        <div
          className="hero-photomask"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.05 ? 'auto' : 'none',
            visibility: heroOpacity <= 0.01 ? 'hidden' : 'visible',
          }}
        >
          <img
            src="/images/hero.jpg"
            alt="Riwaq Al-Wadi Architectural Masterpiece"
            className="hero-photomask-img"
            style={{ transform: `scale(${heroZoom})` }}
          />
          <div className="hero-photomask-gradient" />
          <div className="hero-photomask-vignette" />

          {/* Hero Content Overlay */}
          <div className="container hero-photomask-content">
            <div className="hero-badge-wrap">
              <span className="gold-tag gold-tag-pulse">
                {isAr
                  ? 'استوديو العمارة والتطوير الفاخر — الرياض • دبي • القاهرة'
                  : 'Luxury Architectural Studio — Riyadh • Dubai • Cairo'}
              </span>
            </div>

            <h1 className="hero-photomask-title">
              {isAr ? (
                <>
                  <span className="hero-title-line hero-title-main">رِوَاق الوَادِي</span>
                  <span className="hero-title-line hero-title-sub">
                    <span className="gold-shimmer-text">صِيَاغَة الفَرَاغِ</span> وَالضَّوْء
                  </span>
                </>
              ) : (
                <>
                  <span className="hero-title-line hero-title-main">RIWAQ AL-WADI</span>
                  <span className="hero-title-line hero-title-sub">
                    <span className="gold-shimmer-text">SCULPTING SPACE</span> &amp; LIGHT
                  </span>
                </>
              )}
            </h1>

            <p className="hero-photomask-sub">
              {isAr
                ? 'نبتكر معالم معمارية وقصوراً خاصة تتجاوز حدود الزمن، حيث تلتقي صرامة الهندسة الإنشائية بشاعرية الضوء وأصالة التضاريس.'
                : 'Pioneering timeless architectural monuments and ultra-luxury estates where structural boldness harmonizes with poetic daylight.'}
            </p>

            <div className="hero-photomask-cta">
              <button onClick={() => scrollToChapter(0.22)} className="btn-primary">
                <Compass size={18} />
                <span>{isAr ? 'ابدأ الجولة ثلاثية الأبعاد' : 'Enter 3D Walkthrough'}</span>
              </button>

              <button onClick={scrollToProjects} className="btn-secondary">
                <span>{isAr ? 'استكشف روائع المشاريع' : 'Explore Masterpieces'}</span>
                <ArrowUpRight size={18} />
              </button>
            </div>

            <div className="hero-coords-banner" dir="ltr">
              <span className="coord-lbl">LAT / LONG:</span>
              <span className="coord-val">24°42'42.1"N 46°40'35.4"E</span>
              <span className="coord-div">|</span>
              <span className="coord-lbl">ELEVATION:</span>
              <span className="coord-val">612M</span>
              <span className="coord-div">|</span>
              <span className="coord-lbl">ORIENTATION:</span>
              <span className="coord-val">AZIMUTH 215°</span>
            </div>

            {/* Seamless in-flow scroll cue (Impossible to overlap coordinates) */}
            <button
              onClick={() => scrollToChapter(0.22)}
              className="hero-scroll-cue"
              aria-label={isAr ? 'مرّر لأسفل للغوص داخل التحفة' : 'Scroll down to enter'}
            >
              <span>{isAr ? 'مرّر لأسفل للغوص داخل التحفة' : 'Scroll down to enter'}</span>
              <ChevronDown size={15} className="bounce-arrow" />
            </button>
          </div>
        </div>

        {/* Vignette & Ambient Rim for 3D View */}
        <div className="immersive-vignette" aria-hidden="true" />

        {/* Floating 3D Hotspots */}
        {visibleHotspots.map((spot) => (
          <div
            key={spot.id}
            className="imm-hotspot-marker"
            style={{
              left: `${spot.screenX}px`,
              top: `${spot.screenY}px`,
            }}
          >
            <button
              onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
              className="imm-hotspot-pin"
              aria-label={isAr ? spot.tagAr : spot.tagEn}
            >
              <span className="imm-hotspot-pulse" />
              <span className="imm-hotspot-core" />
              <Info size={12} className="imm-hotspot-icon" />
            </button>

            {/* Hotspot Card */}
            {activeHotspot?.id === spot.id && (
              <div className="imm-hotspot-card glass-card">
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="imm-hotspot-close"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
                <span className="gold-tag gold-tag-sm">{isAr ? spot.tagAr : spot.tagEn}</span>
                <p className="imm-hotspot-desc">{isAr ? spot.descAr : spot.descEn}</p>
              </div>
            )}
          </div>
        ))}

        {/* 3D Walkthrough Chapter Descriptions */}
        <div className="immersive-chapters-stage" aria-live="polite">
          {CHAPTERS.map((ch, idx) => {
            if (ch.isHero) return null;
            const isCurrent = activeChapterIdx === idx && heroOpacity < 0.3;
            return (
              <div
                key={ch.id}
                className={`imm-chapter-card glass-card ${isCurrent ? 'is-active' : ''}`}
              >
                <div className="imm-chapter-top">
                  <span className="imm-chapter-badge">
                    {ch.no} — {isAr ? ch.nameAr : ch.nameEn}
                  </span>
                </div>

                <h2 className="imm-chapter-title">{isAr ? ch.titleAr : ch.titleEn}</h2>
                <div className="gold-divider-sm" />
                <p className="imm-chapter-text">{isAr ? ch.textAr : ch.textEn}</p>

                {ch.isEnd && (
                  <div className="imm-chapter-footer">
                    <button onClick={scrollToProjects} className="btn-primary">
                      <span>{isAr ? 'الانتقال إلى معرض المشاريع' : 'View Signature Projects'}</span>
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Room Dock */}
        <div className="imm-dock-container">
          <nav className="imm-dock glass-card" aria-label="Room navigation">
            <span className="imm-dock-label">
              <Eye size={13} />
              <span>{isAr ? 'محطات الجولة:' : 'Tour Rooms:'}</span>
            </span>
            <div className="imm-dock-items">
              {CHAPTERS.filter((c) => !c.isHero).map((c) => {
                const isActive = CHAPTERS[activeChapterIdx]?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => scrollToChapter(c.targetScroll)}
                    className={`imm-dock-btn ${isActive ? 'is-active' : ''}`}
                    title={isAr ? c.nameAr : c.nameEn}
                  >
                    <span className="imm-dock-dot" />
                    <span className="imm-dock-text">{isAr ? c.nameAr : c.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Side Progress Rail (Visible only after beginning walkthrough) */}
        {scrollProgress > 3 && (
          <div className="imm-progress-rail">
            <div className="imm-rail-track">
              <div className="imm-rail-indicator" style={{ height: `${scrollProgress}%` }} />
            </div>
            <div className="imm-rail-meta">
              <span className="imm-rail-num">{String(scrollProgress).padStart(2, '0')}%</span>
              <span className="imm-rail-tag">{isAr ? 'العمق المعماري' : 'DEPTH'}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
