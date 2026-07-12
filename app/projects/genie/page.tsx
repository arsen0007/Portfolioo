'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { colorMix, themeColors } from '@/lib/constants/colors';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
});

const pipelineNodes = [
  {
    id: '00',
    stage: 'Wake',
    name: 'Wake Word / Button',
    color: themeColors.textMuted as string,
    borderColor: 'var(--surface-border-strong)',
    description:
      '"hey_jarvis" via OpenWakeWord or GPIO button on pin 17 triggers the conversation loop.',
    muted: true,
  },
  {
    id: '01',
    stage: 'Stage 1',
    name: 'Pending State',
    color: themeColors.purple,
    borderColor: colorMix(themeColors.purple, 26),
    description:
      'Skills with multi-turn state get routed back first — WhatsApp 3-step confirm, timer awaiting duration.',
    muted: false,
  },
  {
    id: '02',
    stage: 'Stage 2',
    name: 'Brain Intercept',
    color: themeColors.cyan,
    borderColor: colorMix(themeColors.cyan, 26),
    description:
      '"Switch to local model", "list models", "what mode are you in" — handled before any skill.',
    muted: false,
  },
  {
    id: '03',
    stage: 'Stage 3',
    name: 'Skill Router',
    color: themeColors.amber,
    borderColor: colorMix(themeColors.amber, 26),
    description:
      'Gemini 2.0 Flash receives all 19 skill manifests, returns matched names as JSON. LRU cached. ArgumentExtractor pulls typed args in a separate LLM call.',
    muted: false,
  },
  {
    id: '04',
    stage: 'Stage 4',
    name: 'LLM Fallback',
    color: themeColors.blue,
    borderColor: colorMix(themeColors.blue, 26),
    description:
      'Full system prompt + 4-turn history + memory block. Reached only when no skill matched.',
    muted: false,
  },
] as const;

const lessons = [
  {
    number: '01',
    label: 'Skills-First Dispatch',
    color: themeColors.purple,
    title: 'Put LLM at stage 4, not stage 1.',
    body: 'Most requests hit the cached skill router — the LLM is the exception. Latency and cost drop dramatically when the routing logic is cheap and the expensive call is the fallback, not the default.',
  },
  {
    number: '02',
    label: 'The Resampling Bug',
    color: themeColors.amber,
    title: 'Some bugs are hardware, not code.',
    body: "OpenWakeWord expects 16kHz mono. PipeWire runs at 48kHz stereo. Detection dropped from 0.33 to 0.025. Fix: scipy polyphase downsample 3:1, take channel 0. It looked like a model failure until it wasn't.",
  },
  {
    number: '03',
    label: 'Barge-In Is Done — Architecturally',
    color: themeColors.cyan,
    title: 'Hardware limitations trump clean code.',
    body: "threading.Event propagates cleanly through TTS, skills, and the LLM layer. But the mic hears the speaker. The architecture is correct. The physics isn't. V3 will fix it in software with AEC.",
  },
  {
    number: '04',
    label: 'Memory Injection Strategy',
    color: themeColors.blue,
    title: 'Inject on every turn, not selectively.',
    body: 'Sending extra tokens on every turn costs more. Missing context costs more conversations. Always-inject wins in practice until semantic retrieval is reliable enough to replace it.',
  },
] as const;

const stackLayers = [
  {
    name: 'Hardware',
    items: ['Raspberry Pi 4', 'Seeed 2-Mic HAT', 'APA102 LEDs', 'Pi Camera', 'GPIO'],
  },
  {
    name: 'Voice Layer',
    items: ['OpenWakeWord', 'Sarvam STT', 'Deepgram TTS', 'sounddevice', 'pygame', 'scipy'],
  },
  {
    name: 'LLM Layer',
    items: ['Gemini 2.0 Flash', 'NVIDIA NIM', 'Groq', 'LM Studio'],
  },
  {
    name: 'Runtime',
    items: ['Python 3.11', 'ToolManifest', 'ExecutionContext', 'Google Calendar API', 'Spotify API', 'WhatsApp'],
  },
] as const;

const v3Items = [
  {
    title: 'Vector memory',
    body: 'Replace flat facts.json keyword search with embeddings-based retrieval.',
  },
  {
    title: 'Software AEC pipeline',
    body: 'Acoustic echo cancellation so barge-in actually works.',
  },
  {
    title: 'Better wake word reliability',
    body: 'Robustness improvements across room acoustics and distances.',
  },
] as const;

const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 12 12"
    aria-hidden="true"
  >
    <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
  </svg>
);

