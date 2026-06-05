'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from '@xyflow/react';
import type { AccentColor } from '@/lib/constants/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

type PipelineNodeData = {
  label: string;
  sublabel: string;
  layer: string;
  accent: AccentColor;
  status: 'active' | 'idle';
  metric?: string;
  metricLabel?: string;
};

type ProjectId = 'barhunter' | 'casewise';

// ─── BarHunter Pipeline ───────────────────────────────────────────────────────

const BH_NODES: Node[] = [
  {
    id: '1', type: 'pipeline', position: { x: 20, y: 0 },
    data: { label: 'US State Bars', sublabel: '50 jurisdictions · public registry', layer: 'source', accent: 'cyan', status: 'active' },
  },
  {
    id: '2', type: 'pipeline', position: { x: 300, y: 0 },
    data: { label: 'Law Society Exports', sublabel: 'Canadian provincial data', layer: 'source', accent: 'cyan', status: 'active' },
  },
  {
    id: '3', type: 'pipeline', position: { x: 160, y: 170 },
    data: { label: 'Scraping Pipeline', sublabel: 'Node.js · automated crawlers', layer: 'ingestion', accent: 'amber', status: 'active' },
  },
  {
    id: '4', type: 'pipeline', position: { x: 160, y: 340 },
    data: { label: 'Cleaning & Normalization', sublabel: 'Cross-jurisdiction data shaping', layer: 'processing', accent: 'blue', status: 'active' },
  },
  {
    id: '5', type: 'pipeline', position: { x: 160, y: 510 },
    data: { label: 'Supabase · PostgreSQL', sublabel: 'RLS · indexed · row-level security', layer: 'database', accent: 'green', status: 'active', metric: '100K+', metricLabel: 'leads stored' },
  },
  {
    id: '6', type: 'pipeline', position: { x: 20, y: 700 },
    data: { label: 'Conflict Check', sublabel: 'Pre-export validation logic', layer: 'logic', accent: 'amber', status: 'active' },
  },
  {
    id: '7', type: 'pipeline', position: { x: 300, y: 700 },
    data: { label: 'Recruiter Filters', sublabel: 'Location · practice area · tier', layer: 'logic', accent: 'blue', status: 'active' },
  },
  {
    id: '8', type: 'pipeline', position: { x: 160, y: 880 },
    data: { label: 'Recruiter Dashboard', sublabel: 'Next.js 14 · row level security', layer: 'interface', accent: 'blue', status: 'active', metric: '<60s', metricLabel: 'was hours of work' },
  },
  {
    id: '9', type: 'pipeline', position: { x: 20, y: 1060 },
    data: { label: 'CSV Export', sublabel: 'Campaign-ready outreach lists', layer: 'output', accent: 'green', status: 'active' },
  },
  {
    id: '10', type: 'pipeline', position: { x: 300, y: 1060 },
    data: { label: 'Admin Tracking', sublabel: 'Recruiter stats · audit log', layer: 'output', accent: 'purple', status: 'active' },
  },
];

const BH_EDGES: Edge[] = [
  { id: 'e1', source: '1', target: '3', type: 'pipeline', data: { color: 'var(--cyan)', dur: 1.8 } },
  { id: 'e2', source: '2', target: '3', type: 'pipeline', data: { color: 'var(--cyan)', dur: 2.3 } },
  { id: 'e3', source: '3', target: '4', type: 'pipeline', data: { color: 'var(--amber)', dur: 1.6 } },
  { id: 'e4', source: '4', target: '5', type: 'pipeline', data: { color: 'var(--blue)', dur: 1.9 } },
  { id: 'e5', source: '5', target: '6', type: 'pipeline', data: { color: 'var(--green)', dur: 2.0 } },
  { id: 'e6', source: '5', target: '7', type: 'pipeline', data: { color: 'var(--green)', dur: 1.7 } },
  { id: 'e7', source: '6', target: '8', type: 'pipeline', data: { color: 'var(--amber)', dur: 1.5 } },
  { id: 'e8', source: '7', target: '8', type: 'pipeline', data: { color: 'var(--blue)', dur: 2.1 } },
  { id: 'e9', source: '8', target: '9', type: 'pipeline', data: { color: 'var(--blue)', dur: 1.8 } },
  { id: 'e10', source: '8', target: '10', type: 'pipeline', data: { color: 'var(--blue)', dur: 2.4 } },
];

// ─── CaseWise Pipeline ────────────────────────────────────────────────────────

