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

