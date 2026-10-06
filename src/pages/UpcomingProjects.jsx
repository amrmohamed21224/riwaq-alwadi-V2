import React, { useState } from 'react';
import { UPCOMING_PROJECTS_DATA } from '../data/projectsData';
import {
  Compass,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  Lock,
  ArrowUpRight,
  X,
  Sparkles,
  Building2,
  Leaf,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './UpcomingProjects.css';

export default function UpcomingProjects({ lang }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', investorType: 'individual' });
  const [submitted, setSubmitted] = useState(false);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c8a97e', '#e5d2ae', '#ffffff', '#9a7848'],
    });
  };

  return (
    <div className="upcoming-page">
      {/* Page Hero */}
      <section className="page-hero-section">
        <div className="container">
          <div className="page-hero-content text-center">
            <span className="gold-tag gold-tag-pulse">
              <Compass size={14} />
              {lang === 'ar' ? 'المستقبل المعماري — قيد التنفيذ والتطوير' : 'Future Horizons — In Development'}
            </span>
            <h1 className="page-hero-title">
              {lang === 'ar'
                ? 'المشاريع القادمة والمعالم المستقبلية'
                : 'Upcoming Masterpieces & Landmarks'}
            </h1>
            <p className="page-hero-subtitle">
              {lang === 'ar'
                ? 'رؤى معمارية جريئة يتم تشييدها حالياً لترسم ملامح الغد في مدن المستقبل، متاحة للحجز المسبق لكبار المستثمرين.'
                : 'Bold architectural visions currently taking physical shape to define modern skylines, available for exclusive private preview.'}
            </p>
            <div className="gold-divider center"></div>
          </div>
        </div>
      </section>

      {/* Projects Showcase List */}
      <section className="upcoming-list-section">
        <div className="container">
          <div className="upcoming-cards-stack">
            {UPCOMING_PROJECTS_DATA.map((project, idx) => (
              <div key={project.id} className="upcoming-card glass-card">
                <div className="upcoming-card-grid">
                  {/* Visual Column */}
                  <div className="upcoming-img-box">
                    <img
                      src={project.image}
                      alt={lang === 'ar' ? project.titleAr : project.titleEn}
                      className="upcoming-img"
                    />
                    <div className="upcoming-status-tag">
                      <span className="live-dot"></span>
                      <span>{lang === 'ar' ? project.statusAr : project.statusEn}</span>
                    </div>
                  </div>

                  {/* Information Column */}
                  <div className="upcoming-details-box">
                    <div className="upcoming-header-row">
                      <span className="upcoming-category">
                        {lang === 'ar' ? project.categoryAr : project.categoryEn}
                      </span>
                      <div className="completion-date-badge">
                        <Calendar size={14} className="gold-icon" />
                        <span>
                          {lang === 'ar' ? 'التسليم المتوقع:' : 'Target Handover:'}{' '}
                          <strong>{project.completionDate}</strong>
                        </span>
                      </div>
                    </div>

                    <h2 className="upcoming-title">
                      {lang === 'ar' ? project.titleAr : project.titleEn}
                    </h2>

                    <p className="upcoming-desc">
                      {lang === 'ar' ? project.descriptionAr : project.descriptionEn}
                    </p>

                    {/* Progress Bar */}
                    <div className="progress-container">
                      <div className="progress-labels">
                        <span className="progress-title">
                          <TrendingUp size={14} className="gold-icon" />
                          {lang === 'ar' ? 'مستوى التقدم الإنشائي' : 'Construction Velocity'}
                        </span>
                        <span className="progress-val">{project.progress}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Architectural Specifications Table */}
                    <div className="specs-grid-mini">
                      <div className="spec-box">
                        <span className="spec-key">{lang === 'ar' ? 'الارتفاع / الامتداد' : 'Height / Scale'}</span>
                        <span className="spec-item-val">{project.architecturalSpecs.height}</span>
                      </div>
                      <div className="spec-box">
                        <span className="spec-key">{lang === 'ar' ? 'عدد الطوابق' : 'Levels / Floors'}</span>
                        <span className="spec-item-val">{project.architecturalSpecs.floors}</span>
                      </div>
                      <div className="spec-box">
                        <span className="spec-key">{lang === 'ar' ? 'معيار الاستدامة' : 'Environmental'}</span>
                        <span className="spec-item-val">{project.architecturalSpecs.sustainability}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="upcoming-card-actions">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="btn-primary"
                      >
                        <Lock size={15} />
                        <span>
                          {lang === 'ar'
                            ? 'طلب المخطط السري والكتالوج الاستثماري'
                            : 'Request Confidential Prospectus'}
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Private Investor Registration Modal */}
      {selectedProject && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="lightbox-dialog prospectus-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedProject(null)}
              aria-label="إغلاق"
            >
              <X size={24} />
            </button>

            {!submitted ? (
              <div className="prospectus-content">
                <div className="prospectus-header text-center">
                  <span className="gold-tag gold-tag-pulse">
                    <Sparkles size={14} />
                    {lang === 'ar' ? 'خدمة كبار الشخصيات والمستثمرين' : 'Private VIP Access'}
                  </span>
                  <h2>
                    {lang === 'ar' ? 'طلب الملف المعماري والاستثماري' : 'Request Master Prospectus'}
                  </h2>
                  <p className="prospectus-sub">
                    {lang === 'ar'
                      ? `للحصول على المخططات التفصيلية وجداول الكميات الخاصة بمشروع (${selectedProject.titleAr})، يرجى تزويدنا ببيانات التواصل المباشرة.`
                      : `Receive executive CAD blueprints and investment projections for (${selectedProject.titleEn}).`}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="prospectus-form">
                  <div className="form-group">
                    <label>{lang === 'ar' ? 'الاسم الكريم / المؤسسة' : 'Full Name / Entity'}</label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'ar' ? 'سعادة المهندس / المستثمر...' : 'e.g. Lord Alexander Wright'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'البريد الإلكتروني المهني' : 'Corporate Email'}</label>
                      <input
                        type="email"
                        required
                        placeholder="vip@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'رقم الهاتف / الواتساب' : 'Direct Phone / WhatsApp'}</label>
                      <input
                        type="tel"
                        required
                        placeholder="+966 5..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{lang === 'ar' ? 'صفة الاهتمام' : 'Interest Profile'}</label>
                    <select
                      value={formData.investorType}
                      onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                    >
                      <option value="individual">
                        {lang === 'ar' ? 'مستثمر خاص / مالك قصر' : 'Private Investor / Owner'}
                      </option>
                      <option value="corporate">
                        {lang === 'ar' ? 'مطور عقاري ومؤسسة استثمارية' : 'Real Estate Developer / Fund'}
                      </option>
                      <option value="architect">
                        {lang === 'ar' ? 'مكتب هندسي استشاري شريك' : 'Architectural Consultant'}
                      </option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary form-submit-btn">
                    <span>{lang === 'ar' ? 'إرسال الطلب واعتماد الكتالوج الفوري' : 'Submit & Receive Prospectus'}</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <div className="prospectus-privacy-note">
                    <Lock size={12} />
                    <span>
                      {lang === 'ar'
                        ? 'كافة المخططات والمعلومات تخضع لاتفاقية السرية وحماية حقوق الملكية الفكرية.'
                        : 'All blueprints and data are strictly protected under non-disclosure accords.'}
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="prospectus-success-box text-center">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={54} className="gold-icon" />
                </div>
                <h2>{lang === 'ar' ? 'تم استلام طلبكم بنجاح' : 'Request Confirmed'}</h2>
                <p>
                  {lang === 'ar'
                    ? `أهلاً بك سعادة ${formData.name}. سيقوم مدير العلاقات الخاصة للتطوير المعماري بإرسال الملف المشفر إلى بريدك الإلكتروني (${formData.email}) والتواصل معك عبر الواتساب.`
                    : `Thank you, ${formData.name}. Our private client concierge will dispatch the encrypted prospectus to (${formData.email}) shortly.`}
                </p>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn-secondary"
                  style={{ marginTop: '1.5rem' }}
                >
                  <span>{lang === 'ar' ? 'العودة للمشاريع' : 'Return to Landmarks'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
