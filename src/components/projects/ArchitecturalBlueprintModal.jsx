import React, { useState, useEffect } from 'react';
import { getProjectBlueprint, BLUEPRINT_DATA } from '../../data/projectsData';
import { Layers, Compass, CheckCircle, Info, Sparkles, X } from 'lucide-react';
import './ArchitecturalBlueprintModal.css';

export default function ArchitecturalBlueprintModal({ project, lang, onClose }) {
  const isAr = lang === 'ar';
  const bpData = project ? getProjectBlueprint(project.id) : BLUEPRINT_DATA;
  const floors = bpData.floors || BLUEPRINT_DATA.floors;

  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(
    floors[0]?.hotspots[0] || null
  );

  const activeFloor = floors[activeFloorIndex] || floors[0];

  // Update selected hotspot when floor changes or project changes
  useEffect(() => {
    setActiveFloorIndex(0);
    setSelectedHotspot(floors[0]?.hotspots[0] || null);
  }, [project?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFloorChange = (index) => {
    setActiveFloorIndex(index);
    setSelectedHotspot(floors[index]?.hotspots[0] || null);
  };

  return (
    <div className="arch-blueprint-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="arch-blueprint-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="arch-bp-modal-header">
          <div className="arch-bp-modal-title-group">
            <div className="arch-bp-tag-row">
              <span className="gold-tag gold-tag-pulse">
                <Compass size={14} />
                {isAr ? 'المخطط الهندسي التنفيذي CAD' : 'Executive CAD Blueprint Schematic'}
              </span>
              <span className="arch-bp-scale-badge">{bpData.scale || 'SCALE 1:100 @ A0'}</span>
              {bpData.code && <span className="arch-bp-scale-badge" style={{ opacity: 0.8 }}>{bpData.code}</span>}
            </div>
            <h2 className="arch-bp-modal-title">
              {isAr ? bpData.titleAr : bpData.titleEn}
            </h2>
            <p className="arch-bp-modal-sub">
              {isAr
                ? 'تشريح المساحات والمساقط الأفقية وتوزيع الكتل الإنشائية وتفاصيل الفراغات وفق المعايير العالمية.'
                : 'Spatial anatomy, structural zoning, and technical floor layout engineered to international standards.'}
            </p>
          </div>

          <button onClick={onClose} className="arch-bp-modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Level Switcher & Quick Specs Bar */}
        <div className="arch-bp-controls-bar">
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
              <span className="spec-label">{isAr ? 'المساحة الإجمالية' : 'Total Area'}</span>
              <span className="spec-val">{project?.area || activeFloor?.area}</span>
            </div>
            <div className="spec-badge">
              <span className="spec-label">{isAr ? 'ارتفاع الأسقف' : 'Ceiling Clearance'}</span>
              <span className="spec-val">{activeFloor?.ceilingHeight}</span>
            </div>
            {project?.year && (
              <div className="spec-badge">
                <span className="spec-label">{isAr ? 'سنة التنفيذ' : 'Year'}</span>
                <span className="spec-val">{project.year}</span>
              </div>
            )}
          </div>
        </div>

        {/* Blueprint Stage */}
        <div className="arch-bp-modal-stage">
          {/* Blueprint Canvas Viewport */}
          <div className="arch-bp-canvas-wrap">
            <img
              src={bpData.image || BLUEPRINT_DATA.image}
              alt="Architectural Blueprint CAD"
              className="blueprint-img"
            />

            {/* Glowing Interactive Hotspots */}
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

            {/* CAD Technical Crosshairs & Frame */}
            <div className="blueprint-crosshair top-left" />
            <div className="blueprint-crosshair top-right" />
            <div className="blueprint-crosshair bottom-left" />
            <div className="blueprint-crosshair bottom-right" />
            <div className="cad-scale-bar">
              <span>{bpData.scale || 'SCALE 1:100 @ A0'}</span>
              <div className="scale-ticks" />
            </div>
          </div>

          {/* Hotspot Info Panel Drawer */}
          <div className="arch-bp-info-drawer">
            <div className="panel-header">
              <span className="node-id-badge">
                <Sparkles size={14} />
                {isAr ? 'العنصر المعماري النشط' : 'Active Spatial Focus'}
              </span>
              <span className="node-index">
                HOTSPOT #{selectedHotspot?.id || '01'}
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
                        ? 'عزل صوتي وحراري فائق الكفاءة متوافق مع أعلى المعايير'
                        : 'Ultra-high acoustic and thermal envelope insulation'}
                    </span>
                  </div>
                  <div className="panel-spec-item">
                    <CheckCircle size={16} className="gold-icon" />
                    <span>
                      {isAr
                        ? 'توجيه هندسي مدروس لتدفق الهواء الطبيعي والإضاءة غير المباشرة'
                        : 'Precise orientation for passive cross-ventilation and indirect daylight'}
                    </span>
                  </div>
                  <div className="panel-spec-item">
                    <CheckCircle size={16} className="gold-icon" />
                    <span>
                      {isAr
                        ? 'ربط وتكامل مع الحدائق والمسطحات المائية لتعزيز الرفاهية المكانية'
                        : 'Seamless integration with courtyards and reflecting waters'}
                    </span>
                  </div>
                </div>

                <div className="panel-footer">
                  <span className="tip-text">
                    <Info size={14} />
                    {isAr
                      ? 'انقر على أي نقطة مضيئة في الخريطة لاستكشاف تفاصيل الفراغ'
                      : 'Click any illuminated node on the plan to inspect spatial details'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="panel-empty">
                <p>{isAr ? 'اختر نقطة من المخطط للعرض' : 'Select a node on the plan'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
