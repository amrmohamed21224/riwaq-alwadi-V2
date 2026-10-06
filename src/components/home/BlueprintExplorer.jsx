import React, { useState } from 'react';
import { BLUEPRINT_DATA } from '../../data/projectsData';
import { Layers, Maximize2, Compass, CheckCircle, Info, Sparkles } from 'lucide-react';
import './BlueprintExplorer.css';

export default function BlueprintExplorer({ lang }) {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(
    BLUEPRINT_DATA.floors[0].hotspots[0]
  );

  const activeFloor = BLUEPRINT_DATA.floors[activeFloorIndex];

  const handleFloorChange = (index) => {
    setActiveFloorIndex(index);
    setSelectedHotspot(BLUEPRINT_DATA.floors[index].hotspots[0]);
  };

  return (
    <section className="blueprint-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <span className="gold-tag gold-tag-pulse">
              <Compass size={14} />
              {lang === 'ar' ? 'المخطط الهندسي التفاعلي' : 'Interactive CAD Blueprint'}
            </span>
          </div>
          <h2>
            {lang === 'ar'
              ? 'تشريح الفراغ المعماري وتوزيع المساحات'
              : 'Architectural Spatial Anatomy & Flow'}
          </h2>
          <p>
            {lang === 'ar'
              ? 'مستوحى من أعلى المعايير الهندسية الرقمية العالمية — تفاعل مع النقاط المضيئة لاستكشاف أدق التفاصيل الإنشائية والفلسفة المكانية.'
              : 'Interactive blueprint explorer — select glowing nodes on the plan to inspect spatial ergonomics and structural calculations.'}
          </p>
          <div className="gold-divider center"></div>
        </div>

        {/* Blueprint Dashboard Card */}
        <div className="blueprint-dashboard glass-card">
          {/* Top Controls: Floor Switcher Tabs & Specs */}
          <div className="blueprint-top-bar">
            <div className="floor-tabs">
              <span className="floor-tabs-label">
                <Layers size={16} className="gold-icon" />
                {lang === 'ar' ? 'اختر المستوى:' : 'Select Level:'}
              </span>
              {BLUEPRINT_DATA.floors.map((floor, idx) => (
                <button
                  key={floor.id}
                  className={`floor-tab-btn ${activeFloorIndex === idx ? 'active' : ''}`}
                  onClick={() => handleFloorChange(idx)}
                >
                  <span className="floor-number">0{idx + 1}</span>
                  <span className="floor-title">
                    {lang === 'ar' ? floor.nameAr : floor.nameEn}
                  </span>
                </button>
              ))}
            </div>

            <div className="floor-quick-specs">
              <div className="spec-badge">
                <span className="spec-label">{lang === 'ar' ? 'المساحة الصافية' : 'Net Area'}</span>
                <span className="spec-val">{activeFloor.area}</span>
              </div>
              <div className="spec-badge">
                <span className="spec-label">{lang === 'ar' ? 'ارتفاع الأسقف' : 'Ceiling Clearance'}</span>
                <span className="spec-val">{activeFloor.ceilingHeight}</span>
              </div>
            </div>
          </div>

          {/* Main Interactive Stage */}
          <div className="blueprint-stage">
            {/* The Blueprint Canvas */}
            <div className="blueprint-canvas-wrapper">
              <img
                src={BLUEPRINT_DATA.image}
                alt="Architectural Blueprint CAD"
                className="blueprint-img"
              />

              {/* Glowing Interactive Hotspot Markers */}
              {activeFloor.hotspots.map((spot) => (
                <button
                  key={spot.id}
                  className={`hotspot-marker ${selectedHotspot?.id === spot.id ? 'active' : ''}`}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  onClick={() => setSelectedHotspot(spot)}
                  aria-label={lang === 'ar' ? spot.titleAr : spot.titleEn}
                >
                  <span className="hotspot-pulse"></span>
                  <span className="hotspot-core"></span>
                  <span className="hotspot-label">
                    {lang === 'ar' ? spot.titleAr : spot.titleEn}
                  </span>
                </button>
              ))}

              {/* Grid Overlay Line Decorations */}
              <div className="blueprint-crosshair top-left"></div>
              <div className="blueprint-crosshair top-right"></div>
              <div className="blueprint-crosshair bottom-left"></div>
              <div className="blueprint-crosshair bottom-right"></div>
              <div className="cad-scale-bar">
                <span>SCALE 1:100 @ A0</span>
                <div className="scale-ticks"></div>
              </div>
            </div>

            {/* Hotspot Detailed Information Drawer */}
            <div className="blueprint-info-panel">
              <div className="panel-header">
                <span className="node-id-badge">
                  <Sparkles size={14} />
                  {lang === 'ar' ? 'العنصر المعماري النشط' : 'Active Spatial Focus'}
                </span>
                <span className="node-index">
                  HOTSPOT #{selectedHotspot?.id || '01'}
                </span>
              </div>

              {selectedHotspot ? (
                <div className="panel-body">
                  <h3 className="panel-title">
                    {lang === 'ar' ? selectedHotspot.titleAr : selectedHotspot.titleEn}
                  </h3>

                  <p className="panel-desc">
                    {lang === 'ar' ? selectedHotspot.descAr : selectedHotspot.descEn}
                  </p>

                  <div className="panel-spec-list">
                    <div className="panel-spec-item">
                      <CheckCircle size={16} className="gold-icon" />
                      <span>
                        {lang === 'ar'
                          ? 'نظام عزل حراري ثلاثي الطبقات متوافق مع كود البناء السعودي والأوروبي'
                          : 'Triple-glazed thermal envelope engineered for extreme micro-climates'}
                      </span>
                    </div>
                    <div className="panel-spec-item">
                      <CheckCircle size={16} className="gold-icon" />
                      <span>
                        {lang === 'ar'
                          ? 'فتحات تهوية وتدفق هواء طبيعي ذكي دون استهلاك مستمر للطاقة'
                          : 'Optimized natural cross-ventilation flow reducing active HVAC load'}
                      </span>
                    </div>
                    <div className="panel-spec-item">
                      <CheckCircle size={16} className="gold-icon" />
                      <span>
                        {lang === 'ar'
                          ? 'واجهات زجاجية ممتدة بدون قواطع حديدية لإطلالة غير منقطعة'
                          : 'Seamless structural glass integration for uninterrupted horizon vistas'}
                      </span>
                    </div>
                  </div>

                  <div className="panel-footer">
                    <span className="tip-text">
                      <Info size={14} />
                      {lang === 'ar'
                        ? 'انقر على أي نقطة مضيئة في المخطط لتفقد بقية الأقسام'
                        : 'Click on any pulsating node on the plan to inspect other zones'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="panel-empty">
                  <p>{lang === 'ar' ? 'اختر نقطة من المخطط للعرض' : 'Select a node on the plan'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
