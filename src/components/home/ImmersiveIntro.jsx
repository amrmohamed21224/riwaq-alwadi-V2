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
import { beginFxScene } from '../../walkthrough/fx';
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
  const heroMaskRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const railNumRef = useRef(null);
  const dockRef = useRef(null);
  const chapterStageRef = useRef(null);
  const hotRefs = useRef({});
  const { isSoundPlaying, toggleAmbientSound } = useSoundscape();

  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);

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
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 800;
    const introTier = window.innerWidth < 1100 ? 0 : (navigator.hardwareConcurrency || 4) <= 4 ? 1 : 2;
    const introQuality = {
      tier: introTier,
      shadows: introTier >= 1,
      bloom: introTier >= 2,
      reflections: introTier >= 2,
    };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, introTier === 0 ? 1 : 1.25));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = introQuality.shadows;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 70 : 56,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const rig = createCameraRig();

    // Bloom only on wide, capable screens, and at half resolution
    let composer = null;
    if (introQuality.bloom) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.22,
        0.4,
        0.9,
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    // Textures loader
    let villa = null;
    let disposed = false;
    const loader = new THREE.TextureLoader();
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

    beginFxScene(introQuality);
    villa = buildVilla(scene, projectTextures, renderer, introQuality);

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
      if (composer) composer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = window.innerWidth < 800 ? 70 : 56;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Visibility Observer — pause the loop when the intro leaves the screen or a project tour opens
    let isVisible = true;
    let walkthroughOpen = document.documentElement.classList.contains('wt-open');
    let looping = false;
    let animId = 0;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncLoop();
    });
    observer.observe(section);
    const classObserver = new MutationObserver(() => {
      walkthroughOpen = document.documentElement.classList.contains('wt-open');
      syncLoop();
    });
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const startTime = performance.now();
    let lastTick = startTime;
    const tempLookAt = new THREE.Vector3();
    let lastChapter = -1;
    const tempScreenPos = new THREE.Vector3();

    const tick = () => {
      if (!looping) return;
      animId = requestAnimationFrame(tick);
      if (!isVisible || walkthroughOpen) return;

      const now = performance.now();
      const dt = Math.min((now - lastTick) / 1000, 0.05);
      lastTick = now;
      const time = (now - startTime) * 0.001;

      currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-dt / 0.09));
      mouse.sx += (mouse.x - mouse.sx) * 0.045;
      mouse.sy += (mouse.y - mouse.sy) * 0.045;

      const { position, target: lookTarget } = rig.at(currentProgress);
      camera.position.copy(position);

      const isWalking = currentProgress > 0.15 && currentProgress < 0.88;
      if (isWalking) {
        camera.position.y += Math.sin(time * 1.8) * 0.012;
      }

      tempLookAt.copy(lookTarget);
      tempLookAt.x += mouse.sx * 1.5;
      tempLookAt.y -= mouse.sy * 0.8;
      camera.lookAt(tempLookAt);

      villa.update(time);
      if (composer) composer.render();
      else renderer.render(scene, camera);

      const heroFadeProgress = clamp(currentProgress / 0.12, 0, 1);
      const mask = heroMaskRef.current;
      if (mask) {
        mask.style.setProperty('--hero-opacity', String(1 - heroFadeProgress));
        mask.style.setProperty('--hero-zoom', String(1 + heroFadeProgress * 0.28));
        mask.style.setProperty('--hero-fade', String(heroFadeProgress));
        mask.style.pointerEvents = heroFadeProgress < 0.95 ? 'auto' : 'none';
        mask.style.visibility = heroFadeProgress >= 0.99 ? 'hidden' : 'visible';
      }

      const pct = Math.round(currentProgress * 100);
      if (railFillRef.current) railFillRef.current.style.height = `${pct}%`;
      if (railNumRef.current) railNumRef.current.textContent = String(pct).padStart(2, '0');
      if (railRef.current) railRef.current.classList.toggle('is-on', pct > 3);
      if (dockRef.current) dockRef.current.classList.toggle('is-faded', pct >= 97);
      if (chapterStageRef.current) chapterStageRef.current.classList.toggle('is-ending', pct >= 97);

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

      HOTSPOTS.forEach((spot) => {
        const el = hotRefs.current[spot.id];
        if (!el) return;
        const inRange = currentProgress >= spot.tRange[0] && currentProgress <= spot.tRange[1];
        if (!inRange) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        tempScreenPos.set(...spot.worldPos);
        tempScreenPos.project(camera);
        if (tempScreenPos.z >= 1) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        const x = (tempScreenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(tempScreenPos.y * 0.5) + 0.5) * window.innerHeight;
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      });
    };

    function syncLoop() {
      const should = isVisible && !walkthroughOpen;
      if (should && !looping) {
        looping = true;
        lastTick = performance.now();
        animId = requestAnimationFrame(tick);
      } else if (!should && looping) {
        looping = false;
        cancelAnimationFrame(animId);
      }
    }
    syncLoop();

    return () => {
      disposed = true;
      looping = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      classObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      villa && villa.dispose();
      projectTextures.forEach((t) => t.dispose());
      if (composer) composer.dispose();
      renderer.dispose();
    };
  }, []);

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
        <div ref={heroMaskRef} className="hero-photomask">
          <img
            src="/images/hero.jpg"
            alt="Riwaq Al-Wadi Architectural Masterpiece"
            className="hero-photomask-img"
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

            {/* Architectural Hero Title & Philosophy */}
            <div className="hero-title-block">
              <h1 className="hero-photomask-title">
                {isAr ? (
                  <span className="hero-title-main">رواق الوادي</span>
                ) : (
                  <span className="hero-title-main">RIWAQ AL-WADI</span>
                )}
              </h1>

              <div className="hero-title-ornament" aria-hidden="true">
                <span className="ornament-line ornament-line-left" />
                <span className="ornament-diamond">◆</span>
                <span className="ornament-line ornament-line-right" />
              </div>

              <div className="hero-title-sub">
                {isAr ? (
                  <span className="hero-sub-inner">
                    <span className="gold-shimmer-text">صِيَاغَة الفَرَاغِ</span>
                    <span className="hero-sub-sep">·</span>
                    <span className="hero-sub-light">وَالضَّوْء</span>
                  </span>
                ) : (
                  <span className="hero-sub-inner">
                    <span className="gold-shimmer-text">SCULPTING SPACE</span>
                    <span className="hero-sub-sep">·</span>
                    <span className="hero-sub-light">&amp; LIGHT</span>
                  </span>
                )}
              </div>
            </div>

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

        {/* Floating 3D Hotspots — positions are written from the render loop */}
        {HOTSPOTS.map((spot) => (
          <div
            key={spot.id}
            ref={(el) => {
              hotRefs.current[spot.id] = el;
            }}
            className="imm-hotspot-marker"
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
        <div ref={chapterStageRef} className="immersive-chapters-stage" aria-live="polite">
          {CHAPTERS.map((ch, idx) => {
            if (ch.isHero) return null;
            const isCurrent = activeChapterIdx === idx;
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
        <div ref={dockRef} className="imm-dock-container">
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

        <div ref={railRef} className="imm-progress-rail">
          <div className="imm-rail-track">
            <div ref={railFillRef} className="imm-rail-indicator" />
          </div>
          <div className="imm-rail-meta">
            <span className="imm-rail-num">
              <span ref={railNumRef}>00</span>%
            </span>
            <span className="imm-rail-tag">{isAr ? 'العمق المعماري' : 'DEPTH'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
