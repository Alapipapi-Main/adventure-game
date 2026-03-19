import { useRef, useEffect, useCallback, useState } from 'react';

// ── Tone helpers ──────────────────────────────────────────────────────────────
function createCtx() {
  try { return new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
}

function playTone(ctx, opts) {
  if (!ctx) return;
  const { freq = 440, type = 'sine', gain = 0.3, duration = 0.15, delay = 0, decay = true } = opts;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  amp.gain.setValueAtTime(gain, ctx.currentTime + delay);
  if (decay) amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

// ── Sound effects ─────────────────────────────────────────────────────────────
export const SOUNDS = {
  attack(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 180, type: 'sawtooth', gain: v * 0.4, duration: 0.08 });
    playTone(ctx, { freq: 120, type: 'square',   gain: v * 0.2, duration: 0.12, delay: 0.05 });
  },
  crit(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 300, type: 'sawtooth', gain: v * 0.5, duration: 0.05 });
    playTone(ctx, { freq: 450, type: 'square',   gain: v * 0.35, duration: 0.12, delay: 0.04 });
    playTone(ctx, { freq: 600, type: 'sine',     gain: v * 0.2,  duration: 0.18, delay: 0.1  });
  },
  hit(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 100, type: 'square',   gain: v * 0.35, duration: 0.1  });
    playTone(ctx, { freq: 80,  type: 'sawtooth', gain: v * 0.21, duration: 0.15, delay: 0.05 });
  },
  heal(ctx, v) {
    if (!ctx || !v) return;
    [523, 659, 784].forEach((f, i) =>
      playTone(ctx, { freq: f, type: 'sine', gain: v * 0.3, duration: 0.2, delay: i * 0.1 })
    );
  },
  levelUp(ctx, v) {
    if (!ctx || !v) return;
    [523, 659, 784, 1047].forEach((f, i) =>
      playTone(ctx, { freq: f, type: 'sine', gain: v * 0.35, duration: 0.18, delay: i * 0.08 })
    );
  },
  victory(ctx, v) {
    if (!ctx || !v) return;
    [523, 659, 784, 659, 1047].forEach((f, i) =>
      playTone(ctx, { freq: f, type: 'triangle', gain: v * 0.3, duration: 0.22, delay: i * 0.1 })
    );
  },
  death(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 220, type: 'sawtooth', gain: v * 0.4, duration: 0.5  });
    playTone(ctx, { freq: 110, type: 'square',   gain: v * 0.24, duration: 0.8, delay: 0.3 });
    playTone(ctx, { freq: 55,  type: 'sine',     gain: v * 0.16, duration: 1.2, delay: 0.7 });
  },
  purchase(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 784, type: 'sine', gain: v * 0.25, duration: 0.1 });
    playTone(ctx, { freq: 988, type: 'sine', gain: v * 0.175, duration: 0.12, delay: 0.1 });
  },
  flee(ctx, v) {
    if (!ctx || !v) return;
    [400, 350, 300, 250].forEach((f, i) =>
      playTone(ctx, { freq: f, type: 'sine', gain: v * 0.3, duration: 0.08, delay: i * 0.06 })
    );
  },
  travel(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 440, type: 'sine', gain: v * 0.2, duration: 0.1 });
    playTone(ctx, { freq: 550, type: 'sine', gain: v * 0.12, duration: 0.12, delay: 0.1 });
  },
  menuClick(ctx, v) {
    if (!ctx || !v) return;
    playTone(ctx, { freq: 660, type: 'sine', gain: v * 0.15, duration: 0.07 });
  },
};

// ── Music tracks ──────────────────────────────────────────────────────────────
// Each track: bpm, a melody array of Hz values, oscillator type, base gain, optional harmony
const TRACKS = {
  // Slow, mysterious — title screen
  title: {
    bpm: 52,
    notes: [220, 0, 246, 0, 261, 246, 0, 220, 0, 196, 0, 220],
    harmony: [110, 0, 123, 0, 130, 123, 0, 110, 0, 98, 0, 110],
    type: 'triangle',
    baseGain: 0.1,
  },
  // Gentle, hopeful — exploring safe areas
  explore: {
    bpm: 76,
    notes: [329, 293, 261, 293, 329, 329, 329, 0, 293, 293, 293, 0, 329, 392, 392, 0],
    type: 'sine',
    baseGain: 0.09,
  },
  // Tense, rhythmic — regular battle
  battle: {
    bpm: 148,
    notes: [110, 110, 130, 0, 110, 110, 146, 130, 110, 0, 98, 0, 110, 130, 110, 0],
    type: 'sawtooth',
    baseGain: 0.07,
  },
  // Dark, heavy — boss fight
  boss: {
    bpm: 116,
    notes: [73, 0, 73, 82, 0, 73, 0, 87, 73, 0, 65, 0, 73, 0, 69, 0],
    harmony: [36, 0, 36, 41, 0, 36, 0, 43, 36, 0, 32, 0, 36, 0, 34, 0],
    type: 'square',
    baseGain: 0.065,
  },
  // Mournful, slow — game over
  gameover: {
    bpm: 44,
    notes: [220, 0, 207, 0, 196, 0, 185, 0, 174, 0, 164, 0, 155, 0, 0, 0],
    type: 'triangle',
    baseGain: 0.09,
  },
  // Triumphant, bright — victory screen
  victory: {
    bpm: 96,
    notes: [523, 523, 659, 784, 0, 784, 880, 784, 659, 523, 0, 659, 523, 392, 523, 0],
    type: 'triangle',
    baseGain: 0.09,
  },
  // Warm, merchant-y — shop / lobby modals
  shop: {
    bpm: 88,
    notes: [392, 440, 392, 349, 392, 440, 523, 0, 440, 392, 349, 392, 329, 349, 392, 0],
    type: 'sine',
    baseGain: 0.08,
  },
};

