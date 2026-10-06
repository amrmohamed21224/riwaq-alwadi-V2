import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices with fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 1500);
    };

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      resetIdleTimer();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsIdle(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      resetIdleTimer();
    };

    const handleElementHover = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('.project-card') ||
        target.closest('.tab-btn') ||
        target.closest('.imm-dock-btn') ||
        target.closest('.imm-hotspot-pin')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isVisible]);

  // Smooth trailing effect
  useEffect(() => {
    let animationFrameId;
    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.16,
        y: prev.y + (position.y - prev.y) * 0.16,
      }));
      animationFrameId = requestAnimationFrame(updateTrailing);
    };
    animationFrameId = requestAnimationFrame(updateTrailing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className={`custom-cursor-wrap ${isIdle ? 'cursor-idle' : ''}`}>
      <div
        className={`cursor-dot ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
      <div
        className={`cursor-follower ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      />
    </div>
  );
}
