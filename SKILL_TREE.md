# Skill Tree — Content Draft (v2, revised after multi-model QA pass)

Status: DRAFT. Nothing here is final. Items marked ⚠️ NEEDS CONFIRMATION are my best guess from
available evidence but I'm not certain enough to lock them in without you checking.

Status tag legend:
- **Shipped** — proven in a real, documented project (linked)
- **Applied** — built/used it for real (prototype, personal tool, internal work) but no full shipped
  project page proves it yet
- **Studying** — learned/exposed to it, no hands-on build yet

Rules enforced: tools/vendors/hardware are never listed as skills — they live in an explicit "Tools" /
"Hardware" line under whichever skill they support. Certifications are noted as credentials, not used
to justify a "Shipped" tag by themselves — the tag reflects practiced work. "Problem Solving" is
intentionally not a branch (no tools, cross-cutting trait — belongs in project narratives, not the tree).

v2 changes from v1, after running the draft past GPT-5.6 and Claude Sonnet for a QA pass — both
independently caught the same issues:
- Renamed several skills that claimed more than the evidence supports (see each entry's note)
- Removed 3 duplicate/redundant entries that cited the same evidence twice under different names
- Fixed 2 tool-mislabeled-as-skill errors
- Downgraded "Model Evaluation & Selection" from Applied to Studying — swapping between models isn't
  the same as evaluating them
- Kept "Stakeholder Pitching & Buy-in" as Shipped — the models flagged this as possibly overclaimed,
  but CaseWise's documented project scope literally includes "C-suite pitching" as your own role, not
  just outcomes that happened to you. That one checks out.

---

## 1. LLM Engineering
*Working with models directly: prompting, retrieval, evaluation, routing.*

- **Prompt Engineering** — Shipped
  Evidence: CaseWise (classification/summarization prompts), Genie (skill-routing prompts)
  Tools: Gemini API, Gemini 2.0 Flash, GPT, Claude, DeepSeek

- **Skill Dispatch & Structured Output Extraction** — Shipped
  *(renamed from "Function / Tool Calling" — the evidence is custom skill routing + argument
  extraction and structured outputs, not necessarily model-native function-calling API usage. This
  name matches what's actually built.)*
  Evidence: Genie (skill dispatch + argument extraction per skill), CaseWise (structured
  classification/summary outputs)

- **Multi-Provider LLM Integration & Model Selection** — Shipped
  *(renamed from "Multi-LLM Routing" — evidence supports swappable providers/configurable selection;
  "routing" implied automated decision logic I can't confirm)*
  Evidence: Genie (9 models across 4 swappable provider slots)
  Tools: OpenRouter, Ollama, NVIDIA NIM, Groq, Gemini, Claude, GPT, DeepSeek

- **Model Evaluation & Selection** — Studying (confirmed, downgraded from Applied)
  Swapping between 9 models live shows real usage judgment, but not a formal evaluation process yet —
  expect this to firm up as your agentic systems work matures.

- **Retrieval-Augmented Generation (RAG)** — Studying (confirmed)
  Actively building your own agentic systems — expect this to move to Shipped as that work lands.

- **Local LLM Deployment & Testing** — Applied (confirmed, upgraded from Studying)
  Evidence: runs models locally on your own PC hardware for testing via Ollama and LM Studio — not
  just aware of local inference, actually doing it
  Tools: Ollama, LM Studio

---

## 2. Agentic Systems & Automation
*Systems that act over time: orchestration, memory, tool use, automation.*

- **Agent Dispatch & Orchestration Pipelines** — Shipped
  Evidence: Genie (wake word → pending-state check → brain intercept → LLM router with LRU cache →
  arg extraction → skill execution → LLM fallback)

- **Context & Memory Management** — Shipped
  *(merged "Agent Memory Systems" + "Context & Memory-Window Tuning" — v1 had these as two separate
  skills citing the exact same Genie evidence; that's a duplicate, not two skills)*
  Evidence: Genie (empirically-tuned 12-turn short-term window, long-term `facts.json` keyword-match
  memory, unconditional memory injection strategy)

- **MCP Server Development** — Applied
  Evidence: built your own MCP servers under Claude Code (personal/internal tooling — confirmed)

- **Human-in-the-Loop Workflow Design** — Shipped
  Evidence: CaseWise (AI drafts classification/summary, human reviews and approves before it commits
  to the core system)

- **Browser Automation** — Shipped
  Evidence: CaseWise (DOM scraping/interaction with UCMS)

- **Web Scraping & Data Extraction** — Shipped
  *(split out from "Browser Automation" — httpx/BeautifulSoup are HTTP scraping/parsing tools, not
  browser automation; they're a distinct skill even though both projects touch scraping)*
  Evidence: BarHunter (httpx + BeautifulSoup scraping across state bar and law society sites)

- **Workflow Automation** — Shipped
  Evidence: Mail Merge Tool (dedup → column-split → clean export pipeline), CaseWise (3-stage
  classification → summary → outreach workflow)

- **Multi-Agent Coordination** — Studying (confirmed)
  Genie is one sophisticated agent with many skills/models, not multiple agents coordinating with each
  other. Actively building your own agentic systems now — this moves to Shipped once that's real.

Tools: Claude Code, Playwright, httpx, BeautifulSoup
Tools — Studying: LangChain, n8n

---

## 3. Voice AI & Telephony
*Speech input/output, conversational design, latency.*

- **Speech-to-Text Integration** — Shipped
  Evidence: Genie (Sarvam AI STT)

- **Text-to-Speech & Pipelined Playback** — Shipped
  Evidence: Genie (Deepgram TTS, sentence-level pipelined synthesis — playback starts before the full
  response finishes generating)

- **Wake-Word Detection & Audio Tuning** — Shipped
  *(folded the scipy resampling fix in here directly rather than giving it a separate node — keeps
  the tree from growing an entry for every individual fix)*
  Evidence: Genie (OpenWakeWord, plus a real debugging story: identified a 48kHz→16kHz sample-rate
  mismatch and fixed it via scipy resampling, which restored wake-word detection — internal detection
  score went from 0.025 to 0.33)

- **Voice Pipeline Latency Tuning** — Shipped
  *(renamed from generic "Latency Optimization" — scoped specifically to what's evidenced, not a
  broad latency-engineering claim)*
  Evidence: Genie (sentence-level pipelined TTS + the resampling fix above)

- **Telephony Integration** — Studying (confirmed)
  You're actively building a separate voice infrastructure project — intentionally not surfaced on the
  portfolio yet since it's still in progress. Tag stays Studying until that work is ready to show.

Tools: Sarvam AI, Deepgram, OpenWakeWord, scipy
Tools — Studying: ElevenLabs, Exotel, Twilio

---

## 4. Full-Stack Product Engineering
*Building and shipping complete products.*

- **Full-Stack Web App Development** — Shipped
  Evidence: BarHunter, CaseWise, Mail Merge Tool (Next.js/TypeScript end to end, deployed on Vercel)

- **Backend & API Development** — Shipped
  *(softened from "REST API Design" — evidence supports building/shipping APIs, not necessarily
  formal API design practice like versioning/contracts)*
  Evidence: BarHunter (recruiter dashboard APIs), CaseWise (workflow backend)

- **Database Design & Row-Level Security** — Shipped
  Evidence: BarHunter (Supabase/PostgreSQL with RLS policies)

- **Data Cleanup & CSV Processing** — Shipped
  Evidence: Mail Merge Tool (dedup, column splitting, cleaned export)

- **Client Website Development** — Shipped
  *(kept distinct from the Product Strategy entry below — this one is the technical build, that one
  is the discovery/delivery relationship)*
  Evidence: Fhoneman (booking flow, emergency-inquiry capture, custom form logic)

- **Browser Extension Development** — Shipped (confirmed — better evidence than I had)
  Evidence: CaseWise V1 actually shipped as a Chrome extension (Manifest V3, content scripts) before
  it evolved into a direct UCMS API integration. This is a real technical-evolution story worth
  telling on the CaseWise project page itself, not just a tree leaf — it shows the same instinct as
  Genie's V1→V2→V3 staging: ship the fastest working version first, then rebuild the interface once
  the concept is proven.

- **Self-Hosted & Cloud Compute Deployment** — Applied
  Evidence: deploys agent workloads to your own Raspberry Pi and to Google Cloud compute instances,
  not just PaaS platforms — a distinct skill from pushing to Vercel

Tools: Next.js, TypeScript, Supabase, PostgreSQL, Vercel, Railway, Streamlit, GitHub, Git, Postman,
VS Code, Cursor, Google Cloud
*(Railway confirmed in active use, specifically for hosting AI agent workloads; Render, Fly.io, and
Windsurf dropped — not confirmed as real hands-on use)*

---

## 5. Infrastructure, Security & Edge Systems
*The environment underneath the product: OS, hardware, access, config.*

- **Linux System Administration** — Shipped
  *(absorbed "Networking Fundamentals" into this entry's evidence rather than keeping it standalone —
  the headless-Pi setup evidence is real but too thin to justify its own skill node)*
  Evidence: Genie runs headless on a Raspberry Pi — real terminal/bash/SSH/service-management and
  basic network configuration to keep a 24/7 assistant alive

- **Embedded / Edge Hardware Integration** — Shipped
  Evidence: Genie (Raspberry Pi 4, GPIO wake button, APA102 LED feedback ring)
  Hardware: Raspberry Pi 4, GPIO, APA102 LEDs *(labeled Hardware, not Tools, for precision)*

- **Environment-Based Configuration & API Credential Handling** — Shipped
  *(renamed from "API Key & Secrets Management" — using env vars across projects is real, but
  "secrets management" implies rotation/access-control practices I can't confirm)*
  Evidence: every AI project manages multiple provider keys via environment variables (4 LLM slots
  in Genie alone)

- **Configuration Validation & Startup Reliability** — Shipped
  *(renamed from "System & Agent Architecture Design," which duplicated the Agentic niche's
  orchestration entry — this version is scoped to the specific, distinct thing that's actually
  evidenced: fail-fast config validation)*
  Evidence: Genie (every skill declares a manifest; missing/invalid fields fail loudly at boot, not
  mid-conversation)

Tools: Raspberry Pi OS, SSH, Bash

---

## 6. Product Strategy & Client Delivery
*Deciding what to build, proving it matters, delivering it.*

- **Problem Discovery & Scoping** — Shipped
  Evidence: CaseWise (spotted the legal-intake bottleneck firsthand from 7 years inside ops),
  BarHunter (identified recruiters' manual research pain directly)

- **Stakeholder Pitching & Buy-in** — Shipped
  Evidence: CaseWise — your own documented project scope includes "C-suite pitching" directly (not
  just outcomes that happened to you). Resulted in a $5,000 Product School scholarship from the CEO,
  a CTO directive to integrate into the core system, and a public CISO endorsement. This is your
  strongest, most verifiable proof point on the whole site — make sure it's not buried.

- **MVP Scoping & Iteration** — Shipped
  Evidence: Genie (staged V1 → V2 → V3 build), CaseWise (prototype → CTO-backed core-system path)

- **Client Discovery & Delivery** — Shipped
  *(the relationship/delivery side of Fhoneman — distinct from the technical build listed under
  Full-Stack Product Engineering)*
  Evidence: Fhoneman — scoped, built, and delivered a live site for a real external client

- **Product Management** — Shipped
  Evidence: CaseWise (problem discovery, MVP development, C-suite pitching — documented in your own
  project scope, not just certifications)
  Credential: 6 Product School certifications, CEO-sponsored (supporting evidence, not the sole basis
  for this tag)

---

## Status: content fully confirmed, no open items

Everything below was confirmed with you directly:
- MCP Server Development → Applied (personal/internal, confirmed)
- Telephony → stays Studying, the real WIP voice infra project intentionally not surfaced yet
- Browser Extension Development → upgraded to Shipped (CaseWise V1 history — genuinely good detail)
- Railway/Streamlit → confirmed real, added to tools; Render/Fly.io/Windsurf dropped
- Google Cloud + self-hosted deployment → added as a new skill (Infrastructure niche)
- RAG / Multi-Agent Coordination / Model Evaluation → confirmed Studying, actively converting to real
  work as your own agentic systems project develops
- Local LLM Deployment & Testing → upgraded to Applied (Ollama + LM Studio, run on your own hardware)

This is ready to move from content planning into actually building the tree UI whenever you are.
