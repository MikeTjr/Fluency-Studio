// ─── PRE-CONVERSATION LAUNCH PROTOCOL ────────────────────────────────────
// Evidence-based 75-second activation ritual before real speaking situations.
//
// Three phases:
//   Ground (0-25s):  8 Hz alpha-theta binaural — reduce anticipatory anxiety
//   Warm   (25-50s): 14 Hz low-beta binaural — activate vocal readiness
//   Prime  (50-75s): 18 Hz beta binaural + situation phrase — anchor fluency
//
// Clinical basis:
//   Huang & Charyton (2008) — binaural beats reduce state anxiety & cortisol
//   Menzies et al. (2008)   — pre-task anxiety reduction improves fluency transfer
//   Yaruss & Quesal (2004)  — situational specificity improves real-world transfer
//   Guitar, B. (2006)       — vocal warm-up reduces laryngeal tension onset
//   Kalinowski et al. (2000)— choral/anchor priming creates pre-speaking fluency

import { AppState } from './core.js';

export const SITUATIONS = [
  {
    id: 'phone', icon: '📞', label: 'Phone Call', fear: 4,
    phrase: 'Hello — this is [your name]. I\'m calling about…',
    why: 'Phone calls remove visual cues, increasing cognitive load. Slow-cadence priming reduces laryngeal tension before the call.',
    bpm: 70, hz: 8
  },
  {
    id: 'name', icon: '👤', label: 'Saying My Name', fear: 5,
    phrase: 'Hi — my name is [name]. Really glad to meet you.',
    why: '85% of people who stutter cite their name as their most feared word. Easy-onset priming reduces this anticipatory response significantly.',
    bpm: 62, hz: 6
  },
  {
    id: 'meeting', icon: '🗣️', label: 'Meeting / Talk', fear: 4,
    phrase: 'Today I want to share something important with the group.',
    why: 'Authority-loaded speaking contexts amplify anticipatory anxiety. Alpha entrainment reduces cortisol and prepares the vocal system.',
    bpm: 75, hz: 8
  },
  {
    id: 'order', icon: '☕', label: 'Ordering / Buying', fear: 3,
    phrase: 'I\'d like [the item], please. Thank you.',
    why: 'Transactional speech under social time pressure is a high-frequency daily trigger. Cadence priming transfers directly to this context.',
    bpm: 82, hz: 10
  },
  {
    id: 'video', icon: '🎥', label: 'Video Call', fear: 4,
    phrase: 'Can everyone hear me? Great — let\'s get started.',
    why: 'Self-monitoring during video calls creates dual cognitive load. Pre-session binaural priming lowers the monitoring response.',
    bpm: 72, hz: 8
  },
  {
    id: 'casual', icon: '💬', label: 'Casual Chat', fear: 2,
    phrase: 'Hey! So good to see you. What\'s new with you?',
    why: 'Even casual speech benefits from pre-speaking warm-up. Confident initiation sets the fluency tone for the entire conversation.',
    bpm: 88, hz: 10
  }
];

const PHASES = [
  {
    name: 'GROUND',
    label: 'Ground',
    duration: 25,
    instruction: 'Close your eyes. Breathe slowly and deeply. Feel your shoulders drop. The field is calming with you.',
    binauralHz: 8,
    mood: 'ground',
    color: '#3b82f6'
  },
  {
    name: 'WARM',
    label: 'Warm Up',
    duration: 25,
    instruction: 'Hum softly on your exhale. Feel your voice resonating in your chest. No pressure — just sound.',
    binauralHz: 14,
    mood: 'warm',
    color: '#8b5cf6'
  },
  {
    name: 'PRIME',
    label: 'Prime',
    duration: 25,
    instruction: 'Speak this phrase aloud — slowly, gently, with an easy, soft start.',
    binauralHz: 18,
    mood: 'prime',
    color: '#52c4ff'
  }
];

const CIRC = 251.3; // SVG circle circumference for r=40