const CW_NODES: Node[] = [
  {
    id: '1', type: 'pipeline', position: { x: 160, y: 0 },
    data: { label: 'Case Description', sublabel: 'Structured intake form input', layer: 'input', accent: 'blue', status: 'active' },
  },
  {
    id: '2', type: 'pipeline', position: { x: 160, y: 170 },
    data: { label: 'AI Classification', sublabel: 'LLM · legal issue type mapping', layer: 'ai model', accent: 'purple', status: 'active' },
  },
  {
    id: '3', type: 'pipeline', position: { x: 0, y: 360 },
    data: { label: 'Summary Generation', sublabel: 'Structured case brief output', layer: 'ai output', accent: 'cyan', status: 'active' },
  },
  {
    id: '4', type: 'pipeline', position: { x: 320, y: 360 },
    data: { label: 'Issue Prediction', sublabel: 'Presenting legal issue', layer: 'ai output', accent: 'amber', status: 'active' },
  },
  {
    id: '5', type: 'pipeline', position: { x: 160, y: 540 },
    data: { label: 'Outreach Draft', sublabel: 'Attorney message generator', layer: 'generation', accent: 'cyan', status: 'active', metric: '96%', metricLabel: 'intake time reduced' },
  },
  {
    id: '6', type: 'pipeline', position: { x: 160, y: 720 },
    data: { label: 'Case Workflow Manager', sublabel: 'Review · approve · route', layer: 'interface', accent: 'green', status: 'active', metric: '433h', metricLabel: 'saved per month' },
  },
];

const CW_EDGES: Edge[] = [
  { id: 'e1', source: '1', target: '2', type: 'pipeline', data: { color: 'var(--blue)', dur: 1.8 } },
  { id: 'e2', source: '2', target: '3', type: 'pipeline', data: { color: 'var(--purple)', dur: 1.6 } },
  { id: 'e3', source: '2', target: '4', type: 'pipeline', data: { color: 'var(--purple)', dur: 2.1 } },
  { id: 'e4', source: '3', target: '5', type: 'pipeline', data: { color: 'var(--cyan)', dur: 1.9 } },
  { id: 'e5', source: '4', target: '5', type: 'pipeline', data: { color: 'var(--amber)', dur: 2.2 } },
  { id: 'e6', source: '5', target: '6', type: 'pipeline', data: { color: 'var(--cyan)', dur: 1.7 } },
];

// ─── Custom Node ──────────────────────────────────────────────────────────────

function PipelineNode({ data, selected }: NodeProps) {
  const d = data as PipelineNodeData;
  const av = `var(--${d.accent})`;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: `1px solid color-mix(in srgb, ${av} ${selected ? 60 : 26}%, var(--surface-border))`,
        borderRadius: '12px',
        cursor: 'default',
        maxWidth: '235px',
        minWidth: '210px',
        padding: '13px 17px',
        boxShadow: selected
          ? `0 0 0 2px color-mix(in srgb, ${av} 22%, transparent), 0 8px 32px rgba(0,0,0,0.14)`
          : `0 0 0 1px color-mix(in srgb, ${av} 18%, transparent), 0 2px 16px rgba(0,0,0,0.07)`,
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <Handle
        position={Position.Top}
        style={{ background: av, border: '2px solid var(--surface)', height: 8, top: -4, width: 8 }}
        type="target"
      />

      {/* Layer label + status dot */}
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: av, fontFamily: 'var(--font-mono, monospace)', fontSize: '7.5px', letterSpacing: '0.1em', opacity: 0.9, textTransform: 'uppercase' }}>
          {d.layer}
        </span>
        <span aria-hidden="true" style={{ background: 'var(--green)', borderRadius: '50%', boxShadow: '0 0 5px var(--green)', height: '5px', width: '5px' }} />
      </div>

      {/* Title */}
      <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display, sans-serif)', fontSize: '13px', fontWeight: 500, lineHeight: 1.3, marginBottom: '3px' }}>
        {d.label}
      </div>

      {/* Sublabel */}
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body, sans-serif)', fontSize: '10px', lineHeight: 1.5 }}>
        {d.sublabel}
      </div>

      {/* Metric badge */}
      {d.metric ? (
        <div style={{ alignItems: 'baseline', background: `color-mix(in srgb, ${av} 14%, transparent)`, borderRadius: '7px', display: 'flex', gap: '5px', marginTop: '10px', padding: '6px 10px' }}>
          <span style={{ color: av, fontFamily: 'var(--font-display, sans-serif)', fontSize: '16px', fontWeight: 600, lineHeight: 1 }}>
            {d.metric}
          </span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body, sans-serif)', fontSize: '9px' }}>
            {d.metricLabel}
          </span>
        </div>
      ) : null}

      <Handle
        position={Position.Bottom}
        style={{ background: av, border: '2px solid var(--surface)', bottom: -4, height: 8, width: 8 }}
        type="source"
      />
    </div>
  );
}

// ─── Custom Edge — thin line + 2 flowing particles ────────────────────────────

function PipelineEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY });
  const color = (data?.color as string) ?? 'var(--connection-line)';
  const durNum = (data?.dur as number) ?? 2;
  const dur = `${durNum}s`;
  const trailBegin = `-${(durNum * 0.48).toFixed(2)}s`;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeOpacity: 0.3, strokeWidth: 1.2 }} />

      <g aria-hidden="true">
        {/* leading particle */}
        <circle fill={color} opacity={0} r={3.2}>
          <animateMotion dur={dur} path={edgePath} repeatCount="indefinite" rotate="auto" />
          <animate attributeName="opacity" dur={dur} keyTimes="0;0.05;0.85;1" repeatCount="indefinite" values="0;1;1;0" />
        </circle>

        {/* trailing particle */}
        <circle fill={color} opacity={0} r={2}>
          <animateMotion begin={trailBegin} dur={dur} path={edgePath} repeatCount="indefinite" rotate="auto" />
          <animate attributeName="opacity" begin={trailBegin} dur={dur} keyTimes="0;0.05;0.85;1" repeatCount="indefinite" values="0;0.6;0.6;0" />
        </circle>
      </g>
    </>
  );
}

