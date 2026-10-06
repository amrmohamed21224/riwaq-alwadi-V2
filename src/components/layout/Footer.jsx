import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  Award,
} from 'lucide-react';
import './Footer.css';

export default function Footer({ lang }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-top-glow"></div>
      <div className="container footer-content">
        {/* Main Brand Column */}
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <div className="logo-symbol">
                <svg viewBox="0 0 40 40" fill="none" className="arch-svg">
                  <path
                    d="M20 5 C12 5, 8 13, 8 23 L8 36 L14 36 L14 24 C14 16, 17 11, 20 11 C23 11, 26 16, 26 24 L26 36 L32 36 L32 23 C32 13, 28 5, 20 5 Z"
                    fill="url(#footerGoldGrad)"
                  />
                  <circle cx="20" cy="20" r="2.5" fill="#E8D5B0" />
                  <defs>
                    <linearGradient id="footerGoldGrad" x1="8" y1="5" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F0DFB9" />
                      <stop offset="0.5" stopColor="#C8A97E" />
                      <stop offset="1" stopColor="#8F6C3A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="brand-text">
                <span className="brand-name-ar">رِوَاق الوَادِي</span>
                <span className="brand-sub">RIWAQ AL-WADI ARCHITECTURE</span>
              </div>
            </Link>

            <p className="footer-desc">
              {lang === 'ar'
                ? 'استوديو استشارات معمارية وتطوير فاخر يُعنى بإعادة تعريف الفضاء والضوء، مستلهمين خطوطنا من عمق الطبيعة وبراعة الهندسة المستقبلية.'
                : 'A visionary architectural studio redefining space and light, blending organic natural horizons with futuristic structural mastery.'}
            </p>

            <div className="footer-award-badge">
              <Award size={18} className="gold-icon" />
              <span>
                {lang === 'ar'
                  ? 'مرشح لجائزة أفضل تصميم معماري رقمي — Awwwards'
                  : 'Awwwards Architectural Digital Excellence Nominee'}
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              {lang === 'ar' ? 'أقسام الموقع' : 'Navigation'}
            </h4>
            <div className="gold-divider"></div>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <ArrowUpRight size={14} />
                  <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
                </Link>
              </li>
              <li>
                <Link to="/media">
                  <ArrowUpRight size={14} />
                  <span>{lang === 'ar' ? 'المركز الإعلامي والمعرض' : 'Media & Gallery'}</span>
                </Link>
              </li>
              <li>
                <Link to="/upcoming-projects">
                  <ArrowUpRight size={14} />
                  <span>{lang === 'ar' ? 'المشاريع القادمة والمستقبلية' : 'Upcoming Landmarks'}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <ArrowUpRight size={14} />
                  <span>{lang === 'ar' ? 'احجز استشارة معمارية' : 'VIP Consultation'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Architectural Typology */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              {lang === 'ar' ? 'المجالات والتخصصات' : 'Expertise'}
            </h4>
            <div className="gold-divider"></div>
            <ul className="footer-links">
              <li>
                <Link to="/media">
                  <span>{lang === 'ar' ? 'القصور والفلل السكنية الفاخرة' : 'Ultra-Luxury Private Villas'}</span>
                </Link>
              </li>
              <li>
                <Link to="/media">
                  <span>{lang === 'ar' ? 'الأبراج والمجمعات التجارية' : 'Iconic Commercial Towers'}</span>
                </Link>
              </li>
              <li>
                <Link to="/media">
                  <span>{lang === 'ar' ? 'تخطيط المدن واللاندسكيب' : 'Urban Masterplanning'}</span>
                </Link>
              </li>
              <li>
                <Link to="/media">
                  <span>{lang === 'ar' ? 'التصميم الداخلي والمواد المستدامة' : 'High-End Sustainable Interiors'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-col-title">
              {lang === 'ar' ? 'الكتالوج المعماري الفصلي' : 'Architectural Lookbook'}
            </h4>
            <div className="gold-divider"></div>
            <p className="newsletter-text">
              {lang === 'ar'
                ? 'اشترك للحصول على الكتالوج السري السنوي وأحدث أفكار التطوير المعماري.'
                : 'Subscribe to receive our private seasonal portfolio and curated architectural essays.'}
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder={lang === 'ar' ? 'بريدك الإلكتروني المفضل...' : 'Your business email...'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn" aria-label="اشترك">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </form>

            {subscribed && (
              <div className="subscription-success">
                <CheckCircle2 size={16} />
                <span>{lang === 'ar' ? 'تم تسجيل اهتمامك بنجاح. سنرسل الكتالوج قريباً.' : 'Subscribed successfully. Lookbook arriving shortly.'}</span>
              </div>
            )}

            <div className="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            © {new Date().getFullYear()}{' '}
            <span>{lang === 'ar' ? 'رواق الوادي للاستشارات والتطوير المعماري. كافة الحقوق محفوظة.' : 'Riwaq Al-Wadi Architectural Studio. All rights reserved.'}</span>
          </div>

          <div className="footer-locations">
            <span>الرياض</span>
            <span className="dot-sep">•</span>
            <span>دبي</span>
            <span className="dot-sep">•</span>
            <span>القاهرة</span>
          </div>

          <button onClick={scrollToTop} className="back-to-top-btn" title="العودة لأعلى الصفحة">
            <span>{lang === 'ar' ? 'للأعلى' : 'Top'}</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
