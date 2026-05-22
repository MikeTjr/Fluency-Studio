// ─── UI MANAGER ──────────────────────────────────────────────────────────
// All DOM manipulation lives here. UIManager listens to AppState events
// emitted by AudioEngine and drives the interface reactively.
// Element IDs match index.html faithfully.

import { AppState } from './core.js';

class UIManager {
  constructor() {
    this._curriculum = [];
    this._kidsCurriculum = [];
    this._sttWords = [];
  }

  // ── Init ──────────────────────────────────────────────────────────────

  init({ adultCurriculum, kidsCurriculum }) {
    this._curriculum     = adultCurriculum;
    this._kidsCurriculum = kidsCurriculum;

    this._loadState();
    this._renderCurriculum();
    this._updateModeUI();
    this._checkHeadphonesModal();
    this._setJournalDate();

    // Wire AppState events → DOM
    AppState.on('engineStarting', () => this._onEngineStarting());
    AppState.on('engineStart',    () => this._onEngineStart());
    AppState.on('engineStop',     () => this._onEngineStop());
    AppState.on('engineError',    msg => this._onEngineError(msg));
    AppState.on('binauralStart',  () => this._updateBinauralChip(true));
    AppState.on('binauralStop',   () => this._updateBinauralChip(false));
    AppState.on('beat',           () => this._onBeat());
    AppState.on('bpmChange',      bpm => this._onBpmDisplayChange(bpm));
    AppState.on('transcriptInterim', t => this._onTranscript(t, false));
    AppState.on('transcriptFinal',   t => this._onTranscript(t, true));
    AppState.on('transcriptReset',   () => this._resetTranscript());
  }

  // ── Mode toggle ───────────────────────────────────────────────────────

  toggleMode() {
    AppState.isKidsMode = !AppState.isKidsMode;
    this._renderCurriculum();
    this._updateModeUI();
    if (AppState.activeDay !== null) {
      const curr = AppState.isKidsMode ? this._kidsCurriculum : this._curriculum;
      const item = curr[AppState.activeDay];
      if (item) this._renderPromptPanel(item);
    }
    this._saveState();
  }

  _updateModeUI() {
    document.body.classList.toggle('kids-mode', AppState.isKidsMode);

    // Mode button
    const btnLabel = document.getElementById('mode-btn-label');
    const btnIcon  = document.getElementById('mode-btn-icon');
    if (btnLabel) btnLabel.textContent = AppState.isKidsMode ? 'Adult Mode' : 'Kids Mode';
    if (btnIcon)  btnIcon.textContent  = AppState.isKidsMode ? '🌙' : '🌈';

    // App name
    const brand = document.querySelector('.logo-text span');
    if (brand) brand.textContent = AppState.isKidsMode ? 'Explorers' : 'Studio';

    // Version
    const ver = document.getElementById('version-tag');
    if (ver) ver.textContent = 'v2.2.0';

    // Footer
    const footer = document.getElementById('footer');
    if (footer) footer.textContent = `Fluency ${AppState.isKidsMode ? 'Explorers' : 'Studio'} v2.2.0 · All audio processing is local & browser-sandboxed · No data transmitted`;

    this._updateXPBar();
  }

  // ── Protocol buttons ──────────────────────────────────────────────────

