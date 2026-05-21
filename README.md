# FluencyEngine Pro - State-Preservation Manifest & Architecture Blueprint

## 1. Core Intent & Application State
This repository maintains the decoupled frontend application for **FluencyEngine Pro**, a real-time speech therapeutic engine designed to mitigate speech blocks and disfluency patterns (stuttering) across both adult and pediatric populations (optimized for ages 6 and up).

*   **Current Architecture Build:** v1.2.0 (Monolithic Web Audio Pipeline Deployment).
*   **Target Modalities:** 
    *   Adult Track: Fluency Shaping via Voice Onset Acceleration and Stuttering Modification (Van Riper Protocols).
    *   Pediatric Track: Syllable-Timed Speech Dynamics (Choral/Rhythmic Tracking).
*   **Hardware Dependencies:** Dual-channel standard audio output or Bone Conduction Headsets, omnidirectional capture array (Microphone).

---

## 2. DSP & Signal Processing State Configuration
The core processing layer relies directly on the HTML5 Web Audio API to disrupt the faulty internal auditory-motor loop typical in stuttering phenotypes. 
[User Mic Input] ---> [Low-Latency Audio Capture Node]
|
+----------------------+----------------------+
|                      |                      |
[DAF Pipeline]          [FAF Pipeline]       [Binaural Mask Engine]
(Delay Node: 20-300ms)  (Notch Bi-Quad)      (Lowpass Band Gating)
|                      |                      |
+----------------------+----------------------+
|
[Audio Destination] ---> [Headphones / Bone Conduction]
### Active Core Hardware Profiles:
1.  **Delayed Auditory Feedback (DAF):** Spatially buffers incoming microphone signal by an intentional delay factor 20ms to 300ms. Adults default to 100ms; pediatric targets optimize at 140ms to prompt natural deceleration and choral mirroring.
2.  **Frequency Altered Feedback (FAF):** Shifts tracking pitch coordinates down or up by a localized octave range via specialized Bi-quad resonant filtering configurations to establish a synthetic second-speaker feedback presence.

---

## 3. Core Software State Preservation (For Next-Gen AI Handshake)
When reading this codebase to generate the next system evolution iteration, **the downstream AI engineer must preserve the following behavioral vectors**:

*   **Zero-State Component Isolation:** The application must remain packaged inside a single, zero-dependency `index.html` deployment until code size surpasses limits necessitating structured compression.
*   **State Alignment Rule:** The user's active configuration toggles (`Adult Mode` vs. `Kids Mode`) must instantly remap the active clinical curriculum matrix without breaking the continuous polling state of the Web Audio graph.
*   **Children Safety and Privacy Gating:** All speech visualizer rendering arrays and audio stream evaluations are run locally within the browser sandboxed environment. No biophysical telemetry data or raw recording strings may be transmitted outwards without explicit programmatic consent layers.

---

## 4. Next-Stage Evolutionary Milestones (Product Backlog)
When continuing this script development, focus development efforts strictly onto the following immediate feature extensions:
1.  **True Phase Vocoder Implementation:** Migrate the current FAF filter proxy system into a mathematical Phase Vocoder processing script block utilizing short-time Fourier Transforms (`STFT`) to scale pitch directly without affecting time boundaries.
2.  **Local Web Speech Recognition Engine:** Incorporate the native browser `webkitSpeechRecognition` engine to automatically highlight the specific syllables inside the active curriculum script block where tracking delays or vocal blockages manifest physically.
3.  **Pediatric Interface Gamification Expansion:** Introduce visual scoring tokens that track vocal amplitude consistency, turning smooth vocal tracks into unlockable progress landmarks for younger users.
