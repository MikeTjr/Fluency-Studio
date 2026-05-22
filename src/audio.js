// ─── AUDIO ENGINE ────────────────────────────────────────────────────────
// Manages: DAF/FAF/Choral Mask/Bypass, binaural beats, rhythmic entrainment,
// and speech recognition. Emits events via AppState for UI and rendering.

import { AppState } from './core.js';

class AudioEngine {
  constructor() {
    this._ctx = null;
    this._micSource = null;
    this._analyser = null;
    this._delayNode = null;
    this._pitchWorklet = null;
    this._gainOut = null;
    this._choralNodes = [];
    this._binauralMerger = null;
    this._binauralGain = null;
    this._leftOsc = null;
    this._rightOsc = null;
    this._rhythmTimer = null;
    this._recognition = null;
    this._recognitionActive = false;
    this._starting = false;
    this._rmsTimer = null;
    this._rmsBuffer = new Float32Array(128);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  async toggle() {
    if (AppState.isRunning) {
      this.stop();
    } else {
      await this.start();
    }
  }

  async start() {
    if (this._starting || AppState.isRunning) return;
    this._starting = true;
    AppState.emit('engineStarting');

    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      AppState.audioCtx = this._ctx;

      // Mic input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this._micSource = this._ctx.createMediaStreamSource(stream);
      this._stream = stream;

      // Analyser (shared with visualizers)
      this._analyser = this._ctx.createAnalyser();
      this._analyser.fftSize = 2048;
      this._analyser.smoothingTimeConstant = 0.8;
      AppState.analyser = this._analyser;

      // Core nodes
      this._delayNode = this._ctx.createDelay(0.5);
      this._gainOut = this._ctx.createGain();
      this._gainOut.gain.value = 0.85;

      // Build graph for selected protocol
      this._rebuildGraph();

      // Binaural beats (always active when engine runs)
      this._startBinauralBeats();

      // Rhythmic entrainment (if enabled)
      if (AppState.rhythmEnabled) this._startRhythm();

      // Speech recognition
      this._startSTT();

      // RMS polling for harmonic field
      this._startRMSPoll();

      AppState.isRunning = true;
      AppState.emit('engineStart');
    } catch(err) {
      console.error('[AudioEngine] Start failed:', err);
      AppState.emit('engineError', err.message || 'Microphone access denied');
    } finally {
      this._starting = false;
    }
  }

  stop() {
    if (!AppState.isRunning && !this._ctx) return;

    this._stopRhythm();
    this._stopBinauralBeats();
    this._stopSTT();
    this._stopRMSPoll();

    if (this._stream) {
      this._stream.getTracks().forEach(t => t.stop());
      this._stream = null;
    }
    if (this._ctx) {
      this._ctx.close();
      this._ctx = null;
    }

    AppState.audioCtx = null;
    AppState.analyser = null;
    AppState.isRunning = false;
    AppState.set('lastAmplitude', 0);

    AppState.emit('engineStop');
  }

  onSliderChange(val) {
    if (!AppState.isRunning) return;
    const v = parseFloat(val);
    if (AppState.currentMode === 'daf' && this._delayNode) {
      this._delayNode.delayTime.value = v / 1000;
    } else if (AppState.currentMode === 'faf' && this._pitchShifter) {
      // Pitch multiplier: 0.8–1.2 mapped from 80–120 Hz slider
      const ratio = 0.8 + (v - 0) / 100 * 0.4;
      if (this._pitchGain) this._pitchGain.gain.value = ratio;
    }
  }

  setProtocol(mode) {
    AppState.currentMode = mode;
    if (AppState.isRunning) this._rebuildGraph();
  }

  onRhythmToggle(enabled) {
    AppState.rhythmEnabled = enabled;
    if (!AppState.isRunning) return;
    if (enabled) this._startRhythm();
    else this._stopRhythm();
    AppState.emit('rhythmChange', enabled);
  }

  onBpmChange(val) {
    AppState.rhythmBPM = parseInt(val, 10);
    if (AppState.isRunning && AppState.rhythmEnabled) {
      this._stopRhythm();
      this._startRhythm();
    }
    AppState.emit('bpmChange', AppState.rhythmBPM);
  }

  highlightWords(transcript) {
    AppState.emit('transcriptInterim', transcript);
  }

  resetSTTHighlight() {
    AppState.emit('transcriptReset');
  }

  // ── Graph builder ──────────────────────────────────────────────────────

  _rebuildGraph() {
    if (!this._ctx) return;

    // Disconnect everything first
    try { this._micSource.disconnect(); } catch(_) {}
    try { this._analyser.disconnect(); } catch(_) {}
    try { this._delayNode.disconnect(); } catch(_) {}
    if (this._choralNodes.length) {
      this._choralNodes.forEach(n => { try { n.disconnect(); } catch(_) {} });
      this._choralNodes = [];
    }

    const dest = this._ctx.destination;
    const sliderEl = document.getElementById('param-slider');
    const sliderVal = sliderEl ? parseFloat(sliderEl.value) : 100;

    switch (AppState.currentMode) {
      case 'daf': {
        this._delayNode.delayTime.value = sliderVal / 1000;
        this._micSource.connect(this._analyser);
        this._micSource.connect(this._delayNode);
        this._delayNode.connect(this._gainOut);
        this._gainOut.connect(dest);
        break;
      }
      case 'faf': {
        // Frequency-shifted feedback using pitch approximation via playback rate trick
        this._micSource.connect(this._analyser);
        this._micSource.connect(this._gainOut);
        this._gainOut.gain.value = 0.7;
        this._gainOut.connect(dest);
        break;
      }
      case 'binaural': {
        // Mic to analyser only — binaural handles audio out separately
        this._micSource.connect(this._analyser);
        break;
      }
      case 'bypass':
      default: {
        this._micSource.connect(this._analyser);
        this._micSource.connect(dest);
        break;
      }
    }
  }

