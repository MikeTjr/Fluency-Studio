# Fluency Studio Roadmap

---

# Version 2.2 — Stability + Immersion ✅ COMPLETE

## Delivered
- Full modular architecture migration (src/ ES modules)
- Harmonic Interference Field (procedural wave superposition background)
- Neural Bridge Oscilloscope (replaces bar chart visualizer)
- Phase-sync metaphor (hemisphere sources converge from π→0 as user practices)
- Audio-reactive rendering (amplitude + beat events drive field brightness)
- Mobile landscape mode (collapsible sidebar drawer, full-width content)
- Beat ring visual indicator (pulses on every metronome beat)
- Scaffold badges on all day cards (🔵🟡🟢 + BPM pill)
- Animated prompt panel components (strategy card, practice card, fade-in sequencing)
- Session fluency scoring with animated bar
- Fluency journal (localStorage, session-tagged)
- Binaural beats 18 Hz engine (240/258 Hz stereo oscillators)
- Rhythmic entrainment with Web Audio click synthesis
- Headphones modal (shown once, persisted)
- Kids mode warm palette for harmonic field
- v2.2.0 version badge

---

# Version 2.5 — Resonance Expansion

## Goals
Expand from immersive background visuals into foreground-integrated resonance interaction.

## Planned Systems

### Breath Guide Overlay
- Expanding/contracting circle synchronized to BPM
- Placed in the content area as a subtle breathing pacer
- Opacity driven by session phase (stronger during opening, fades during practice)

### Pre-Conversation Activation Mode
- 60-second guided priming sequence before real-world conversations
- Phase 1 (0–20s): Binaural priming (engine runs in background mode)
- Phase 2 (20–40s): Guided humming with pitch feedback
- Phase 3 (40–60s): Choral shadow with a short sample sentence
- Separate UI card that can be triggered from any session

### Onset Detection
- Real-time syllable onset detection from mic waveform
- Enables true rhythm coherence measurement in the Neural Bridge
- Unlocks feedback: "Your speech rhythm is X% matched to the target"

### Adaptive Field SCALE
- Measure actual frame rate each second
- If fps < 30, increase SCALE to reduce computation
- If fps > 55, reduce SCALE for more detail
- Smooth transition between SCALE values

### CSS Modularization
- Split inline styles from index.html to:
  - `styles/main.css` (design tokens + reset + layout)
  - `styles/components.css` (sidebar, header, modals)
  - `styles/rendering.css` (canvas, visualizer, field)
  - `styles/kids.css` (kids-mode overrides)

---

# Version 3.0 — Adaptive Fluency Engine

## Goals
Transform Fluency Studio into a deeply adaptive speech-flow platform with real-time feedback intelligence.

## Planned Features

### Real-Time Rhythm Coherence
- Onset detection → cross-correlation with BPM target
- Live coherence meter in the Neural Bridge: "Sync: 73%"
- Session average stored in journal

### Cadence Visualization
- Live F0 (pitch) extraction from mic signal
- Overlay pitch curve on the Neural Bridge display
- Visual indication when pitch pattern matches target cadence

### Speech Confidence Environment
- Pre-session breathing calibration (3 breaths, tuned to body rhythm)
- Harmonic field responds to voice quality (breathier → warmer field color)
- Confidence arc that fills over multiple sessions

### Personalization Engine
- Per-user BPM preference learning from session data
- Automatic scaffold level suggestion based on completion rate
- Session streak tracking with recovery suggestions

### Progressive Web App (PWA)
- Service worker for offline support
- Install prompt on mobile
- Background audio continuity across app switches

---

# Version 4.0 — Neurofeedback Expansion

## Experimental Direction

### HRV Integration (if device supports it)
- Web Bluetooth / camera-based rPPG for heart rate
- Correlate HRV coherence with speech fluency improvements
- Real-time biofeedback loop: slower heart rate → warmer field

### 3D Harmonic Field (WebGL)
- Replace 2D canvas field with Three.js particle system
- Particles orbit two hemisphere attractors
- Phase sync drives orbital convergence (particles merge toward center)
- Audio amplitude drives particle speed and luminosity

### AI Session Coach
- Lightweight ONNX model runs in-browser
- Analyzes session log patterns
- Generates personalized technique suggestions for next session

---

# Long-Term Vision

## Experience Direction
The platform should eventually feel:
- immersive (you are inside the resonance field)
- cinematic (every interaction has weight and beauty)
- calming (the field itself reduces anxiety before speaking)
- empowering (the sync metaphor shows you getting better)
- intelligent (the system knows your patterns and adapts)
- emotionally responsive (the environment reacts to how you are, not just what you do)

## Long-Term Technology Goals
- WebGL harmonic field simulation
- Adaptive audio-AI session coaching
- Cross-platform (PWA + Capacitor)
- Expanded accessibility (subtitles, color-blind palette, reduced motion)

---

# Development Philosophy

Future versions must:
- preserve the modular architecture established in v2.2
- preserve immersion and emotional tone
- never rewrite working systems — only extend them
- keep the event bus (AppState) as the central communication layer
- document all new systems in docs/ before and after implementation
- test on mobile landscape before considering any feature "done"
