import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SoundscapeContext = createContext({
  isSoundPlaying: false,
  toggleAmbientSound: () => {},
});

export function SoundscapeProvider({ children }) {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef(null);

  const toggleAmbientSound = () => {
    if (isSoundPlaying) {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend();
      }
      setIsSoundPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Master Gain
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.05, ctx.currentTime);
        master.connect(ctx.destination);

        // Low Warm Drone Oscillator (55Hz / A1)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        // Fifth Harmony Oscillator (82.4Hz / E2)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(82.4, ctx.currentTime);

        // Soft Filter (Warm lowpass)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(master);

        osc1.start();
        osc2.start();
        audioNodesRef.current = { osc1, osc2, master };
      } else {
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }
      setIsSoundPlaying(true);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <SoundscapeContext.Provider value={{ isSoundPlaying, toggleAmbientSound }}>
      {children}
    </SoundscapeContext.Provider>
  );
}

export function useSoundscape() {
  return useContext(SoundscapeContext);
}
