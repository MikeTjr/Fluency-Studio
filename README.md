# Fluency Studio — Adaptive Speech Therapy Engine
### v2.0.0 · Single-File · Zero Dependencies · Browser-Sandboxed

---

## What It Is

Fluency Studio is a real-time, browser-native speech therapy application targeting stuttering and disfluency across adult and pediatric populations. It runs entirely inside a single `index.html` with no backend, no telemetry, and no external runtime dependencies. Audio processing, speech recognition, and all user data live exclusively inside the browser sandbox.

---

## Architecture

```
[Microphone Input]
       │
       ▼
[Low-Latency AudioContext Capture]
       │
       ├──── [DAF Pipeline]        DelayNode: 20–300ms (adult default 100ms, kids 140ms)
       │
       ├──── [FAF Pipeline]        BiquadFilter (peaking): pitched resonance at target Hz
       │
       ├──── [Binaural Mask]       BiquadFilter (lowpass): choral gating at 400–1600Hz
       │
       └──── [Bypass]              Direct mic → destination passthrough
       │
       ▼
[AnalyserNode] ──► [Canvas Frequency Visualizer]
       │
[webkitSpeechRecognition]
       │
       ▼
[Real-Time Word Highlighter] ──► Overlaid on active practice prompt
```

All graph topology rebuilds live via `rebuildGraph()` on protocol or slider change while the engine is running. Teardown on stop closes the `AudioContext` entirely to release hardware.

---

## Features — v2.0.0

### Audio Engine
| Protocol | Mechanism | Default Delay/Param |
|---|---|---|
| **DAF** | `DelayNode` buffers mic signal | 100ms adult / 140ms kids |
| **FAF** | `BiquadFilter` peaking resonance | 200Hz shift |
| **Choral Mask** | `BiquadFilter` lowpass band gate | 40% intensity |
| **Bypass** | Direct mic passthrough | — |

### Real-Time Speech Recognition
- `webkitSpeechRecognition` continuous stream with interim results
- Spoken words matched against active prompt tokens and highlighted inline
- Auto-restarts on recognition timeout (continuous session support)
- Live transcript display in sidebar with interim vs. final differentiation

### Full 30-Day Curriculum (Both Tracks)
Each track contains all 30 sessions — no gaps. Each session carries:
- **Tag** — clinical or adventure category label
- **Strategy** — full therapeutic or gamified instruction
- **Practice Prompt** — word-tagged, STT-highlightable text

### Pediatric Track Gamification
- Avatar character with floating animation
- XP bar (0–10 pts, awarded per completed session)
- Star unlock system — one star per 2 XP earned
- Session complete overlay with randomised emoji celebration
- Distinct warm-toned theme, `Nunito` font family, rounded geometry throughout

### Session Tracking
- Completed days persist in-session via `Set`
- Day cards update to show ✓ Done badge on completion
- Metrics row displays: session number, total completed, active protocol

---

## Design System

### Adult Mode
```
Background:  #07090f
Surface:     #0d1117 / #131922 / #1a2332
Accent:      #52c4ff (blue) / #a78bfa (purple) / #34d399 (green)
Fonts:       Syne (UI/display) · DM Mono (labels/metrics)
Geometry:    14px base radius · 8px small radius
Motion:      0.25s cubic-bezier(0.4,0,0.2,1) transitions
```

### Kids Mode
```
Background:  #fef9f0
Surface:     #ffffff / #fff5e0
Accent:      #ff6b35 (orange) · #ffba08 (amber) · #43aa8b (teal)
Fonts:       Nunito (all text, playful weight 400–900)
Geometry:    14–20px radius · 30px pill radius on interactive elements
Motion:      Float animation (avatar) · Star-pop keyframes · XP bar transition
```

---

## State Preservation Rules (AI Handshake)

When a downstream AI engineer extends this codebase, the following behavioral constraints are non-negotiable:

1. **Single-file deployment.** All HTML, CSS, and JavaScript must remain in `index.html`. No module imports, no bundler, no external script files. The application must open by double-clicking.

2. **Zero external runtime.** Google Fonts are the only external resource (loaded via `<link>`). All logic is vanilla JS. No React, no frameworks, no CDN scripts at runtime.

3. **Audio state continuity.** `rebuildGraph()` must be callable while the engine is running without clicking Stop/Start. Protocol and slider changes apply live.

4. **Mode isolation.** Adult ↔ Kids toggle must hot-swap theme, curriculum dataset, DSP defaults, and UI geometry without touching audio graph state.

5. **Privacy constraint.** No audio data, transcript text, biometric readings, or session logs may be transmitted outside the browser. No `fetch()` calls to external endpoints. No `localStorage` persistence (session-only state).

6. **STT safety.** `webkitSpeechRecognition` access requires engine start — it never activates passively or on page load.

---

## Product Backlog — Next Evolution Milestones

### Priority 1 — Phase Vocoder (FAF Upgrade)
Replace the current BiquadFilter FAF approximation with a true phase vocoder built on ScriptProcessorNode or AudioWorkletNode using Short-Time Fourier Transform (STFT). This shifts pitch without time-stretching — the gold standard for therapeutic frequency alteration. Target: ±1 octave pitch shift, <10ms added latency.

### Priority 2 — Syllable-Level STT Flagging
Upgrade the word-match highlighter to syllable granularity. Use interim recognition confidence scores to flag syllables where disfluency or blockage is detected. Visual cue: wavy underline in red on flagged syllables within the prompt.

### Priority 3 — Session Recording + Playback
In-browser recording via `MediaRecorder` API. Store session audio as a Blob URL (session-scoped, never persisted). Allow user to replay their practice session directly on the page for self-monitoring feedback.

### Priority 4 — Progress Persistence (Optional)
If the user explicitly opts in, offer `localStorage`-based persistence of completed days and XP. Must be consent-gated — a visible "Save My Progress" toggle with clear explanation that data stays local.

### Priority 5 — Additional Avatars + Kids Rewards
Expand the kids avatar system to include 5+ selectable characters. Tie avatar unlock to star milestones. Add a simple badge shelf display below the XP bar showing earned milestone badges.

### Priority 6 — Clinician Export Mode
One-click generation of a plain-text session log (days completed, protocols used, session notes typed by user) that can be copied to clipboard for sharing with a supervising clinician.

---

## Communication Protocol

This repository is maintained via ZIP exchange to preserve the single-file architecture and avoid token overhead. When submitting upgrades:

- Deliver `index.html` + `README.md` zipped as `Fluency-Studio-main.zip`
- No folder nesting beyond the root `Fluency-Studio-main/` directory
- Do not split CSS or JS into separate files
- Describe all behavioral changes in a revision note at the top of this README

---

## Local Usage

1. Download `Fluency-Studio-main.zip`
2. Extract the folder
3. Open `index.html` in **Google Chrome** (required for `webkitSpeechRecognition`)
4. When prompted, allow microphone access
5. Select a protocol, adjust the slider, click **Initialize Engine**
6. Select any day from the 30-day curriculum to begin

> Speech recognition requires Chrome or a Chromium-based browser. The audio engine (DAF/FAF/Mask/Bypass) works in all modern browsers with WebAudio support. Safari supports WebAudio but not `webkitSpeechRecognition`.

---

*All processing is local. No data leaves your device. No accounts. No telemetry.*
