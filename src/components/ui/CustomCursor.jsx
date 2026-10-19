import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    const visibleRef = { current: false };
    const idleRef = { current: false };
    const hoveredRef = { current: false };

    const resetIdleTimer = () => {
      if (idleRef.current) {
        idleRef.current = false;
        setIsIdle(false);
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        idleRef.current = true;
        setIsIdle(true);
      }, 1500);
    };

    const handleMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
      resetIdleTimer();
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      idleRef.current = true;
      setIsVisible(false);
      setIsIdle(true);
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
      resetIdleTimer();
    };

    const handleElementHover = (e) => {
      const target = e.target;
      const next = !!(
        target?.closest &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('.interactive') ||
          target.closest('.project-card') ||
          target.closest('.tab-btn') ||
          target.closest('.imm-dock-btn') ||
          target.closest('.imm-hotspot-pin'))
      );
      if (next !== hoveredRef.current) {
        hoveredRef.current = next;
        setIsHovered(next);
      }
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.documentElement.classList.contains('wt-open')) return;
      trail.x += (pos.x - trail.x) * 0.16;
      trail.y += (pos.y - trail.y) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (followerRef.current) followerRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`custom-cursor-wrap ${isIdle ? 'cursor-idle' : ''}`}>
      <div ref={dotRef} className={`cursor-dot ${isHovered ? 'hovered' : ''}`} />
      <div ref={followerRef} className={`cursor-follower ${isHovered ? 'hovered' : ''}`} />
    </div>
  );
}