  setProtocol(btn) {
    document.querySelectorAll('.protocol-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;
    AppState.currentMode = mode;

    const label = document.getElementById('ctrl-label');
    const val   = document.getElementById('ctrl-val');
    const slider = document.getElementById('param-slider');

    if (mode === 'daf') {
      if (label)  label.textContent = 'DAF Buffer Delay';
      if (slider) { slider.min='20'; slider.max='300'; slider.step='5'; slider.value='100'; }
      if (val)    val.textContent = '100 ms';
    } else if (mode === 'faf') {
      if (label)  label.textContent = 'FAF Pitch Offset';
      if (slider) { slider.min='0'; slider.max='100'; slider.step='1'; slider.value='50'; }
      if (val)    val.textContent = '50 Hz';
    } else if (mode === 'binaural') {
      if (label)  label.textContent = 'Choral Voices';
      if (slider) { slider.min='1'; slider.max='8'; slider.step='1'; slider.value='4'; }
      if (val)    val.textContent = '4';
    } else {
      if (label)  label.textContent = 'Output Gain';
      if (slider) { slider.min='0'; slider.max='100'; slider.step='1'; slider.value='85'; }
      if (val)    val.textContent = '85%';
    }

    AppState.emit('sliderChange', parseFloat(slider ? slider.value : 100));
  }

  onSliderChange(raw) {
    const val = document.getElementById('ctrl-val');
    if (!val) return;
    const mode = AppState.currentMode;
    if      (mode === 'daf')      val.textContent = `${raw} ms`;
    else if (mode === 'faf')      val.textContent = `${raw} Hz`;
    else if (mode === 'binaural') val.textContent = raw;
    else                          val.textContent = `${raw}%`;
  }

  // ── Headphones modal ──────────────────────────────────────────────────

  _checkHeadphonesModal() {
    if (!localStorage.getItem('fluency_headphones_confirmed')) {
      const m = document.getElementById('hp-modal');
      if (m) m.classList.add('show');
    }
  }

  confirmHeadphones() {
    localStorage.setItem('fluency_headphones_confirmed', '1');
    const m = document.getElementById('hp-modal');
    if (m) m.classList.remove('show');
  }

  // ── Engine state UI ───────────────────────────────────────────────────

  _onEngineStarting() {
    const btn  = document.getElementById('engine-btn');
    const icon = document.getElementById('engine-btn-icon');
    const lbl  = document.getElementById('engine-btn-label');
    if (btn)  btn.disabled = true;
    if (icon) icon.textContent = '⏳';
    if (lbl)  lbl.textContent  = 'STARTING…';
  }

  _onEngineStart() {
    const btn  = document.getElementById('engine-btn');
    const icon = document.getElementById('engine-btn-icon');
    const lbl  = document.getElementById('engine-btn-label');
    if (btn)  { btn.disabled = false; btn.classList.add('active'); }
    if (icon) icon.textContent = '⏹';
    if (lbl)  lbl.textContent  = 'STOP ENGINE';

    const badge = document.getElementById('engine-badge');
    const dot   = document.getElementById('badge-dot');
    const label = document.getElementById('badge-label');
    if (badge) badge.classList.add('live');
    if (label) label.textContent = 'Engine Online';
    if (dot)   dot.style.cssText = 'background:var(--accent-3);box-shadow:0 0 8px var(--accent-3)';

    this._updateBinauralChip(true);
  }

  _onEngineStop() {
    const btn  = document.getElementById('engine-btn');
    const icon = document.getElementById('engine-btn-icon');
    const lbl  = document.getElementById('engine-btn-label');
    if (btn)  { btn.disabled = false; btn.classList.remove('active'); }
    if (icon) icon.textContent = '⚡';
    if (lbl)  lbl.textContent  = 'Initialize Engine';

    const badge = document.getElementById('engine-badge');
    const dot   = document.getElementById('badge-dot');
    const label = document.getElementById('badge-label');
    if (badge) badge.classList.remove('live');
    if (label) label.textContent = 'Engine Offline';
    if (dot)   dot.style.cssText = '';

    this._updateBinauralChip(false);
    this._hideBeatRing();
  }

  _onEngineError(msg) {
    const btn = document.getElementById('engine-btn');
    if (btn) btn.disabled = false;
    const icon = document.getElementById('engine-btn-icon');
    const lbl  = document.getElementById('engine-btn-label');
    if (icon) icon.textContent = '⚡';
    if (lbl)  lbl.textContent  = 'Initialize Engine';
    alert(`Engine could not start: ${msg}\n\nMake sure microphone access is allowed.`);
  }

  // ── Binaural chip ─────────────────────────────────────────────────────

  _updateBinauralChip(active) {
    const chip  = document.getElementById('binaural-chip');
    const label = document.getElementById('binaural-chip-label');
    if (!chip) return;
    chip.classList.toggle('active', active);
    if (label) label.textContent = active ? 'Binaural 18Hz · Active' : 'Binaural 18Hz · Off';
    const dot = chip.querySelector('.binaural-dot');
    if (dot) dot.style.background = active ? 'var(--accent-3)' : '';
  }

  // ── Beat visual ───────────────────────────────────────────────────────

  _onBeat() {
    const ring = document.getElementById('beat-ring');
    if (!ring) return;
    ring.classList.remove('pulse');
    void ring.offsetWidth;
    ring.classList.add('pulse');
  }

  _hideBeatRing() {
    const ring = document.getElementById('beat-ring');
    if (ring) ring.classList.remove('pulse');
  }

  _onBpmDisplayChange(bpm) {
    const el = document.getElementById('bpm-val');
    if (el) el.textContent = `${bpm} BPM`;
    const slider = document.getElementById('bpm-slider');
    if (slider) slider.value = bpm;
  }

  // ── Curriculum ────────────────────────────────────────────────────────

  _renderCurriculum() {
    const list = document.getElementById('curriculum-list');
    if (!list) return;
    const curr = AppState.isKidsMode ? this._kidsCurriculum : this._curriculum;

    list.innerHTML = curr.map((item, idx) => {
      const done     = AppState.completedDays.has(item.day);
      const isActive = AppState.activeDay === idx;
      const sClass   = item.day <= 10 ? 'scaffold-full' : item.day <= 20 ? 'scaffold-reduced' : 'scaffold-minimal';
      const sLabel   = item.day <= 10 ? '🔵 Full' : item.day <= 20 ? '🟡 Reduced' : '🟢 Minimal';

      return `
        <div class="day-card ${isActive ? 'active' : ''} ${done ? 'completed' : ''}"
             onclick="selectDay(${idx})">
          <div class="day-header">
            <span class="day-num">Day ${item.day}</span>
            <span class="day-tag">${item.tag}</span>
            ${done ? '<span class="done-badge">✓</span>' : ''}
          </div>
          <div class="day-title">${item.title}</div>
          <div class="day-meta-row">
            <span class="scaffold-badge ${sClass}">${sLabel} Scaffold</span>
            <span class="bpm-pill">${item.bpm} BPM</span>
          </div>
        </div>`;
    }).join('');
  }

  selectDay(idx) {
    AppState.activeDay = idx;
    const curr = AppState.isKidsMode ? this._kidsCurriculum : this._curriculum;
    const item = curr[idx];
    if (!item) return;

    // Set day's recommended BPM
    AppState.rhythmBPM = item.bpm;
    this._onBpmDisplayChange(item.bpm);
    AppState.emit('bpmChange', item.bpm);

    document.querySelectorAll('.day-card').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });

