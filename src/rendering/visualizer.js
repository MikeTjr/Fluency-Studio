// ─── NEURAL BRIDGE OSCILLOSCOPE ──────────────────────────────────────────
// Replaces the simple frequency bar chart with a dual-channel oscilloscope
// that shows the microphone time-domain waveform (Channel A, blue) overlaid
// with a reference sine wave at the BPM frequency (Channel B, purple).
//
// The visual metaphor: two hemispheres trying to find the same rhythm.
// As the user practices, the signals appear more coherent and in sync.

import { AppState } from '../core.js';

const CLAMP = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

class NeuralBridgeVisualizer {
  constructor() {
    this._canvas = null;
    this._ctx = null;
    this._rafId = null;
    this._t = 0;
    this._beatFlash = 0;
    this._rmsEnergy = 0;
    this._lastFrameTime = 0;
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  init() {
    this._canvas = document.getElementById('neural-viz');
    if (!this._canvas) { console.warn('[NeuralViz] Canvas not found'); return; }
    this._ctx = this._canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize(), { passive: true });

    AppState.on('beat', () => { this._beatFlash = 1.0; });
    AppState.on('bpmChange', bpm => { this._bpm = bpm; });
    this._bpm = AppState.rhythmBPM;

    this._render(0);
  }

  // ── Render loop ──────────────────────────────────────────────────────────

