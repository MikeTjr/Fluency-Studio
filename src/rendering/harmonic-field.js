// ─── HARMONIC INTERFERENCE FIELD ─────────────────────────────────────────
// Procedural wave-superposition renderer. Simulates two "hemisphere" wave
// sources whose phases gradually converge from π→0 as the user practices,
// creating a visual metaphor of hemispheric synchronization.
//
// Math: f(x,y,t) = Σᵢ Aᵢ·sin(k·rᵢ − ω·t + φᵢ) / (1 + λ·rᵢ)
//   where rᵢ = √((x−sxᵢ)² + (y−syᵢ)²)
//
// Rendered at 1/SCALE resolution then scaled up for a soft-field aesthetic
// and mobile performance.

import { AppState } from '../core.js';

const LERP = (a, b, t) => a + (b - a) * t;
const CLAMP = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

class HarmonicFieldRenderer {
  constructor() {
    this._canvas = null;
    this._ctx = null;
    this._offscreen = null;
    this._offCtx = null;
    this._imageData = null;

    this._t = 0;
    this._beatFlash = 0;   // 0–1, decays on each frame after beat
    this._rafId = null;
    this._lastFrameTime = 0;

    // Wave simulation constants
    this._kWave = 11;      // spatial frequency (higher = more ripples)
    this._kDamp = 5.5;     // amplitude decay with distance
    this._omega = 0.38;    // temporal angular frequency (BPM-influenced)

    // Two primary sources = left/right hemisphere metaphor
    // Additional ambient sources add depth and organic complexity
    this._sources = [
      { x: 0.28, y: 0.50, phase: 0,              amp: 1.0,  audioSens: 0.45, drift: { ax:0.012, ay:0.007, px:0, py:1.3 } },
      { x: 0.72, y: 0.50, phase: Math.PI,        amp: 1.0,  audioSens: 0.45, drift: { ax:0.012, ay:0.007, px:Math.PI, py:2.6 } },
      { x: 0.50, y: 0.22, phase: Math.PI / 3,   amp: 0.55, audioSens: 0.25, drift: { ax:0.007, ay:0.010, px:0.8, py:0 } },
      { x: 0.50, y: 0.78, phase: Math.PI * 1.6, amp: 0.55, audioSens: 0.25, drift: { ax:0.007, ay:0.010, px:2.0, py:Math.PI } },
      { x: 0.15, y: 0.30, phase: Math.PI * 0.7, amp: 0.30, audioSens: 0.15, drift: { ax:0.005, ay:0.008, px:1.0, py:0.5 } },
      { x: 0.85, y: 0.70, phase: Math.PI * 1.2, amp: 0.30, audioSens: 0.15, drift: { ax:0.005, ay:0.008, px:3.0, py:2.0 } },
    ];

    // Computed positions (include slow drift)
    this._positions = this._sources.map(s => ({ x: s.x, y: s.y }));

    this._SCALE = this._isMobile() ? 6 : 4;
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────

  init() {
    this._canvas = document.getElementById('harmonic-field');
    if (!this._canvas) { console.warn('[HarmonicField] Canvas not found'); return; }

    this._ctx = this._canvas.getContext('2d');
    this._offscreen = document.createElement('canvas');
    this._offCtx = this._offscreen.getContext('2d');

    this._resize();
    window.addEventListener('resize', () => this._resize(), { passive: true });

    // Listen to AppState events
    AppState.on('beat', () => { this._beatFlash = 1.0; });
    AppState.on('bpmChange', bpm => {
      this._omega = 0.20 + (bpm / 60) * 0.18;
    });

    this._render(0);
  }

  // ── Main render loop ────────────────────────────────────────────────────

  _render(ts) {
    this._rafId = requestAnimationFrame(t => this._render(t));

    const dt = Math.min((ts - this._lastFrameTime) / 1000, 0.05); // cap at 50ms
    this._lastFrameTime = ts;

    // Time advance
    this._t += dt * this._omega;

    // Beat flash decay
    this._beatFlash = Math.max(0, this._beatFlash - dt * 2.8);

    // Sync progress drives hemisphere phase convergence
    const sync = AppState.syncProgress || 0;
    this._sources[1].phase = Math.PI * (1 - sync);

    // Drift source positions slowly for organic feel
    this._updateDrift(this._t);

    // Audio amplitude
    const amp = CLAMP((AppState.lastAmplitude || 0) * 1.4 + this._beatFlash * 0.5, 0, 1.2);

    // Compute interference field at low resolution
    this._computeField(amp);

    // Scale up to canvas
    this._offCtx.putImageData(this._imageData, 0, 0);
    this._ctx.drawImage(this._offscreen, 0, 0, this._canvas.width, this._canvas.height);
  }

  // ── Field computation ───────────────────────────────────────────────────

  _computeField(amp) {
    const w = this._offscreen.width;
    const h = this._offscreen.height;
    const data = this._imageData.data;
    const src = this._sources;
    const pos = this._positions;
    const k = this._kWave;
    const lam = this._kDamp;
    const t = this._t;
    const nSrc = src.length;
    const isKids = AppState.isKidsMode;

    for (let py = 0; py < h; py++) {
      const ny = py / h;
      for (let px = 0; px < w; px++) {
        const nx = px / w;
        let f = 0;
        for (let i = 0; i < nSrc; i++) {
          const dx = nx - pos[i].x;
          const dy = ny - pos[i].y;
          const r = Math.sqrt(dx * dx + dy * dy);
          const a = src[i].amp + amp * src[i].audioSens;
          f += a * Math.sin(k * r - t + src[i].phase) / (1 + lam * r);
        }
        // f ≈ in range [-3, 3]; normalize to [0,1]
        const tn = CLAMP((f + 2.8) / 5.6, 0, 1);
        const [r, g, b] = isKids ? this._colorKids(tn, amp) : this._colorAdult(tn, amp);
        const idx = (py * w + px) * 4;
        data[idx]   = r;
        data[idx+1] = g;
        data[idx+2] = b;
        data[idx+3] = 255;
      }
    }
  }

  // ── Slow source drift ───────────────────────────────────────────────────

  _updateDrift(t) {
    const src = this._sources;
    const pos = this._positions;
    for (let i = 0; i < src.length; i++) {
      const d = src[i].drift;
      pos[i].x = src[i].x + d.ax * Math.sin(t * 0.18 + d.px);
      pos[i].y = src[i].y + d.ay * Math.cos(t * 0.14 + d.py);
    }
  }

  // ── Color mappings ──────────────────────────────────────────────────────

  // Adult: deep neural space — dark navy → teal → cyan → purple → white-lavender
  _colorAdult(tn, amp) {
    const boost = 1 + amp * 0.55;
    let r, g, b;

    if (tn < 0.22) {
      const f = tn / 0.22;
      r = LERP(7,  14, f);
      g = LERP(9,  18, f);
      b = LERP(15, 52, f);
    } else if (tn < 0.45) {
      const f = (tn - 0.22) / 0.23;
      r = LERP(14,  28, f);
      g = LERP(18, 115, f);
      b = LERP(52, 185, f);
    } else if (tn < 0.68) {
      const f = (tn - 0.45) / 0.23;
      r = LERP(28,  110, f);
      g = LERP(115, 100, f);
      b = LERP(185, 210, f);
    } else {
      const f = (tn - 0.68) / 0.32;
      r = LERP(110, 195, f);
      g = LERP(100, 138, f);
      b = LERP(210, 245, f);
    }

    return [
      CLAMP(Math.floor(r * boost), 0, 255),
      CLAMP(Math.floor(g * boost), 0, 255),
      CLAMP(Math.floor(b * boost), 0, 255),
    ];
  }

  // Kids: warm resonance — dark warm → amber → golden yellow → bright peach
  _colorKids(tn, amp) {
    const boost = 1 + amp * 0.55;
    let r, g, b;

    if (tn < 0.22) {
      const f = tn / 0.22;
      r = LERP(12, 40, f);
      g = LERP(8,  22, f);
      b = LERP(8,  10, f);
    } else if (tn < 0.45) {
      const f = (tn - 0.22) / 0.23;
      r = LERP(40,  190, f);
      g = LERP(22,   90, f);
      b = LERP(10,   15, f);
    } else if (tn < 0.68) {
      const f = (tn - 0.45) / 0.23;
      r = LERP(190, 240, f);
      g = LERP(90,  185, f);
      b = LERP(15,   20, f);
    } else {
      const f = (tn - 0.68) / 0.32;
      r = LERP(240, 255, f);
      g = LERP(185, 225, f);
      b = LERP(20,  120, f);
    }

    return [
      CLAMP(Math.floor(r * boost), 0, 255),
      CLAMP(Math.floor(g * boost), 0, 255),
      CLAMP(Math.floor(b * boost), 0, 255),
    ];
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  _resize() {
    if (!this._canvas) return;
    this._canvas.width  = window.innerWidth;
    this._canvas.height = window.innerHeight;
    const w = Math.floor(window.innerWidth  / this._SCALE);
    const h = Math.floor(window.innerHeight / this._SCALE);
    this._offscreen.width  = Math.max(1, w);
    this._offscreen.height = Math.max(1, h);
    this._imageData = this._offCtx.createImageData(this._offscreen.width, this._offscreen.height);
  }

  _isMobile() {
    return window.innerWidth < 768 || navigator.maxTouchPoints > 0;
  }
}

export const harmonicField = new HarmonicFieldRenderer();
