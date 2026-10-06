import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, Volume2, VolumeX, ChevronDown, Info, Layers, Eye, ArrowUpRight, Award, Compass, MousePointer2 } from 'lucide-react';
import { createEngine } from '../../walkthrough/engine';
import { createAmbience } from '../../walkthrough/ambience';
import './ProjectWalkthrough.css';

const LOADERS = {
  'cliff-sanctuary': () => import('../../walkthrough/scenes/cliff'),
  'hammam-atrium': () => import('../../walkthrough/scenes/hammam'),
  'emerald-oasis': () => import('../../walkthrough/scenes/alula'),
  'diriyah-manor': () => import('../../walkthrough/scenes/diriyah'),
  'celestial-penthouse': () => import('../../walkthrough/scenes/penthouse'),
  'marble-colonnade': () => import('../../walkthrough/scenes/colonnade'),
};

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

export default function ProjectWalkthrough({ project, lang, onClose }) {
  const isAr = lang === 'ar';
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollerRef = useRef(null);
  const engineRef = useRef(null);
  const audioRef = useRef(null);
  const hotRefs = useRef({});
  const pctRef = useRef(null);
  const railRef = useRef(null);
  const defRef = useRef(null);
  const chapterRef = useRef(0);

  const [def, setDef] = useState(null);
  const [load, setLoad] = useState({ p: 0, label: '' });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [openSpot, setOpenSpot] = useState(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const [sound, setSound] = useState(false);
  const [started, setStarted] = useState(false);

  /* lock page scroll while open + Esc to close */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('wt-open');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove('wt-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  /* build the engine for this project */
  useEffect(() => {
    let disposed = false;
    let engine = null;
    const loader = LOADERS[project.id];
    if (!loader) {
      setError('NO_SCENE');
      return undefined;
    }

    const onFrame = ({ progress }) => {
      const d = defRef.current;
      if (!d) return;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(progress * 100)).padStart(2, '0');
      if (railRef.current) railRef.current.style.height = `${progress * 100}%`;
      let idx = 0;
      for (let i = 0; i < d.chapters.length; i++) if (progress >= d.chapters[i].start) idx = i;
      if (idx !== chapterRef.current) {
        chapterRef.current = idx;
        setChapterIdx(idx);
      }
      d.hotspots?.forEach((h) => {
        const el = hotRefs.current[h.id];
        if (!el) return;
        const inRange = progress >= h.range[0] && progress <= h.range[1];
        if (!inRange || !engine) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        const s = engine.project(h.pos);
        if (!s.visible) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
        el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
      });
    };

    (async () => {
      try {
        const mod = await loader();
        if (disposed) return;
        const d = mod.default;
        defRef.current = d;
        setDef(d);
        engine = await createEngine({
          canvas: canvasRef.current,
          def: d,
          onLoadProgress: (p, label) => !disposed && setLoad({ p, label }),
          onFrame,
        });
        if (disposed) {
          engine.dispose();
          return;
        }
        engineRef.current = engine;
        audioRef.current = createAmbience(d.audio || {});
        setReady(true);
      } catch (e) {
        console.error(e);
        if (!disposed) setError(e.message === 'WEBGL_UNAVAILABLE' ? 'WEBGL' : 'FAIL');
      }
    })();

    const onResize = () => engine && engine.resize();
    const onVis = () => engine && engine.setVisible(!document.hidden);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      audioRef.current && audioRef.current.dispose();
      audioRef.current = null;
      if (engine) engine.dispose();
      engineRef.current = null;
      defRef.current = null;
    };
  }, [project.id]);

  /* scroll -> camera progress */
  useEffect(() => {
    if (!ready) return undefined;
    const sc = scrollerRef.current;
    const onScroll = () => {
      const max = sc.scrollHeight - sc.clientHeight;
      const p = max > 0 ? sc.scrollTop / max : 0;
      engineRef.current && engineRef.current.setProgress(p);
      if (p > 0.012) setStarted(true);
    };
    onScroll();
    sc.addEventListener('scroll', onScroll, { passive: true });
    return () => sc.removeEventListener('scroll', onScroll);
  }, [ready]);

  const onPointerMove = useCallback((e) => {
    engineRef.current && engineRef.current.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
  }, []);

  const onWheel = (e) => {
    const sc = scrollerRef.current;
    if (!sc || sc.contains(e.target)) return;
    sc.scrollTop += e.deltaY;
  };

  const goTo = (p) => {
    const sc = scrollerRef.current;
    if (!sc) return;
    sc.scrollTo({ top: p * (sc.scrollHeight - sc.clientHeight), behavior: 'smooth' });
  };

  const toggleSound = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.playing) {
      a.stop();
      setSound(false);
    } else {
      a.start();
      setSound(true);
    }
  };

  const title = isAr ? project.titleAr : project.titleEn;
  const chapters = def?.chapters || [];
  const ch = chapters[chapterIdx];
  const isLast = chapterIdx === chapters.length - 1 && chapters.length > 0;

  return (
    <div ref={rootRef} className="wt-root" dir={isAr ? 'rtl' : 'ltr'} onPointerMove={onPointerMove} onWheel={onWheel} role="dialog" aria-modal="true" aria-label={title}>
      <canvas ref={canvasRef} className="wt-canvas" />

      {/* invisible scroll driver */}
      <div ref={scrollerRef} className={`wt-scroller ${ready ? '' : 'is-locked'}`} tabIndex={0}>
        <div className="wt-track" style={{ height: `${def?.scroll || 800}vh` }} />
      </div>

      {/* film vignette */}
      <div className="wt-vignette" aria-hidden="true" />

      {/* hotspots */}
      {ready &&
        def?.hotspots?.map((h) => (
          <div key={h.id} ref={(el) => (hotRefs.current[h.id] = el)} className="wt-hotspot" style={{ opacity: 0 }}>
            <button className="wt-pin" onClick={() => setOpenSpot(openSpot === h.id ? null : h.id)} aria-label={isAr ? h.tagAr : h.tagEn}>
              <span className="wt-pin-pulse" />
              <Info size={13} />
            </button>
            {openSpot === h.id && (
              <div className="wt-spot-card">
                <button className="wt-spot-x" onClick={() => setOpenSpot(null)} aria-label="close">
                  <X size={13} />
                </button>
                <span className="wt-tag">{isAr ? h.tagAr : h.tagEn}</span>
                <p>{isAr ? h.descAr : h.descEn}</p>
              </div>
            )}
          </div>
        ))}

      {/* HUD */}
      {ready && (
        <>
          <header className="wt-topbar">
            <div className="wt-brand">
              <span className="wt-brand-code">{project.blueprintCode}</span>
              <strong>{title}</strong>
            </div>
            <div className="wt-actions">
              <button className={`wt-pill ${sound ? 'is-on' : ''}`} onClick={toggleSound} title={isAr ? 'الأجواء الصوتية' : 'Soundscape'}>
                {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{sound ? (isAr ? 'الصوت: نشط' : 'Sound ON') : isAr ? 'الأجواء' : 'Atmosphere'}</span>
              </button>
              <button className={`wt-pill ${showSpecs ? 'is-on' : ''}`} onClick={() => setShowSpecs((s) => !s)}>
                <Layers size={15} />
                <span>{isAr ? 'ملف المشروع' : 'Project File'}</span>
              </button>
              <button className="wt-close" onClick={onClose} aria-label={isAr ? 'العودة للمشاريع' : 'Back to projects'}>
                <X size={18} />
                <span>{isAr ? 'عودة للمشاريع' : 'Back to projects'}</span>
              </button>
            </div>
          </header>

          {/* opening title splash */}
          <div className={`wt-splash ${started ? 'is-gone' : ''}`}>
            <span className="wt-tag">
              <Compass size={13} /> {isAr ? project.categoryAr : project.categoryEn}
            </span>
            <h1>{title}</h1>
            <p>
              {isAr ? project.locationAr : project.locationEn} · {project.area} · {project.year}
            </p>
            <div className="wt-scroll-cue">
              <MousePointer2 size={16} />
              <span>{isAr ? 'مرّر لتدخل المشروع وتتجول بداخله' : 'Scroll to step inside and explore'}</span>
              <ChevronDown size={16} className="wt-bounce" />
            </div>
          </div>

          {/* chapter card */}
          {chapters.map((c, i) => (
            <article key={c.id} className={`wt-chapter ${i === chapterIdx && started && !c.hero ? 'is-active' : ''}`} aria-live="polite">
              <span className="wt-chapter-badge">
                {c.no} — {isAr ? c.nameAr : c.nameEn}
              </span>
              <h2>{isAr ? c.titleAr : c.titleEn}</h2>
              <i className="wt-div" />
              <p>{isAr ? c.textAr : c.textEn}</p>
              {c.end && (
                <div className="wt-chapter-cta">
                  <button className="btn-primary" onClick={onClose}>
                    <span>{isAr ? 'العودة لمعرض المشاريع' : 'Return to Projects'}</span>
                    <ArrowUpRight size={17} />
                  </button>
                  <Link to="/contact" className="btn-secondary" onClick={onClose}>
                    <span>{isAr ? 'اطلب مشروعاً مماثلاً' : 'Commission Similar'}</span>
                  </Link>
                </div>
              )}
            </article>
          ))}

          {/* dock */}
          <nav className="wt-dock" aria-label="rooms">
            <span className="wt-dock-label">
              <Eye size={13} /> {isAr ? 'محطات الجولة' : 'Tour stops'}
            </span>
            <div className="wt-dock-items">
              {chapters
                .filter((c) => !c.hero)
                .map((c) => (
                  <button key={c.id} className={`wt-dock-btn ${ch?.id === c.id ? 'is-active' : ''}`} onClick={() => goTo(c.target)}>
                    <i />
                    <span>{isAr ? c.nameAr : c.nameEn}</span>
                  </button>
                ))}
            </div>
          </nav>

          {/* progress rail */}
          <div className="wt-rail" aria-hidden="true">
            <div className="wt-rail-track">
              <div ref={railRef} className="wt-rail-fill" />
            </div>
            <span className="wt-rail-num">
              <b ref={pctRef}>00</b>%
            </span>
          </div>

          {/* specs drawer */}
          <aside className={`wt-specs ${showSpecs ? 'is-open' : ''}`}>
            <button className="wt-spot-x" onClick={() => setShowSpecs(false)} aria-label="close">
              <X size={15} />
            </button>
            <span className="wt-tag">
              <Award size={12} /> {isAr ? project.awardAr : project.awardEn}
            </span>
            <h3>{title}</h3>
            <p className="wt-specs-concept">{isAr ? project.conceptAr : project.conceptEn}</p>
            <dl>
              <div>
                <dt>{isAr ? 'الموقع' : 'Location'}</dt>
                <dd>{isAr ? project.locationAr : project.locationEn}</dd>
              </div>
              <div>
                <dt>{isAr ? 'المساحة' : 'Area'}</dt>
                <dd>{project.area}</dd>
              </div>
              <div>
                <dt>{isAr ? 'سنة الإنجاز' : 'Year'}</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>{isAr ? 'كبير المعماريين' : 'Lead Architect'}</dt>
                <dd>{isAr ? project.leadArchitectAr : project.leadArchitectEn}</dd>
              </div>
            </dl>
            <h4>{isAr ? 'لوحة الخامات' : 'Material Palette'}</h4>
            <ul>
              {project.materials?.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </aside>
        </>
      )}

      {/* loader */}
      {!ready && !error && (
        <div className="wt-loader">
          <img src={project.image} alt="" aria-hidden="true" />
          <div className="wt-loader-inner">
            <span className="wt-tag">{isAr ? 'جارٍ تجهيز الجولة ثلاثية الأبعاد' : 'Preparing 3D walkthrough'}</span>
            <h2>{title}</h2>
            <div className="wt-loader-bar">
              <i style={{ width: `${Math.round(clamp(load.p, 0.03, 1) * 100)}%` }} />
            </div>
            <small>{isAr ? 'تحميل الخامات والإضاءة الواقعية…' : 'Synthesising materials & lighting…'}</small>
          </div>
          <button className="wt-close wt-close-loader" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="wt-loader">
          <img src={project.image} alt="" aria-hidden="true" />
          <div className="wt-loader-inner">
            <h2>{isAr ? 'تعذّر تشغيل الجولة ثلاثية الأبعاد' : '3D walkthrough unavailable'}</h2>
            <p className="wt-err">
              {error === 'WEBGL'
                ? isAr
                  ? 'متصفحك لا يدعم WebGL. جرّب متصفحاً حديثاً.'
                  : 'Your browser does not support WebGL.'
                : isAr
                  ? 'حدث خطأ أثناء تحميل المشهد.'
                  : 'The scene failed to load.'}
            </p>
            <button className="btn-primary" onClick={onClose}>
              <span>{isAr ? 'عودة' : 'Back'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