// ─── Stable type maps ─────────────────────────────────────────────────────────

const nodeTypes = { pipeline: PipelineNode };
const edgeTypes = { pipeline: PipelineEdge };

// ─── Keyed canvas — remounts on project switch, triggering fresh fitView ──────

function FlowCanvas({ project }: { project: ProjectId }) {
  const nodes = project === 'barhunter' ? BH_NODES : CW_NODES;
  const edges = project === 'barhunter' ? BH_EDGES : CW_EDGES;
  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  return (
    <ReactFlow
      edgeTypes={edgeTypes}
      edges={flowEdges}
      fitView
      fitViewOptions={{ maxZoom: 0.88, padding: 0.14 }}
      maxZoom={2.5}
      minZoom={0.25}
      nodeTypes={nodeTypes}
      nodes={flowNodes}
      nodesDraggable={false}
      nodesConnectable={false}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      panOnDrag
      zoomOnScroll
    >
      <Background color="var(--grid-line)" gap={28} size={1} variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

// ─── Project meta ─────────────────────────────────────────────────────────────

const PROJECTS = {
  barhunter: { color: 'var(--green)', edgeCount: 10, href: '/projects/barhunter', label: 'BarHunter', nodeCount: 10, sublabel: 'Lead engine · 100K+ sourced' },
  casewise: { color: 'var(--blue)', edgeCount: 6, href: '/projects/casewise', label: 'CaseWise', nodeCount: 6, sublabel: 'AI intake · 96% faster' },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  const [active, setActive] = useState<ProjectId>('barhunter');
  const proj = PROJECTS[active];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      {/* Spacer — clears the floating portfolio header (fixed, top:20px, height:62px) */}
      <div style={{ flexShrink: 0, height: '90px' }} />

      {/* ReactFlow canvas — fills remaining height above control strip */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <FlowCanvas key={active} project={active} />
      </div>

      {/* Bottom control strip — in document flow so canvas knows its bounds */}
      <div style={{ alignItems: 'center', display: 'flex', flexShrink: 0, justifyContent: 'center', padding: '12px 24px 20px' }}>
      <div
        style={{
          alignItems: 'center',
          backdropFilter: 'blur(16px)',
          background: 'color-mix(in srgb, var(--surface) 82%, transparent)',
          border: '1px solid var(--surface-border)',
          borderRadius: '999px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1), 0 0 0 1px color-mix(in srgb, var(--blue) 16%, transparent)',
          display: 'flex',
          gap: '12px',
          padding: '8px 8px 8px 20px',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Status */}
        <div style={{ alignItems: 'center', display: 'flex', gap: '6px' }}>
          <span aria-hidden="true" style={{ background: 'var(--green)', borderRadius: '50%', boxShadow: '0 0 6px var(--green)', flexShrink: 0, height: '6px', width: '6px' }} />
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '12px' }}>
            System Architecture
          </span>
        </div>

        {/* Divider */}
        <span style={{ background: 'var(--surface-border)', height: '16px', width: '1px' }} />

        {/* Node / edge count */}
        <span style={{ color: proj.color, fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}>
          {proj.nodeCount} nodes · {proj.edgeCount} edges
        </span>

        {/* Divider */}
        <span style={{ background: 'var(--surface-border)', height: '16px', width: '1px' }} />

        {/* Project switcher */}
        <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)', borderRadius: '999px', display: 'flex', gap: '2px', padding: '2px' }}>
          {(Object.entries(PROJECTS) as [ProjectId, (typeof PROJECTS)[ProjectId]][]).map(([id, p]) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                style={{
                  background: isActive ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${isActive ? `color-mix(in srgb, ${p.color} 22%, var(--surface-border))` : 'transparent'}`,
                  borderRadius: '999px',
                  color: isActive ? p.color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: isActive ? 500 : 400,
                  padding: '5px 14px',
                  transition: 'all 0.15s ease',
                }}
                type="button"
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <span style={{ background: 'var(--surface-border)', height: '16px', width: '1px' }} />

        {/* View project page */}
        <Link
          href={proj.href}
          style={{
            alignItems: 'center',
            background: `color-mix(in srgb, ${proj.color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${proj.color} 28%, transparent)`,
            borderRadius: '999px',
            color: proj.color,
            display: 'inline-flex',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            gap: '5px',
            letterSpacing: '0.08em',
            padding: '5px 12px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          View project
          <svg aria-hidden="true" fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 10 10" width="10">
            <path d="M2 8l6-6M8 2H3.5M8 2v4.5" />
          </svg>
        </Link>
      </div>
      </div>
    </div>
  );
}
