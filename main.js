// ─── FLUENCY STUDIO — v2.3.0 Entry Point ─────────────────────────────────
// Imports all modules, initializes in correct order, and exposes global
// callback functions for HTML onclick handlers (legacy compat layer).

import { AppState }       from './src/core.js';
import { adultCurriculum, kidsCurriculum } from './src/curriculum.js';
import { audioEngine }    from './src/audio.js';
import { harmonicField }  from './src/rendering/harmonic-field.js';
import { neuralViz }      from './src/rendering/visualizer.js';
import { uiManager }      from './src/ui.js';
import { launchProtocol } from './src/launch.js';

// ── Boot sequence ──────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize rendering systems (they start their own RAF loops)
  harmonicField.init();
  neuralViz.init();

  // 2. Initialize UI (loads state, renders curriculum, wires AppState events)
  uiManager.init({ adultCurriculum, kidsCurriculum });

  // 3. Initialize launch protocol (wires DOM events on overlay)
  launchProtocol.init();

  // 4. Wire audio → rendering bridges
  AppState.on('amplitude', rms => {
    // HarmonicField reads AppState.lastAmplitude directly in its loop.
    // This is just for any future direct subscribers.
  });

  // 5. Restore active day view if one was saved
  if (AppState.activeDay !== null) {
    const curr = AppState.isKidsMode ? kidsCurriculum : adultCurriculum;
    const item = curr[AppState.activeDay];
    if (item) uiManager.selectDay(AppState.activeDay);
  }

  // 6. Mobile: detect landscape and add class
  const updateOrientation = () => {
    const isLandscapeMobile = window.innerHeight < 500 && window.innerWidth > window.innerHeight;
    document.body.classList.toggle('landscape-mobile', isLandscapeMobile);
  };
  window.addEventListener('resize', updateOrientation, { passive: true });
  updateOrientation();

  console.info('[Fluency Studio] v2.2.0 — All systems initialized.');
});

// ── Global API (HTML onclick compatibility) ────────────────────────────────
// These expose module methods globally so existing inline onclick handlers
// continue to work without a full HTML refactor.

window.toggleEngine   = ()    => audioEngine.toggle();
window.setProtocol    = (btn) => {
  uiManager.setProtocol(btn);
  audioEngine.setProtocol(btn.dataset.mode);
};
window.onSliderChange = (v)   => {
  uiManager.onSliderChange(v);
  audioEngine.onSliderChange(v);
};
window.onRhythmToggle = (v)   => audioEngine.onRhythmToggle(v);
window.onBpmChange    = (v)   => audioEngine.onBpmChange(v);
window.selectDay      = (idx) => uiManager.selectDay(idx);
window.markComplete   = (day) => uiManager.markComplete(day);
window.closeComplete  = ()    => uiManager.closeComplete();
window.toggleMode     = ()    => uiManager.toggleMode();
window.openJournal    = ()    => uiManager.openJournal();
window.closeJournal   = ()    => uiManager.closeJournal();
window.saveJournalEntry  = () => uiManager.saveJournalEntry();
window.confirmHeadphones = () => uiManager.confirmHeadphones();
window.scaffoldInfo   = ()    => uiManager.scaffoldInfo();
window.resetSTTHighlight = () => audioEngine.resetSTTHighlight();
window.toggleSidebar  = ()    => uiManager.toggleSidebar();

// ── Launch Protocol globals ────────────────────────────────────────────────
window.openLaunch      = ()    => launchProtocol.openOverlay();
window.closeLaunch     = ()    => launchProtocol.closeOverlay();
window.launchSituation = (id)  => launchProtocol.startSituation(id);
