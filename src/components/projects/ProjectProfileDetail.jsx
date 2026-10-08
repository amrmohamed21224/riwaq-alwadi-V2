import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Layers,
  Sparkles,
  CheckCircle,
  Building2,
  TreePine,
  ShieldCheck,
  Award,
  Maximize2,
  Calendar,
  MapPin,
  User,
  Quote,
  ArrowUp,
  ArrowUpRight,
  Info,
  Thermometer,
  Wind,
  Sun,
  Zap,
} from 'lucide-react';
import { getProjectBlueprint } from '../../data/projectsData';
import './ProjectProfileDetail.css';

export default function ProjectProfileDetail({ project, lang, onBackToTop, onClose }) {
  const isAr = lang === 'ar';
  const bpData = getProjectBlueprint(project.id);
  const floors = bpData.floors || [];

  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(
    floors[0]?.hotspots[0] || null
  );

  const activeFloor = floors[activeFloorIndex] || floors[0];

  const handleFloorChange = (index) => {
    setActiveFloorIndex(index);
    setSelectedHotspot(floors[index]?.hotspots[0] || null);
  };

  const title = isAr ? project.titleAr : project.titleEn;
  const category = isAr ? project.categoryAr : project.categoryEn;
  const location = isAr ? project.locationAr : project.locationEn;
  const leadArchitect = isAr ? project.leadArchitectAr : project.leadArchitectEn;
  const award = isAr ? project.awardAr : project.awardEn;
  const concept = isAr ? project.conceptAr : project.conceptEn;
  const specs = project.technicalSpecs || {};

  return (
    <div className="project-profile-container" id="project-profile-root" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. PROFILE HERO HEADER */}
      <section className="profile-hero-section">
        <div className="container">
          <div className="profile-hero-badge-row">
            <span className="gold-tag gold-tag-pulse">
              <Compass size={14} />
              {isAr ? 'الملف المعماري الشامل والمخططات' : 'Comprehensive Architectural Monograph'}
            </span>
            <span className="profile-code-badge">{project.blueprintCode || bpData.code}</span>
            <span className="profile-sheet-badge">{bpData.sheet || 'SHEET A101'}</span>
          </div>

          <h1 className="profile-main-title">{title}</h1>

          <div className="profile-gold-divider" />

          {/* Quick Facts Ribbon */}
          <div className="profile-facts-ribbon">
            <div className="fact-item">
              <MapPin size={16} className="gold-icon" />
              <div>
                <span className="fact-label">{isAr ? 'الموقع الجغرافي' : 'Location'}</span>
                <strong>{location}</strong>
              </div>
            </div>
            <div className="fact-item">
              <Maximize2 size={16} className="gold-icon" />
              <div>
                <span className="fact-label">{isAr ? 'المساحة الإجمالية' : 'Total Area'}</span>
                <strong>{project.area}</strong>
              </div>
            </div>
            <div className="fact-item">
              <Calendar size={16} className="gold-icon" />
              <div>
                <span className="fact-label">{isAr ? 'سنة الإنجاز' : 'Year'}</span>
                <strong>{project.year}</strong>
              </div>
            </div>
            <div className="fact-item">
              <User size={16} className="gold-icon" />
              <div>
                <span className="fact-label">{isAr ? 'كبير المعماريين' : 'Lead Architect'}</span>
                <strong>{leadArchitect}</strong>
              </div>
            </div>
            <div className="fact-item">
              <Award size={16} className="gold-icon" />
              <div>
                <span className="fact-label">{isAr ? 'التكريم والجوائز' : 'Accolade'}</span>
                <strong>{award}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED INTERACTIVE CAD BLUEPRINT STAGE */}
      <section className="profile-blueprint-section" id="wt-blueprint">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-tag">
              <Layers size={14} />
              {isAr ? 'المخطط الهندسي التنفيذي CAD' : 'Executive CAD Blueprint Schematic'}
            </span>
            <h2 className="section-title">
              {isAr ? bpData.titleAr : bpData.titleEn}
            </h2>
            <p className="section-subtitle">
              {isAr
                ? 'تشريح الفراغ والمساقط الأفقية وتوزيع الكتل الإنشائية وتفاصيل الفراغات وفق المعايير المعمارية العالمية — انقر على النقاط المضيئة لمعاينة التفاصيل.'
                : 'Interactive blueprint explorer — select glowing nodes on the plan to inspect spatial ergonomics and structural calculations.'}
            </p>
            <div className="gold-divider center" />
          </div>

          <div className="profile-blueprint-dashboard glass-card">
            {/* Top Bar: Floor Tabs & Quick Metrics */}
            <div className="blueprint-top-bar">
              <div className="floor-tabs">
                <span className="floor-tabs-label">
                  <Layers size={16} className="gold-icon" />
                  {isAr ? 'اختر المستوى:' : 'Select Level:'}
                </span>
                {floors.map((floor, idx) => (
                  <button
                    key={floor.id}
                    className={`floor-tab-btn ${activeFloorIndex === idx ? 'active' : ''}`}
                    onClick={() => handleFloorChange(idx)}
                  >
                    <span className="floor-number">0{idx + 1}</span>
                    <span className="floor-title">
                      {isAr ? floor.nameAr : floor.nameEn}
                    </span>
                  </button>
                ))}
              </div>

              <div className="floor-quick-specs">
                <div className="spec-badge">
                  <span className="spec-label">{isAr ? 'المساحة' : 'Area'}</span>
                  <span className="spec-val">{activeFloor?.area || project.area}</span>
                </div>
                <div className="spec-badge">
                  <span className="spec-label">{isAr ? 'ارتفاع السقف' : 'Clearance'}</span>
                  <span className="spec-val">{activeFloor?.ceilingHeight || '4.5 م'}</span>
                </div>
                <div className="spec-badge">
                  <span className="spec-label">{isAr ? 'المقياس' : 'Scale'}</span>
                  <span className="spec-val">{bpData.scale || '1:100 @ A0'}</span>
                </div>
              </div>
            </div>

            {/* Stage Layout */}
            <div className="profile-blueprint-stage">
              {/* Canvas Wrap */}
              <div className="profile-blueprint-canvas">
                <img
                  src={bpData.image}
                  alt={`CAD Blueprint ${title}`}
                  className="profile-blueprint-img"
                />

                {/* Hotspot Markers */}
                {activeFloor?.hotspots?.map((spot) => (
                  <button
                    key={spot.id}
                    className={`hotspot-marker ${selectedHotspot?.id === spot.id ? 'active' : ''}`}
                    style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                    onClick={() => setSelectedHotspot(spot)}
                    aria-label={isAr ? spot.titleAr : spot.titleEn}
                  >
                    <span className="hotspot-pulse" />
                    <span className="hotspot-core" />
                    <span className="hotspot-label">
                      {isAr ? spot.titleAr : spot.titleEn}
                    </span>
                  </button>
                ))}

                {/* CAD Overlays */}
                <div className="blueprint-crosshair top-left" />
                <div className="blueprint-crosshair top-right" />
                <div className="blueprint-crosshair bottom-left" />
                <div className="blueprint-crosshair bottom-right" />
                <div className="cad-scale-bar">
                  <span>{bpData.scale || 'SCALE 1:100 @ A0'}</span>
                  <div className="scale-ticks" />
                </div>
              </div>

              {/* Information Drawer */}
              <div className="profile-blueprint-drawer">
                <div className="panel-header">
                  <span className="node-id-badge">
                    <Sparkles size={14} />
                    {isAr ? 'العنصر المعماري النشط' : 'Active Spatial Focus'}
                  </span>
                  <span className="node-index">
                    NODE #{selectedHotspot?.id || '01'}
                  </span>
                </div>

                {selectedHotspot ? (
                  <div className="panel-body">
                    <h3 className="panel-title">
                      {isAr ? selectedHotspot.titleAr : selectedHotspot.titleEn}
                    </h3>

                    <p className="panel-desc">
                      {isAr ? selectedHotspot.descAr : selectedHotspot.descEn}
                    </p>

                    <div className="panel-spec-list">
                      <div className="panel-spec-item">
                        <CheckCircle size={16} className="gold-icon" />
                        <span>
                          {isAr
                            ? 'عزل حراري وصوتي فائق الكفاءة متوافق مع كود البناء السعودي والأوروبي'
                            : 'High-performance acoustic and thermal envelope insulation'}
                        </span>
                      </div>
                      <div className="panel-spec-item">
                        <CheckCircle size={16} className="gold-icon" />
                        <span>
                          {isAr
                            ? 'توزيع استراتيجي لفتحات التهوية الطبيعية والإضاءة غير المباشرة'
                            : 'Strategic passive airflow channels and indirect diurnal illumination'}
                        </span>
                      </div>
                      <div className="panel-spec-item">
                        <CheckCircle size={16} className="gold-icon" />
                        <span>
                          {isAr
                            ? 'تشطيبات حجرية ورخامية مخصصة مقاومة للعوامل المناخية القاسية'
                            : 'Heirloom stone finishes engineered for resilience against harsh microclimates'}
                        </span>
                      </div>
                    </div>

                    <div className="panel-footer">
                      <span className="tip-text">
                        <Info size={14} />
                        {isAr
                          ? 'انقر على أي نقطة مضيئة في المخطط لمعاينة تفاصيل الفراغ'
                          : 'Click any glowing node on the plan to inspect spatial details'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="panel-empty">
                    <p>{isAr ? 'اختر عنصراً من المخطط' : 'Select a node on the blueprint'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL PHILOSOPHY & MANIFESTO */}
      <section className="profile-philosophy-section">
        <div className="container">
          <div className="philosophy-layout">
            <div className="philosophy-narrative">
              <span className="gold-tag">
                <Sparkles size={14} />
                {isAr ? 'الفلسفة المعمارية وسياق التصميم' : 'Architectural Philosophy & Intent'}
              </span>
              <h2 className="philosophy-title">
                {isAr
                  ? 'حوار صامت بين صلابة المادة وانسيابية النور'
                  : 'A Poetic Dialogue Between Monolithic Form and Fluid Light'}
              </h2>
              <div className="gold-divider" />
              <p className="philosophy-text">{concept}</p>

              {/* Lead Architect Quote */}
              <div className="lead-principal-quote glass-card">
                <Quote size={28} className="quote-icon" />
                <p>
                  {isAr
                    ? `«في ${title}، لم نكن نبني فراغات فحسب، بل كنا نصنع إيقاعاً زمنياً وملاذاً يمنح الساكن شعوراً بالهيبة والسكينة المطلقة.»`
                    : `“In ${title}, our objective was not merely building spaces, but sculpting a sacred temporal rhythm that breathes absolute stillness.”`}
                </p>
                <div className="quote-author">
                  <strong>{leadArchitect}</strong>
                  <span>{isAr ? 'استوديو رواق الوادي للتصميم المعماري' : 'Riwaq Al-Wadi Architectural Atelier'}</span>
                </div>
              </div>
            </div>

            <div className="philosophy-pillars">
              <div className="pillar-box glass-card">
                <Building2 size={24} className="gold-icon" />
                <h3>{isAr ? 'التجانس التضاريسي العضوي' : 'Topographical Resonance'}</h3>
                <p>
                  {isAr
                    ? 'التحام دقيق مع طبيعة الأرض وتضاريس الموقع لضمان بقاء المنشأة كجزء لا يتجزأ من البيئة المحيطة.'
                    : 'Harmonious integration into site contours ensuring the structure stands as an organic extension of terrain.'}
                </p>
              </div>

              <div className="pillar-box glass-card">
                <TreePine size={24} className="gold-icon" />
                <h3>{isAr ? 'الاستدامة والذكاء المناخي' : 'Biophilic Net-Zero Intelligence'}</h3>
                <p>
                  {isAr
                    ? 'استثمار حركة الشمس وظلال الجروف الطبيعية وتيارات الرياح لخفض استهلاك الطاقة وتوفير بيئة داخلية مثالية.'
                    : 'Harnessing solar trajectories, natural canyon shadows, and wind channels for passive climatic comfort.'}
                </p>
              </div>

              <div className="pillar-box glass-card">
                <ShieldCheck size={24} className="gold-icon" />
                <h3>{isAr ? 'المتانة والمواد الخالدة' : 'Heirloom Material Authenticity'}</h3>
                <p>
                  {isAr
                    ? 'اختيار مواد طبيعية تزداد عراقة وجمالاً مع مرور السنين دون حاجة لتعديلات مستمرة.'
                    : 'Hand-selected natural stones and metals that age with regal dignity across generations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MATERIALITY PALETTE & TACTILE DETAILS */}
      {project.materialsDetail && (
        <section className="profile-materials-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="gold-tag">
                <Compass size={14} />
                {isAr ? 'لوحة الخامات المعمارية' : 'Materiality Palette & Textures'}
              </span>
              <h2 className="section-title">
                {isAr ? 'أصالة المواد وفنون الصياغة' : 'Curated Tactile Materiality'}
              </h2>
              <p className="section-subtitle">
                {isAr
                  ? 'تم استيراد واختيار كل خامة بعناية فائقة من أندر المحاجر وورش الحرفيين لضمان تجربة حسية وبصرية لا مثيل لها.'
                  : 'Every stone, timber, and metal element was hand-selected from premier quarries and artisanal ateliers.'}
              </p>
              <div className="gold-divider center" />
            </div>

            <div className="materials-cards-grid">
              {project.materialsDetail.map((mat, idx) => (
                <div key={idx} className="material-card glass-card">
                  <div className="mat-card-header">
                    <span className="mat-number">0{idx + 1}</span>
                    <span className="mat-origin">{mat.origin}</span>
                  </div>
                  <h3 className="mat-name">{isAr ? mat.nameAr : mat.nameEn}</h3>
                  <div className="mat-divider" />
                  <p className="mat-finish">
                    <strong>{isAr ? 'طريقة الصياغة:' : 'Finish:'} </strong>
                    {mat.finish}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. STRUCTURAL & TECHNICAL SPECIFICATIONS MATRIX */}
      <section className="profile-specs-section" id="wt-specs">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-tag">
              <ShieldCheck size={14} />
              {isAr ? 'المصفوفة التقنية والهندسية' : 'Structural & Engineering Matrix'}
            </span>
            <h2 className="section-title">
              {isAr ? 'أدق الحسابات والمعايير الإنشائية' : 'Engineering Precision & Calculations'}
            </h2>
            <p className="section-subtitle">
              {isAr
                ? 'توثيق المواصفات الإنشائية والحرارية والبيئية المعتمدة في المخططات التنفيذية للمشروع.'
                : 'Verified structural systems, thermal envelope ratings, and microclimate engineering parameters.'}
            </p>
            <div className="gold-divider center" />
          </div>

          <div className="specs-matrix-grid">
            <div className="spec-matrix-item glass-card">
              <div className="matrix-icon"><Building2 size={22} /></div>
              <h4>{isAr ? 'الهيكل الإنشائي والجسور' : 'Structural System'}</h4>
              <p>{isAr ? specs.structure : specs.structureEn || specs.structure}</p>
            </div>

            <div className="spec-matrix-item glass-card">
              <div className="matrix-icon"><Maximize2 size={22} /></div>
              <h4>{isAr ? 'ارتفاع الأسقف والفراغات' : 'Ceiling Clearances'}</h4>
              <p>{isAr ? specs.ceilingHeight : specs.ceilingHeightEn || specs.ceilingHeight}</p>
            </div>

            <div className="spec-matrix-item glass-card">
              <div className="matrix-icon"><Thermometer size={22} /></div>
              <h4>{isAr ? 'الغلاف الحراري والواجهات' : 'Thermal Envelope'}</h4>
              <p>{isAr ? specs.thermalEnvelope : specs.thermalEnvelopeEn || specs.thermalEnvelope}</p>
            </div>

            <div className="spec-matrix-item glass-card">
              <div className="matrix-icon"><Zap size={22} /></div>
              <h4>{isAr ? 'معايير الاستدامة والتصنيف' : 'Sustainability Rating'}</h4>
              <p>{isAr ? specs.sustainability : specs.sustainabilityEn || specs.sustainability}</p>
            </div>

            <div className="spec-matrix-item glass-card">
              <div className="matrix-icon"><Sun size={22} /></div>
              <h4>{isAr ? 'التوجيه الشمسي والأيروديناميكي' : 'Solar & Wind Orientation'}</h4>
              <p>{isAr ? specs.orientation : specs.orientationEn || specs.orientation}</p>
            </div>

            <div className="spec-matrix-item glass-card">
              <div className="matrix-icon"><Wind size={22} /></div>
              <h4>{isAr ? 'أنظمة التكييف والتهوية الذكية' : 'HVAC & Climate Microclimate'}</h4>
              <p>{isAr ? specs.hvac : specs.hvacEn || specs.hvac}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CURATED VISUAL GALLERY */}
      <section className="profile-gallery-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-tag">
              <Sparkles size={14} />
              {isAr ? 'المعرض البصري للتحفة' : 'Curated Visual Archive'}
            </span>
            <h2 className="section-title">
              {isAr ? 'مشاهد من واقع التحفة المعمارية' : 'Perspectives of Architectural Grandeur'}
            </h2>
            <div className="gold-divider center" />
          </div>

          <div className="profile-gallery-grid">
            <div className="gallery-main-frame">
              <img src={project.image} alt={title} className="gallery-img" />
              <div className="gallery-frame-overlay">
                <span className="gold-tag">{category}</span>
                <h3>{title}</h3>
                <p>{isAr ? `تصوير: ${project.photographer || 'أرشيف رواق الوادي'}` : `Photography: ${project.photographer || 'Riwaq Archives'}`}</p>
              </div>
            </div>
            <div className="gallery-blueprint-frame">
              <img src={bpData.image} alt="CAD Plan View" className="gallery-img" />
              <div className="gallery-frame-overlay">
                <span className="gold-tag">CAD SCHEMATIC</span>
                <h3>{isAr ? 'المخطط الهندسي العام' : 'Master Blueprint Plan'}</h3>
                <p>{bpData.scale || 'SCALE 1:100 @ A0'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VIP COMMISSION & BOTTOM ACTIONS */}
      <section className="profile-cta-section">
        <div className="container">
          <div className="profile-cta-box glass-card text-center">
            <span className="gold-tag gold-tag-pulse">
              <Award size={14} />
              {isAr ? 'صياغة تحفتك الخاصة' : 'Bespoke Architectural Commission'}
            </span>
            <h2>
              {isAr
                ? 'هل ترغب في صياغة صرح معماري استثنائي يحمل بصمتك؟'
                : 'Envisioning an Uncompromising Monument of Your Own?'}
            </h2>
            <p>
              {isAr
                ? 'فريق كبار المعماريين في رواق الوادي متاح لجلسات استشارية خاصة وحصرية لمناقشة المشاريع الكبرى والقصور الخاصة.'
                : 'Our principal architects are available for private consultations to conceptualize your landmark estate.'}
            </p>
            <div className="gold-divider center" />

            <div className="profile-cta-buttons">
              <Link to="/contact" className="btn-primary" onClick={onClose}>
                <span>{isAr ? 'حجز جلسة استشارية خاصة' : 'Request Private Consultation'}</span>
                <ArrowUpRight size={18} />
              </Link>
              <button className="btn-secondary" onClick={onBackToTop}>
                <ArrowUp size={18} />
                <span>{isAr ? 'العودة لأعلى الجولة 3D' : 'Back to 3D Walkthrough'}</span>
              </button>
              <button className="btn-secondary" onClick={onClose}>
                <span>{isAr ? 'العودة لمعرض المشاريع' : 'Return to Projects'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
