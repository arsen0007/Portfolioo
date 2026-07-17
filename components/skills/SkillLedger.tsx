'use client';

import { useState } from 'react';
import Link from 'next/link';
import { themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';
import { niches, type SkillStatus } from '@/lib/data/skillTree';
import { projects } from '@/lib/data/projects';

const accentByColor: Record<AccentColor, string> = {
  blue: themeColors.blue,
  green: themeColors.green,
  cyan: themeColors.cyan,
  amber: themeColors.amber,
  purple: themeColors.purple,
};

function StatusDot({ accent, status }: { accent: string; status: SkillStatus }) {
  const filled = status === 'shipped' ? accent : `color-mix(in srgb, ${accent} 55%, transparent)`;

  return (
    <span
      aria-hidden="true"
      style={{
        background: filled,
        border: `1.5px solid ${accent}`,
        borderRadius: '999px',
        display: 'inline-block',
        flexShrink: 0,
        height: 6,
        width: 6,
      }}
    />
  );
}

function Chevron({ color, open }: { color: string; open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="11"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
      viewBox="0 0 10 10"
      width="11"
    >
      <path d="M2 3.5L5 6.5L8 3.5" />
    </svg>
  );
}

// A plain, readable ledger — no canvas, no graph metaphor. One layout for every screen size.
export function SkillLedger() {
  const [openNiches, setOpenNiches] = useState<Set<string>>(new Set());
  const [openSkills, setOpenSkills] = useState<Set<string>>(new Set());

  function toggleNiche(id: string) {
    setOpenNiches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSkill(id: string) {
    setOpenSkills((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-start gap-3 px-4 pb-20 pt-4 md:grid-cols-2 md:gap-4">
      {niches.map((niche) => {
        const accent = accentByColor[niche.color];
        const nicheOpen = openNiches.has(niche.id);
        const panelId = `niche-panel-${niche.id}`;

        return (
          <div
            key={niche.id}
            style={{
              background: 'var(--surface)',
              border: `1px solid color-mix(in srgb, ${accent} ${nicheOpen ? 40 : 22}%, var(--surface-border))`,
              borderRadius: '14px',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            <button
              aria-controls={panelId}
              aria-expanded={nicheOpen}
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => toggleNiche(niche.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '16px 18px' }}
              type="button"
            >
              <span>
                <span
                  style={{
                    color: 'var(--text-primary)',
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {niche.name}
                </span>
                <span
                  style={{
                    color: 'var(--text-muted)',
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    marginTop: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {niche.skills.length} skills
                </span>
              </span>
              <Chevron color={accent} open={nicheOpen} />
            </button>

            {nicheOpen ? (
              <div
                id={panelId}
                style={{
                  borderTop: `1px solid color-mix(in srgb, ${accent} 16%, var(--surface-border))`,
                  padding: '4px 18px 14px',
                }}
              >
                {niche.skills.map((skill) => {
                  const sid = `${niche.id}__${skill.id}`;
                  const hasTools = skill.tools.length > 0;
                  const skillOpen = openSkills.has(sid);
                  const evidenceProjects = projects.filter((p) => skill.evidenceProjectIds?.includes(p.id));
                  const statusColor =
                    skill.status === 'shipped' ? accent : `color-mix(in srgb, ${accent} 60%, var(--text-muted))`;
                  const toolsPanelId = `${sid}-tools`;

                  return (
                    <div key={sid} style={{ borderTop: '1px solid var(--surface-border)', padding: '12px 0' }}>
                      {hasTools ? (
                        <button
                          aria-controls={toolsPanelId}
                          aria-expanded={skillOpen}
                          className="flex w-full items-center justify-between gap-2 text-left"
                          onClick={() => toggleSkill(sid)}
                          style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                          type="button"
                        >
                          <span
                            style={{
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-display)',
                              fontSize: 13,
                              fontWeight: 600,
                              lineHeight: 1.35,
                            }}
                          >
                            {skill.name}
                          </span>
                          <Chevron color={accent} open={skillOpen} />
                        </button>
                      ) : (
                        <p
                          style={{
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-display)',
                            fontSize: 13,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            margin: 0,
                          }}
                        >
                          {skill.name}
                        </p>
                      )}

                      {skill.status === 'shipped' && evidenceProjects.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                          {evidenceProjects.map((p, pi) => (
                            <span key={p.id} style={{ alignItems: 'center', display: 'inline-flex', gap: 4 }}>
                              <Link
                                href={`/projects/${p.id}`}
                                style={{
                                  color: accent,
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: 9,
                                  letterSpacing: '0.06em',
                                  textDecoration: 'none',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {p.name}
                              </Link>
                              {pi < evidenceProjects.length - 1 ? <span style={{ color: 'var(--text-muted)' }}>·</span> : null}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div style={{ alignItems: 'center', display: 'flex', gap: 6, marginTop: 7 }}>
                        <StatusDot accent={accent} status={skill.status} />
                        <p
                          style={{
                            color: statusColor,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            fontWeight: skill.status === 'shipped' ? 700 : 400,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {skill.status}
                          {hasTools ? ` · ${skill.tools.length} tools` : ''}
                        </p>
                      </div>

                      {hasTools && skillOpen ? (
                        <div id={toolsPanelId} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                          {skill.tools.map((tool) => (
                            <span
                              key={tool}
                              style={{
                                background: `color-mix(in srgb, ${accent} 10%, var(--surface))`,
                                border: `1px solid color-mix(in srgb, ${accent} 28%, var(--surface-border))`,
                                borderRadius: '999px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                padding: '4px 10px',
                              }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
