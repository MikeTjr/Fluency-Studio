# AI Rules — Fluency Studio
## Updated: v2.2.0

---

# Core Rule

DO NOT rewrite the entire project.

All updates must be:
- incremental
- modular
- reversible
- architecture-aware

---

# Architecture Rules (v2.2.0)

## Current Module Map

```
index.html          — HTML + CSS shell ONLY. No inline JS.
main.js             — Entry point. Imports modules. Exposes window.* globals.
src/core.js         — AppState singleton + event bus. Single source of truth.
src/curriculum.js   — Pure data. Never import other modules.
src/audio.js        — AudioEngine. Emits events. Never touches DOM directly.
src/ui.js           — UIManager. Listens to AppState. Only module touching DOM.
src/rendering/harmonic-field.js  — HarmonicFieldRenderer. Own RAF loop.
src/rendering/visualizer.js      — NeuralBridgeVisualizer. Own RAF loop.
```

## Event Bus Rules

All inter-module communication goes through AppState:

```javascript
// Emit from any module:
AppState.emit('beat');
AppState.emit('engineStart');
AppState.emit('amplitude', rmsValue);

// Subscribe from any module:
AppState.on('beat', () => { ... });
```

Modules MUST NOT directly import each other (except both importing core.js).

## DO NOT
- Flatten folder structures
- Convert modular systems into monolithic files
- Remove existing systems without approval
- Rewrite unrelated systems during focused updates
- Replace immersive UI with generic UI
- Remove mobile support
- Remove kids-mode support
- Remove resonance-based concepts
- Simplify the project vision
- Add inline `<script>` tags back to index.html
- Put UI logic in audio.js or rendering modules
- Put audio logic in ui.js

---

# ALWAYS

## Preserve
- immersive visual identity
- futuristic atmosphere
- emotional tone
- mobile landscape compatibility
- touch interaction behavior
- responsive layouts
- existing feature continuity
- ES module architecture
- event-driven communication pattern

## Maintain
- modular scalability
- organized structure
- readable architecture
- future extensibility
- AppState as the single event bus

---

# Update Safety Rules

When implementing updates:

## ONLY modify:
- modules directly related to the requested task

## DO NOT touch:
- unrelated rendering systems
- unrelated UI systems
- unrelated interaction systems

unless explicitly instructed.

---

# File Structure Rules

Current structure (v2.2.0 — enforce this):

```
index.html           — HTML shell + CSS (no inline JS)
main.js              — Entry point (window.* bridge + boot sequence)
src/
  core.js            — AppState
  curriculum.js      — Data only
  audio.js           — AudioEngine class
  ui.js              — UIManager class
  rendering/
    harmonic-field.js
    visualizer.js
docs/
  current-state.md
  roadmap.md
  ai-rules.md
  feature-ideas.md
```

Preferred next expansion (v2.5):

```
styles/
  main.css
  components.css
  rendering.css
  kids.css
src/
  core.js
  curriculum.js
  audio.js
  ui.js
  physics/            ← new in v2.5
    onset-detector.js
    rhythm-analyser.js
  rendering/
    harmonic-field.js
    visualizer.js
    breath-guide.js   ← new in v2.5
```

---

# AI Workflow Rules

Before implementing updates:
1. Read all docs files (always read ALL FOUR before touching code)
2. Identify which module owns the feature being changed
3. Identify which AppState events are relevant
4. Preserve all event emissions and subscriptions
5. Never add DOM manipulation to audio.js or rendering modules
6. Never add audio logic to ui.js

---

# Replit Update Rules

When generating updates in Replit:

## ALWAYS
- preserve existing module imports
- preserve AppState event subscriptions
- create new modules in src/ — never add to main.js beyond entry wiring
- maintain ES module syntax (import/export)
- avoid replacing entire module files unnecessarily
- test that all window.* globals in main.js still exist after changes

## NEVER
- regenerate the whole app
- add `<script>` blocks to index.html
- overwrite AppState structure without updating all listeners
- delete module files without checking what imports them

---

# Mobile Rules

Mobile experience is a priority.

Maintain:
- landscape compatibility (body.landscape-mobile + sidebar drawer)
- touch responsiveness
- immersive fullscreen behavior in landscape
- readable controls (minimum 44px touch targets)
- smooth performance (SCALE=6 on mobile harmonic field)

When changing the harmonic field:
- Always test SCALE performance on simulated mobile (window < 768px)
- Never set kWave > 16 (too many ripples becomes noise on small screens)

---

# Visual Identity Rules

The project aesthetic must remain:
- immersive (harmonic field behind all content)
- cinematic (fade-in animations on prompt panel components)
- atmospheric (bg-mesh + harmonic field layering)
- emotionally intelligent (phase sync metaphor = hope/progress)
- futuristic (monospace labels, oscilloscope, neural bridge naming)
- fluid (all transitions use cubic-bezier(0.4,0,0.2,1))

Kids mode must remain:
- warm and playful
- same layout, different palette
- Nunito font
- amber/gold harmonic field

Avoid:
- sterile enterprise styling
- generic dashboards
- overly clinical presentation
- harsh colors or jarring contrast changes

---

# Performance Rules

Prioritize:
- smooth rendering (60fps target, 30fps mobile minimum)
- stable frame rate (RAF loops use dt-based time, not fixed increments)
- lightweight harmonic field (SCALE=4 desktop, SCALE=6 mobile)
- minimal DOM manipulation (UIManager batches updates)

Avoid:
- synchronous heavy calculations in RAF loops
- spawning new RAF loops without cancelling old ones
- creating AudioNodes without connecting/disconnecting them properly
- adding heavy CSS animations to elements inside the content-area

---

# Documentation Rules

After EVERY major update:
1. Update docs/current-state.md with new systems + architecture state
2. Update docs/roadmap.md — mark completed items, add new planned items
3. Update docs/feature-ideas.md — move implemented ideas to "Implemented" section
4. Update docs/ai-rules.md IF new architectural patterns are introduced

The docs folder is the persistent project memory system.
No implementation is complete until docs are updated.
