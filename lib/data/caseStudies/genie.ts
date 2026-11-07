import type { CaseStudyContent } from './types';

export const genie: CaseStudyContent = {
  blocks: [
    {
      type: 'steps',
      eyebrow: 'Dispatch pipeline',
      title: 'Every turn runs the same 4-stage pipeline',
      intro: 'LLM is stage 4, not stage 1. Skills route first — LLM is the fallback.',
      items: [
        {
          label: 'Wake: Wake Word / Button',
          body: '"hey_jarvis" via OpenWakeWord or GPIO button on pin 17 triggers the conversation loop.',
        },
        {
          label: 'Stage 1: Pending State',
          body: 'Skills with multi-turn state get routed back first — WhatsApp 3-step confirm, timer awaiting duration.',
        },
        {
          label: 'Stage 2: Brain Intercept',
          body: '"Switch to local model", "list models", "what mode are you in" — handled before any skill.',
        },
        {
          label: 'Stage 3: Skill Router',
          body: 'Gemini 2.0 Flash receives all 19 skill manifests, returns matched names as JSON. LRU cached. ArgumentExtractor pulls typed args in a separate LLM call.',
        },
        {
          label: 'Stage 4: LLM Fallback',
          body: 'Full system prompt + 4-turn history + memory block. Reached only when no skill matched.',
        },
      ],
      note: 'Four named model slots, nine registered providers, all swappable by voice.',
    },
    {
      type: 'list',
      eyebrow: 'Under the hood',
      title: 'The engineering behind the skills',
      intro: 'Each skill has a specific bug, decision, or constraint behind it — not theory, not tutorials.',
      items: [
        {
          title: 'Voice AI pipeline',
          body: 'Wake word → VAD recording → STT → skill dispatch → TTS.',
        },
        {
          title: 'Wake word detection',
          body: 'OpenWakeWord integration, low-latency trigger loop.',
        },
        {
          title: 'Audio signal processing',
          body: 'scipy polyphase resampling: 48kHz stereo → 16kHz mono.',
        },
        {
          title: 'Threading and concurrency',
          body: 'Pipelined TTS, barge-in via threading.Event, non-blocking mic.',
        },
        {
          title: 'Raspberry Pi and GPIO',
          body: 'APA102 LED strip, push button on pin 17, Pi Camera HAT.',
        },
        {
          title: 'LED color states',
          body: 'The APA102 LED ring shows four states: idle, listening, processing, speaking.',
        },
        {
          title: 'Embedded system design',
          body: 'Runs fully air-gapped with local models — no cloud required.',
        },
        {
          title: 'REST API integration',
          body: 'Google Calendar, Spotify Web API, WhatsApp — 19 skills total.',
        },
        {
          title: 'ToolManifest system',
          body: 'Custom skill schema — JSON-typed args, validation, execution context.',
        },
      ],
    },
    {
      type: 'list',
      eyebrow: 'Stack',
      title: 'Grouped by layer',
      items: [
        {
          title: 'Hardware',
          body: 'Raspberry Pi 4, Seeed 2-Mic HAT, APA102 LEDs, Pi Camera, GPIO.',
        },
        {
          title: 'Voice layer',
          body: 'OpenWakeWord, Sarvam STT, Deepgram TTS, sounddevice, pygame, scipy.',
        },
        {
          title: 'LLM layer',
          body: 'Gemini 2.0 Flash, NVIDIA NIM, Groq, LM Studio.',
        },
        {
          title: 'Runtime',
          body: 'Python 3.11, ToolManifest, ExecutionContext, Google Calendar API, Spotify API, WhatsApp.',
        },
      ],
    },
    {
      type: 'steps',
      eyebrow: 'Version history',
      title: 'Where Genie is headed',
      items: [
        {
          label: 'V1 Foundation (shipped)',
          body: 'Wire up the hardware and get a keyword-based loop running end to end — prove the runtime could exist on a Pi at all.',
        },
        {
          label: 'V2 Intelligence (current)',
          body: "Replace keyword matching with an LLM skill router, add real memory and context, and rebuild the pipeline into modular, swappable stages. Basic voice search, sending messages on my behalf, and daily briefings already run on this — still rough, but working. Wake word reliability was hardened here after the resampling fix.",
        },
        {
          label: 'V3 Orchestrator (next)',
          body: "MCP support turns Genie from a runtime with its own tools into one that can drive everything else on the box — the six MCP servers in Arsen's Lab already expose the camera, microphone, shell, browser, database, and Alexa, and V3 is where Genie becomes their client. Plus cron-driven autonomy, vector memory over facts.json, and software AEC to finally close out barge-in.",
        },
        {
          label: 'V4 Embodiment (future)',
          body: 'Add sensors and mobility so Genie can act in physical space, not just talk in it.',
        },
      ],
    },
    {
      type: 'prose',
      eyebrow: 'Trade-off',
      title: 'The LLM is the fallback, and barge-in is the honest failure',
      paragraphs: [
        'The LLM sits at stage four of four, not stage one — it is the fallback, not the router. Routing every turn through a model is slow and expensive, so the router caches on (text, model) and most repeated requests never reach it. The honest failure is barge-in: the architecture is correct, but the microphone hears the speaker. That is a physics problem, and V3 fixes it in software with acoustic echo cancellation.',
      ],
    },
    {
      type: 'list',
      eyebrow: 'What building this taught me',
      title: 'The lessons that stuck',
      items: [
        {
          title: 'Skills-First Dispatch: Put LLM at stage 4, not stage 1.',
          body: 'Most requests hit the cached skill router — the LLM is the exception. Latency and cost drop dramatically when the routing logic is cheap and the expensive call is the fallback, not the default.',
        },
        {
          title: 'The Resampling Bug: Some bugs are hardware, not code.',
          body: "OpenWakeWord expects 16kHz mono. PipeWire runs at 48kHz stereo. Detection dropped from 0.33 to 0.025. Fix: scipy polyphase downsample 3:1, take channel 0. It looked like a model failure until it wasn't.",
        },
        {
          title: 'Barge-In Is Done — Architecturally: Hardware limitations trump clean code.',
          body: "threading.Event propagates cleanly through TTS, skills, and the LLM layer. But the mic hears the speaker. The architecture is correct. The physics isn't. V3 will fix it in software with acoustic echo cancellation.",
        },
        {
          title: 'Memory Injection Strategy: Inject on every turn, not selectively.',
          body: 'Sending extra tokens on every turn costs more. Missing context costs more conversations. Always-inject wins in practice until semantic retrieval is reliable enough to replace it.',
        },
      ],
    },
    {
      type: 'links',
      eyebrow: 'Source',
      title: 'Full docs and current demos',
      items: [
        {
          label: 'Genie Agent Runtime on GitHub (device photos and demo clips are being added there)',
          href: 'https://github.com/arsen0007/Genie-Agent-Runtime',
        },
      ],
    },
  ],
};
