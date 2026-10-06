import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Download,
  MessageSquare,
  Building,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './Contact.css';

export default function Contact({ lang }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'villa',
    location: 'riyadh',
    budget: '15m-50m',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c8a97e', '#e5d2ae', '#d4af37', '#ffffff'],
      });
    }, 800);
  };

  const handleDownloadBrochure = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const offices = [
    {
      cityAr: 'المقر الرئيسي — الرياض',
      cityEn: 'Headquarters — Riyadh',
      addressAr: 'حي النخيل، طريق الملك فهد، برج رواق المعماري — الدور 28',
      addressEn: 'Al-Nakheel District, King Fahd Rd, Riwaq Tower — Floor 28',
      phone: '+966 11 456 7890',
      email: 'riyadh@riwaq-alwadi.com',
    },
    {
      cityAr: 'استوديو دبي للتصميم المتقدم',
      cityEn: 'Dubai Advanced Design Studio',
      addressAr: 'مركز دبي المالي العالمي (DIFC)، مبنى البوابة 04',
      addressEn: 'Dubai International Financial Centre (DIFC), Gate Precinct 04',
      phone: '+971 4 321 0987',
      email: 'dubai@riwaq-alwadi.com',
    },
    {
      cityAr: 'مكتب القاهرة الكبرى',
      cityEn: 'Cairo Regional Office',
      addressAr: 'مجمع الأعمال المركزي، التجمع الخامس، القاهرة الجديدة',
      addressEn: 'Central Business District, New Cairo',
      phone: '+20 2 2789 6543',
      email: 'cairo@riwaq-alwadi.com',
    },
  ];

  return (
    <div className="contact-page">
      {/* Page Hero */}
      <section className="page-hero-section">
        <div className="container">
          <div className="page-hero-content text-center">
            <span className="gold-tag gold-tag-pulse">
              <MessageSquare size={14} />
              {lang === 'ar' ? 'جلسات الاستشارة المعمارية الخاصة' : 'VIP Studio Consultations'}
            </span>
            <h1 className="page-hero-title">
              {lang === 'ar'
                ? 'ابدأ حوارك المعماري مع رواق الوادي'
                : 'Initiate Your Architectural Dialogue'}
            </h1>
            <p className="page-hero-subtitle">
              {lang === 'ar'
                ? 'سواء كنت تخطط لتشييد قصرك الخاص أو تطوير معلم حضري استثماري، خبراؤنا مستعدون لتحويل طموحك إلى واقع ملموس.'
                : 'Whether sculpting a private estate sanctuary or pioneering a civic urban landmark, our master architects are ready to collaborate.'}
            </p>
            <div className="gold-divider center"></div>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Studio Details */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Form Column */}
            <div className="contact-form-card glass-card">
              {!isSuccess ? (
                <>
                  <div className="form-card-header">
                    <span className="gold-tag">
                      <Sparkles size={14} />
                      {lang === 'ar' ? 'طلب استشارة معمارية' : 'Consultation Request'}
                    </span>
                    <h2>
                      {lang === 'ar'
                        ? 'تفاصيل المشروع والطلب الأولي'
                        : 'Project Blueprint & Initial Brief'}
                    </h2>
                    <p>
                      {lang === 'ar'
                        ? 'يرجى تزويدنا بالمعلومات الأساسية لمساعدتنا في تحضير المقترح المعماري الأولي لجلسة النقاش.'
                        : 'Provide key details so our lead partners can prepare an initial spatial brief.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="architectural-form">
                    <div className="form-grid-2">
                      <div className="input-field">
                        <label>{lang === 'ar' ? 'الاسم الكريم' : 'Full Name'}</label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'ar' ? 'مثال: م. فهد بن عبدالعزيز' : 'e.g. Sheikh Fahad'}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="input-field">
                        <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <input
                          type="email"
                          required
                          placeholder="client@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="input-field">
                        <label>{lang === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}</label>
                        <input
                          type="tel"
                          required
                          placeholder="+966 50 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="input-field">
                        <label>{lang === 'ar' ? 'موقع المشروع المقترح' : 'Project Location'}</label>
                        <select
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        >
                          <option value="riyadh">{lang === 'ar' ? 'الرياض / المملكة العربية السعودية' : 'Riyadh, KSA'}</option>
                          <option value="dubai">{lang === 'ar' ? 'دبي / الإمارات العربية المتحدة' : 'Dubai, UAE'}</option>
                          <option value="cairo">{lang === 'ar' ? 'القاهرة / جمهورية مصر العربية' : 'Cairo, Egypt'}</option>
                          <option value="redsea">{lang === 'ar' ? 'البحر الأحمر / العلا' : 'Red Sea / AlUla'}</option>
                          <option value="international">{lang === 'ar' ? 'موقع دولي آخر' : 'Other Global Location'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="input-field">
                        <label>{lang === 'ar' ? 'نوع المنشأة المعمارية' : 'Typology'}</label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        >
                          <option value="villa">{lang === 'ar' ? 'قصر سكني خاص فاخر' : 'Private Residential Palace'}</option>
                          <option value="commercial">{lang === 'ar' ? 'برج تجاري / مجمع استثماري' : 'Commercial Tower / Mixed Use'}</option>
                          <option value="hospitality">{lang === 'ar' ? 'منتجع سياحي بيئي فاخر' : 'Ultra-Luxury Eco Resort'}</option>
                          <option value="interior">{lang === 'ar' ? 'تصميم داخلي واستشارات هندسية' : 'Interior Architecture & Renovation'}</option>
                        </select>
                      </div>

                      <div className="input-field">
                        <label>{lang === 'ar' ? 'الميزانية التقديرية للاستثمار' : 'Estimated Budget Range'}</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        >
                          <option value="5m-15m">{lang === 'ar' ? '5 - 15 مليون ريال / درهم' : '$1.5M - $4M USD'}</option>
                          <option value="15m-50m">{lang === 'ar' ? '15 - 50 مليون ريال / درهم' : '$4M - $14M USD'}</option>
                          <option value="50m+">{lang === 'ar' ? 'أكثر من 50 مليون ريال / درهم' : '$14M+ USD'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>{lang === 'ar' ? 'الرؤية المعمارية والملاحظات الخاصة' : 'Architectural Aspirations & Brief'}</label>
                      <textarea
                        rows={4}
                        placeholder={
                          lang === 'ar'
                            ? 'شاركنا تطلعاتك للمشروع، المساحة التقريبية للأرض، الطراز المفضل، أو أي اشتراطات خاصة...'
                            : 'Describe your vision, land dimensions, design preferences, or key milestones...'
                        }
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary submit-contact-btn"
                    >
                      <span>
                        {isSubmitting
                          ? lang === 'ar' ? 'جاري إرسال الطلب...' : 'Transmitting Brief...'
                          : lang === 'ar' ? 'إرسال طلب الاستشارة المعمارية' : 'Submit Architectural Brief'}
                      </span>
                      <Send size={16} />
                    </button>

                    <div className="form-privacy-guarantee">
                      <ShieldCheck size={16} className="gold-icon" />
                      <span>
                        {lang === 'ar'
                          ? 'نلتزم بالسرية المطلقة وعدم مشاركة أي مخططات أو بيانات مع أي طرف ثالث.'
                          : 'Full non-disclosure integrity guaranteed for all inquiries.'}
                      </span>
                    </div>
                  </form>
                </>
              ) : (
                <div className="contact-success-state text-center">
                  <div className="success-icon-box">
                    <CheckCircle2 size={64} className="gold-icon" />
                  </div>
                  <h2>
                    {lang === 'ar' ? 'تم استلام طلبكم بكل ترحيب' : 'Inquiry Received with Distinction'}
                  </h2>
                  <p>
                    {lang === 'ar'
                      ? `شكراً لك سعادة ${formData.name}. تم إحالة طلبك لمكتب الشريك المعماري المسؤول وسنتواصل معك خلال 24 ساعة لترتيب موعد الجلسة الاستشارية.`
                      : `Thank you, ${formData.name}. Our managing architectural partner will contact you within 24 hours to coordinate your private session.`}
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        projectType: 'villa',
                        location: 'riyadh',
                        budget: '15m-50m',
                        message: '',
                      });
                    }}
                    className="btn-secondary"
                    style={{ marginTop: '2rem' }}
                  >
                    <span>{lang === 'ar' ? 'إرسال استفسار إضافي' : 'Send Another Brief'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Studio Offices & VIP Concierge */}
            <div className="contact-info-col">
              {/* WhatsApp VIP Concierge Card */}
              <div className="concierge-card glass-card">
                <div className="concierge-header">
                  <span className="gold-tag gold-tag-pulse">VIP CONCIERGE</span>
                  <h3>{lang === 'ar' ? 'المكتب التنفيذي الفوري' : 'Executive Direct Line'}</h3>
                  <p>
                    {lang === 'ar'
                      ? 'للمشاريع الاستعجالية أو التواصل المباشر مع رئيس الاستوديو عبر الواتساب المعتمد.'
                      : 'For immediate VIP project inquiries, reach our client director directly on WhatsApp.'}
                  </p>
                </div>

                <a
                  href="https://wa.me/966501234567?text=مرحباً%20استوديو%20رواق%20الوادي،%20أود%20طلب%20استشارة%20معمارية%20خاصة"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-concierge-btn"
                >
                  <MessageSquare size={18} />
                  <span>{lang === 'ar' ? 'محادثة فورية عبر واتساب VIP' : 'Chat via VIP WhatsApp'}</span>
                  <ArrowUpRight size={18} />
                </a>
              </div>

              {/* Download Studio Monograph / Lookbook */}
              <div className="monograph-card glass-card">
                <div className="monograph-icon-box">
                  <Download size={24} className="gold-icon" />
                </div>
                <div className="monograph-text">
                  <h4>{lang === 'ar' ? 'الكتالوج السنوي للأعمال المعمارية' : 'Annual Studio Monograph'}</h4>
                  <p>
                    {lang === 'ar'
                      ? 'ملف تعريفي فاخر بصيغة PDF يتضمن المخططات، دراسات الحالة، والفلسفة التصميمية.'
                      : 'Curated 85-page lookbook containing CAD case studies and project photography.'}
                  </p>
                  <button
                    onClick={handleDownloadBrochure}
                    className="btn-outline-gold download-btn"
                  >
                    <span>{lang === 'ar' ? 'تحميل الكتالوج المعماري (PDF)' : 'Download Monograph (PDF)'}</span>
                    <ArrowUpRight size={15} />
                  </button>
                  {downloadSuccess && (
                    <span className="download-toast">
                      <CheckCircle2 size={14} />
                      {lang === 'ar' ? 'بدأ تحميل الكتالوج بنجاح...' : 'Lookbook downloaded successfully...'}
                    </span>
                  )}
                </div>
              </div>

              {/* Studio Locations List */}
              <div className="offices-card glass-card">
                <h3 className="offices-card-title">
                  <Building size={18} className="gold-icon" />
                  {lang === 'ar' ? 'مقرات ومكاتب الاستوديو' : 'Studio Locations'}
                </h3>
                <div className="gold-divider"></div>

                <div className="offices-list">
                  {offices.map((office, idx) => (
                    <div key={idx} className="office-item">
                      <h4 className="office-name">
                        {lang === 'ar' ? office.cityAr : office.cityEn}
                      </h4>
                      <p className="office-address">
                        <MapPin size={15} className="gold-icon" />
                        <span>{lang === 'ar' ? office.addressAr : office.addressEn}</span>
                      </p>
                      <div className="office-contacts">
                        <a href={`tel:${office.phone}`} className="contact-link">
                          <Phone size={13} />
                          <span dir="ltr">{office.phone}</span>
                        </a>
                        <a href={`mailto:${office.email}`} className="contact-link">
                          <Mail size={13} />
                          <span>{office.email}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
