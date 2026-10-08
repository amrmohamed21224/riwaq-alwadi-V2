import React, { useState, useRef } from 'react';
import {
  Maximize2,
  Award,
  Sun,
  Sunset,
  Moon,
  Layers,
  Sparkles,
  ArrowUpRight,
  Compass,
} from 'lucide-react';
import './ArchitecturalProjectCard.css';

/**
 * Ultra-realistic 3D Tilt Architectural Project Card
 * Features:
 * - Real 3D Perspective Physics Tilt
 * - Dynamic Lighting Atmosphere (Day / Dusk / Night)
 * - Blueprint CAD Wireframe Overlay Mode
 * - Multi-layer Parallax (floating badges & typography)
 */
export default function ArchitecturalProjectCard({ project, lang, onInspect, onEnter, onOpenBlueprint }) {
  const isAr = lang === 'ar';
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightingMode, setLightingMode] = useState('dusk'); // 'day' | 'dusk' | 'night'

  const getLightingClass = () => {
    switch (lightingMode) {
      case 'day':
        return 'lighting-day';
      case 'night':
        return 'lighting-night';
      case 'dusk':
      default:
        return 'lighting-dusk';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`arch-card-wrap ${isHovered ? 'is-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="arch-card-inner glass-card">
        {/* Media Frame with Elegant Lighting */}
        <div className={`arch-media-box ${getLightingClass()}`}>
          <img
            src={project.image}
            alt={isAr ? project.titleAr : project.titleEn}
            className="arch-img"
            loading="lazy"
          />

          {/* Lighting atmosphere controller */}
          <div className="arch-lighting-ctrl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightingMode('day')}
              className={`arch-light-btn ${lightingMode === 'day' ? 'is-active' : ''}`}
              title={isAr ? 'إضاءة النهار' : 'Daylight'}
            >
              <Sun size={13} />
            </button>
            <button
              onClick={() => setLightingMode('dusk')}
              className={`arch-light-btn ${lightingMode === 'dusk' ? 'is-active' : ''}`}
              title={isAr ? 'إضاءة الغروب' : 'Dusk / Twilight'}
            >
              <Sunset size={13} />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`arch-light-btn ${lightingMode === 'night' ? 'is-active' : ''}`}
              title={isAr ? 'الإضاءة الليلية' : 'Nocturne'}
            >
              <Moon size={13} />
            </button>
            <span className="arch-light-div" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenBlueprint) {
                  onOpenBlueprint(project);
                } else if (onInspect) {
                  onInspect(project);
                }
              }}
              className="arch-light-btn arch-light-btn-cad"
              title={isAr ? 'عرض المخطط الهندسي CAD' : 'View CAD Blueprint'}
            >
              <Layers size={13} />
            </button>
          </div>

          {/* Top floating badge */}
          <div className="arch-card-badge-row">
            <span className="arch-award-badge">
              <Award size={13} className="gold-icon" />
              <span>{isAr ? project.awardAr : project.awardEn}</span>
            </span>
          </div>

          {/* Fullscreen Inspect Trigger Button */}
          <button
            onClick={() => onEnter && onEnter(project)}
            className="arch-inspect-cta"
            aria-label="Enter 3D walkthrough"
          >
            <Compass size={16} />
            <span>{isAr ? 'ادخل المشروع ثلاثي الأبعاد' : 'Enter 3D Walkthrough'}</span>
          </button>
        </div>

        {/* Card Content & Architectural Specs */}
        <div className="arch-content-box">
          <div className="arch-meta-row">
            <span className="arch-location">
              <Compass size={13} className="gold-icon" />
              {isAr ? project.locationAr : project.locationEn}
            </span>
            {project.area && <span className="arch-area">{project.area}</span>}
            {project.year && <span className="arch-year">{project.year}</span>}
          </div>

          <h3 className="arch-title" onClick={() => (onEnter ? onEnter(project) : onInspect && onInspect(project))}>
            {isAr ? project.titleAr : project.titleEn}
          </h3>

          <p className="arch-concept">
            {isAr ? project.conceptAr : project.conceptEn}
          </p>

          {/* Material Swatches Preview */}
          {project.materials && (
            <div className="arch-materials-row">
              <span className="arch-mat-label">{isAr ? 'الخامات:' : 'Materials:'}</span>
              <div className="arch-mat-tags">
                {project.materials.slice(0, 3).map((mat, i) => (
                  <span key={i} className="arch-mat-tag">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card Footer Link */}
          <div className="arch-card-foot">
            <button
              onClick={() => onInspect && onInspect(project)}
              className="arch-foot-link"
            >
              <span>{isAr ? 'عرض المواصفات والمخطط' : 'Blueprint & Architecture Specs'}</span>
              <ArrowUpRight size={15} />
            </button>
            {project.photographer && (
              <span className="arch-photo-credit">
                {isAr ? 'عدسة: ' : 'Photo: '}
                <strong>{project.photographer}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
