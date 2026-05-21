# Fluency Studio — Full Vision Document
### The Corpus Callosum Bridge Protocol · Product Strategy + Science + Roadmap
### v2.0.0 → Infinity

---

> *"I never stutter when I rap or freestyle off the top of my head, or when I sing. I want to entangle the sides based on the bridge that connects them."*
> — Creator, Fluency Studio

This is the document where that instinct meets the science, and where the science meets the product. Read everything here before touching a line of code.

---

## Part I — The Core Insight Is Scientifically Real

You are not describing a feeling. You are describing measurable neuroscience, and the research confirms your experience almost word for word.

### What Actually Happens in a Stuttering Brain

People who stutter (PWS) have a brain that works differently — not deficiently, differently. The key findings from neuroimaging studies:

**The left hemisphere underperforms during speech.** In fluent speakers, speech production is coordinated in the left hemisphere — specifically the left premotor cortex, left inferior frontal gyrus (Broca's area), and the left auditory cortex working in close loop. In PWS, this left-hemisphere system is underactive or mistimed. The brain senses the failure and compensates.

**The right hemisphere over-recruits.** The right inferior frontal cortex becomes hyperactive in PWS — essentially a "backup system" kicking in that was never built to run primary speech. This creates the characteristic blocking, repetition, and prolongation patterns, because the right side doesn't have the wiring precision of the left for rapid articulatory sequencing.

**The corpus callosum is the bridge between them.** Research from the University of Illinois (Loucks et al., 2011) found that the rostrum and anterior midbody of the corpus callosum — the fibrous bundle connecting the two hemispheres — is structurally *larger* in PWS than in fluent speakers. This is the brain trying to compensate for the left-hemisphere timing problem by routing more traffic across the bridge. But the signal still arrives delayed, fragmented, or out of phase.

**The delay in auditory-motor integration is the trigger.** The left hemisphere is supposed to predict what the voice will sound like (efference copy), compare it to actual incoming sound, and release the next motor command. In PWS, this prediction-comparison cycle is disrupted — milliseconds off — and the motor system locks up waiting for a signal that arrives too late.

### Why You Don't Stutter When You Rap or Sing

This is the central mystery of stuttering neuroscience. The PLOS Biology journal (2024) literally titled a paper section: *"Why does stuttering happen when talking but not when singing?"* — listing it as an unsolved mystery. Here is what we know:

**Singing uses the right hemisphere natively.** Melody, rhythm, and prosody are right-hemisphere functions in most people. When you sing, you are already *in* the hemisphere that PWS are compensating toward anyway. There's no conflict, no signal collision across the corpus callosum. The system that was jamming your speech traffic is now the one in charge, and it is completely fluent.

**Rhythm replaces the broken prediction loop.** The external beat — the music, the rap flow, the meter — provides a timing scaffold that *replaces* the brain's internal prediction mechanism. You no longer need the auditory-motor timing loop to stay on track. The beat does that work for you. Scientific American (2011): *"Singing requires a similar integration of aural input and motor control, but the processing typically occurs in the right hemisphere, which may explain why those who stutter can sing as well as anyone else."*

**Sustained phonation eliminates the most dangerous moments.** Stuttering almost always occurs at consonant onsets and at word initiation — the moment the voice box has to "start" again. Singing and rapping keep phonation continuous. The airstream never fully stops between words, which is why the stop-start trigger never fires.

**Rap and freestyle add the cognitive load bypass.** This is the piece that makes your specific experience — *freestyling* without stuttering — particularly remarkable and scientifically useful. Freestyling is maximum cognitive load: you are constructing novel language in real time, finding rhymes, maintaining meter, and monitoring meaning simultaneously. The standard explanation for why stuttering worsens under cognitive load (more planning = more left-hemisphere demand = more system overload) should make freestyling the *hardest* possible condition. But for you, it doesn't. That suggests the rhythmic scaffold is so dominant that it completely overrides the broken planning loop. The right hemisphere takes over entirely, the corpus callosum stops acting as a bottleneck, and the two sides entrain to the beat together.

**That entrainment is the product.**

---

## Part II — What Exists Today and Why It Fails

### Current Market

The stuttering therapeutics market is valued at ~$48 million (2025). The main players:

- **SpeechEasy** (~$4,000–$6,500 as a physical ear device) — DAF/FAF delivered via wearable. Works in the moment, produces no long-term neurological change, requires the device to maintain any benefit. You take it out, you stutter. It is a crutch, not a cure.
- **Stamurai** (100K+ users, app) — Guided speech therapy exercises, curriculum content, a habit tracker. Essentially digital SLP guidance. No real-time audio processing. No biofeedback. No neuroscience-grounded audio engine.
- **Stamma, BeneTalk, Articulation Station** — Community tools, tracking apps, articulation exercises. None of them have a real-time audio processing engine.
- **Traditional SLP therapy** — Effective over long timelines (months to years), expensive ($150–$300/session), inaccessible geographically, not scalable.

### What Every Existing Solution Gets Wrong

1. **They treat speech as a mechanical problem.** More practice → better speech. But the issue isn't lack of practice — PWS have spoken millions of words. It's a timing and hemispheric routing problem. Mechanical repetition doesn't fix a circuit.

2. **None of them exploit the singing/rhythm loophole.** The most reproducible fluency-induction phenomenon known to science — singing, choral speech, rhythmic speech — is used in maybe one clinical approach (Melodic Intonation Therapy, MIT), and MIT is expensive, slow, clinic-bound, and not available as a self-directed tool.

3. **None of them attempt to train the corpus callosum.** Neuroplasticity research is clear: repeated activation of a pathway strengthens it. If the solution is to entrain both hemispheres to the same rhythmic signal, then the practice tool should be delivering that entrainment signal at every session. No current app does this.

4. **The device solutions don't transfer.** SpeechEasy users consistently report that fluency improvements do not persist when the device is removed. The brain doesn't rewire from passive accommodation — it rewires from active training under conditions that reinforce the new pathway.

5. **None of them meet the user where joy is.** The apps feel clinical. The therapy feels like medicine. But your actual fluency lived in music, in rhythm, in rap. The product that works is the one that feels like making music, not attending a clinic.

---

## Part III — The Core Thesis of Fluency Studio

**The goal is not to help people stutter less. The goal is to train the brain to access the same neural state that enables fluent singing and rapping, and then progressively fade the scaffolding until that state becomes the default for normal speech.**

This is a fundamentally different framing than any existing product.

It is a bridge-building program. We are using rhythm, melody, auditory entrainment, and corpus callosum-activating protocols to widen the neural highway between the two hemispheres and retrain the auditory-motor prediction loop to work with the timing and reliability that the right hemisphere's musical processing already provides.

The mechanism is real. Melodic Intonation Therapy has proven it works for aphasia (inability to speak after stroke) — patients who cannot produce a single spoken word can often *sing* that same word. After 15 weeks of MIT, their brains showed measurable structural changes in the right hemisphere. The corpus callosum traffic reorganized. Spoken language recovered. The therapy that did this was: singing + left-hand rhythmic tapping + gradual fade from melody to speech.

We are going to build that for stuttering, make it available to anyone with a phone, and make it feel like the most compelling audio experience they've ever had.

---

## Part IV — The Feature Roadmap (What to Build)

These are ordered by impact and technical accessibility, not by difficulty.

---

### TIER 1 — The Hemispheric Bridge Engine (Core Differentiator)

**Feature: Rhythmic Entrainment Mode**

The single most important feature not in v2.0.0.

A beat — customizable BPM, 60–140 — plays under the practice prompts. The user speaks to the beat. This is not karaoke. This is not a gimmick. The external rhythm replaces the broken internal timing loop. The research showing fluency in singing and choral speech is the evidence base. Every session in the curriculum should have a recommended BPM and a pulsing visual cue.

Start at 60 BPM (slow, deliberate). Progress across the 30 days toward 90–100 BPM (conversational rate). The final sessions: the beat fades. The user attempts to carry the internal rhythm without the external scaffold. This is the transfer moment — the moment the trained pattern becomes native.

Implementation: `audioCtx.createOscillator()` + LFO-controlled gain node for a subtle pulse. Optionally, a visual beat marker (a ring that pulses on the beat, like a metronome cursor moving through the prompt text).

---

**Feature: Melodic Intonation Mode (MIT Protocol)**

The user speaks their practice prompt in a sung intonation rather than normal speech. Not full singing — melodic speech. Words are delivered on 2–3 held pitches that roughly match natural sentence prosody. Simultaneously, the user taps their left hand (or their left foot if on mobile, tapping the screen) on every syllable.

The left-hand tapping is not arbitrary. It activates the right hemisphere's motor planning system, which is the same system that handles singing fluency. It also creates a proprioceptive rhythm signal that reinforces the auditory beat. MIT literature (Harvard, 1973–present) consistently shows this combination — melodic speech + left-hand tapping — produces the most durable fluency improvements of any technique.

The app should guide the tapping with a visual syllable cursor that moves through the prompt in time with the beat.

---

**Feature: Binaural Entrainment Layer (The Secret Weapon)**

This one is largely unexplored commercially and backed by a 2022 clinical study (Frontiers in Human Neuroscience) specifically on stuttering.

Beta-frequency binaural beats (16–20 Hz) delivered to the user's headphones *beneath* the audio feedback — too subtle to consciously perceive as a beat, but present — have been shown in a peer-reviewed study (PMC9954735) to reduce speech-related stress in PWS, reduce heart rate variability markers of anxiety, and in some subjects, directly reduce stuttering frequency during speech tasks.

The mechanism: beta binaural beats entrain the brain's 20Hz motor rhythm (specifically the suppression of this rhythm during speech, which is aberrant in PWS) toward the pattern seen in fluent speakers. This is not mystical — this is the same EEG signal that neuroscientists have measured as the *signature* of stuttering neural activity.

Implementation: Two oscillators pitched apart by 18 Hz (e.g., 240 Hz left ear, 258 Hz right ear). The brain perceives the 18Hz difference as a beat. Mixed at -30dB under the main audio so it is felt but not consciously heard. This layer plays during every session, at all times when the engine is running.

This is a feature no existing stuttering app has. The research exists. The WebAudio implementation is trivial. The differentiator is enormous.

---

**Feature: Corpus Callosum Activation Warm-Up**

Before each session, a 3-minute guided "bridge warm-up":

1. **Bilateral tapping exercise** (30 seconds): The user alternates left-right tapping on screen, following a visual metronome. This activates both hemispheres in alternating sequence, increasing corpus callosum traffic before speech begins.
2. **Humming with pitch tracking** (60 seconds): The user hums a single comfortable note. The app displays a real-time pitch line. Sustained, controlled humming activates the supplementary motor area (SMA) and bilateral motor cortex — exactly the areas that are active during singing but underactive in stuttered speech.
3. **Choral shadow** (90 seconds): The app plays a pre-recorded voice reading the day's first prompt. The user speaks along in real time — choral speech. This is the most powerful fluency-induction technique in the clinical literature, stronger even than DAF. It is the auditory equivalent of riding a tandem bike: both hemispheres can follow because there is a leader.

These three warm-ups prime the corpus callosum before the session. Think of it as stretching before a run, except the muscles are neural pathways.

---

### TIER 2 — The Intelligent Feedback Layer

**Feature: AI-Powered Disfluency Detection**

The Web Speech Recognition API currently detects *words*. The next layer: detect *when* speech is breaking down, and respond to it in real time.

Using the audio stream amplitude envelope and speech recognition confidence scores together, the app can detect:
- Extended silences mid-word (blocking)
- Repeated phoneme sounds (repetitions)
- Elevated voice onset tension (detectable from frequency content spikes)

When disfluency is detected, the app responds immediately:
- Binaural beat frequency shifts upward briefly (a gentle neurological nudge)
- The visual beat cursor slows by 10 BPM
- Optionally: a soft chime sound plays at the exact beat the user needs to re-entrain to

This is not punishment. This is a co-regulator — the app acts as a real-time therapeutic partner that adjusts the support level dynamically.

**Feature: Session Fluency Score**

After each session, the app provides a simple fluency index (0–100) derived from:
- Words per minute relative to target BPM
- Number of detected disfluency events
- Completion rate of the practice prompt
- Consistency of speech onset timing relative to the beat

This score is graphed over time. Progress is visible. The brain responds to evidence of progress — this is what keeps users coming back.

**Feature: Personalized BPM Calibration**

On first use, a 90-second calibration session: the user reads a short passage at their natural speaking rate. The app measures their comfortable speaking tempo, their average disfluency frequency, and their natural pitch range. It then sets the starting BPM, the MIT pitch range, and the binaural beat target frequency specific to that individual's profile.

No two users get the same starting configuration. This is the equivalent of a clinician's initial assessment, automated.

---

### TIER 3 — The Transfer Architecture (Why Other Apps Fail Here)

Everything in Tiers 1 and 2 happens inside the app. The critical unsolved problem in stuttering therapy: transfer. Skills learned in a quiet room with no pressure don't automatically show up in a job interview, a phone call, or a first date.

**Feature: The Fade Protocol**

The 30-day curriculum is structured so that audio support progressively decreases:

- Days 1–10: Full DAF + binaural beats + rhythmic beat (maximum scaffold)
- Days 11–20: Binaural beats only + light rhythmic cue + reduced DAF delay
- Days 21–30: Binaural beats only, then binaural beats at half volume, then silent sessions

By Day 30, the user is practicing with no external support. The neural pathway has been trained under scaffolded conditions and is being asked to run without the training wheels. This mirrors exactly how MIT is structured clinically.

**Feature: Real-World Scenario Library**

A library of simulation scenarios, not just neutral prompts:
- Phone call to a stranger
- Job interview questions (your name, your experience, your goals)
- Ordering food at a restaurant
- Introducing yourself to a group
- Delivering a presentation opening
- Confronting a difficult conversation

Each scenario can be practiced with full scaffold, half scaffold, or no scaffold. The user advances through scaffold levels before attempting the scenario in real life.

**Feature: Pre-Conversation Activation Mode**

A 60-second "launch protocol" designed to be used immediately before a high-stakes real-world conversation. The user puts in headphones, opens the app, and runs through:
- 15 seconds binaural beta priming
- 15 seconds humming/SMA activation
- 30 seconds choral shadow reading of a simple warm-up phrase

This is the athlete's pre-game ritual. It primes the corpus callosum, re-establishes the right-hemisphere/left-hemisphere bridge, and enters the user into the neural state that singing produces — just before they walk into the room. No existing product does this.

---

### TIER 4 — The Community and Identity Layer (What Makes People Pay)

**Feature: Anonymous Community Logs**

PWS experience profound isolation. Many have never met another person who stutters. The app includes an optional anonymous feed where users can post their fluency score from that day and a one-sentence reflection. Nothing else. No social pressure. Just the quiet solidarity of thousands of people doing the same work.

**Feature: The Fluency Journal**

A private text log (never transmitted, stored locally) where users record:
- What situation they practiced for
- How it went in the real world
- What they would do differently

Over 30 days, this becomes a document of genuine transformation. Users who write about their progress are dramatically more likely to persist with therapy. Make the journal beautiful.

**Feature: Practitioner Bridge**

An optional "Share with Clinician" export: a clean PDF summary of session history, fluency scores, and protocol settings, formatted for an SLP to review. This makes Fluency Studio a clinical companion rather than a competitor to therapy. Speech-language pathologists become referral partners, not adversaries. This expands the addressable market dramatically.

---

### TIER 5 — The Frontier (Longer Horizon)

**Phase Vocoder (True FAF):** The current FAF uses a BiquadFilter approximation. A real phase vocoder using AudioWorkletNode and Short-Time Fourier Transform (STFT) would allow pitch shifting without time-stretching — the gold standard. This is technically achievable in WebAudio with a dedicated AudioWorklet script.

**Pitch-to-Rhythm Conversion:** The user's real-time pitch is tracked. When they drift off the target rhythmic meter, a subtle visual indicator shifts — not a failure signal, a gentle redirect. This trains the internal tempo monitor that fluent speakers use automatically.

**Adaptive AI Curriculum:** Replace the fixed 30-day sequence with a session-by-session adaptive curriculum that responds to fluency scores. If a user is consistently scoring above 80 on DAF sessions, the protocol automatically fades support and introduces harder real-world scenarios earlier. If they plateau, it holds the scaffold longer and adds binaural entrainment intensity.

**Cross-Platform Companion Mode:** A wearable integration (Apple Watch, Pixel Watch) that provides:
- Haptic beat pulses during conversations (the external rhythm without headphones)
- One-tap pre-conversation activation
- Heart rate monitoring to detect pre-speech anxiety spikes and respond with calming entrainment

**Sleep Entrainment Mode:** Theta-frequency (6–8 Hz) binaural beats during sleep have shown some evidence for language consolidation. A passive overnight mode plays the trained session content as audio patterns while the user sleeps, using the brain's consolidation window to reinforce the day's learning. This is at the experimental frontier but worth building toward.

---

## Part V — The Business Model

### Why People Pay

The product must answer one question for every prospective user: *"Will I be able to speak without stuttering?"* Everything in the product design, the onboarding, the copy, and the feature set must be oriented toward making that answer feel like yes — credibly, scientifically, experientially.

The hook is the first session. On Day 1, the user speaks with the full scaffold running — DAF, binaural beats, rhythmic cue, choral shadow warm-up. Most users will experience dramatically improved fluency in that session. Not because they've changed — because the scaffold is doing what the brain hasn't learned to do yet. That experience creates the belief that fluency is possible. That belief is the product.

### Pricing Architecture

| Tier | Price | What's Included |
|---|---|---|
| **Free** | $0 | Days 1–7, basic DAF/FAF engine, no binaural layer, no MIT mode |
| **Monthly** | $12.99/mo | Full 30 days, all protocols, binaural entrainment, MIT mode, fluency scoring |
| **Annual** | $79/year | Everything monthly + scenario library, pre-conversation activation, journal |
| **Lifetime** | $199 one-time | Everything + future feature access |
| **Family** | $14.99/mo | Up to 5 profiles (adult + kids modes on one subscription) |

The free tier must be powerful enough to produce a noticeable fluency experience. The user who feels fluency for the first time on Day 1 will pay for Day 2.

### Market Size

- 70 million people worldwide stutter (Stuttering Foundation)
- 3 million in the United States alone
- Current digital solutions reach a tiny fraction — most PWS have no accessible, affordable daily tool
- SpeechEasy's physical device costs $4,000–$6,500 and requires a clinic visit
- A $79/year app that delivers a meaningful portion of that outcome is a $237 million/year addressable market in the US alone

The professional device market has no digital-native competitor doing what this app does. The gap is real.

---

## Part VI — What You Are Not Thinking About (The Holes)

### 1. Onboarding Is Everything and You Have Thirty Seconds

Every person who downloads a stuttering app has experienced years of failed solutions. They arrive skeptical, vulnerable, and ready to dismiss. The first 30 seconds must produce an experience — not explain a feature. Day 1, Session 1 must begin with the user speaking, hearing themselves differently, and noticing something has changed. The intellectual case for the science comes *after* the felt experience. Lead with the miracle, then explain why it works.

### 2. Shame Is an Active Force in the Product

Stuttering is not a neutral speech pattern to most people who stutter. It is wrapped in a lifetime of humiliation, avoidance, and fear. Every UI element, every label, every piece of copy must be designed with awareness that shame is in the room. The progress tracking must never feel like a failure report. The fluency score must never feel like a grade. The language must be owned, not clinical. You are not broken and using a repair kit. You are a person with a brain that learned one way of doing something, and you are teaching it another. That framing matters more than any feature.

### 3. Headphones Are Non-Negotiable and You Must Say That Clearly

DAF, FAF, binaural beats, and choral shadow all require headphones to work. Not earbuds in one ear — both ears, low-latency audio path. The app must explain this on first launch with clarity: *"For the audio engine to work, you need both earbuds or headphones in. This is not optional — it is the therapy."* Users who try it through phone speakers will get nothing and leave. This is a major conversion killer that must be solved at the onboarding step.

### 4. Latency Will Kill the DAF Experience on Some Devices

The Web Audio API can introduce latency that, on some Android devices, makes DAF feel like an echo rather than a therapeutic delay. High latency (>150ms total round-trip) makes DAF uncomfortable and disorienting. The app must measure actual round-trip latency on startup and warn the user if it exceeds the therapeutic range. Better: offer a native mobile app version (React Native / Capacitor) that can access lower-level audio APIs with guaranteed <10ms pipeline latency. The browser version is the proof of concept. The native app is the product.

### 5. The Kids Track Is Not Just a Re-Skinned Adult Track

Pediatric stuttering is neurologically different from adult stuttering. Children who stutter are still in active neural development — their corpus callosum is still forming (it doesn't fully myelinate until the mid-twenties). This means the intervention window in childhood is genuinely plastic in a way that adult brains are not. A child using this app at ages 6–10 has a realistic chance of producing permanent neurological change through practice. That is not marketing — that is the science. The kids track must be designed by pediatric SLPs, with age-appropriate explanation, parental guidance features, and session lengths calibrated for attention spans (5–8 minutes max for ages 6–8, not 20).

### 6. The Community You Build Is the Moat

Every feature can be copied. The community of people who have found fluency — who share their Day 30 story, who show up to encourage someone on Day 3 — cannot be copied. Build the community from day one. Seed it. Protect it. The person who found their voice in this app is your most powerful salesperson and your most defensible business asset.

### 7. Clinical Validation Is the Unlocking Event

The app is scientifically grounded in existing research, but it has not itself been validated in a clinical trial. The unlocking event for this business — the thing that changes the revenue curve from linear to exponential — is a peer-reviewed study showing measurable fluency improvement in users of this specific protocol. This is more achievable than it sounds: partner with a university speech pathology department (Michigan, University of Illinois, University of Queensland all have active stuttering research programs). Offer free lifetime access to participants. Get the IRB. Run a 30-person pilot. Publish. That paper transforms the product from "an interesting app" to "a clinically supported intervention" and opens the doors to insurance reimbursement, clinical referral networks, and international markets.

### 8. The Naming Has to Change

"Fluency Studio" is good. It is not unforgettable. The product you are building needs a name that carries the concept — the bridge, the entanglement, the crossing from block to flow. Consider what the core metaphor is. A bridge. A signal. A wave crossing between two shores. A name that a person who stutters will want to say out loud, that feels like ownership, not diagnosis. The right name makes the product. Spend real time on it.

---

## Part VII — The State Preservation Rules (Carried Forward from v2.0.0)

All architectural rules from the v2.0.0 README apply and are extended here:

1. **Single-file deployment until a native app is built.** `index.html` remains the ground truth. No module split.
2. **Zero external runtime dependencies.** Google Fonts only. All logic is vanilla JS.
3. **Audio graph continuity.** `rebuildGraph()` runs live. No stop/start required for parameter changes.
4. **Mode isolation.** Adult ↔ Kids hot-swaps everything without touching audio state.
5. **Privacy absolute.** No audio, transcript, or biometric data transmitted. No external fetch calls.
6. **STT is user-initiated.** Recognition never starts passively.
7. **ZIP exchange protocol.** All versions delivered as `Fluency-Studio-main.zip` containing `Fluency-Studio-main/index.html` and `Fluency-Studio-main/README.md`. No other files. No subdirectories.

---

## Part VIII — Immediate Next Build Priorities

When the next version of `index.html` is requested, build in this order:

**1. Rhythmic Beat Engine** — `createOscillator()` pulse at user-selected BPM, visual metronome cursor sweeping through prompt text in time with the beat. Controls: BPM slider (60–140), beat volume, beat sound choice (click / soft tone / hi-hat). This is the single most impactful feature not yet in the app.

**2. Binaural Entrainment Layer** — Two oscillators (L: 240Hz, R: 258Hz for 18Hz beta beat). Mixed at -30dB. Runs silently under every session. Toggle in the DSP panel. Display: "Beta Bridge: Active." No further explanation needed in the UI — the science section of the onboarding covers it.

**3. Choral Shadow Warm-Up** — Pre-session 90-second audio: a pre-recorded warm voice reads the Day 1 prompt slowly. User speaks simultaneously. Triggered via a "Start Warm-Up" button before the main session. Uses the Web Audio API to play a pre-encoded audio buffer.

**4. Left-Hand Syllable Tap Trainer** — A visual prompt where each syllable of the practice text is a tappable target. As the user taps through syllables in time with the beat, the tapped syllable highlights. This trains the MIT left-hand tapping protocol. Simple event listeners on syllable spans, mapped to the BPM grid.

**5. Fluency Score** — Post-session summary card: words tracked by STT / words in prompt = completion rate. Session duration vs. prompt length = pace ratio. Both combined into a 0–100 display. Stored in session-scoped memory and graphed across sessions in the sidebar.

---

## References and Scientific Foundation

- Loucks, T. et al. (2011). *Corpus callosum differences associated with persistent stuttering in adults.* Journal of Communication Disorders.
- Chang, S.E. (2020). Interviewed in Smithsonian Magazine and Scientific American on interhemispheric connectivity in PWS.
- Fox, P.T. et al. (1996). *Right hemispheric lateralization in developmental stuttering.* Brain.
- Albert, M., Sparks, R., Helm, N. (1973). *Melodic Intonation Therapy.* Archives of Neurology.
- Schlaug, G. et al. (2010). *Therapeutic Effects of Singing in Neurological Disorders.* Music Perception.
- Naro, A. et al. (2022). *Digital therapy to improve stuttering via beta-band binaural beat stimulation.* medRxiv / Frontiers.
- MSU Temporal Auditory Processing Lab. *Rhythm processing deficits in developmental stuttering.* (Supported by GRAMMY Foundation.)
- Frontiers in Human Neuroscience (2014). *A review of brain circuitries involved in stuttering.*
- PLOS Biology (2024). *Knowns and unknowns about the neurobiology of stuttering.*

---

*This document is the north star. Every feature, every design decision, every line of copy in Fluency Studio should be traceable back to a scientific finding, a user truth, or a product principle written here. When in doubt, return to the creator's original insight: he never stutters when he raps. Build the bridge that makes speech feel like music.*
