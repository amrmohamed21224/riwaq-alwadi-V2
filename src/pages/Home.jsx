import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  Sparkles,
  Building,
  Building2,
  Maximize2,
  TreePine,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import {
  STUDIO_STATS,
  FEATURED_PROJECTS,
  PRESS_REVIEWS,
} from '../data/projectsData';
import BlueprintExplorer from '../components/home/BlueprintExplorer';
import ImmersiveIntro from '../components/home/ImmersiveIntro';
import ArchitecturalProjectCard from '../components/projects/ArchitecturalProjectCard';
import ArchitecturalMasterpieceModal from '../components/projects/ArchitecturalMasterpieceModal';
import ArchitecturalBlueprintModal from '../components/projects/ArchitecturalBlueprintModal';
import './Home.css';

const ProjectWalkthrough = lazy(() => import('../components/projects/ProjectWalkthrough'));

export default function Home({ lang }) {
  const [activeInspectProject, setActiveInspectProject] = useState(null);
  const [walkthroughProject, setWalkthroughProject] = useState(null);
  const [blueprintModalProject, setBlueprintModalProject] = useState(null);
  return (
    <div className="home-page">
      {/* 1. IMMERSIVE 3D WALKTHROUGH INTRO */}
      <ImmersiveIntro lang={lang} />

      {/* 2. STATS & ARCHITECTURAL MILESTONES */}
      <section className="stats-ribbon-section" id="studio-milestones">
        <div className="container">
          <div className="stats-header">
            <span className="gold-tag">
              <Award size={14} />
              {lang === 'ar' ? 'سجل الريادة والمنجزات' : 'Architectural Legacy & Scale'}
            </span>
            <h2 className="stats-heading">
              {lang === 'ar'
                ? 'أرقام تصنع الفارق وترسخ الهيبة المعمارية'
                : 'Pioneering Scale Across the Region'}
            </h2>
            <p className="stats-lead">
              {lang === 'ar'
                ? 'عقدان من صياغة المعالم الفاخرة والقصور الخاصة التي تتجاوز حدود الزمن وتلهم الأجيال.'
                : 'Nearly two decades of sculpting iconic monuments, monolithic villas, and visionary private sanctuaries.'}
            </p>
          </div>

          <div className="stats-cards-grid">
            {STUDIO_STATS.map((stat) => {
              const IconComponent =
                stat.icon === 'Sparkles'
                  ? Sparkles
                  : stat.icon === 'Building2'
                  ? Building2
                  : stat.icon === 'Award'
                  ? Award
                  : Maximize2;

              return (
                <div key={stat.id} className="stat-arch-card">
                  {/* Subtle architectural corner accents */}
                  <span className="arch-card-corner top-left" />
                  <span className="arch-card-corner bottom-right" />

                  <div className="stat-card-top">
                    <div className="stat-icon-pod">
                      <IconComponent size={20} />
                    </div>
                    <span className="stat-badge-tag">
                      {lang === 'ar' ? 'سجل موثق' : 'Verified'}
                    </span>
                  </div>

                  <div className="stat-number-wrap">
                    <span className="stat-number">{stat.value}</span>
                  </div>

                  <h3 className="stat-label">
                    {lang === 'ar' ? stat.labelAr : stat.labelEn}
                  </h3>

                  <p className="stat-desc">
                    {lang === 'ar' ? stat.descAr : stat.descEn}
                  </p>

                  <div className="stat-card-glow-line" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL PHILOSOPHY & MANIFESTO */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-left">
              <span className="gold-tag">
                <Sparkles size={14} />
                {lang === 'ar' ? 'رؤيتنا وفلسفتنا' : 'Studio Manifesto'}
              </span>
              <h2 className="philosophy-heading">
                {lang === 'ar'
                  ? 'العمارة ليست مجرد جدران، بل هي حوار دائم بين الإنسان والكون'
                  : 'Architecture is not mere walls; it is an eternal dialogue between human and cosmos.'}
              </h2>
              <div className="gold-divider"></div>
              <p className="philosophy-lead">
                {lang === 'ar'
                  ? 'في "رواق الوادي"، نرى في كل مشروع فرصة لإعادة كتابة العلاقة بين المكان والروح. نستلهم خطوطنا من تموجات أوديتنا الصخرية، معتمدين أحدث تقنيات النمذجة البارامترية والمواد المستدامة التي تزداد هيبة مع مرور السنين.'
                  : 'At Riwaq Al-Wadi, every project is a sacred canvas to re-envision human existence within space. We draw organic inspiration from monolithic desert canyons, blending parametric computational design with heirloom materials that age with regal grace.'}
              </p>

              <div className="lead-principal-quote glass-card">
                <Quote size={28} className="quote-icon" />
                <p>
                  {lang === 'ar'
                    ? '"هدفنا لا يقف عند تشييد مبانٍ جميلة؛ نحن نبني أيقونات تاريخية تتوارثها الأجيال وتبقى شاهداً على عبقرية المكان."'
                    : '"Our ambition is never confined to building shelters; we sculpt historic landmarks inherited across generations."'}
                </p>
                <div className="quote-author">
                  <strong>د. خالد بن إبراهيم الوادعي</strong>
                  <span>{lang === 'ar' ? 'المؤسس ورئيس التصميم المعماري' : 'Founder & Principal Design Architect'}</span>
                </div>
              </div>
            </div>

            <div className="philosophy-right">
              <div className="pillars-list">
                <div className="pillar-item glass-card">
                  <div className="pillar-icon-box">
                    <Building size={24} />
                  </div>
                  <div className="pillar-text">
                    <h3>{lang === 'ar' ? 'التجانس التضاريسي العضوي' : 'Topographical Resonance'}</h3>
                    <p>
                      {lang === 'ar'
                        ? 'تطويع الكتل المعمارية لتلتحم مع التضاريس الطبيعية دون تشويه، واستغلال حركة الرياح ومسارات الشمس لإنشاء ملاذات مريحة طبيعياً.'
                        : 'Integrating monolithic structures into natural terrain contours, harnessing wind microclimates and celestial sun paths.'}
                    </p>
                  </div>
                </div>

                <div className="pillar-item glass-card">
                  <div className="pillar-icon-box">
                    <TreePine size={24} />
                  </div>
                  <div className="pillar-text">
                    <h3>{lang === 'ar' ? 'الاستدامة الصفرية والذكاء البيئي' : 'Biophilic Net-Zero Intelligence'}</h3>
                    <p>
                      {lang === 'ar'
                        ? 'تطبيق معايير LEED Platinum العالمية، واستخدام أنظمة العزل المتقدمة والطاقة الكهروضوئية المدمجة في الواجهات.'
                        : 'Implementing global LEED Platinum standards with integrated photovoltaic facades and passive cooling geomancy.'}
                    </p>
                  </div>
                </div>

                <div className="pillar-item glass-card">
                  <div className="pillar-icon-box">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="pillar-text">
                    <h3>{lang === 'ar' ? 'المتانة والمواد الخالدة' : 'Heirloom Material Authenticity'}</h3>
                    <p>
                      {lang === 'ar'
                        ? 'اختيار الحجر الجيري الطبيعي، الخرسانة المعمارية المصقولة، وخشب الساج والبرونز الخالص لضمان بقاء المنشأة قروناً قادمة.'
                        : 'Curating raw desert limestone, architectural off-form concrete, and patinated bronze for enduring longevity.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE BLUEPRINT SECTION */}
      <BlueprintExplorer lang={lang} />

      {/* 5. MASTERPIECE FEATURED PROJECTS GALLERY */}
      <section id="featured-projects" className="featured-projects-section">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">
              <span className="gold-tag">
                <Award size={14} />
                {lang === 'ar' ? 'روائع المعمار المنجزة' : 'Signature Masterpieces'}
              </span>
            </div>
            <h2>
              {lang === 'ar'
                ? 'أيقونات معمارية تجسد الفخامة المطلقة'
                : 'Architectural Icons of Absolute Distinction'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'مختارات من مشاريعنا السكنية والتجارية الاستثنائية التي نالت إشادة النقاد وأعادت صياغة المشهد الحضري.'
                : 'A curated selection of our landmark private sanctuaries and iconic commercial developments.'}
            </p>
            <div className="gold-divider center"></div>
          </div>

          <div className="featured-projects-grid">
            {FEATURED_PROJECTS.map((project) => (
              <ArchitecturalProjectCard
                key={project.id}
                project={project}
                lang={lang}
                onInspect={(proj) => setActiveInspectProject(proj)}
                onEnter={(proj) => setWalkthroughProject(proj)}
                onOpenBlueprint={(proj) => setBlueprintModalProject(proj)}
              />
            ))}
          </div>

          <div className="projects-bottom-cta">
            <Link to="/media" className="btn-secondary">
              <span>{lang === 'ar' ? 'استعراض أرشيف المعرض بالكامل' : 'Explore Complete Media Archive'}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL PRESS & AWARDS RIBBON */}
      <section className="press-reviews-section">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">
              <span className="gold-tag">
                <Award size={14} />
                {lang === 'ar' ? 'أصداء الصحافة العالمية' : 'Global Press & Accolades'}
              </span>
            </div>
            <h2>
              {lang === 'ar' ? 'إشادات النقد المعماري الدولي' : 'Celebrated Across International Press'}
            </h2>
          </div>

          <div className="grid-3">
            {PRESS_REVIEWS.map((review, idx) => (
              <div key={idx} className="press-card glass-card">
                <Quote size={24} className="press-quote-icon" />
                <p className="press-quote-text">
                  {lang === 'ar' ? review.quoteAr : review.quoteEn}
                </p>
                <div className="press-card-footer">
                  <h4 className="publisher-name">{review.publisher}</h4>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CINEMATIC VIP INVITATION CALL TO ACTION */}
      <section className="vip-cta-section">
        <div className="container">
          <div className="vip-cta-card glass-card">
            <div className="cta-ambient-glow"></div>
            <div className="cta-content">
              <span className="gold-tag gold-tag-pulse">
                {lang === 'ar' ? 'استشارات كبار الشخصيات VIP' : 'Private VIP Consultations'}
              </span>
              <h2>
                {lang === 'ar'
                  ? 'هل أنت مستعد لبناء تحفتك المعمارية القادمة؟'
                  : 'Ready to Manifest Your Next Architectural Landmark?'}
              </h2>
              <p>
                {lang === 'ar'
                  ? 'يسعد فريقنا من كبار المعماريين ومهندسي الإنشاءات بلقائك لمناقشة أفكار مشروعك ووضع الرؤية التصميمية الأولية بسرية واحترافية متناهية.'
                : 'Our principal architects and structural masterminds are at your disposal to sculpt your visionary project with peerless exclusivity.'}
              </p>
              <div className="cta-buttons">
                <Link to="/contact" className="btn-primary">
                  <span>{lang === 'ar' ? 'حجز جلسة استشارية خاصة' : 'Schedule Private Consultation'}</span>
                  <ArrowUpRight size={18} />
                </Link>
                <Link to="/upcoming-projects" className="btn-secondary">
                  <span>{lang === 'ar' ? 'اطّلع على المشاريع المستقبلية' : 'View Upcoming Pipeline'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4K Architectural Masterpiece Modal */}
      {activeInspectProject && (
        <ArchitecturalMasterpieceModal
          project={activeInspectProject}
          lang={lang}
          onClose={() => setActiveInspectProject(null)}
        />
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
