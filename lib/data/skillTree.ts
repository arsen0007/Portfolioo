import type { AccentColor } from '@/lib/constants/colors';

export type SkillStatus = 'shipped' | 'applied' | 'studying';

export type Skill = {
  id: string;
  name: string;
  status: SkillStatus;
  evidenceProjectIds?: string[]; // only set when status is 'shipped' and tied to a real project
  note: string; // short evidence/context line, shown on hover tooltip
  tools: string[];
};

export type Niche = {
  id: string;
  name: string;
  color: AccentColor;
  skills: Skill[];
};

export const niches: Niche[] = [
  {
    id: 'llm-engineering',
    name: 'LLM Engineering',
    color: 'blue',
    skills: [
      {
        id: 'prompt-engineering',
        name: 'Prompt Engineering',
        status: 'shipped',
        evidenceProjectIds: ['casewise', 'genie'],
        note: 'CaseWise classification/summarization prompts, Genie skill-routing prompts.',
        tools: ['Gemini API', 'Gemini 2.0 Flash', 'GPT', 'Claude', 'DeepSeek'],
      },
      {
        id: 'skill-dispatch-structured-output',
        name: 'Skill Dispatch & Structured Output Extraction',
        status: 'shipped',
        evidenceProjectIds: ['genie', 'casewise'],
        note: 'Genie skill dispatch + argument extraction per skill; CaseWise structured classification/summary outputs.',
        tools: [],
      },
      {
        id: 'multi-provider-llm',
        name: 'Multi-Provider LLM Integration & Model Selection',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie routes across 9 models spread over 4 swappable provider slots.',
        tools: ['OpenRouter', 'Ollama', 'NVIDIA NIM', 'Groq', 'Gemini', 'Claude', 'GPT', 'DeepSeek'],
      },
      {
        id: 'model-evaluation-selection',
        name: 'Model Evaluation & Selection',
        status: 'studying',
        note: 'Real usage judgment from swapping models live, but no formal evaluation process yet.',
        tools: [],
      },
      {
        id: 'rag',
        name: 'Retrieval-Augmented Generation (RAG)',
        status: 'studying',
        note: 'Coming as the in-progress agentic systems build matures.',
        tools: [],
      },
      {
        id: 'local-llm-deployment',
        name: 'Local LLM Deployment & Testing',
        status: 'applied',
        note: 'Runs models locally on personal hardware for testing via Ollama and LM Studio.',
        tools: ['Ollama', 'LM Studio'],
      },
    ],
  },
  {
    id: 'agentic-systems-automation',
    name: 'Agentic Systems & Automation',
    color: 'purple',
    skills: [
      {
        id: 'agent-dispatch-orchestration',
        name: 'Agent Dispatch & Orchestration Pipelines',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: wake word -> pending-state check -> brain intercept -> LLM router with LRU cache -> arg extraction -> skill execution -> LLM fallback.',
        tools: [],
      },
      {
        id: 'context-memory-management',
        name: 'Context & Memory Management',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: empirically-tuned 12-turn short-term window plus long-term facts.json keyword-match memory.',
        tools: [],
      },
      {
        id: 'mcp-server-development',
        name: 'MCP Server Development',
        status: 'applied',
        note: 'Built custom MCP servers under Claude Code for personal/internal tooling.',
        tools: ['Claude Code'],
      },
      {
        id: 'human-in-the-loop',
        name: 'Human-in-the-Loop Workflow Design',
        status: 'shipped',
        evidenceProjectIds: ['casewise'],
        note: 'CaseWise: AI drafts classification and summary, human reviews and approves before it commits to the core system.',
        tools: [],
      },
      {
        id: 'browser-automation',
        name: 'Browser Automation',
        status: 'shipped',
        evidenceProjectIds: ['casewise'],
        note: 'CaseWise: DOM scraping and interaction with UCMS.',
        tools: ['Playwright'],
      },
      {
        id: 'web-scraping-data-extraction',
        name: 'Web Scraping & Data Extraction',
        status: 'shipped',
        evidenceProjectIds: ['barhunter'],
        note: 'BarHunter: scraping across state bar and law society sites.',
        tools: ['httpx', 'BeautifulSoup'],
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        status: 'shipped',
        evidenceProjectIds: ['mailmerge', 'casewise'],
        note: 'Mail Merge Tool dedup/clean/export pipeline; CaseWise 3-stage classification -> summary -> outreach workflow.',
        tools: [],
      },
      {
        id: 'multi-agent-coordination',
        name: 'Multi-Agent Coordination',
        status: 'studying',
        note: 'Genie is one sophisticated agent, not multiple agents coordinating yet — coming as the in-progress agentic systems build matures.',
        tools: ['LangChain', 'n8n'],
      },
    ],
  },
  {
    id: 'voice-ai-telephony',
    name: 'Voice AI & Telephony',
    color: 'cyan',
    skills: [
      {
        id: 'stt-integration',
        name: 'Speech-to-Text Integration',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: Sarvam AI STT.',
        tools: ['Sarvam AI'],
      },
      {
        id: 'tts-pipelined-playback',
        name: 'Text-to-Speech & Pipelined Playback',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: Deepgram TTS with sentence-level pipelined synthesis — playback starts before the full response finishes generating.',
        tools: ['Deepgram'],
      },
      {
        id: 'wake-word-audio-tuning',
        name: 'Wake-Word Detection & Audio Tuning',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: OpenWakeWord, plus a real fix — a 48kHz to 16kHz sample-rate mismatch resolved via scipy resampling that restored wake-word detection (score went from 0.025 to 0.33).',
        tools: ['OpenWakeWord', 'scipy'],
      },
      {
        id: 'voice-latency-tuning',
        name: 'Voice Pipeline Latency Tuning',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: sentence-level pipelined TTS plus the resampling fix above.',
        tools: [],
      },
      {
        id: 'telephony-integration',
        name: 'Telephony Integration',
        status: 'studying',
        note: 'Building a separate voice infrastructure project — in progress, not yet ready to surface as shipped.',
        tools: ['Exotel', 'Twilio', 'ElevenLabs'],
      },
    ],
  },
  {
    id: 'fullstack-product-engineering',
    name: 'Full-Stack Product Engineering',
    color: 'green',
    skills: [
      {
        id: 'fullstack-web-app-dev',
        name: 'Full-Stack Web App Development',
        status: 'shipped',
        evidenceProjectIds: ['barhunter', 'casewise', 'mailmerge'],
        note: 'Next.js/TypeScript end to end, deployed on Vercel.',
        tools: ['Next.js', 'TypeScript', 'Vercel', 'Streamlit', 'GitHub', 'Git', 'VS Code', 'Cursor'],
      },
      {
        id: 'backend-api-development',
        name: 'Backend & API Development',
        status: 'shipped',
        evidenceProjectIds: ['barhunter', 'casewise'],
        note: 'BarHunter recruiter dashboard APIs, CaseWise workflow backend.',
        tools: ['Postman'],
      },
      {
        id: 'database-design-rls',
        name: 'Database Design & Row-Level Security',
        status: 'shipped',
        evidenceProjectIds: ['barhunter'],
        note: 'BarHunter: Supabase/PostgreSQL with RLS policies.',
        tools: ['Supabase', 'PostgreSQL'],
      },
      {
        id: 'data-cleanup-csv',
        name: 'Data Cleanup & CSV Processing',
        status: 'shipped',
        evidenceProjectIds: ['mailmerge'],
        note: 'Mail Merge Tool: dedup, column splitting, cleaned export.',
        tools: [],
      },
      {
        id: 'client-website-dev',
        name: 'Client Website Development',
        status: 'shipped',
        evidenceProjectIds: ['fhoneman'],
        note: 'Fhoneman: booking flow, emergency-inquiry capture, custom form logic.',
        tools: [],
      },
      {
        id: 'browser-extension-dev',
        name: 'Browser Extension Development',
        status: 'shipped',
        evidenceProjectIds: ['casewise'],
        note: 'CaseWise V1 shipped as a Chrome extension (Manifest V3, content scripts) before evolving into a direct UCMS API integration.',
        tools: [],
      },
      {
        id: 'self-hosted-cloud-deployment',
        name: 'Self-Hosted & Cloud Compute Deployment',
        status: 'applied',
        note: 'Deploys agent workloads to a personal Raspberry Pi and Google Cloud compute instances, not just PaaS platforms.',
        tools: ['Google Cloud', 'Railway'],
      },
    ],
  },
  {
    id: 'infrastructure-security-edge',
    name: 'Infrastructure, Security & Edge Systems',
    color: 'amber',
    skills: [
      {
        id: 'linux-sysadmin',
        name: 'Linux System Administration',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie runs headless on a Raspberry Pi — real terminal/bash/SSH/service-management work to keep a 24/7 assistant alive.',
        tools: ['Raspberry Pi OS', 'SSH', 'Bash'],
      },
      {
        id: 'embedded-edge-hardware',
        name: 'Embedded / Edge Hardware Integration',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: Raspberry Pi 4, GPIO wake button, APA102 LED feedback ring.',
        tools: ['Raspberry Pi 4', 'GPIO', 'APA102 LEDs'],
      },
      {
        id: 'env-config-api-credentials',
        name: 'Environment-Based Configuration & API Credential Handling',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Every AI project manages multiple provider keys via environment variables — 4 LLM slots in Genie alone.',
        tools: [],
      },
      {
        id: 'config-validation-startup-reliability',
        name: 'Configuration Validation & Startup Reliability',
        status: 'shipped',
        evidenceProjectIds: ['genie'],
        note: 'Genie: every skill declares a manifest; missing or invalid fields fail loudly at boot, not mid-conversation.',
        tools: [],
      },
    ],
  },
  {
    id: 'product-strategy-client-delivery',
    name: 'Product Strategy & Client Delivery',
    color: 'blue',
    skills: [
      {
        id: 'problem-discovery-scoping',
        name: 'Problem Discovery & Scoping',
        status: 'shipped',
        evidenceProjectIds: ['casewise', 'barhunter'],
        note: 'Spotted the legal-intake bottleneck firsthand from 7 years inside ops (CaseWise); identified recruiters’ manual research pain directly (BarHunter).',
        tools: [],
      },
      {
        id: 'stakeholder-pitching-buyin',
        name: 'Stakeholder Pitching & Buy-in',
        status: 'shipped',
        evidenceProjectIds: ['casewise'],
        note: 'CaseWise’s own project scope includes C-suite pitching directly. Resulted in a $5,000 Product School scholarship from the CEO, a CTO directive to integrate into the core system, and a public CISO endorsement.',
        tools: [],
      },
      {
        id: 'mvp-scoping-iteration',
        name: 'MVP Scoping & Iteration',
        status: 'shipped',
        evidenceProjectIds: ['genie', 'casewise'],
        note: 'Genie staged V1 -> V2 -> V3; CaseWise went prototype -> CTO-backed core system.',
        tools: [],
      },
      {
        id: 'client-discovery-delivery',
        name: 'Client Discovery & Delivery',
        status: 'shipped',
        evidenceProjectIds: ['fhoneman'],
        note: 'Fhoneman: scoped, built, and delivered a live site for a real external client.',
        tools: [],
      },
      {
        id: 'product-management',
        name: 'Product Management',
        status: 'shipped',
        evidenceProjectIds: ['casewise'],
        note: 'CaseWise: problem discovery, MVP development, C-suite pitching. Backed by 6 CEO-sponsored Product School certifications.',
        tools: [],
      },
    ],
  },
];