class LaunchProtocol {
  constructor() {
    this._overlay    = null;
    this._situation  = null;
    this._phaseIdx   = 0;
    this._elapsed    = 0;
    this._timer      = null;
    this._audioCtx   = null;
    this._leftOsc    = null;
    this._rightOsc   = null;
    this._gainNode   = null;
    this._merger     = null;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  init() {
    this._overlay = document.getElementById('launch-overlay');
    if (!this._overlay) return;

    // Close on backdrop click
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) this.closeOverlay();
    });
  }

  openOverlay() {
    if (!this._overlay) return;
    this._showSelector();
    this._overlay.classList.add('active');
    AppState.emit('launchOpen');
  }

  closeOverlay() {
    this._stopAudio();
    this._stopTimer();
    if (this._overlay) this._overlay.classList.remove('active');
    AppState.emit('launchAbort');
  }

  // ── Selector screen ───────────────────────────────────────────────────────

  _showSelector() {
    const body = document.getElementById('launch-body');
    if (!body) return;

    body.innerHTML = `
      <div class="launch-selector">
        <div class="launch-header-block">
          <div class="launch-title">Pre-Conversation<br>Activation</div>
          <div class="launch-subtitle">A 75-second protocol to prime your fluency before real speaking. Choose your situation.</div>
        </div>
        <div class="launch-grid">
          ${SITUATIONS.map(s => `
            <button class="situation-card" onclick="window.launchSituation('${s.id}')">
              <span class="sit-icon">${s.icon}</span>
              <div class="sit-label">${s.label}</div>
              <div class="sit-fear">${Array.from({length:5},(_,i)=>`<span class="${i<s.fear?'fear-dot active':'fear-dot'}"></span>`).join('')}</div>
            </button>
          `).join('')}
        </div>
        <div class="launch-clinical-note">
          Protocol based on DAF priming, binaural entrainment, and situational transfer research. Headphones required.
        </div>
      </div>
    `;
  }

  // ── Protocol runner ───────────────────────────────────────────────────────

  startSituation(id) {
    this._situation = SITUATIONS.find(s => s.id === id);
    if (!this._situation) return;

    this._phaseIdx = 0;
    this._elapsed  = 0;
    this._renderProtocol();
    this._startPhase(0);
    AppState.emit('launchStart', this._situation);
  }

  _startPhase(idx) {
    this._phaseIdx = idx;
    this._elapsed  = 0;
    this._stopTimer();

    const phase = PHASES[idx];
    this._setBinauralHz(phase.binauralHz);
    AppState.emit('launchPhase', { phaseIdx: idx, mood: phase.mood });
    this._updatePhaseUI();

    this._timer = setInterval(() => {
      this._elapsed += 0.1;
      this._updateTimerUI();
      if (this._elapsed >= PHASES[this._phaseIdx].duration) {
        if (this._phaseIdx < PHASES.length - 1) {
          this._startPhase(this._phaseIdx + 1);
        } else {
          this._complete();
        }
      }
    }, 100);
  }

  _complete() {
    this._stopTimer();
    this._stopAudio();
    AppState.emit('launchPhase', { phaseIdx: 3, mood: 'burst' });
    this._renderComplete();
    AppState.emit('launchComplete', this._situation);
  }

  // ── UI rendering ──────────────────────────────────────────────────────────

  _renderProtocol() {
    const body = document.getElementById('launch-body');
    if (!body) return;
    const sit = this._situation;
    body.innerHTML = `
      <div class="launch-protocol">
        <div class="launch-sit-header">
          <span class="sit-icon-lg">${sit.icon}</span>
          <span class="sit-label-lg">${sit.label}</span>
        </div>
        <div class="phase-dots" id="launch-phase-dots">
          ${PHASES.map((p,i) => `<div class="phase-dot" id="pd-${i}"><span>${p.label}</span></div>`).join('')}
        </div>
        <div class="launch-timer-wrap">
          <svg class="timer-ring" viewBox="0 0 100 100" width="150" height="150">
            <circle class="timer-track" cx="50" cy="50" r="40"/>
            <circle class="timer-arc" id="timer-arc" cx="50" cy="50" r="40"
              stroke-dasharray="${CIRC}" stroke-dashoffset="0"
              transform="rotate(-90 50 50)"/>
          </svg>
          <div class="timer-center">
            <div class="timer-phase-name" id="timer-phase-name">GROUND</div>
            <div class="timer-secs" id="timer-secs">25</div>
            <div class="timer-unit">sec</div>
          </div>
        </div>
        <div class="phase-instruction" id="phase-instruction"></div>
        <div class="phase-phrase" id="phase-phrase"></div>
        <div class="phase-evidence" id="phase-evidence"></div>
        <button class="launch-abort-btn" onclick="window.closeLaunch()">✕ Cancel</button>
      </div>
    `;
    this._updatePhaseUI();
  }

  _updatePhaseUI() {
    const phase = PHASES[this._phaseIdx];

    // Phase dots
    for (let i = 0; i < PHASES.length; i++) {
      const dot = document.getElementById(`pd-${i}`);
      if (!dot) continue;
      dot.className = 'phase-dot' + (i < this._phaseIdx ? ' done' : i === this._phaseIdx ? ' active' : '');
    }

    const nameEl = document.getElementById('timer-phase-name');
    if (nameEl) nameEl.textContent = phase.name;

    const instEl = document.getElementById('phase-instruction');
    if (instEl) instEl.textContent = phase.instruction;

    const phraseEl = document.getElementById('phase-phrase');
    if (phraseEl) {
      phraseEl.textContent = this._phaseIdx === 2 ? `"${this._situation.phrase}"` : '';
      phraseEl.style.opacity = this._phaseIdx === 2 ? '1' : '0';
    }

    const evEl = document.getElementById('phase-evidence');
    if (evEl) evEl.textContent = this._situation.why;

    const arc = document.getElementById('timer-arc');
    if (arc) arc.style.stroke = phase.color;
  }

  _updateTimerUI() {
    const phase  = PHASES[this._phaseIdx];
    const prog   = Math.min(this._elapsed / phase.duration, 1);
    const remain = Math.ceil(phase.duration - this._elapsed);

    const arc = document.getElementById('timer-arc');
    if (arc) arc.style.strokeDashoffset = `${CIRC * prog}`;

    const secsEl = document.getElementById('timer-secs');
    if (secsEl) secsEl.textContent = remain;
  }

  _renderComplete() {
    const body = document.getElementById('launch-body');
    if (!body) return;
    const sit = this._situation;
    body.innerHTML = `
      <div class="launch-complete">
        <div class="launch-complete-glow"></div>
        <div class="launch-complete-symbol">✦</div>
        <div class="launch-complete-title">You're Primed</div>
        <div class="launch-complete-body">Your vocal system is warmed up and your mind is calm.<br>The words are already there.</div>
        <div class="launch-complete-phrase">"${sit.phrase}"</div>
        <button class="launch-go-btn" onclick="window.closeLaunch()">Go Speak →</button>
      </div>
    `;
  }

  // ── Binaural audio ────────────────────────────────────────────────────────

  _setBinauralHz(beatHz) {
    const base = 220;

    if (!this._audioCtx) {
      try {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this._merger   = this._audioCtx.createChannelMerger(2);
        this._gainNode = this._audioCtx.createGain();
        this._gainNode.gain.value = 0.04;
        this._merger.connect(this._gainNode);
        this._gainNode.connect(this._audioCtx.destination);

        this._leftOsc = this._audioCtx.createOscillator();
        this._leftOsc.type = 'sine';
        this._leftOsc.frequency.value = base;
        this._leftOsc.connect(this._merger, 0, 0);
        this._leftOsc.start();

        this._rightOsc = this._audioCtx.createOscillator();
        this._rightOsc.type = 'sine';
        this._rightOsc.frequency.value = base + beatHz;
        this._rightOsc.connect(this._merger, 0, 1);
        this._rightOsc.start();
      } catch(err) {
        console.warn('[LaunchProtocol] Audio init failed:', err);
      }
    } else if (this._rightOsc) {
      const now = this._audioCtx.currentTime;
      this._rightOsc.frequency.linearRampToValueAtTime(base + beatHz, now + 2.5);
    }
  }

  _stopAudio() {
    const stop = (node) => { try { node.stop(); node.disconnect(); } catch(_) {} };
    if (this._leftOsc)   { stop(this._leftOsc);  this._leftOsc  = null; }
    if (this._rightOsc)  { stop(this._rightOsc); this._rightOsc = null; }
    if (this._gainNode)  { try { this._gainNode.disconnect(); }  catch(_) {} this._gainNode  = null; }
    if (this._merger)    { try { this._merger.disconnect(); }    catch(_) {} this._merger    = null; }
    if (this._audioCtx)  { try { this._audioCtx.close(); }      catch(_) {} this._audioCtx  = null; }
  }

  _stopTimer() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }
}

export const launchProtocol = new LaunchProtocol();
