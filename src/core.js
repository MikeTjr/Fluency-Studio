// ─── APP STATE — Central state singleton and event bus ────────────────────
// All modules share state through this object. Communication between
// modules happens via the event system rather than direct imports.

export const AppState = {
  // ── UI state
  isKidsMode: false,

  // ── Audio protocol
  currentMode: 'daf',     // 'daf' | 'faf' | 'binaural' | 'bypass'

  // ── Engine state
  isRunning: false,
  analyser: null,          // shared AnalyserNode (set by AudioEngine)
  audioCtx: null,          // shared AudioContext (set by AudioEngine)

  // ── Rhythm
  rhythmEnabled: false,
  rhythmBPM: 80,

  // ── Session
  activeDay: null,
  completedDays: new Set(),
  kidsXP: 0,
  kidsStars: 0,

  // ── Rendering state (read by HarmonicField + Visualizer)
  syncProgress: 0,         // 0→1 as user practices (drives hemisphere phase sync)
  lastAmplitude: 0,        // RMS amplitude from mic

  // ─── Event system ────────────────────────────────────────────────────
  _listeners: {},

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
    // Return unsubscribe function
    return () => { this._listeners[event] = this._listeners[event].filter(l => l !== cb); };
  },

  emit(event, data) {
    (this._listeners[event] || []).forEach(cb => {
      try { cb(data); } catch(e) { console.warn(`[AppState] Event "${event}" handler error:`, e); }
    });
  },

  // Convenience: set a value and emit a change event
  set(key, value) {
    this[key] = value;
    this.emit(`change:${key}`, value);
  }
};
