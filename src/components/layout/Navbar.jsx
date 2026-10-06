import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ArrowUpRight, PhoneCall, Volume2, VolumeX } from 'lucide-react';
import { useSoundscape } from '../../context/SoundscapeContext';
import './Navbar.css';

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSoundPlaying, toggleAmbientSound } = useSoundscape();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    { name: lang === 'ar' ? 'المركز الإعلامي' : 'Media', path: '/media' },
    { name: lang === 'ar' ? 'المشاريع القادمة' : 'Upcoming Projects', path: '/upcoming-projects' },
    { name: lang === 'ar' ? 'اتصل بنا' : 'Contact Us', path: '/contact' },
  ];

  const toggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          {/* Logo Area */}
          <Link to="/" className="brand-logo" aria-label="رواق الوادي">
            <div className="logo-symbol">
              <svg viewBox="0 0 40 40" fill="none" className="arch-svg">
                <path
                  d="M20 5 C12 5, 8 13, 8 23 L8 36 L14 36 L14 24 C14 16, 17 11, 20 11 C23 11, 26 16, 26 24 L26 36 L32 36 L32 23 C32 13, 28 5, 20 5 Z"
                  fill="url(#headerGoldGrad)"
                />
                <circle cx="20" cy="20" r="2.5" fill="#E8D5B0" />
                <defs>
                  <linearGradient id="headerGoldGrad" x1="8" y1="5" x2="32" y2="36" gradientUnits="userSpaceOnUse">
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

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-links-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {item.name}
                    <span className="nav-dot"></span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action CTAs */}
          <div className="header-actions">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={toggleAmbientSound}
              className={`header-sound-btn ${isSoundPlaying ? 'is-playing' : ''}`}
              title={lang === 'ar' ? 'تشغيل الأجواء الصوتية المعمارية' : 'Toggle Architectural Soundscape'}
              aria-label="Toggle Architectural Soundscape"
            >
              {isSoundPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="sound-text">
                {isSoundPlaying
                  ? lang === 'ar' ? 'الأجواء: نشطة' : 'Sound: ON'
                  : lang === 'ar' ? 'الأجواء الصوتية' : 'Atmosphere'}
              </span>
              {isSoundPlaying && (
                <span className="sound-wave-bars" aria-hidden="true">
                  <span className="sw-bar bar-1"></span>
                  <span className="sw-bar bar-2"></span>
                  <span className="sw-bar bar-3"></span>
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="lang-toggle-btn"
              title="تغيير اللغة / Switch Language"
              aria-label="Switch Language"
            >
              <span className="lang-code">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Direct Consultation Link */}
            <Link to="/contact" className="btn-header-cta">
              <span>{lang === 'ar' ? 'احجز استشارة' : 'Consultation'}</span>
              <ArrowUpRight size={15} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="فتح القائمة"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          <div className="mobile-drawer-header">
            <span className="gold-tag gold-tag-pulse">
              {lang === 'ar' ? 'استوديو رواق الوادي' : 'Riwaq Al-Wadi Studio'}
            </span>
            <button
              className="close-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <ul className="mobile-links-list">
            {navItems.map((item, idx) => (
              <li key={item.path} style={{ animationDelay: `${idx * 0.08}s` }}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="mobile-link-idx">0{idx + 1}</span>
                  <span className="mobile-link-text">{item.name}</span>
                  <ArrowUpRight size={18} className="mobile-link-icon" />
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-drawer-footer">
            <div className="mobile-drawer-controls">
              <button
                onClick={toggleAmbientSound}
                className={`mobile-sound-btn ${isSoundPlaying ? 'is-playing' : ''}`}
              >
                {isSoundPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>
                  {isSoundPlaying
                    ? lang === 'ar' ? 'الأجواء: نشطة' : 'Sound: Active'
                    : lang === 'ar' ? 'تشغيل الأجواء الصوتية' : 'Enable Soundscape'}
                </span>
              </button>

              <button onClick={toggleLang} className="mobile-lang-btn">
                <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
              </button>
            </div>

            <Link to="/contact" className="btn-primary" style={{ width: '100%' }}>
              <span>{lang === 'ar' ? 'حجز جلسة معمارية خاصة' : 'Book VIP Consultation'}</span>
            </Link>
            <div className="mobile-contact-bar">
              <span>الرياض • دبي • القاهرة</span>
              <span className="gold-text">+966 50 123 4567</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