// ── Music player class ────────────────────────────────────────────────────────
class MusicPlayer {
  constructor(ctx) {
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.connect(ctx.destination);
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.track = null;
    this.noteIdx = 0;
    this.timer = null;
    this.volume = 0.5;
    this.running = false;
    this.currentName = null;
  }

  setVolume(v) {
    this.volume = v;
    this.masterGain.gain.setTargetAtTime(v === 0 ? 0 : v, this.ctx.currentTime, 0.15);
  }

  play(trackName) {
    if (this.currentName === trackName && this.running) return; // already playing
    this.stop();
    const def = TRACKS[trackName];
    if (!def) return;
    this.track = def;
    this.currentName = trackName;
    this.noteIdx = 0;
    this.running = true;
    this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.6);
    this._tick();
  }

  _tick() {
    if (!this.running || !this.track) return;
    const def = this.track;
    const interval = (60 / def.bpm) * 1000;
    const freq    = def.notes[this.noteIdx % def.notes.length];
    const harmFreq = def.harmony ? def.harmony[this.noteIdx % def.harmony.length] : 0;
    this.noteIdx++;

    if (freq > 0) {
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.connect(amp); amp.connect(this.masterGain);
      osc.type = def.type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      amp.gain.setValueAtTime(def.baseGain, this.ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (interval / 1000) * 0.75);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + (interval / 1000) * 0.8);
    }

    if (harmFreq > 0) {
      const osc2 = this.ctx.createOscillator();
      const amp2 = this.ctx.createGain();
      osc2.connect(amp2); amp2.connect(this.masterGain);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(harmFreq, this.ctx.currentTime);
      amp2.gain.setValueAtTime(def.baseGain * 0.5, this.ctx.currentTime);
      amp2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (interval / 1000) * 0.7);
      osc2.start(this.ctx.currentTime);
      osc2.stop(this.ctx.currentTime + (interval / 1000) * 0.75);
    }

    this.timer = setTimeout(() => this._tick(), interval);
  }

  stop() {
    this.running = false;
    this.currentName = null;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this.track = null;
    this.noteIdx = 0;
  }

  crossfadeTo(trackName) {
    if (this.currentName === trackName && this.running) return;
    const prev = this.currentName;
    this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.35);
    setTimeout(() => {
      if (!this.running || this.currentName !== prev) return; // guard against double-calls
      this.stop();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.play(trackName);
    }, 800);
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────
const MUSIC_VOL_KEY = 'vorhaan_music_vol';
const SFX_VOL_KEY   = 'vorhaan_sfx_vol';

export function useAudio() {
  const ctxRef   = useRef(null);
  const musicRef = useRef(null);
  const pendingTrack = useRef(null); // track requested before AudioContext existed

  const [musicVol, setMusicVolState] = useState(() =>
    parseFloat(localStorage.getItem(MUSIC_VOL_KEY) ?? '0.5')
  );
  const [sfxVol, setSfxVolState] = useState(() =>
    parseFloat(localStorage.getItem(SFX_VOL_KEY) ?? '0.7')
  );

  // Lazily create AudioContext on first user gesture, then flush pending track
  const ensureCtx = useCallback(() => {
    if (ctxRef.current) {
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      return ctxRef.current;
    }
    const ctx = createCtx();
    if (!ctx) return null;
    ctxRef.current = ctx;
    const player = new MusicPlayer(ctx);
    const vol = parseFloat(localStorage.getItem(MUSIC_VOL_KEY) ?? '0.5');
    player.volume = vol;
    musicRef.current = player;
    // Flush any track that was requested before the context existed
    if (pendingTrack.current) {
      player.play(pendingTrack.current);
      pendingTrack.current = null;
    }
    return ctx;
  }, []);

  const setMusicVol = useCallback((v) => {
    setMusicVolState(v);
    localStorage.setItem(MUSIC_VOL_KEY, String(v));
    musicRef.current?.setVolume(v);
  }, []);

  const setSfxVol = useCallback((v) => {
    setSfxVolState(v);
    localStorage.setItem(SFX_VOL_KEY, String(v));
  }, []);

  // playMusic — works even before the first gesture by queuing the track
  const playMusic = useCallback((trackName) => {
    if (!ctxRef.current) {
      // Queue it — will be picked up on the next ensureCtx() call (first click)
      pendingTrack.current = trackName;
      return;
    }
    ensureCtx();
    musicRef.current?.crossfadeTo(trackName);
  }, [ensureCtx]);

  const stopMusic = useCallback(() => {
    musicRef.current?.stop();
    pendingTrack.current = null;
  }, []);

  const playSfx = useCallback((name) => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const fn = SOUNDS[name];
    const vol = parseFloat(localStorage.getItem(SFX_VOL_KEY) ?? '0.7');
    if (fn) fn(ctx, vol);
  }, [ensureCtx]);

  useEffect(() => () => { musicRef.current?.stop(); }, []);

  return { musicVol, sfxVol, setMusicVol, setSfxVol, playMusic, stopMusic, playSfx };
}
