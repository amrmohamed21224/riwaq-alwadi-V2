/** Generative architectural soundscape (Web Audio): pad + optional water / wind beds */
export function createAmbience({ notes = [55, 82.4, 110, 164.8], water = 0, wind = 0, shimmer = 0.5, gain = 0.07 } = {}) {
  let ctx = null;
  let master = null;
  let playing = false;

  const noiseBuffer = (c) => {
    const len = c.sampleRate * 3;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  };

  function init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 520;
    lp.Q.value = 0.4;
    lp.connect(master);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 180;
    lfo.connect(lfoG);
    lfoG.connect(lp.frequency);
    lfo.start();

    notes.forEach((f, i) => {
      for (const det of [-6, 6]) {
        const o = ctx.createOscillator();
        o.type = i % 2 ? 'triangle' : 'sawtooth';
        o.frequency.value = f;
        o.detune.value = det;
        const g = ctx.createGain();
        g.gain.value = 0.05 / (1 + i * 0.4);
        o.connect(g);
        g.connect(lp);
        o.start();
      }
    });

    if (shimmer > 0) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = notes[notes.length - 1] * 4;
      const g = ctx.createGain();
      g.gain.value = 0;
      const l2 = ctx.createOscillator();
      l2.frequency.value = 0.11;
      const l2g = ctx.createGain();
      l2g.gain.value = 0.012 * shimmer;
      l2.connect(l2g);
      l2g.connect(g.gain);
      l2.start();
      o.connect(g);
      g.connect(master);
      o.start();
    }

    if (water > 0 || wind > 0) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx);
      src.loop = true;
      if (water > 0) {
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1400;
        bp.Q.value = 0.7;
        const wg = ctx.createGain();
        wg.gain.value = 0.35 * water;
        const l3 = ctx.createOscillator();
        l3.frequency.value = 0.4;
        const l3g = ctx.createGain();
        l3g.gain.value = 500;
        l3.connect(l3g);
        l3g.connect(bp.frequency);
        l3.start();
        src.connect(bp);
        bp.connect(wg);
        wg.connect(master);
      }
      if (wind > 0) {
        const lp2 = ctx.createBiquadFilter();
        lp2.type = 'lowpass';
        lp2.frequency.value = 400;
        const wg2 = ctx.createGain();
        wg2.gain.value = 0.5 * wind;
        const l4 = ctx.createOscillator();
        l4.frequency.value = 0.09;
        const l4g = ctx.createGain();
        l4g.gain.value = 0.25 * wind;
        l4.connect(l4g);
        l4g.connect(wg2.gain);
        l4.start();
        src.connect(lp2);
        lp2.connect(wg2);
        wg2.connect(master);
      }
      src.start();
    }
  }

  return {
    get playing() {
      return playing;
    },
    start() {
      try {
        if (!ctx) init();
        ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(gain, ctx.currentTime + 2.5);
        playing = true;
      } catch {
        playing = false;
      }
    },
    stop() {
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setTimeout(() => ctx && ctx.suspend(), 900);
      playing = false;
    },
    dispose() {
      try {
        ctx && ctx.close();
      } catch {
        /* noop */
      }
      ctx = null;
      playing = false;
    },
  };
}
