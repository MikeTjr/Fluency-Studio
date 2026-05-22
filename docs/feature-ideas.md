# Feature Ideas — Fluency Studio

---

# Implemented in v2.2.0

## Harmonic Interference Field ✅
Background canvas with procedural wave superposition math:
- 6 wave sources (2 primary hemisphere + 4 ambient)
- f(x,y,t) = Σ Aᵢ·sin(k·rᵢ − ω·t + φᵢ) / (1 + λ·rᵢ)
- Audio-reactive: amplitude boosts field brightness
- Beat-reactive: flash on every metronome beat
- Phase sync metaphor: right hemisphere source phase π→0 as user practices
- Kids mode: warm amber/golden palette

## Neural Bridge Oscilloscope ✅
Dual-channel oscilloscope replacing the frequency bar chart:
- Channel A: live microphone time-domain waveform (blue)
- Channel B: reference sine at BPM-derived frequency (purple dashed)
- Grid overlay, RMS energy bar (right edge), sync% counter
- Idle animation: two slow sine waves drifting out of phase
- Beat flash effect on waveform

## Audio-Reactive Environment ✅
- RMS amplitude from analyser node feeds HarmonicFieldRenderer each frame
- Binaural beats react: beat event drives beatFlash → field brightens
- BPM changes: omega (temporal frequency) of wave field updates live

## Mobile Landscape Mode ✅
- `body.landscape-mobile` class applied via JS resize listener
- Sidebar collapses off-screen to sliding drawer
- `☰ Menu` button appears in fixed position top-left
- Content area takes full grid width
- Field opacity increases for immersion

---

# Resonance + Harmonic Systems (Next)

## Breath Guide Overlay
Expanding/contracting animated circle in the content area:
- Synchronized to current BPM (inhale on beat, exhale on off-beat)
- Opacity fades during active practice, more prominent at session start
- Color tied to the harmonic field palette

## 3D Harmonic Field (WebGL)
Replace 2D canvas field with Three.js particle system:
- Particles orbit two attractor points (left/right hemisphere)
- Phase sync drives orbital convergence — particles merge toward center
- Audio amplitude drives particle speed and emissive glow
- More depth and cinematic quality than 2D canvas

## Adaptive Field Resolution
Auto-adjusting SCALE based on measured frame rate:
- If fps drops below 30, increase SCALE (reduce resolution)
- If fps is stable >55, reduce SCALE (increase detail)
- Smooth cross-fade between resolution levels

---

# Audio-Reactive Ideas (Next)

## Onset Detection Engine
- Real-time syllable onset detection from mic waveform using RMS delta
- Enables true rhythm coherence: compare onset timing to metronome beats
- Drives Neural Bridge "SYNC X%" readout with real data

## Breath Synchronization Visual
- Detect natural breath pauses in mic signal
- Visualize them as breath markers on the Neural Bridge waveform
- Guide user to align breath with phrase boundaries

## Pre-Conversation Activation Mode
60-second guided priming sequence:
- Phase 1 (0–20s): Silent binaural priming — eyes closed, field animates
- Phase 2 (20–40s): Guided humming with pitch feedback visualization
- Phase 3 (40–60s): Single choral shadow sentence with slow echo
- Accessible from a floating button on any session page

## Harmonic Immersion Modes
Context-specific resonance environments:
- Calm Mode: lower BPM, warm colors, slower wave animation
- Focus Mode: default blue palette, medium BPM, clear grid
- Confidence Mode: brighter field, larger beat flash, higher omega
- Speech Preparation Mode: animated countdown + slower fade-in

---

# UI + Experience Ideas (Next)

## Intelligent UI Visibility
Controls that auto-hide during active practice:
- Sidebar collapses when engine is running and a day is selected
- Controls fade to minimal opacity after 5s of inactivity
- Tap/click anywhere to restore full UI

## Session Arc Visualization
A subtle arc progress indicator in the content area:
- Shows which phase of the 30-day program the user is in
- Colored by scaffold level (🔵→🟡→🟢)
- Grows as more days are completed

## Ambient Status Field
The harmonic field visually reflects session state:
- No session: slow, low-amplitude drift
- Session selected, engine off: gentle pulsing at day's BPM
- Engine running: full audio-reactive mode
- Session complete: brief bright radial burst, then calm

---

# Mobile Experience Ideas (Next)

## Landscape Immersion Mode Polish
- Larger practice text in landscape (font scaling)
- Touch-optimized complete button positioning
- Swipe-left gesture to collapse sidebar (touch event listeners)

## Multi-Touch Resonance Control
Users manipulate harmonic field sources directly:
- Two-finger drag moves the hemisphere source positions
- Pinch changes wave frequency (kWave parameter)
- Creates a playful, exploratory experience for kids mode

---

# Therapy + Neuroscience Ideas (Future)

## Confidence State Training
Pre-speaking environments designed to reduce tension:
- 3-minute guided session: breathing → vocalization → full sentence
- Visual confidence meter that fills over the session
- Exported as shareable "session snapshot" image

## Flow-State Speech Preparation
Complete pre-speaking immersion sequence:
- Starts with harmonic field at minimum amplitude
- Binaural beats prime beta-frequency entrainment
- BPM metronome fades in
- Practice prompt appears when user is ready

## Adaptive AI Personalization
System learns user patterns over time:
- Optimal BPM per session time of day
- Which techniques correlate with best fluency scores
- Personalized day ordering based on performance data
- Runs entirely in-browser via ONNX / TensorFlow.js

---

# Design Direction Reminders

The project should continue evolving toward:
- immersion (feel like being inside the resonance field)
- empowerment (visual metaphors of growing strength)
- emotional intelligence (the environment responds to how you are)
- expressive confidence (the field celebrates fluent speech)
- fluid interaction (no jarring transitions)
- resonance-inspired aesthetics (every visual has a physics-inspired rationale)

Avoid becoming:
- sterile
- overly clinical
- generic productivity software
- simplistic therapy tooling
- visually noisy or overwhelming
