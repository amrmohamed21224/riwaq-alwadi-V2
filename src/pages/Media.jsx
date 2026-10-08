import React, { useState, Suspense, lazy } from 'react';
import {
  MEDIA_GALLERY,
  PRESS_REVIEWS,
  FEATURED_PROJECTS,
} from '../data/projectsData';
import ArchitecturalProjectCard from '../components/projects/ArchitecturalProjectCard';
import ArchitecturalMasterpieceModal from '../components/projects/ArchitecturalMasterpieceModal';
import ArchitecturalBlueprintModal from '../components/projects/ArchitecturalBlueprintModal';
import {
  Camera,
  Play,
  X,
  Maximize2,
  Award,
  Layers,
  ArrowUpRight,
  Filter,
  Film,
  Sparkles,
} from 'lucide-react';
import './Media.css';

const ProjectWalkthrough = lazy(() => import('../components/projects/ProjectWalkthrough'));

export default function Media({ lang }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [walkthroughProject, setWalkthroughProject] = useState(null);
  const [blueprintModalProject, setBlueprintModalProject] = useState(null);

  const categories = [
    { id: 'all', nameAr: 'كافة الأعمال', nameEn: 'All Works' },
    { id: 'villas', nameAr: 'الفلل والقصور الفاخرة', nameEn: 'Luxury Villas' },
    { id: 'commercial', nameAr: 'الأبراج والمجمعات', nameEn: 'Commercial & Towers' },
    { id: 'landscape', nameAr: 'اللاندسكيب والبيئة', nameEn: 'Landscape & Nature' },
    { id: 'interior', nameAr: 'التصميم الداخلي الفاخر', nameEn: 'Haute Interiors' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? MEDIA_GALLERY
      : MEDIA_GALLERY.filter((item) => item.category === activeCategory);

  const videoReels = [
    {
      id: 'reel-1',
      titleAr: 'الفيلم الوثائقي: نحت صخر الوادي — ولادة تحفة معمارية',
      titleEn: 'Documentary: Sculpting the Canyon Rock — Genesis of a Landmark',
      duration: '04:12',
      resolution: '4K UHD 60FPS',
      cover: '/images/hero.jpg',
      year: '2025',
    },
    {
      id: 'reel-2',
      titleAr: 'جولة سينمائية: محاكاة تدفق الرياح حول برج الرداء',
      titleEn: 'Cinematic Aerodynamic Study: The Obsidian Spire',
      duration: '03:45',
      resolution: '4K UHD DOLBY',
      cover: '/images/upcoming_landmark.jpg',
      year: '2025',
    },
    {
      id: 'reel-3',
      titleAr: 'فلسفة الصمت والضوء: التصميم الداخلي في قصر الأفق',
      titleEn: 'Silence & Light: Interior Poetry of the Horizon Manor',
      duration: '02:50',
      resolution: '4K UHD HDR',
      cover: '/images/projects/diriyah_palace.jpg',
      year: '2025',
    },
  ];

  return (
    <div className="media-page">
      {/* Media Page Header */}
      <section className="page-hero-section">
        <div className="container">
          <div className="page-hero-content text-center">
            <span className="gold-tag gold-tag-pulse">
              <Camera size={14} />
              {lang === 'ar' ? 'الأرشيف البصري والتوثيق المعماري' : 'Architectural Visual Archive'}
            </span>
            <h1 className="page-hero-title">
              {lang === 'ar'
                ? 'المركز الإعلامي والمعرض البصري'
                : 'Media Center & Curated Gallery'}
            </h1>
            <p className="page-hero-subtitle">
              {lang === 'ar'
                ? 'مجموعة منتقاة من الأعمال المصورة بعدسات رواد التصوير المعماري العالمي، لتوثيق مسيرة الإبداع والحضور الإعلامي لرواق الوادي.'
                : 'A curated visual repository captured by premier architectural photographers, documenting the spatial triumphs of Riwaq Al-Wadi.'}
            </p>
            <div className="gold-divider center"></div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="media-filter-section">
        <div className="container">
          <div className="filters-container">
            <div className="filter-badge-label">
              <Filter size={16} className="gold-icon" />
              <span>{lang === 'ar' ? 'تصفية الفئات:' : 'Filter Archive:'}</span>
            </div>
            <div className="filter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {lang === 'ar' ? cat.nameAr : cat.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="media-gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <ArchitecturalProjectCard
                key={item.id}
                project={item}
                lang={lang}
                onInspect={(proj) => setActiveModalItem(proj)}
                onOpenBlueprint={(proj) => setBlueprintModalProject(proj)}
                onEnter={(proj) => {
                  const resolved = FEATURED_PROJECTS.find((p) => p.id === (proj.projectId || proj.id)) || proj;
                  setWalkthroughProject(resolved);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video Reels Section */}
      <section className="cinematic-reels-section">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">
              <span className="gold-tag">
                <Film size={14} />
                {lang === 'ar' ? 'الأفلام الوثائقية المعمارية' : 'Architectural Films'}
              </span>
            </div>
            <h2>
              {lang === 'ar' ? 'جولات سينمائية ثلاثية الأبعاد' : 'Cinematic Virtual Explorations'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'استكشف حركة الضوء وانسيابية الهواء عبر عروض فيديو ملتقطة بتقنيات السينما المعمارية الفائقة.'
                : 'Experience spatial fluidity, natural light transitions, and structural physics through motion.'}
            </p>
            <div className="gold-divider center"></div>
          </div>

          <div className="grid-3">
            {videoReels.map((reel) => (
              <div
                key={reel.id}
                className="reel-card glass-card"
                onClick={() => setActiveVideoModal(reel)}
              >
                <div className="reel-media-wrapper">
                  <img
                    src={reel.cover}
                    alt={lang === 'ar' ? reel.titleAr : reel.titleEn}
                    className="reel-cover"
                  />
                  <div className="reel-overlay"></div>
                  <div className="play-button-pulse">
                    <Play size={22} fill="currentColor" />
                  </div>
                  <span className="reel-duration">{reel.duration}</span>
                  <span className="reel-res-badge">{reel.resolution}</span>
                </div>

                <div className="reel-content">
                  <span className="reel-year">{reel.year}</span>
                  <h3 className="reel-title">
                    {lang === 'ar' ? reel.titleAr : reel.titleEn}
                  </h3>
                  <div className="reel-watch-link">
                    <span>{lang === 'ar' ? 'مشاهدة العرض السينمائي' : 'Watch Showcase'}</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4K Masterpiece Inspection Modal */}
      {activeModalItem && (
        <ArchitecturalMasterpieceModal
          project={activeModalItem}
          lang={lang}
          onClose={() => setActiveModalItem(null)}
        />
      )}

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div
          className="lightbox-overlay"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="lightbox-dialog video-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setActiveVideoModal(null)}
              aria-label="إغلاق"
            >
              <X size={26} />
            </button>

            <div className="video-player-container">
              <img
                src={activeVideoModal.cover}
                alt="Video playback cover"
                className="video-sim-bg"
              />
              <div className="video-sim-overlay">
                <div className="video-sim-pulse-btn">
                  <Play size={36} fill="#c8a97e" />
                </div>
                <div className="video-sim-meta">
                  <h3>{lang === 'ar' ? activeVideoModal.titleAr : activeVideoModal.titleEn}</h3>
                  <div className="video-meta-tags">
                    <span>{activeVideoModal.resolution}</span>
                    <span>{activeVideoModal.duration}</span>
                    <span>STUDIO MASTER REEL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Interactive CAD Architectural Blueprint Modal */}
      {blueprintModalProject && (
        <ArchitecturalBlueprintModal
          project={blueprintModalProject}
          lang={lang}
          onClose={() => setBlueprintModalProject(null)}
        />
      )}

      {/* Immersive 3D project walkthrough */}
      {walkthroughProject && (
        <Suspense fallback={null}>
          <ProjectWalkthrough
            key={walkthroughProject.id}
            project={walkthroughProject}
            lang={lang}
            onClose={() => setWalkthroughProject(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