  _render(ts) {
    this._rafId = requestAnimationFrame(t => this._render(t));

    const dt = Math.min((ts - this._lastFrameTime) / 1000, 0.05);
    this._lastFrameTime = ts;

    this._t += dt;
    this._beatFlash = Math.max(0, this._beatFlash - dt * 3.5);

    const ctx = this._ctx;
    const W = this._canvas.width;
    const H = this._canvas.height;

    // ── Background ──
    ctx.fillStyle = AppState.isKidsMode ? '#120a04' : '#07090f';
    ctx.fillRect(0, 0, W, H);

    // ── Grid ──
    this._drawGrid(W, H);

    if (!AppState.isRunning || !AppState.analyser) {
      this._drawIdle(W, H, dt);
      return;
    }

    // ── Channel A: microphone time-domain ──
    const bufLen = AppState.analyser.fftSize;
    const timeDomain = new Uint8Array(bufLen);
    AppState.analyser.getByteTimeDomainData(timeDomain);

    this._rmsEnergy = this._computeRMS(timeDomain);
    this._drawChannelA(timeDomain, W, H);

    // ── Channel B: reference wave at BPM harmonic ──
    this._drawChannelB(W, H);

    // ── Energy bar ──
    this._drawEnergyBar(W, H);

    // ── Labels ──
    this._drawLabels(W, H);

    // ── Beat flash overlay ──
    if (this._beatFlash > 0.01) {
      const alpha = this._beatFlash * 0.12;
      ctx.fillStyle = AppState.isKidsMode
        ? `rgba(255,180,0,${alpha})`
        : `rgba(82,196,255,${alpha})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ── Grid ────────────────────────────────────────────────────────────────

  _drawGrid(W, H) {
    const ctx = this._ctx;
    ctx.save();
    ctx.strokeStyle = AppState.isKidsMode
      ? 'rgba(255,140,0,0.06)'
      : 'rgba(82,196,255,0.055)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (H / 4) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // Vertical lines
    for (let i = 0; i <= 8; i++) {
      const x = (W / 8) * i;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Center line (brighter)
    ctx.strokeStyle = AppState.isKidsMode
      ? 'rgba(255,140,0,0.18)'
      : 'rgba(82,196,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    ctx.restore();
  }

  // ── Channel A — live microphone waveform ────────────────────────────────

  _drawChannelA(timeDomain, W, H) {
    const ctx = this._ctx;
    const N = timeDomain.length;
    const midY = H / 2;
    const ampScale = H * 0.38;

    const beat = this._beatFlash;
    const alpha = 0.75 + beat * 0.25;
    const lineW = 1.4 + beat * 0.6;

    ctx.save();
    ctx.beginPath();

    const step = Math.max(1, Math.floor(N / W));
    for (let px = 0; px < W; px++) {
      const idx = Math.floor((px / W) * N);
      const v = (timeDomain[idx] / 128.0) - 1.0; // [-1, 1]
      const y = midY + v * ampScale;
      if (px === 0) ctx.moveTo(px, y);
      else          ctx.lineTo(px, y);
    }

    // Glow pass
    ctx.strokeStyle = AppState.isKidsMode
      ? `rgba(255,160,30,${alpha * 0.35})`
      : `rgba(82,196,255,${alpha * 0.3})`;
    ctx.lineWidth = lineW + 4;
    ctx.filter = 'blur(3px)';
    ctx.stroke();

    // Sharp pass
    ctx.filter = 'none';
    ctx.strokeStyle = AppState.isKidsMode
      ? `rgba(255,180,60,${alpha})`
      : `rgba(100,210,255,${alpha})`;
    ctx.lineWidth = lineW;
    ctx.stroke();
    ctx.restore();
  }

  // ── Channel B — reference BPM-harmonic sine ─────────────────────────────

  _drawChannelB(W, H) {
    const ctx = this._ctx;
    const midY = H / 2;
    const ampScale = H * 0.22;

    // Frequency: BPM * 4 for a visible audio-rate-adjacent frequency
    const freq = this._bpm / 60 * 4;

    ctx.save();
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const phase = (px / W) * Math.PI * 12 + this._t * freq * 2;
      const v = Math.sin(phase);
      const y = midY + v * ampScale;
      if (px === 0) ctx.moveTo(px, y);
      else          ctx.lineTo(px, y);
    }

    ctx.strokeStyle = AppState.isKidsMode
      ? 'rgba(255,220,80,0.28)'
      : 'rgba(167,139,250,0.35)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── Energy bar (right edge) ──────────────────────────────────────────────

  _drawEnergyBar(W, H) {
    const ctx = this._ctx;
    const barW = 4;
    const barH = H - 20;
    const x = W - barW - 6;
    const y = 10;
    const fill = CLAMP(this._rmsEnergy * 2.2, 0, 1);

    ctx.save();
    // Track
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(x, y, barW, barH);

    // Fill
    const grad = ctx.createLinearGradient(0, y + barH, 0, y);
    if (AppState.isKidsMode) {
      grad.addColorStop(0, 'rgba(255,120,0,0.9)');
      grad.addColorStop(0.6, 'rgba(255,200,0,0.9)');
      grad.addColorStop(1, 'rgba(255,255,180,0.9)');
    } else {
      grad.addColorStop(0, 'rgba(82,196,255,0.9)');
      grad.addColorStop(0.6, 'rgba(140,100,255,0.9)');
      grad.addColorStop(1, 'rgba(200,160,255,0.9)');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y + barH * (1 - fill), barW, barH * fill);
    ctx.restore();
  }

  // ── Channel labels ───────────────────────────────────────────────────────

  _drawLabels(W, H) {
    const ctx = this._ctx;
    ctx.save();
    ctx.font = '9px "JetBrains Mono", monospace';

    const cA = AppState.isKidsMode ? 'rgba(255,180,60,0.55)' : 'rgba(100,210,255,0.55)';
    const cB = AppState.isKidsMode ? 'rgba(255,220,80,0.45)' : 'rgba(167,139,250,0.45)';

    ctx.fillStyle = cA;
    ctx.fillText('CH·A — LIVE WAVEFORM', 8, 14);

    ctx.fillStyle = cB;
    ctx.fillText('CH·B — REFERENCE', 8, 26);

    // Sync progress
    const pct = Math.round((AppState.syncProgress || 0) * 100);
    const syncColor = AppState.isKidsMode ? 'rgba(255,220,60,0.65)' : 'rgba(100,255,180,0.65)';
    ctx.fillStyle = syncColor;
    ctx.textAlign = 'right';
    ctx.fillText(`SYNC ${pct}%`, W - 14, 14);

    ctx.restore();
  }

  // ── Idle animation (engine off) ──────────────────────────────────────────

  _drawIdle(W, H, dt) {
    const ctx = this._ctx;
    const midY = H / 2;
    const amp = H * 0.14;

    // Two slow sine waves drifting slightly apart — hemispheres not yet synchronized
    for (let ch = 0; ch < 2; ch++) {
      const phaseOffset = ch === 0 ? 0 : Math.PI * 0.9;
      const colorA = AppState.isKidsMode
        ? (ch === 0 ? 'rgba(255,150,30,0.22)' : 'rgba(255,220,60,0.18)')
        : (ch === 0 ? 'rgba(82,196,255,0.22)' : 'rgba(167,139,250,0.18)');

      ctx.save();
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const phase = (px / W) * Math.PI * 6 + this._t * 0.5 + phaseOffset;
        const y = midY + Math.sin(phase) * amp * (0.8 + 0.2 * Math.sin(this._t * 0.3 + ch));
        if (px === 0) ctx.moveTo(px, y);
        else          ctx.lineTo(px, y);
      }
      ctx.strokeStyle = colorA;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // Idle label
    ctx.save();
    ctx.fillStyle = AppState.isKidsMode ? 'rgba(255,200,80,0.35)' : 'rgba(82,196,255,0.35)';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('AWAITING ENGINE…', 8, 14);
    ctx.restore();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  _computeRMS(timeDomain) {
    let sum = 0;
    for (let i = 0; i < timeDomain.length; i++) {
      const v = (timeDomain[i] / 128.0) - 1.0;
      sum += v * v;
    }
    return Math.sqrt(sum / timeDomain.length);
  }

  _resize() {
    if (!this._canvas) return;
    const container = this._canvas.parentElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    this._canvas.width  = Math.max(1, Math.floor(rect.width));
    this._canvas.height = Math.max(1, Math.floor(rect.height));
  }
}

export const neuralViz = new NeuralBridgeVisualizer();
