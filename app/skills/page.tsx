'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from '@xyflow/react';
import { themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';
import { niches, type Niche, type Skill } from '@/lib/data/skillTree';
import { projects, type Project } from '@/lib/data/projects';

const accentByColor: Record<AccentColor, string> = {
  blue: themeColors.blue,
  green: themeColors.green,
  cyan: themeColors.cyan,
  amber: themeColors.amber,
  purple: themeColors.purple,
};

// ─── Layout constants ────────────────────────────────────────────────────────

const TOOL_SPACING_X = 160;
const TOOL_NODE_WIDTH_EST = 140;
const SKILL_COLUMN_MIN = 220;
const SKILL_GAP = 40;
const SKILL_ROW_Y = 200;
const NICHE_COLUMN_MIN = 240;
const NICHE_GAP = 60;
const TOOL_ROW_Y = 400;

// ─── Node data types ──────────────────────────────────────────────────────────

type NicheNodeData = {
  niche: Niche;
  isExpanded: boolean;
  onToggle: (id: string) => void;
};

type SkillNodeData = {
  skill: Skill;
  color: AccentColor;
  isExpanded: boolean;
  evidenceProjects: Project[];
  onToggle: (id: string) => void;
};

type ToolNodeData = {
  label: string;
  color: AccentColor;
};

// ─── Status → visual treatment ───────────────────────────────────────────────

function statusStyle(status: Skill['status'], accent: string, active: boolean) {
  const intensity = status === 'shipped' ? (active ? 55 : 30) : status === 'applied' ? (active ? 40 : 20) : (active ? 30 : 14);
  return {
    borderStyle: status === 'studying' ? 'dashed' : ('solid' as const),
    border: `1px ${status === 'studying' ? 'dashed' : 'solid'} color-mix(in srgb, ${accent} ${intensity}%, var(--surface-border))`,
    color: status === 'shipped' ? accent : `color-mix(in srgb, ${accent} 60%, var(--text-muted))`,
  };
}

// ─── Niche node ───────────────────────────────────────────────────────────────

function NicheNode({ id, data }: NodeProps) {
  const d = data as NicheNodeData;
  const [hover, setHover] = useState(false);
  const accent = accentByColor[d.niche.color];
  const active = hover || d.isExpanded;

  return (
    <div
      onClick={() => d.onToggle(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid color-mix(in srgb, ${accent} ${active ? 55 : 30}%, var(--surface-border))`,
        borderRadius: '14px',
        boxShadow: active
          ? `0 0 26px color-mix(in srgb, ${accent} 32%, transparent)`
          : `0 0 0 1px color-mix(in srgb, ${accent} 16%, transparent)`,
        cursor: 'pointer',
        maxWidth: '240px',
        minWidth: '210px',
        padding: '16px 18px',
        position: 'relative',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, margin: 0 }}>
          {d.niche.name}
        </p>
        <svg
          aria-hidden="true"
          fill="none"
          height="11"
          stroke={accent}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          style={{ flexShrink: 0, transform: d.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          viewBox="0 0 10 10"
          width="11"
        >
          <path d="M2 3.5L5 6.5L8 3.5" />
        </svg>
      </div>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', marginTop: 8, textTransform: 'uppercase' }}>
        {d.niche.skills.length} skills
      </p>

      <Handle
        position={Position.Bottom}
        style={{ background: accent, border: '2px solid var(--surface)', bottom: -4, height: 8, width: 8 }}
        type="source"
      />
    </div>
  );
}

// ─── Skill node ───────────────────────────────────────────────────────────────

function SkillNode({ id, data }: NodeProps) {
  const d = data as SkillNodeData;
  const [hover, setHover] = useState(false);
  const accent = accentByColor[d.color];
  const active = hover || d.isExpanded;
  const hasTools = d.skill.tools.length > 0;
  const style = statusStyle(d.skill.status, accent, active);

  return (
    <div
      onClick={hasTools ? () => d.onToggle(id) : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface)',
        border: style.border,
        borderRadius: '14px',
        boxShadow: active && hasTools
          ? `0 0 22px color-mix(in srgb, ${accent} 26%, transparent)`
          : 'none',
        cursor: hasTools ? 'pointer' : 'default',
        maxWidth: '230px',
        minWidth: '200px',
        padding: '13px 15px',
        position: 'relative',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <AnimatePresence>
        {hover ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            initial={{ opacity: 0, y: 4 }}
            style={{
              background: 'var(--surface-raised)',
              border: '0.5px solid var(--surface-border)',
              borderRadius: '10px',
              bottom: 'calc(100% + 10px)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              left: '50%',
              lineHeight: 1.5,
              maxWidth: '230px',
              padding: '8px 12px',
              pointerEvents: 'none',
              position: 'absolute',
              transform: 'translateX(-50%)',
              width: 'max-content',
              zIndex: 30,
            }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {d.skill.note}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Handle
        position={Position.Top}
        style={{ background: accent, border: '2px solid var(--surface)', height: 6, top: -3, width: 6 }}
        type="target"
      />

      <div style={{ alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>
          {d.skill.name}
        </p>
        {hasTools ? (
          <svg
            aria-hidden="true"
            fill="none"
            height="10"
            stroke={accent}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            style={{ flexShrink: 0, transform: d.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            viewBox="0 0 10 10"
            width="10"
          >
            <path d="M2 3.5L5 6.5L8 3.5" />
          </svg>
        ) : null}
      </div>

      {d.skill.status === 'shipped' && d.evidenceProjects.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {d.evidenceProjects.map((p, pi) => (
            <span key={p.id} style={{ alignItems: 'center', display: 'inline-flex', gap: 4 }}>
              <Link
                href={`/projects/${p.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: accent, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase' }}
              >
                {p.name}
              </Link>
              {pi < d.evidenceProjects.length - 1 ? <span style={{ color: 'var(--text-muted)' }}>·</span> : null}
            </span>
          ))}
        </div>
      ) : null}

      <p style={{ color: style.color, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.08em', marginTop: 6, textTransform: 'uppercase' }}>
        {d.skill.status}{hasTools ? ` · ${d.skill.tools.length} tools` : ''}
      </p>

      {hasTools ? (
        <Handle
          position={Position.Bottom}
          style={{ background: accent, border: '2px solid var(--surface)', bottom: -4, height: 8, width: 8 }}
          type="source"
        />
      ) : null}
    </div>
  );
}

// ─── Tool node ────────────────────────────────────────────────────────────────

function ToolNode({ data }: NodeProps) {
  const d = data as ToolNodeData;
  const accent = accentByColor[d.color];

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.85 }}
      style={{
        background: `color-mix(in srgb, ${accent} 10%, var(--surface))`,
        border: `1px solid color-mix(in srgb, ${accent} 28%, var(--surface-border))`,
        borderRadius: '999px',
        padding: '6px 14px',
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <Handle
        position={Position.Top}
        style={{ background: accent, border: '2px solid var(--surface)', height: 6, top: -3, width: 6 }}
        type="target"
      />
      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        {d.label}
      </span>
    </motion.div>
  );
}