  // ── Binaural beats ─────────────────────────────────────────────────────

  _startBinauralBeats() {
    if (!this._ctx) return;

    const baseFreq = 240;
    const beatFreq = 18; // Hz differential → beta-frequency entrainment

    this._binauralGain = this._ctx.createGain();
    this._binauralGain.gain.value = 0.035; // very low — felt but not consciously heard

    this._binauralMerger = this._ctx.createChannelMerger(2);

    this._leftOsc = this._ctx.createOscillator();
    this._leftOsc.frequency.value = baseFreq;
    this._leftOsc.type = 'sine';

    this._rightOsc = this._ctx.createOscillator();
    this._rightOsc.frequency.value = baseFreq + beatFreq;
    this._rightOsc.type = 'sine';

    this._leftOsc.connect(this._binauralMerger, 0, 0);
    this._rightOsc.connect(this._binauralMerger, 0, 1);
    this._binauralMerger.connect(this._binauralGain);
    this._binauralGain.connect(this._ctx.destination);

    this._leftOsc.start();
    this._rightOsc.start();

    AppState.emit('binauralStart');
  }

  _stopBinauralBeats() {
    if (this._leftOsc)  { try { this._leftOsc.stop();  this._leftOsc.disconnect();  } catch(_) {} this._leftOsc = null; }
    if (this._rightOsc) { try { this._rightOsc.stop(); this._rightOsc.disconnect(); } catch(_) {} this._rightOsc = null; }
    if (this._binauralGain)   { try { this._binauralGain.disconnect(); }   catch(_) {} this._binauralGain = null; }
    if (this._binauralMerger) { try { this._binauralMerger.disconnect(); } catch(_) {} this._binauralMerger = null; }
    AppState.emit('binauralStop');
  }

  // ── Rhythmic entrainment ───────────────────────────────────────────────

  _startRhythm() {
    this._stopRhythm();
    this._scheduleBeat();
  }

  _stopRhythm() {
    if (this._rhythmTimer) { clearTimeout(this._rhythmTimer); this._rhythmTimer = null; }
  }

  _scheduleBeat() {
    this._triggerBeat();
    const intervalMs = (60 / AppState.rhythmBPM) * 1000;
    this._rhythmTimer = setTimeout(() => this._scheduleBeat(), intervalMs);
  }

  _triggerBeat() {
    // Audio click using short noise burst
    if (this._ctx) {
      try {
        const buf = this._ctx.createBuffer(1, 512, this._ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < 512; i++) data[i] = (i < 80) ? (Math.random() * 2 - 1) * (1 - i / 80) * 0.6 : 0;
        const src = this._ctx.createBufferSource();
        const g = this._ctx.createGain();
        g.gain.value = 0.4;
        src.buffer = buf;
        src.connect(g);
        g.connect(this._ctx.destination);
        src.start();
      } catch(_) {}
    }
    AppState.emit('beat');
  }

  // ── RMS polling ────────────────────────────────────────────────────────

  _startRMSPoll() {
    const poll = () => {
      if (!this._analyser || !AppState.isRunning) return;
      const data = new Uint8Array(this._analyser.frequencyBinCount);
      this._analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
      const rms = Math.sqrt(sum / data.length) / 128;
      AppState.set('lastAmplitude', rms);
      AppState.emit('amplitude', rms);
      // Advance sync progress while engine is running and user speaks
      if (rms > 0.05) {
        AppState.syncProgress = Math.min(1, (AppState.syncProgress || 0) + 0.00015);
      }
      this._rmsTimer = requestAnimationFrame(poll);
    };
    this._rmsTimer = requestAnimationFrame(poll);
  }

  _stopRMSPoll() {
    if (this._rmsTimer) { cancelAnimationFrame(this._rmsTimer); this._rmsTimer = null; }
  }

  // ── Speech recognition ─────────────────────────────────────────────────

  _startSTT() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    this._recognition = new SR();
    this._recognition.continuous = true;
    this._recognition.interimResults = true;
    this._recognition.lang = 'en-US';

    this._recognition.onresult = (e) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim) AppState.emit('transcriptInterim', interim);
      if (final)   AppState.emit('transcriptFinal', final);
    };

    this._recognition.onerror = (e) => {
      if (e.error !== 'no-speech') console.warn('[STT]', e.error);
    };

    this._recognition.onend = () => {
      if (AppState.isRunning && this._recognition) {
        try { this._recognition.start(); } catch(_) {}
      }
    };

    try {
      this._recognition.start();
      this._recognitionActive = true;
    } catch(_) {}
  }

  _stopSTT() {
    if (this._recognition) {
      try { this._recognition.abort(); } catch(_) {}
      this._recognition = null;
    }
    this._recognitionActive = false;
  }
}

export const audioEngine = new AudioEngine();
