import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SoundscapeProvider } from './context/SoundscapeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/ui/CustomCursor';
import Home from './pages/Home';
import Media from './pages/Media';
import UpcomingProjects from './pages/UpcomingProjects';
import Contact from './pages/Contact';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <SoundscapeProvider>
      <div className={`app-root lang-${lang}`}>
      {/* Film Grain Texture for Luxury Awwwards Depth */}
      <div className="film-grain" aria-hidden="true"></div>

      {/* Smooth Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Auto Scroll Restorer */}
      <ScrollToTop />

      {/* Fixed Luxury Navigation Header */}
      <Navbar lang={lang} setLang={setLang} />

      {/* Routed Main Content */}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/media" element={<Media lang={lang} />} />
          <Route path="/upcoming-projects" element={<UpcomingProjects lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Home lang={lang} />} />
        </Routes>
      </main>

      {/* Luxury Cinematic Footer */}
      <Footer lang={lang} />
    </div>
    </SoundscapeProvider>
  );
}