// ─── Edge: thin line + 1 flowing particle ────────────────────────────────────

function TreeEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY });
  const color = (data?.color as string) ?? 'var(--connection-line)';

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeOpacity: 0.35, strokeWidth: 1.2 }} />
      <circle fill={color} opacity={0} r={2.6}>
        <animateMotion dur="1.8s" path={edgePath} repeatCount="indefinite" rotate="auto" />
        <animate attributeName="opacity" dur="1.8s" keyTimes="0;0.05;0.85;1" repeatCount="indefinite" values="0;1;1;0" />
      </circle>
    </>
  );
}

const nodeTypes = { niche: NicheNode, skill: SkillNode, tool: ToolNode };
const edgeTypes = { treeEdge: TreeEdge };

// ─── Re-frame the camera whenever branches open/close ────────────────────────

function FitViewOnChange({ triggerKey }: { triggerKey: string }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    fitView({ duration: 400, padding: 0.2 });
  }, [triggerKey, fitView]);

  return null;
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function skillNodeId(nicheId: string, skillId: string) {
  return `${nicheId}__${skillId}`;
}

function SkillTreeCanvas() {
  const [expandedNiches, setExpandedNiches] = useState<Set<string>>(new Set());
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  const toggleNiche = useCallback((id: string) => {
    setExpandedNiches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSkill = useCallback((id: string) => {
    setExpandedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const { nodes, edges } = useMemo(() => {
    const nicheNodes: Node[] = [];
    const skillNodes: Node[] = [];
    const toolNodes: Node[] = [];
    const treeEdges: Edge[] = [];

    // Pass 1 — compute each niche's required column width from its skills' own
    // required widths, so an expanded niche never collides with its neighbors.
    let cursor = 0;
    const nicheX: number[] = [];
    const nicheSkillWidths: number[][] = [];

    niches.forEach((niche) => {
      const nicheExpanded = expandedNiches.has(niche.id);
      let nicheWidth = 0;
      const skillWidths: number[] = [];

      if (nicheExpanded) {
        niche.skills.forEach((skill) => {
          const sid = skillNodeId(niche.id, skill.id);
          const toolCount = expandedSkills.has(sid) ? skill.tools.length : 0;
          const fanWidth = toolCount > 0 ? (toolCount - 1) * TOOL_SPACING_X + TOOL_NODE_WIDTH_EST : 0;
          const width = Math.max(SKILL_COLUMN_MIN, fanWidth);
          skillWidths.push(width);
        });
        nicheWidth = skillWidths.reduce((sum, w) => sum + w, 0) + (skillWidths.length - 1) * SKILL_GAP;
      }

      nicheSkillWidths.push(skillWidths);
      const columnWidth = Math.max(NICHE_COLUMN_MIN, nicheWidth);
      nicheX.push(cursor + columnWidth / 2);
      cursor += columnWidth + NICHE_GAP;
    });

    // Pass 2 — build nodes/edges using the widths computed above.
    niches.forEach((niche, ni) => {
      const nicheExpanded = expandedNiches.has(niche.id);
      const accent = `var(--${niche.color})`;

      nicheNodes.push({
        data: { niche, isExpanded: nicheExpanded, onToggle: toggleNiche },
        draggable: false,
        id: niche.id,
        position: { x: nicheX[ni], y: 0 },
        type: 'niche',
      });

      if (!nicheExpanded) return;

      const skillWidths = nicheSkillWidths[ni];
      const totalWidth = skillWidths.reduce((sum, w) => sum + w, 0) + (skillWidths.length - 1) * SKILL_GAP;
      let skillCursor = nicheX[ni] - totalWidth / 2;

      niche.skills.forEach((skill, si) => {
        const sid = skillNodeId(niche.id, skill.id);
        const width = skillWidths[si];
        const skillX = skillCursor + width / 2;
        skillCursor += width + SKILL_GAP;

        skillNodes.push({
          data: {
            color: niche.color,
            evidenceProjects: projects.filter((p) => skill.evidenceProjectIds?.includes(p.id)),
            isExpanded: expandedSkills.has(sid),
            onToggle: toggleSkill,
            skill,
          },
          draggable: false,
          id: sid,
          position: { x: skillX, y: SKILL_ROW_Y },
          type: 'skill',
        });

        treeEdges.push({
          data: { color: accent },
          id: `e-${sid}`,
          source: niche.id,
          target: sid,
          type: 'treeEdge',
        });

        if (!expandedSkills.has(sid) || skill.tools.length === 0) return;

        const startX = skillX - ((skill.tools.length - 1) * TOOL_SPACING_X) / 2;
        skill.tools.forEach((tool, ti) => {
          const toolId = `${sid}__${tool}`;
          toolNodes.push({
            data: { color: niche.color, label: tool },
            draggable: false,
            id: toolId,
            position: { x: startX + ti * TOOL_SPACING_X, y: TOOL_ROW_Y },
            type: 'tool',
          });
          treeEdges.push({
            data: { color: accent },
            id: `e-${toolId}`,
            source: sid,
            target: toolId,
            type: 'treeEdge',
          });
        });
      });
    });

    return { edges: treeEdges, nodes: [...nicheNodes, ...skillNodes, ...toolNodes] };
  }, [expandedNiches, expandedSkills, toggleNiche, toggleSkill]);

  const triggerKey = useMemo(
    () => `${Array.from(expandedNiches).sort().join('|')}::${Array.from(expandedSkills).sort().join('|')}`,
    [expandedNiches, expandedSkills]
  );

  return (
    <ReactFlow
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
      maxZoom={1.5}
      minZoom={0.1}
      nodes={nodes}
      nodesConnectable={false}
      nodesDraggable={false}
      nodeTypes={nodeTypes}
      panOnDrag
      style={{ background: 'transparent' }}
      zoomOnScroll
    >
      <FitViewOnChange triggerKey={triggerKey} />
    </ReactFlow>
  );
}

export default function SkillsPage() {
  return (
    <main className="dot-grid relative" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      {/* Spacer — clears the floating portfolio header (fixed, top:20px, height:62px) */}
      <div style={{ flexShrink: 0, height: '90px' }} />

      {/* Blank canvas — the tree is the entire page */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <SkillTreeCanvas />
      </div>
    </main>
  );
}