export default function GeniePage() {
  return (
    <main className="dot-grid relative min-h-screen pb-24">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 82% 52% at 50% 0%, color-mix(in srgb, var(--purple) 20%, transparent), transparent)',
            'radial-gradient(ellipse 50% 40% at 2% 65%, color-mix(in srgb, var(--cyan) 10%, transparent), transparent)',
            'radial-gradient(ellipse 42% 36% at 100% 88%, color-mix(in srgb, var(--amber) 9%, transparent), transparent)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28">

        {/* ── BACK NAV ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0)}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-textMuted transition-colors hover:text-textPrimary"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M9 2.5 4.5 7 9 11.5" />
            </svg>
            All projects
          </Link>
        </motion.div>

        {/* ── SECTION 1: HERO ───────────────────────────────────────── */}
        <motion.div className="mt-10" {...fadeUp(0.04)}>
          {/* V3 Upcoming chip */}
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1"
            style={{
              borderColor: colorMix(themeColors.amber, 32),
              background: colorMix(themeColors.amber, 8),
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: themeColors.amber, boxShadow: `0 0 8px ${themeColors.amber}` }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: themeColors.amber }}
            >
              V3 Upcoming
            </span>
          </div>

          {/* Category chips row */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                background: colorMix(themeColors.purple, 14),
                color: themeColors.purple,
                border: `1px solid ${colorMix(themeColors.purple, 28)}`,
              }}
            >
              Agent Runtime
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                background: colorMix(themeColors.green, 8),
                color: themeColors.green,
                border: `1px solid ${colorMix(themeColors.green, 20)}`,
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full available-pulse"
                style={{ background: themeColors.green, boxShadow: `0 0 8px ${themeColors.green}` }}
              />
              Active · Open Source · Hardware
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-display text-[52px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[72px]">
            Genie
          </h1>

          {/* Subheadline */}
          <p
            className="mt-4 font-display text-[20px] font-medium leading-tight tracking-[-0.02em] md:text-[26px]"
            style={{ color: themeColors.textSecondary }}
          >
            I built the agent. Not the app.
          </p>

          {/* Tagline */}
          <p className="mt-4 max-w-[600px] font-body text-[17px] leading-[1.8] text-textSecondary">
            I didn&apos;t want to just use an agent. I wanted to understand how one works. So I built
            the runtime — complete dispatch pipeline, memory system, LLM provider switching, and 19
            skills — running on Raspberry Pi hardware.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.18)}>
          <a
            href="https://github.com/arsen0007/Genie-Agent-Runtime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{
              borderColor: colorMix(themeColors.purple, 32),
              color: themeColors.purple,
              background: colorMix(themeColors.purple, 10),
            }}
          >
            View on GitHub
            <ArrowIcon />
          </a>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textMuted transition-colors hover:text-textPrimary"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            See other projects
          </Link>
        </motion.div>

        {/* Device placeholder */}
        <motion.div className="mt-10" {...fadeUp(0.24)}>
          <div
            className="bento-card relative overflow-hidden"
            style={{
              borderColor: colorMix(themeColors.purple, 24),
              background: `radial-gradient(ellipse 70% 90% at 50% 50%, ${colorMix(themeColors.purple, 12)}, var(--surface))`,
              minHeight: '200px',
            }}
          >
            <div className="bento-shimmer" />
            <div className="flex flex-col items-center justify-center gap-8 py-12 px-6">
              {/* LED state row */}
              <div className="flex items-start gap-8 md:gap-12">
                {[
                  { label: 'idle', color: colorMix(themeColors.purple, 55), glow: colorMix(themeColors.purple, 35) },
                  { label: 'listening', color: themeColors.cyan, glow: themeColors.cyan },
                  { label: 'processing', color: themeColors.amber, glow: themeColors.amber },
                  { label: 'speaking', color: themeColors.green, glow: themeColors.green },
                ].map((state) => (
                  <div key={state.label} className="flex flex-col items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: state.color,
                        boxShadow: `0 0 10px ${state.glow}, 0 0 22px ${colorMix(state.glow, 40)}`,
                      }}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-textMuted">
                      {state.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Label below LEDs */}
              <div className="text-center">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: colorMix(themeColors.purple, 70) }}
                >
                  APA102 LED Ring · Color State System
                </p>
                <p className="mt-1.5 font-body text-[13px] text-textMuted">
                  Device photos and demo clips coming — see GitHub for current hardware setup
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
            Device · Raspberry Pi 4 · APA102 LEDs · Seeed 2-Mic HAT · Pi Camera · GPIO Button
          </p>
        </motion.div>

        {/* ── SECTION 2: WHAT IT IS ────────────────────────────────── */}
        <motion.div className="mt-16" {...fadeUp(0.05)}>
          <div
            className="bento-card p-8 md:p-10"
            style={{
              borderColor: colorMix(themeColors.purple, 20),
              background: `radial-gradient(ellipse 60% 80% at 0% 110%, ${colorMix(themeColors.purple, 9)}, var(--surface))`,
            }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: themeColors.purple }}
            >
              What It Is
            </p>
            <h2 className="mt-4 font-display text-[22px] font-medium leading-snug tracking-tight text-textPrimary md:text-[26px]">
              A custom agent runtime built from scratch.
            </h2>
            <p className="mt-5 max-w-[680px] font-body text-[16px] leading-[1.85] text-textSecondary">
              Genie is a voice agent running on a Raspberry Pi 4 — not a wrapper around a cloud API,
              but a complete runtime written to understand how dispatch, memory, and multi-provider
              inference actually work at the implementation level. Every conversation turn runs through
              a 4-stage pipeline: pending state check, brain intercept for control commands, an LLM
              skill router with 19 registered skills, and an LLM fallback. Four named model slots,
              nine registered providers, all swappable by voice.
            </p>
            <a
              href="https://github.com/arsen0007/Genie-Agent-Runtime"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
              style={{ color: themeColors.purple }}
            >
              Full docs on GitHub
              <ArrowIcon />
            </a>
          </div>
        </motion.div>

        {/* ── SECTION 3: DISPATCH PIPELINE ─────────────────────────── */}
        <motion.div className="mt-4" {...fadeUp(0.08)}>
          <div
            className="bento-card p-7 md:p-8"
            style={{ borderColor: colorMix(themeColors.purple, 18) }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: themeColors.purple }}
            >
              Dispatch Pipeline
            </p>
            <h2 className="mt-4 font-display text-[22px] font-medium tracking-tight text-textPrimary md:text-[26px]">
              Every turn runs the same 4-stage pipeline.
            </h2>
            <p className="mt-3 max-w-[480px] font-body text-[14px] leading-[1.75] text-textMuted">
              LLM is stage 4, not stage 1. Skills route first — LLM is the fallback.
            </p>

            {/* Desktop pipeline */}
            <div className="mt-8 hidden overflow-x-auto md:block">
              <div className="flex min-w-[660px] items-stretch gap-1.5">
                {pipelineNodes.map((node, i) => (
                  <React.Fragment key={node.id}>
                    {/* Node card */}
                    <div
                      className="relative flex min-h-[210px] flex-1 flex-col rounded-[14px] border p-4 transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        borderColor: node.muted
                          ? 'var(--surface-border-strong)'
                          : colorMix(node.color, 24),
                        background: node.muted
                          ? colorMix(themeColors.textMuted, 6)
                          : `radial-gradient(ellipse 120% 45% at 50% 0%, ${colorMix(node.color, 14)}, var(--surface))`,
                      }}
                    >
                      {/* Top accent line */}
                      {!node.muted && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-4 top-0 h-px"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
                          }}
                        />
                      )}

                      {/* Number badge */}
                      <div
                        className="mb-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold"
                        style={
                          node.muted
                            ? {
                                background: colorMix(themeColors.textMuted, 14),
                                color: themeColors.textMuted,
                                border: `1px solid ${colorMix(themeColors.textMuted, 26)}`,
                              }
                            : {
                                background: colorMix(node.color, 20),
                                color: node.color,
                                border: `1px solid ${colorMix(node.color, 36)}`,
                              }
                        }
                      >
                        {node.id}
                      </div>

                      {/* Stage label */}
                      <p
                        className="font-mono text-[9px] uppercase tracking-[0.12em]"
                        style={{ color: node.muted ? themeColors.textMuted : node.color }}
                      >
                        {node.stage}
                      </p>

                      {/* Node name */}
                      <p className="mt-1.5 font-display text-[13px] font-semibold leading-tight text-textPrimary">
                        {node.name}
                      </p>

                      {/* Description */}
                      <p className="mt-2 font-body text-[11px] leading-[1.6] text-textMuted">
                        {node.description}
                      </p>
                    </div>

                    {/* Arrow connector */}
                    {i < pipelineNodes.length - 1 && (
                      <div className="flex shrink-0 items-center" style={{ width: '24px' }}>
                        <svg
                          width="24"
                          height="14"
                          viewBox="0 0 24 14"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M0 7H18M14 3L20 7L14 11"
                            stroke={colorMix(node.muted ? themeColors.textMuted : node.color, 36)}
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Mobile pipeline */}
            <div className="mt-6 space-y-2 md:hidden">
              {pipelineNodes.map((node, i) => (
                <div
                  key={node.id}
                  className="flex items-start gap-3 rounded-[12px] border p-4"
                  style={{
                    borderColor: node.muted
                      ? 'var(--surface-border-strong)'
                      : colorMix(node.color, 20),
                    background: node.muted
                      ? colorMix(themeColors.textMuted, 6)
                      : colorMix(node.color, 7),
                  }}
                >
                  {/* Left column: badge + connector line */}
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold"
                      style={
                        node.muted
                          ? {
                              background: colorMix(themeColors.textMuted, 16),
                              color: themeColors.textMuted,
                              border: `1px solid ${colorMix(themeColors.textMuted, 28)}`,
                            }
                          : {
                              background: colorMix(node.color, 22),
                              color: node.color,
                              border: `1px solid ${colorMix(node.color, 38)}`,
                            }
                      }
                    >
                      {node.id}
                    </div>
                    {i < pipelineNodes.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="w-px flex-1"
                        style={{
                          minHeight: '20px',
                          background: node.muted
                            ? colorMix(themeColors.textMuted, 18)
                            : colorMix(node.color, 20),
                        }}
                      />
                    )}
                  </div>

                  {/* Right column: content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-mono text-[9px] uppercase tracking-[0.1em]"
                      style={{ color: node.muted ? themeColors.textMuted : node.color }}
                    >
                      {node.stage}
                    </p>
                    <p className="mt-1 font-display text-[14px] font-medium text-textPrimary">
                      {node.name}
                    </p>
                    <p className="mt-1 font-body text-[12px] leading-[1.6] text-textMuted">
                      {node.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 4: IN THE WILD ───────────────────────────────── */}
        <motion.div className="mt-4" {...fadeUp(0.1)}>
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: themeColors.purple }}
          >
            In The Wild
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Photo placeholder */}
            <div>
              <div
                className="bento-card relative overflow-hidden"
                style={{
                  borderColor: colorMix(themeColors.purple, 26),
                  background: `radial-gradient(ellipse 90% 90% at 50% 50%, ${colorMix(themeColors.purple, 11)}, var(--surface))`,
                  aspectRatio: '4 / 3',
                }}
              >
                <div className="bento-shimmer" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      background: colorMix(themeColors.purple, 16),
                      border: `1px solid ${colorMix(themeColors.purple, 32)}`,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      style={{ color: colorMix(themeColors.purple, 80) }}
                    >
                      <path d="M1 6a2 2 0 012-2h1.5l2-3h7l2 3H17a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V6z" />
                      <circle cx="10" cy="10.5" r="3" />
                    </svg>
                  </div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: colorMix(themeColors.purple, 70) }}
                  >
                    Photo placeholder
                  </p>
                </div>
                <div className="absolute left-4 top-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
                    Device Shot
                  </p>
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
                Raspberry Pi 4 · APA102 LEDs · Seeed 2-Mic HAT
              </p>
            </div>

            {/* Video placeholder */}
            <div>
              <div
                className="bento-card relative overflow-hidden"
                style={{
                  borderColor: colorMix(themeColors.purple, 26),
                  background: `radial-gradient(ellipse 90% 90% at 50% 50%, ${colorMix(themeColors.purple, 9)}, var(--surface))`,
                  aspectRatio: '16 / 9',
                }}
              >
                <div className="bento-shimmer" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
                    style={{
                      background: colorMix(themeColors.purple, 18),
                      border: `1px solid ${colorMix(themeColors.purple, 36)}`,
                      boxShadow: `0 0 24px ${colorMix(themeColors.purple, 28)}`,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="currentColor"
                      aria-hidden="true"
                      style={{ color: themeColors.purple, marginLeft: '2px' }}
                    >
                      <path d="M4 2.5l12 6.5-12 6.5V2.5z" />
                    </svg>
                  </div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: colorMix(themeColors.purple, 70) }}
                  >
                    Demo clip coming
                  </p>
                </div>
                <div className="absolute left-4 top-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
                    Voice Demo
                  </p>
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
                Genie introducing himself
              </p>
            </div>
          </div>

          <p className="mt-4 font-body text-[13px] leading-[1.7] text-textMuted">
            Photos and video clips being added —{' '}
            <a
              href="https://github.com/arsen0007/Genie-Agent-Runtime"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-60"
              style={{ color: themeColors.purple }}
            >
              check the GitHub repo for current demos →
            </a>
          </p>
        </motion.div>

        {/* ── SECTION 5: WHAT I LEARNED ────────────────────────────── */}
        <motion.div className="mt-6" {...fadeUp(0.06)}>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: themeColors.purple }}
          >
            What Building This Taught Me
          </p>
          <h2 className="mt-4 font-display text-[24px] font-medium tracking-tight text-textPrimary md:text-[28px]">
            The lessons that stuck.
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {lessons.map((lesson, i) => (
              <motion.div key={lesson.number} className="h-full" {...fadeUp(0.08 + i * 0.06)}>
                <div
                  className="bento-card relative h-full overflow-hidden transition-all duration-200"
                  style={{
                    borderColor: colorMix(lesson.color, 22),
                    background: colorMix(lesson.color, 6),
                  }}
                >
                  {/* Left border accent */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-5 left-0 top-5 w-[3px] rounded-r-full"
                    style={{
                      background: lesson.color,
                      boxShadow: `0 0 10px ${colorMix(lesson.color, 55)}`,
                    }}
                  />

                  {/* Content */}
                  <div className="p-6 pl-8">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="font-mono text-[10px]"
                        style={{ color: colorMix(lesson.color, 55) }}
                      >
                        {lesson.number}
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.12em]"
                        style={{ color: lesson.color }}
                      >
                        {lesson.label}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[17px] font-semibold leading-snug text-textPrimary">
                      {lesson.title}
                    </h3>
                    <p className="mt-2.5 font-body text-[13px] leading-[1.78] text-textSecondary">
                      {lesson.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 6: STACK + V3 TEASER ─────────────────────────── */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          {/* Stack card */}
          <motion.div {...fadeUp(0.12)}>
            <div
              className="bento-card h-full p-7"
              style={{ borderColor: colorMix(themeColors.purple, 20) }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: themeColors.purple }}
              >
                Tech Stack
              </p>
              <h3 className="mt-3 font-display text-[18px] font-medium text-textPrimary">
                Grouped by layer.
              </h3>

              <div className="mt-6 space-y-5">
                {stackLayers.map((layer) => (
                  <div key={layer.name}>
                    <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-textMuted">
                      {layer.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.items.map((item) => (
                        <span key={item} className="tech-badge">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* V3 teaser card */}
          <motion.div {...fadeUp(0.16)}>
            <div
              className="bento-card relative h-full overflow-hidden p-7"
              style={{
                borderColor: colorMix(themeColors.amber, 42),
                borderStyle: 'dashed',
                background: `radial-gradient(ellipse 100% 70% at 50% 110%, ${colorMix(themeColors.amber, 14)}, var(--surface))`,
              }}
            >
              {/* Amber scan-line */}
              <div
                aria-hidden="true"
                className="scan-line"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colorMix(themeColors.amber, 58)}, transparent)`,
                }}
              />

              {/* V3 chip */}
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1"
                style={{
                  borderColor: colorMix(themeColors.amber, 36),
                  background: colorMix(themeColors.amber, 12),
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: themeColors.amber,
                    boxShadow: `0 0 8px ${themeColors.amber}`,
                  }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: themeColors.amber }}
                >
                  V3 — Upcoming
                </span>
              </div>

              <h3 className="font-display text-[20px] font-semibold text-textPrimary">
                What&apos;s next for Genie.
              </h3>

              <ul className="mt-5 space-y-4">
                {v3Items.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: themeColors.amber,
                        boxShadow: `0 0 8px ${themeColors.amber}`,
                      }}
                    />
                    <div>
                      <p className="font-display text-[14px] font-semibold text-textPrimary">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-body text-[12px] leading-[1.65] text-textMuted">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="mt-6 border-t pt-5"
                style={{ borderColor: colorMix(themeColors.amber, 20) }}
              >
                <a
                  href="https://github.com/arsen0007/Genie-Agent-Runtime"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
                  style={{ color: themeColors.amber }}
                >
                  Follow the build on GitHub
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── CLOSING CTA ───────────────────────────────────────────── */}
        <motion.div className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.3)}>
          <a
            href="https://github.com/arsen0007/Genie-Agent-Runtime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{
              borderColor: colorMix(themeColors.purple, 32),
              color: themeColors.purple,
              background: colorMix(themeColors.purple, 10),
            }}
          >
            View GitHub Repo
            <ArrowIcon />
          </a>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textMuted transition-colors hover:text-textPrimary"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            See other projects
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
