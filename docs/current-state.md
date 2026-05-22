# Current State — Fluency Studio
## Version 2.2.0 — Stability + Immersion + Advanced Rendering

---

## Project Identity

Fluency Studio is an immersive, neuroscience-inspired speech fluency platform focused on rhythm, resonance, timing synchronization, auditory-motor integration, and expressive speech flow.

The platform combines:
- speech therapy concepts
- rhythm and cadence training
- immersive procedural visuals
- harmonic interaction and wave simulation
- emotional regulation aesthetics
- adaptive UI systems
- audio-reactive rendering
- modular architecture

The project direction is intentionally experiential, cinematic, and emotionally engaging rather than clinical and sterile.

---

## Architecture State (v2.2.0)

### Current Structure (MODULAR)

The project has been migrated from a monolithic `index.html` to a fully modular ES module architecture:

```
index.html          — HTML shell + CSS only (no inline JS)
main.js             — Entry point, module wiring, global API bridge
src/
  core.js           — AppState singleton + event bus
  curriculum.js     — Adult and kids curriculum data (30 days each)
  audio.js          — AudioEngine class (DAF/FAF/binaural/bypass/STT/rhythm)
  ui.js             — UIManager class (all DOM manipulation)
  rendering/
    harmonic-field.js  — HarmonicFieldRenderer (wave superposition simulation)
    visualizer.js      — NeuralBridgeVisualizer (oscilloscope display)
docs/
  current-state.md
  roadmap.md
  ai-rules.md
  feature-ideas.md
```

### Module Responsibilities

- **core.js**: Single source of truth for shared state. Event bus with `on(event, cb)` and `emit(event, data)`. All modules communicate through AppState events.
- **curriculum.js**: Pure data. 30-day adult curriculum + 30-day kids curriculum. Each day includes: title, tag, strategy, prompt, BPM, scaffold level.
- **audio.js**: AudioEngine class. Manages: mic input, DAF delay, FAF pitch, binaural beats (240/258 Hz stereo oscillators), rhythmic entrainment metronome, speech recognition (STT), RMS polling.
- **ui.js**: UIManager class. Listens to AppState events and drives DOM. Manages: curriculum rendering, prompt panel, session complete modal, fluency score, journal, mode toggle, XP bar (kids), binaural chip, beat ring.
- **rendering/harmonic-field.js**: HarmonicFieldRenderer. Background canvas at z-index 0. Procedural wave interference simulation. Two primary hemisphere wave sources with phase that converges from π→0 as user practices (sync metaphor). Reacts to audio amplitude and beat events.
- **rendering/visualizer.js**: NeuralBridgeVisualizer. Sidebar oscilloscope replacing the old bar chart. Dual-channel time-domain display (blue = mic, purple = reference). Shows coherence %, RMS energy bar, idle animation.
- **main.js**: Boot sequence. Initializes all modules in order. Exposes `window.*` global functions for HTML onclick compatibility.

---

## Active Systems (v2.2.0)

### Audio Engine
- DAF (Delayed Auditory Feedback): real-time delay 20–300ms
- FAF (Frequency-Altered Feedback): pitch-modified voice
- Choral Mask (Binaural mode): voice masked with binaural carrier
- Bypass: pass-through with analyser
- Binaural Beats: 240 Hz left / 258 Hz right = 18 Hz beta differential
- Rhythmic Entrainment: BPM metronome (40–140 BPM) with noise-burst clicks
- Speech Recognition (STT): continuous Web Speech API with word highlighting
- RMS Polling: per-frame amplitude measurement emitted to rendering systems

### Visual Rendering
- **Harmonic Interference Field**: Full-screen background canvas. 6-source wave superposition using `f(x,y,t) = Σ Aᵢ·sin(k·rᵢ − ω·t + φᵢ) / (1 + λ·rᵢ)`. Rendered at 1/4 resolution (1/6 on mobile) scaled up for soft-field look. Color: deep navy → teal → cyan → purple → white-lavender. Kids mode: warm amber → golden → bright peach.
- **Phase Sync Metaphor**: Sources[0] (left hemisphere) at phase 0. Sources[1] (right hemisphere) phase = π × (1 − syncProgress). As user speaks, syncProgress accumulates toward 1.0, causing wave patterns to shift from destructive to constructive interference (chaotic → coherent visual field).
- **Audio Reactivity**: Amplitude from mic boosts field brightness and source strengths each frame. Beat events trigger a 1.0 → 0 flash decaying at 2.8/sec.
- **Neural Bridge Oscilloscope**: Dual-channel waveform display. Channel A (blue): live mic time-domain waveform. Channel B (purple dashed): reference sine at BPM frequency. Center line, grid, RMS energy bar, sync% counter, idle animation showing two drifting waves.
- **Beat Ring**: Circular visual indicator that pulses with a scale+glow animation on each metronome beat.

### UI Systems
- 30-day curriculum list with scaffold badges (🔵🟡🟢) and BPM pills on each day card
- Prompt panel with animated strategy card and practice text
- STT word highlighting on practice prompts
- Session complete modal with animated fluency score bar
- Fluency journal (localStorage) with session tagging
- Headphones warning modal (shown once, remembered)
- Kids mode: warm palette, Nunito font, XP bar, star rewards, avatar
- Mobile landscape mode: sidebar collapses to floating drawer, full-width content
- Version badge updated to v2.2.0

---

## Performance Characteristics

- Harmonic field: ~57,600 pixel ops/frame at 1/4 scale (desktop), ~18,000 at 1/6 (mobile)
- Two independent requestAnimationFrame loops (field + visualizer) — modern browsers handle without issue
- All audio processing is Web Audio API in the browser — zero server round trips
- STT is browser-native Web Speech API — no external API calls

---

## Current Weaknesses / Risks

### Architecture
- `index.html` still serves all CSS inline (could be split to `styles/` in v2.5)
- `window.*` global bridge in main.js is pragmatic but could be replaced with event listener delegation in v3.0
- Curriculum data in curriculum.js could become JSON files with dynamic loading for extensibility

### Performance
- Harmonic field SCALE is fixed at init time; no adaptive frame-rate throttling yet
- Two RAF loops run independently; a shared orchestrator would be cleaner
- Mobile landscape detection uses a window size heuristic, not the device orientation API

### Audio
- FAF implementation is simplified (gain-based rather than true pitch shifting)
- Choral Mask uses the binaural carrier rather than true chorus voices
- STT accuracy depends heavily on browser implementation

---

## Mobile State

Mobile landscape mode is now actively supported:
- Detected via `window.innerHeight < 500 && innerWidth > innerHeight`
- Sidebar collapses to a fixed off-screen drawer
- `☰ Menu` button appears to open it
- Content area takes full width
- Harmonic field opacity increases for more immersion

---

## Long-Term Development Priorities

### High Priority
- CSS modularization (split to styles/ folder)
- True FAF pitch shifting via WebAudio worklet
- Adaptive field SCALE based on measured frame rate
- Shared RAF orchestrator

### Medium Priority
- Onset detection for real rhythm coherence measurement
- Breath guide overlay (expanding ring synchronized to BPM)
- Pre-conversation activation mode (60-second priming sequence)

### Long-Term Priority
- Adaptive AI personalization based on session history
- 3D rendering (WebGL) for the harmonic field
- Biofeedback expansion (HRV if device supports it)
- Cross-platform packaging (PWA / Capacitor)
