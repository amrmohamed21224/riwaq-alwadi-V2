import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Maximize2,
  Minimize2,
  Award,
  Compass,
  Layers,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';
import './ArchitecturalMasterpieceModal.css';

export default function ArchitecturalMasterpieceModal({ project, lang, onClose }) {
  const isAr = lang === 'ar';
  const [lightingMode, setLightingMode] = useState('dusk');
  const [isBlueprint, setIsBlueprint] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Keyboard close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const getLightingFilterClass = () => {
    switch (lightingMode) {
      case 'day':
        return 'modal-light-day';
      case 'night':
        return 'modal-light-night';
      case 'dusk':
      default:
        return 'modal-light-dusk';
    }
  };

  return (
    <div className="arch-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="arch-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div className="arch-modal-header">
          <div className="arch-modal-title-wrap">
            <span className="gold-tag gold-tag-sm">
              <Sparkles size={12} />
              {isAr ? 'فحص التحفة المعمارية بدقة 4K' : '4K Architectural Masterpiece Inspection'}
            </span>
            <h2 className="arch-modal-heading">
              {isAr ? project.titleAr : project.titleEn}
            </h2>
          </div>

          <div className="arch-modal-header-actions">
            {project.blueprintCode && (
              <span className="arch-blueprint-badge">
                <Layers size={13} className="gold-icon" />
                <span>{project.blueprintCode}</span>
              </span>
            )}
            <button onClick={onClose} className="arch-modal-close-btn" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="arch-modal-body">
          {/* Visual Interactive Viewport */}
          <div className="arch-modal-viewport">
            <div
              className={`arch-modal-canvas-frame ${getLightingFilterClass()} ${isBlueprint ? 'is-blueprint' : ''}`}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomed(!isZoomed)}
              title={isAr ? 'انقر للتكبير والتكبير العدسي' : 'Click to toggle zoom lens'}
            >
              <img
                src={project.image}
                alt={isAr ? project.titleAr : project.titleEn}
                className="arch-modal-img"
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform: isZoomed ? 'scale(2.4)' : 'scale(1)',
                }}
              />

              {/* CAD Wireframe Grid */}
              <div className="arch-modal-cad-grid" aria-hidden="true">
                <div className="cad-axis-label cad-axis-x">X-AXIS • 120.4M</div>
                <div className="cad-axis-label cad-axis-y">Y-AXIS • 84.2M</div>
                <div className="cad-crosshair" />
              </div>

              {/* Viewport Floating Controls */}
              <div className="arch-viewport-controls" onClick={(e) => e.stopPropagation()}>
                {/* Lighting Atmospheres */}
                <div className="arch-ctrl-group">
                  <button
                    onClick={() => setLightingMode('day')}
                    className={`arch-ctrl-btn ${lightingMode === 'day' ? 'is-active' : ''}`}
                    title={isAr ? 'إضاءة النهار' : 'Daylight'}
                  >
                    <Sun size={15} />
                    <span>{isAr ? 'نهار' : 'Day'}</span>
                  </button>
                  <button
                    onClick={() => setLightingMode('dusk')}
                    className={`arch-ctrl-btn ${lightingMode === 'dusk' ? 'is-active' : ''}`}
                    title={isAr ? 'إضاءة الغروب الذهبية' : 'Dusk / Golden Hour'}
                  >
                    <Sunset size={15} />
                    <span>{isAr ? 'غروب' : 'Dusk'}</span>
                  </button>
                  <button
                    onClick={() => setLightingMode('night')}
                    className={`arch-ctrl-btn ${lightingMode === 'night' ? 'is-active' : ''}`}
                    title={isAr ? 'الإضاءة الليلية الشاعرية' : 'Night Atmosphere'}
                  >
                    <Moon size={15} />
                    <span>{isAr ? 'ليل' : 'Night'}</span>
                  </button>
                </div>

                {/* Blueprint CAD Toggle */}
                <button
                  onClick={() => setIsBlueprint(!isBlueprint)}
                  className={`arch-ctrl-btn ${isBlueprint ? 'is-active' : ''}`}
                >
                  <Layers size={15} />
                  <span>{isAr ? 'مخطط CAD' : 'CAD Mode'}</span>
                </button>

                {/* Zoom Lens Toggle */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`arch-ctrl-btn ${isZoomed ? 'is-active' : ''}`}
                >
                  <ZoomIn size={15} />
                  <span>{isZoomed ? (isAr ? 'تصغير' : 'Reset') : isAr ? 'عدسة 4K' : '4K Lens'}</span>
                </button>
              </div>

              {/* Zoom hint prompt */}
              {!isZoomed && (
                <div className="arch-zoom-hint">
                  <ZoomIn size={13} />
                  <span>{isAr ? 'انقر على أي جزء للتكبير والفحص الدقيق' : 'Click to inspect in 4K'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Architectural Specifications & Material Palette Sidebar */}
          <div className="arch-modal-sidebar">
            {/* Accolade Banner */}
            {project.awardAr && (
              <div className="arch-award-banner glass-card">
                <Award size={18} className="gold-icon" />
                <div className="arch-award-text">
                  <span className="arch-award-label">{isAr ? 'التكريم والتميز الدولي' : 'Accolade'}</span>
                  <strong>{isAr ? project.awardAr : project.awardEn}</strong>
                </div>
              </div>
            )}

            {/* Architectural Concept */}
            <div className="arch-spec-block">
              <h4 className="arch-spec-title">{isAr ? 'الرؤية المعمارية والفلسفة' : 'Design Philosophy'}</h4>
              <p className="arch-spec-desc">
                {isAr ? project.conceptAr : project.conceptEn}
              </p>
            </div>

            {/* Material Palette Swatches */}
            {project.materials && (
              <div className="arch-spec-block">
                <h4 className="arch-spec-title">
                  {isAr ? 'لوحة المواد والخامات المعمارية' : 'Curated Material Palette'}
                </h4>
                <div className="arch-material-swatches">
                  {project.materials.map((mat, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)}
                      className={`arch-swatch-item ${selectedMaterial === mat ? 'is-selected' : ''}`}
                    >
                      <span className="arch-swatch-dot" />
                      <span className="arch-swatch-name">{mat}</span>
                    </button>
                  ))}
                </div>
                {selectedMaterial && (
                  <p className="arch-swatch-detail">
                    <CheckCircle2 size={12} className="gold-icon" />
                    <span>
                      {isAr
                        ? `خامة معتمدة: تم توريد ومعالجة ${selectedMaterial} وفق أعلى معايير الاستدامة المعمارية العالمية.`
                        : `Certified Specification: ${selectedMaterial} sustainably sourced & crafted.`}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Architectural Data HUD Grid */}
            <div className="arch-hud-grid">
              <div className="arch-hud-item">
                <span className="arch-hud-label">{isAr ? 'الموقع' : 'Location'}</span>
                <strong className="arch-hud-val">{isAr ? project.locationAr : project.locationEn}</strong>
              </div>
              {project.area && (
                <div className="arch-hud-item">
                  <span className="arch-hud-label">{isAr ? 'المساحة الإجمالية' : 'Total Area'}</span>
                  <strong className="arch-hud-val">{project.area}</strong>
                </div>
              )}
              {project.year && (
                <div className="arch-hud-item">
                  <span className="arch-hud-label">{isAr ? 'سنة الإنجاز' : 'Timeline'}</span>
                  <strong className="arch-hud-val">{project.year}</strong>
                </div>
              )}
              <div className="arch-hud-item">
                <span className="arch-hud-label">{isAr ? 'معيار الاستدامة' : 'Environmental'}</span>
                <strong className="arch-hud-val">LEED Platinum</strong>
              </div>
            </div>

            {/* Lead Architect & Photographer Credits */}
            <div className="arch-credits-row">
              {project.leadArchitectAr && (
                <div className="arch-credit">
                  <span>{isAr ? 'كبير المعماريين:' : 'Lead Architect:'}</span>
                  <strong>{isAr ? project.leadArchitectAr : project.leadArchitectEn}</strong>
                </div>
              )}
              {project.photographer && (
                <div className="arch-credit">
                  <span>{isAr ? 'التوثيق الفوتوغرافي:' : 'Photography:'}</span>
                  <strong>{project.photographer}</strong>
                </div>
              )}
            </div>

            {/* VIP Consultation CTA */}
            <div className="arch-modal-cta">
              <Link to="/contact" className="btn-primary arch-vip-btn" onClick={onClose}>
                <span>{isAr ? 'طلب استشارة لتصميم مشروع مماثل' : 'Consult on Similar Masterpiece'}</span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