    this._renderPromptPanel(item);
    this._saveState();
  }

  _renderPromptPanel(item) {
    const panel = document.getElementById('prompt-panel');
    if (!panel) return;

    const sLabel = item.day <= 10 ? '🔵 Full Scaffold'
                 : item.day <= 20 ? '🟡 Reduced Scaffold'
                 : '🟢 Minimal Scaffold';

    const words = item.prompt.split(' ').map((w, i) =>
      `<span class="stt-word" data-idx="${i}" data-word="${w.toLowerCase().replace(/[^a-z']/g,'')}" id="w${i}">${w}</span>`
    ).join(' ');

    this._sttWords = item.prompt.split(' ').map(w => w.toLowerCase().replace(/[^a-z']/g,''));

    panel.innerHTML = `
      <div class="prompt-header fade-in">
        <div class="prompt-meta-row">
          <span class="prompt-day-badge">Day ${item.day}</span>
          <span class="scaffold-badge">${sLabel}</span>
          <span class="bpm-pill">${item.bpm} BPM</span>
        </div>
        <h2 class="prompt-title">${item.title}</h2>
        <span class="prompt-tag">${item.tag}</span>
      </div>
      <div class="strategy-card fade-in" style="animation-delay:0.08s">
        <div class="strategy-label">TECHNIQUE</div>
        <p class="strategy-text">${item.strategy}</p>
      </div>
      <div class="practice-card fade-in" style="animation-delay:0.16s">
        <div class="practice-label">PRACTICE PROMPT</div>
        <p class="practice-text" id="practice-words">${words}</p>
        <button class="reset-btn" onclick="resetSTTHighlight()">↺ Reset</button>
      </div>
      <div class="session-actions fade-in" style="animation-delay:0.24s">
        <button class="complete-btn" onclick="markComplete(${item.day})">
          ${AppState.isKidsMode ? '🌟 Complete Quest!' : '✅ Mark Session Complete'}
        </button>
      </div>
      <div id="stt-status" class="stt-status"></div>`;
  }

  // ── STT transcript ────────────────────────────────────────────────────

  _onTranscript(text, isFinal) {
    const status = document.getElementById('stt-status');
    if (status) {
      status.textContent = isFinal ? `✔ "${text.trim()}"` : `… ${text}`;
    }
    const words = text.toLowerCase().split(/\s+/);
    this._sttWords.forEach((w, i) => {
      if (words.includes(w)) {
        const el = document.getElementById(`w${i}`);
        if (el) el.classList.add('highlighted');
      }
    });

    // Live transcript pane
    const disp = document.getElementById('transcript-display');
    if (disp) {
      disp.innerHTML = `<span style="color:var(--text-2);font-size:0.8rem;">${text}</span>`;
    }
  }

  _resetTranscript() {
    document.querySelectorAll('.stt-word').forEach(el => el.classList.remove('highlighted'));
    const status = document.getElementById('stt-status');
    if (status) status.textContent = '';
  }

  // ── Session complete / fluency score ──────────────────────────────────

  markComplete(day) {
    const highlighted = document.querySelectorAll('.stt-word.highlighted').length;
    const total       = this._sttWords.length || 1;
    const score       = Math.min(100, Math.round((highlighted / total) * 100));

    AppState.completedDays.add(day);
    if (AppState.isKidsMode) {
      AppState.kidsXP += 50;
      if (AppState.kidsXP > 0 && AppState.kidsXP % 200 === 0) AppState.kidsStars++;
      this._updateXPBar();
    }

    this._renderCurriculum();
    this._showCompleteModal(day, score);
    this._saveState();
  }

  _showCompleteModal(day, score) {
    const flash = document.getElementById('complete-flash');
    const title = document.getElementById('complete-title');
    const sub   = document.getElementById('complete-sub');
    const bar   = document.getElementById('score-bar');
    const num   = document.getElementById('score-number');
    const desc  = document.getElementById('score-desc');

    if (!flash) return;

    if (title) title.textContent = `Day ${day} Complete!`;
    if (sub)   sub.textContent   = AppState.isKidsMode
      ? 'Amazing! You finished today\'s quest! 🌟'
      : 'Session logged. Your voice is growing stronger.';

    if (num)  num.textContent  = `${score}%`;
    if (bar)  { bar.style.width = '0%'; setTimeout(() => { bar.style.width = `${score}%`; }, 80); }
    if (desc) desc.textContent =
      score >= 85 ? 'Exceptional rhythm — your voice is finding its flow.'
    : score >= 65 ? 'Strong session. Each word builds your confidence.'
    : score >= 40 ? 'Good effort. Consistency is the key to fluency.'
    :               'Every session moves you forward. Keep coming back.';

    // Kids stars
    if (AppState.isKidsMode) {
      const icon = document.getElementById('complete-icon');
      if (icon) icon.textContent = score >= 85 ? '🌟' : '⭐';
    }

    flash.classList.add('show');
  }

  closeComplete() {
    const flash = document.getElementById('complete-flash');
    if (flash) flash.classList.remove('show');
  }

  // ── XP Bar (kids) ─────────────────────────────────────────────────────

  _updateXPBar() {
    const fill  = document.getElementById('xp-fill');
    const label = document.getElementById('xp-label-val');
    if (fill)  fill.style.width = `${Math.min(100, (AppState.kidsXP % 200) / 2)}%`;
    if (label) label.textContent = `⭐ ${AppState.kidsStars} stars · ${AppState.kidsXP} XP`;
  }

  // ── Journal ───────────────────────────────────────────────────────────

  openJournal() {
    this._loadJournalHistory();
    const m = document.getElementById('journal-modal');
    if (m) m.classList.add('show');
  }

  closeJournal() {
    const m = document.getElementById('journal-modal');
    if (m) m.classList.remove('show');
  }

  saveJournalEntry() {
    const q1 = document.getElementById('journal-situation');
    const q2 = document.getElementById('journal-carry');
    if (!q1 || !q2 || (!q1.value.trim() && !q2.value.trim())) return;

    const entry = {
      date: Date.now(),
      session: AppState.activeDay !== null ? `Day ${AppState.activeDay + 1}` : 'Free Practice',
      situation: q1.value.trim(),
      carry: q2.value.trim()
    };

    const entries = JSON.parse(localStorage.getItem('fs_journal') || '[]');
    entries.unshift(entry);
    localStorage.setItem('fs_journal', JSON.stringify(entries.slice(0, 60)));

    q1.value = '';
    q2.value = '';

    const badge = document.getElementById('journal-saved-badge');
    if (badge) { badge.classList.add('show'); setTimeout(() => badge.classList.remove('show'), 3000); }

    this._loadJournalHistory();
  }

  _loadJournalHistory() {
    const entries = JSON.parse(localStorage.getItem('fs_journal') || '[]');
    const wrap    = document.getElementById('journal-history-wrap');
    const hist    = document.getElementById('journal-history');
    if (!wrap || !hist) return;

    if (!entries.length) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    hist.innerHTML = entries.slice(0, 10).map(e => `
      <div class="journal-entry">
        <div class="journal-entry-date">
          ${new Date(e.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
          ${e.session ? ` · ${e.session}` : ''}
        </div>
        ${e.situation ? `<div>${e.situation}</div>` : ''}
        ${e.carry     ? `<div style="margin-top:0.3rem;opacity:0.7;font-style:italic">${e.carry}</div>` : ''}
      </div>`).join('');
  }

  _setJournalDate() {
    const el = document.getElementById('journal-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', {
      weekday:'long', month:'long', day:'numeric', year:'numeric'
    });
  }

  // ── Scaffold info ─────────────────────────────────────────────────────

  scaffoldInfo() {
    alert('Scaffold levels show how much support each session provides:\n\n🔵 Full Scaffold (Days 1–10): Maximum guidance and prompting.\n🟡 Reduced Scaffold (Days 11–20): Intermediate support as skills develop.\n🟢 Minimal Scaffold (Days 21–30): Near-independent practice for full transfer.');
  }

  // ── Mobile sidebar toggle ──────────────────────────────────────────────

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
  }

  // ── State persistence ─────────────────────────────────────────────────

  _saveState() {
    try {
      localStorage.setItem('fluency_state_v2', JSON.stringify({
        isKidsMode:   AppState.isKidsMode,
        completedDays:[...AppState.completedDays],
        kidsXP:       AppState.kidsXP,
        kidsStars:    AppState.kidsStars,
        activeDay:    AppState.activeDay,
        syncProgress: AppState.syncProgress
      }));
    } catch(_) {}
  }

  _loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('fluency_state_v2') || '{}');
      if (saved.isKidsMode !== undefined) AppState.isKidsMode  = saved.isKidsMode;
      if (saved.completedDays) AppState.completedDays = new Set(saved.completedDays);
      if (saved.kidsXP)        AppState.kidsXP        = saved.kidsXP;
      if (saved.kidsStars)     AppState.kidsStars     = saved.kidsStars;
      if (saved.activeDay !== undefined && saved.activeDay !== null) AppState.activeDay = saved.activeDay;
      if (saved.syncProgress)  AppState.syncProgress  = saved.syncProgress;
    } catch(_) {}
  }
}

export const uiManager = new UIManager();
