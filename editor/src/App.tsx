import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Undo2, RotateCcw, Eye, Pencil, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  useViewport,
  useReactFlow,
  MarkerType,
  Position,
  Handle,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { pilotNodes, pilotEdges } from './data/pilotFlow';
import { localizeValue, translateText, type Language } from './i18n';

// ─── Custom Node Components ────────────────────────────────────────────────────

const EXTENDED_HANDLE_OPTIONS = [
  { value: '', label: 'auto' },
  { value: 'left-top', label: 'left-top' },
  { value: 'left', label: 'left' },
  { value: 'left-bottom', label: 'left-bottom' },
  { value: 'top-left', label: 'top-left' },
  { value: 'top', label: 'top' },
  { value: 'top-right', label: 'top-right' },
  { value: 'right-top', label: 'right-top' },
  { value: 'right', label: 'right' },
  { value: 'right-bottom', label: 'right-bottom' },
  { value: 'bottom-left', label: 'bottom-left' },
  { value: 'bottom', label: 'bottom' },
  { value: 'bottom-right', label: 'bottom-right' },
] as const;

const HANDLE_HIDDEN_STYLE = {
  opacity: 0,
  pointerEvents: 'none' as const,
};

const EDGE_PATH_MODES = new Set(['smoothstep', 'step', 'straight']);

const BASIC_HANDLE_OPTIONS = [
  { value: '', label: 'auto' },
  { value: 'left', label: 'left' },
  { value: 'top', label: 'top' },
  { value: 'right', label: 'right' },
  { value: 'bottom', label: 'bottom' },
] as const;

function getHandleOptionsForNode(node: any) {
  return node?.type === 'task' || node?.type === 'database' || node?.type === 'service'
    ? EXTENDED_HANDLE_OPTIONS
    : BASIC_HANDLE_OPTIONS;
}

function getHandleStyle(visible: boolean, style: React.CSSProperties = {}) {
  return visible ? style : { ...style, ...HANDLE_HIDDEN_STYLE };
}

function getValidHandleIdsForNode(node: any) {
  return new Set(
    getHandleOptionsForNode(node)
      .map((option) => option.value)
      .filter((value): value is string => Boolean(value)),
  );
}

function normalizeHandleForNode(node: any, handleId?: string) {
  if (!handleId) return undefined;
  if (!node) return handleId;
  return getValidHandleIdsForNode(node).has(handleId) ? handleId : undefined;
}

function MultiHandleSet({ visible = true }: { visible?: boolean }) {
  const commonClass = 'w-2 h-2 !bg-primary';
  return (
    <>
      <Handle type="source" position={Position.Left} id="left-top" className={commonClass} style={getHandleStyle(visible, { top: '24%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Left} id="left" className={commonClass} style={getHandleStyle(visible, { top: '50%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Left} id="left-bottom" className={commonClass} style={getHandleStyle(visible, { top: '76%' })} isConnectableStart={visible} isConnectableEnd={visible} />

      <Handle type="source" position={Position.Top} id="top-left" className={commonClass} style={getHandleStyle(visible, { left: '24%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Top} id="top" className={commonClass} style={getHandleStyle(visible, { left: '50%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Top} id="top-right" className={commonClass} style={getHandleStyle(visible, { left: '76%' })} isConnectableStart={visible} isConnectableEnd={visible} />

      <Handle type="source" position={Position.Right} id="right-top" className={commonClass} style={getHandleStyle(visible, { top: '24%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Right} id="right" className={commonClass} style={getHandleStyle(visible, { top: '50%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Right} id="right-bottom" className={commonClass} style={getHandleStyle(visible, { top: '76%' })} isConnectableStart={visible} isConnectableEnd={visible} />

      <Handle type="source" position={Position.Bottom} id="bottom-left" className={commonClass} style={getHandleStyle(visible, { left: '24%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={commonClass} style={getHandleStyle(visible, { left: '50%' })} isConnectableStart={visible} isConnectableEnd={visible} />
      <Handle type="source" position={Position.Bottom} id="bottom-right" className={commonClass} style={getHandleStyle(visible, { left: '76%' })} isConnectableStart={visible} isConnectableEnd={visible} />
    </>
  );
}

const TaskNode = ({ data }: any) => {
  const variant = data.variant || 'default';
  const shell = {
    default: 'bg-surface-container',
    job: 'bg-[#253128]',
    service: 'bg-[#222c38]',
  }[variant] || 'bg-surface-container';
  const border = data.edgeHighlighted
    ? 'border-[#ff8e7d] shadow-[0_0_12px_rgba(255,142,125,0.5)]'
    : variant === 'job'
      ? 'border-emerald-300/30'
      : variant === 'service'
        ? 'border-sky-200/30'
        : 'border-white/10';
  const labelTone = variant === 'job'
    ? 'text-emerald-100'
    : variant === 'service'
      ? 'text-sky-100'
      : 'text-white';

  return (
    <div className={`px-4 py-3 shadow-md rounded-md border-2 ${shell} ${border} ${data.dimmed ? 'opacity-35' : 'opacity-100'} w-fit max-w-[230px] text-center transition-all`}>
      <MultiHandleSet visible={!!data.editMode} />
      {data.badge && (
        <div className={`mb-1 text-[9px] font-black uppercase tracking-[0.18em] ${variant === 'job' ? 'text-emerald-200/80' : variant === 'service' ? 'text-sky-200/80' : 'text-white/45'}`}>
          {data.badge}
        </div>
      )}
      <div className={`text-xs font-black italic epilogue uppercase break-words leading-snug whitespace-normal ${labelTone}`}>
        {data.label}
      </div>
      {data.cadence && (
        <div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-white/45">{data.cadence}</div>
      )}
    </div>
  );
};

const ServiceNode = ({ data }: any) => {
  const hideDetailsOnCanvas = data.hideDetailsOnCanvas || data.lane === 'AWS + Aurora';
  const border = data.edgeHighlighted
    ? 'border-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.35)]'
    : data.isPrimary
      ? 'border-primary/70 shadow-[0_0_12px_rgba(255,142,125,0.2)]'
      : 'border-sky-200/20';
  return (
    <div className={`min-w-[200px] max-w-[220px] rounded-xl border bg-[#1b2632]/92 px-4 py-3 text-left shadow-md transition-all ${border} ${data.dimmed ? 'opacity-30' : 'opacity-100'}`}>
      <MultiHandleSet visible={!!data.editMode} />
      {data.badge && (
        <div className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-sky-200/70">
          {data.badge}
        </div>
      )}
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-sky-50 break-words leading-snug">
        {data.label}
      </div>
      {data.details && !hideDetailsOnCanvas && (
        <div className="mt-2 text-[10px] leading-relaxed text-white/46">
          {data.details}
        </div>
      )}
      {data.cadence && (
        <div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-white/45">{data.cadence}</div>
      )}
    </div>
  );
};

const HIDDEN_CANVAS_NODE_IDS = new Set([
  'aws-rdb',
  'aws-redis',
  'aws-s3',
  'aws-sqs',
  'staff-assist',
  'staff-manual',
  'staff-api-end',
]);

function mergeUniqueStrings(...lists: Array<string[] | undefined>) {
  return Array.from(
    new Set(
      lists.flatMap((list) => list ?? []).filter((item): item is string => Boolean(item)),
    ),
  );
}

function isCanvasHiddenNode(node: any) {
  return HIDDEN_CANVAS_NODE_IDS.has(node?.id);
}

function getProjectedNodeData(node: any, language: Language) {
  const t = (value: string) => translateText(value, language);
  const data = localizeValue(node.data, language) as any;

  if (node.id === 'store-snapshot') {
    data.systems = mergeUniqueStrings(data.systems, [t('Aurora PostgreSQL'), t('S3 rå-payloads')]);
  }

  if (node.id === 'store-operational') {
    data.systems = mergeUniqueStrings(data.systems, [t('Aurora PostgreSQL'), t('Redis (valfri i V1)'), t('SQS / EventBridge')]);
  }

  if (node.id === 'store-events') {
    data.systems = mergeUniqueStrings(data.systems, [t('Aurora PostgreSQL'), t('S3 rå-payloads'), t('SQS / EventBridge')]);
  }

  if (node.id === 'store-future') {
    data.future = false;
    delete data.statusTag;
    data.label = t('Connected experience');
    data.summary = t('Aktiv connected-del i piloten för profiler, bandkoppling och sessionsunderlag.');
    data.writePattern = t('Aktiv i piloten när connected valts och när staff kopplar band vid utlämning.');
    data.systems = mergeUniqueStrings(data.systems, [t('Aurora PostgreSQL')]);
  }

  if (node.id === 'staff-handoff') {
    data.details = t('Normal utlämning hos staff när check-in-flödet är klart.');
    data.why = t('Staff verifierar QR-kod eller bokningskod, lämnar ut tillägg och kopplar Connected Experience-band. Om något strular kan staff falla tillbaka till dagens manuella check-in.');
  }

  return data;
}

const GatewayNode = ({ data }: any) => (
  <div className={`relative w-16 h-16 flex items-center justify-center transition-opacity ${data.dimmed ? 'opacity-30' : 'opacity-100'}`}>
    <>
      <Handle type="source" position={Position.Left} id="left" className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
      <Handle type="source" position={Position.Top} id="top" className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
      <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
    </>
    <div className={`absolute inset-0 transform rotate-45 border-2 bg-[#1a1a1a] pointer-events-none ${data.edgeHighlighted ? 'border-white shadow-[0_0_16px_rgba(255,142,125,0.7)]' : 'border-[#ff8e7d] shadow-[0_0_15px_rgba(255,142,125,0.2)]'}`}></div>
    <div className="relative z-10 text-[10px] font-black text-[#ff8e7d] italic text-center px-1">{data.label}</div>
  </div>
);

const EventNode = ({ data }: any) => (
  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${data.edgeHighlighted ? 'shadow-[0_0_12px_rgba(255,142,125,0.6)]' : ''} ${data.dimmed ? 'opacity-30' : 'opacity-100'} ${data.type === 'start' ? 'border-green-500 bg-green-500/20' : data.type === 'end' ? 'border-red-500 bg-red-500/20' : 'border-yellow-500 bg-yellow-500/20'}`}>
    <>
      <Handle type="source" position={Position.Left} id="left" className="w-2 h-2 !bg-primary" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
      <Handle type="source" position={Position.Top} id="top" className="w-2 h-2 !bg-primary" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-primary" style={getHandleStyle(!!data.editMode)} isConnectableStart={!!data.editMode} isConnectableEnd={!!data.editMode} />
    </>
    <div className="text-[8px] font-bold text-white uppercase text-center leading-tight">{data.label}</div>
  </div>
);

const DatabaseNode = ({ data }: any) => (
  <div className={`px-4 py-3 shadow-md rounded-md ${data.future ? 'bg-[#28303a]' : 'bg-[#2f2f2f]'} border-2 ${data.edgeHighlighted ? 'border-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.35)]' : data.future ? 'border-slate-300/25 border-dashed' : 'border-white/20'} ${data.dimmed ? 'opacity-30' : 'opacity-100'} ${data.collapsed ? 'min-w-[230px] max-w-[250px]' : 'min-w-[250px] max-w-[280px]'} text-left relative overflow-hidden transition-all`}>
    <div className="absolute top-0 left-0 w-full h-2 bg-white/10 rounded-t-[50%]"></div>
    <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10 rounded-b-[50%]"></div>
    <MultiHandleSet visible={!!data.editMode} />
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        data.onToggleCollapse?.();
      }}
      title={data.collapsed ? data.expandLabel : data.collapseLabel}
      className="nodrag nopan absolute top-3 right-3 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[11px] font-black text-white/70 transition-colors hover:bg-white/12 hover:text-white"
    >
      {data.collapsed ? '+' : '-'}
    </button>
    {data.statusTag && (
      <div className="absolute left-3 top-3 rounded-full border border-white/12 bg-white/6 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/60">
        {data.statusTag}
      </div>
    )}
    <div className="pr-7">
      <div className={`text-xs font-black italic epilogue uppercase text-white/90 text-center ${data.statusTag ? 'pt-6' : ''}`}>{data.label}</div>
      {data.collapsed ? (
        <>
          {data.summary && (
            <p className="mt-2 text-[10px] leading-relaxed text-white/64">
              {data.summary}
            </p>
          )}
          <ul className="mt-2 space-y-1">
            {(data.summaryItems || data.contains || data.keyFields || []).slice(0, 3).map((item: string) => (
              <li key={item} className="text-[10px] leading-snug text-white/72">
                {item}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {data.summary && (
            <p className="mt-2 text-[10px] leading-relaxed text-white/60">
              {data.summary}
            </p>
          )}
          {data.tables?.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {data.tables.slice(0, 5).map((table: string) => (
                <span key={table} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/68">
                  {table}
                </span>
              ))}
            </div>
          )}
          {data.writePattern && (
            <div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-cyan-200/85 text-center">{data.writePattern}</div>
          )}
          {data.keyFields?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {data.keyFields.slice(0, 5).map((item: string) => (
                <li key={item} className="text-[10px] leading-snug text-white/72">
                  {item}
                </li>
              ))}
            </ul>
          )}
          {(data.usedBy || data.jobs)?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {(data.usedBy || data.jobs).slice(0, 3).map((item: string) => (
                <span key={item} className="rounded-full border border-cyan-400/15 bg-cyan-400/8 px-2 py-0.5 text-[9px] font-bold text-cyan-100/75">
                  {item}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

const NoteNode = ({ data }: any) => {
  const tone = data.tone || 'info';
  const palette = {
    guide: {
      shell: 'bg-[#585858]/92 border-white/20',
      heading: 'text-white',
      body: 'text-white/80',
      chip: 'bg-white/8 border-white/12 text-white/82',
    },
    info: {
      shell: 'bg-cyan-200/18 border-cyan-100/40',
      heading: 'text-cyan-300',
      body: 'text-cyan-50/92',
      chip: 'bg-cyan-200/14 border-cyan-100/30 text-cyan-50/92',
    },
    system: {
      shell: 'bg-orange-200/18 border-orange-100/40',
      heading: 'text-orange-300',
      body: 'text-orange-50/92',
      chip: 'bg-orange-200/14 border-orange-100/30 text-orange-50/92',
    },
    warning: {
      shell: 'bg-amber-200/20 border-amber-100/42',
      heading: 'text-amber-200',
      body: 'text-amber-50/94',
      chip: 'bg-amber-200/16 border-amber-100/30 text-amber-50/94',
    },
  }[tone] ?? {
    shell: 'bg-cyan-200/18 border-cyan-100/40',
    heading: 'text-cyan-300',
    body: 'text-cyan-50/92',
    chip: 'bg-cyan-200/14 border-cyan-100/30 text-cyan-50/92',
  };
  const items = (data.risks?.length ? data.risks : data.systems?.length ? data.systems : data.sources || []).slice(0, 4);

  return (
    <div className={`w-[280px] rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-all ${data.edgeHighlighted ? 'shadow-[0_0_16px_rgba(255,255,255,0.18)]' : ''} ${data.dimmed ? 'opacity-30' : 'opacity-100'} ${palette.shell}`}>
      <Handle type="source" position={Position.Left} id="left" className="w-2 h-2 !bg-white/40 opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-white/40 opacity-0" />
      <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${palette.heading}`}>{data.label}</div>
      {data.details && (
        <p className={`mt-2 text-[11px] leading-relaxed whitespace-pre-line ${palette.body}`}>{data.details}</p>
      )}
      {items.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((item: string) => (
            <li key={item} className={`rounded-md border px-2 py-1 text-[10px] leading-relaxed ${palette.chip}`}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ZoneNode = ({ data }: any) => {
  const theme = data.theme || 'runtime';
  const palette = {
    ops: 'bg-emerald-400/6 border-emerald-300/20',
    runtime: 'bg-cyan-400/5 border-cyan-300/18',
    architecture: 'bg-[#11161d]/72 border-white/10',
    future: 'bg-slate-400/6 border-slate-300/20 border-dashed',
  }[theme] || 'bg-white/5 border-white/10';

  return (
    <div
      className={`rounded-2xl border px-5 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.18)] ${palette}`}
      style={{ width: data.widthPx, height: data.heightPx }}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.24em] text-white/72">{data.label}</div>
      {data.subtitle && (
        <div className="mt-1 text-[11px] leading-relaxed text-white/45">{data.subtitle}</div>
      )}
    </div>
  );
};

const LaneNode = ({ data }: any) => {
  const h = data.heightPx ? `${data.heightPx}px` : (data.height || '200px');
  return (
    <div
      className={`border-b border-white/8 flex items-stretch ${data.index % 2 === 0 ? 'bg-[#4f4f4f]' : 'bg-[#5a5a5a]'} ${data.layoutSelected ? 'border-t-2 border-b-2 border-primary/45 shadow-[inset_0_0_0_1px_rgba(255,142,125,0.18)]' : ''}`}
      style={{ height: h, width: data.width || '5000px', cursor: data.editMode ? (data.layoutSelected ? 'grab' : 'pointer') : 'default' }}
    >
      <div className="w-12 bg-[#2f2f2f] border-r border-white/10 flex items-center justify-center shadow-[5px_0_15px_rgba(0,0,0,0.25)] shrink-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transform -rotate-90 whitespace-nowrap">
          {data.label}
        </span>
      </div>
    </div>
  );
};

const PoolNode = ({ data }: any) => (
  <div
    style={{
      width: data.widthPx || 6600,
      height: data.heightPx || 300,
      backgroundColor: `${data.color}20`,
      border: data.layoutSelected ? `2px solid ${data.color}80` : `1px solid ${data.color}40`,
      borderRadius: 4,
      position: 'relative',
      pointerEvents: data.editMode ? 'auto' : 'none',
      cursor: data.editMode ? (data.layoutSelected ? 'grab' : 'pointer') : 'default',
      boxShadow: data.layoutSelected ? 'inset 0 0 0 1px rgba(255,255,255,0.08)' : undefined,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: -36,
        top: 0,
        bottom: 0,
        width: 32,
        backgroundColor: `${data.color}28`,
        border: `1px solid ${data.color}40`,
        borderRadius: '4px 0 0 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{
        fontSize: 11,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: `${data.color}cc`,
        transform: 'rotate(-90deg)',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-epilogue, sans-serif)',
        fontStyle: 'italic',
      }}>
        {data.label}
      </span>
    </div>
  </div>
);

const nodeTypes = { task: TaskNode, service: ServiceNode, gateway: GatewayNode, event: EventNode, database: DatabaseNode, note: NoteNode, lane: LaneNode, pool: PoolNode, zone: ZoneNode };

type RollerApiReference = {
  name: string;
  docUrl?: string;
  docLabel?: string;
  docStatus?: 'official' | 'confirm';
  note?: string;
};

const ROLLER_API_REFERENCES: Record<string, RollerApiReference> = {
  'Get detail of a booking': {
    name: 'Get detail of a booking',
    docUrl: 'https://docs.roller.app/docs/rest-api/olt8a8nxs75ev',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Get products': {
    name: 'Get products',
    docUrl: 'https://docs.roller.app/docs/roller-api/7bbac8eaac480-get-products',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Booking costs': {
    name: 'Booking costs',
    docUrl: 'https://docs.roller.app/docs/rest-api/branches/main/62e21c34b7ef3',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Redeem tickets': {
    name: 'Redeem tickets',
    docUrl: 'https://docs.roller.app/docs/rest-api/fb1d84952285f-redeem-tickets',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Create webhook (optional)': {
    name: 'Create webhook (optional)',
    docUrl: 'https://docs.roller.app/docs/rest-api/3a934c551891e-create-webhook',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Get attendance': {
    name: 'Get attendance',
    docUrl: 'https://docs.roller.app/docs/roller-api/b22c31e263a6c-get-attendance',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Get tickets': {
    name: 'Get tickets',
    docUrl: 'https://docs.roller.app/docs/roller-api/e4f76c0848391-get-tickets',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Get payments': {
    name: 'Get payments',
    docUrl: 'https://docs.roller.app/docs/roller-api/64688fe222c1a-get-payments',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Edit booking': {
    name: 'Edit booking',
    docUrl: 'https://docs.roller.app/docs/rest-api/v4mzj4t4erwa9-update-a-booking',
    docLabel: 'Dokumentation',
    docStatus: 'official',
  },
  'Add transaction record': {
    name: 'Add transaction record',
    docUrl: 'https://docs.roller.app/docs/rest-api/a86n5aasxe98r-add-transaction-record',
    docLabel: 'Dokumentation',
    docStatus: 'official',
    note: 'Doklänk att bekräfta',
  },
};

const ROLLER_API_STAGE_MAP = [
  {
    priority: 'CRITICAL',
    stage: 'Länköppning och live-refresh',
    endpoints: ['Get detail of a booking'],
    desc: 'Används när SMS-länk eller token öppnas och när snapshoten är för gammal för ett säkert beslut.',
  },
  {
    priority: 'CRITICAL',
    stage: 'Tillägg och prisberäkning',
    endpoints: ['Get products', 'Booking costs'],
    desc: 'Stödjer val av tillägg och räknar om bokningen innan betalning eller writeback.',
  },
  {
    priority: 'CRITICAL',
    stage: 'Writeback till Roller',
    endpoints: ['Edit booking', 'Add transaction record'],
    desc: 'Lägger till produkter på befintlig bokning och registrerar extern betalning.',
  },
  {
    priority: 'CRITICAL',
    stage: 'Inlösen vid ankomst',
    endpoints: ['Redeem tickets'],
    desc: 'Per-ticket check-in som är den kritiska slutpunkten i pilotflödet.',
  },
  {
    priority: 'HIGH',
    stage: 'Bulk-sync och optional webhook',
    endpoints: ['Get attendance', 'Get tickets', 'Get payments', 'Create webhook (optional)'],
    desc: 'Driver daily seed, delta sync och eventuell extra bekräftelse utanför happy path.',
  },
] as const;

// ─── Array field editor ───────────────────────────────────────────────────────

function ArrayField({ label, items, onAdd, onRemove, placeholder }: {
  label: string; items: string[];
  onAdd: (v: string) => void; onRemove: (i: number) => void; placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const commit = () => { if (draft.trim()) { onAdd(draft.trim()); setDraft(''); } };
  return (
    <div>
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{label}</label>
      {items.length > 0 && (
        <ul className="space-y-1 mb-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-1">
              <span className="flex-1 text-xs text-white/60 bg-white/5 px-2 py-1 rounded leading-relaxed">{item}</span>
              <button onClick={() => onRemove(i)} className="text-white/20 hover:text-red-400 text-sm px-1 shrink-0 leading-none mt-0.5">×</button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-1">
        <input
          type="text" value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && commit()}
          placeholder={placeholder}
          className="flex-1 text-xs text-white bg-[#1a1a1a] px-2 py-1.5 rounded border border-white/10 focus:border-primary outline-none"
        />
        <button onClick={commit} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded border border-white/10 transition-colors">+</button>
      </div>
    </div>
  );
}

// ─── Read-only metadata ───────────────────────────────────────────────────────

function getRollerApiReference(endpoint: string): RollerApiReference {
  const canonicalEndpoint = translateText(endpoint, 'en');
  const reference = ROLLER_API_REFERENCES[endpoint] ?? ROLLER_API_REFERENCES[canonicalEndpoint];
  return reference ? { ...reference, name: endpoint } : { name: endpoint };
}

function EndpointReferenceList({
  label,
  endpoints,
  language,
}: {
  label: string;
  endpoints?: string[];
  language: Language;
}) {
  const t = (value: string) => translateText(value, language);
  if (!endpoints?.length) return null;

  return (
    <div>
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t(label)}</label>
      <div className="space-y-2">
        {endpoints.map((endpoint) => {
          const ref = getRollerApiReference(endpoint);
          return (
            <div key={endpoint} className="rounded border border-cyan-400/18 bg-cyan-500/8 px-3 py-2">
              <div className="text-xs font-bold text-cyan-100">{ref.name}</div>
              {ref.docUrl ? (
                <a
                  href={ref.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex text-[10px] font-bold text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  {t(ref.docLabel || 'Dokumentation')}
                </a>
              ) : null}
              {!ref.docUrl && ref.docStatus === 'confirm' && (
                <div className="mt-1 text-[10px] text-amber-200/85">{t(ref.note || 'Doklänk att bekräfta')}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NodeMeta({ data, language }: { data: any; language: Language }) {
  const t = (value: string) => translateText(value, language);
  const renderList = (label: string, items?: string[], tone = 'default') => {
    if (!items?.length) return null;
    const itemClass = tone === 'info'
      ? 'text-xs text-cyan-100/85 bg-cyan-500/10 border border-cyan-400/20 px-2 py-1.5 rounded leading-relaxed'
      : tone === 'danger'
        ? 'text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 px-2 py-1.5 rounded leading-relaxed'
        : 'text-xs text-white/65 bg-white/5 px-2 py-1.5 rounded leading-relaxed';
    return (
      <div>
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t(label)}</label>
        <ul className="space-y-1">
          {items.map((item: string) => (
            <li key={item} className={itemClass}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <>
      {(data.details || data.note) && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Beskrivning')}</label>
          <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">{data.details || data.note}</p>
        </div>
      )}
      {data.why && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Varför noden finns')}</label>
          <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">{data.why}</p>
        </div>
      )}
      {data.systems?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('System')}</label>
          <ul className="space-y-1">
            {data.systems.map((s: string) => (
              <li key={s} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">{s}</li>
            ))}
          </ul>
        </div>
      )}
      {data.writePattern && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Skrivmönster')}</label>
          <p className="text-xs text-cyan-100/85 bg-cyan-500/10 border border-cyan-400/20 px-2 py-1.5 rounded leading-relaxed whitespace-pre-line">
            {data.writePattern}
          </p>
        </div>
      )}
      {data.cadence && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Kadens')}</label>
          <p className="text-xs text-white/70 bg-white/5 px-2 py-1.5 rounded leading-relaxed">{data.cadence}</p>
        </div>
      )}
      {renderList('Läser', data.reads, 'info')}
      {renderList('Skriver', data.writes, 'info')}
      {renderList('Visas när', data.shownWhen)}
      {renderList('Hoppas över när', data.skippedWhen)}
      {renderList('Ger besökaren', data.givesGuest)}
      {renderList('Staff verifierar med', data.staffVerifies)}
      {renderList('Data-touchpoints', data.touchpoints, 'info')}
      {renderList('Tabellgrupper', data.tables)}
      {renderList('Nyckelfält', data.keyFields, 'info')}
      {renderList('Ägd state', data.ownedState)}
      {renderList('Används av', data.usedBy)}
      {renderList('Jobb', data.jobs)}
      <EndpointReferenceList label="API-endpoints" endpoints={data.endpoints} language={language} />
      {data.contains?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Lagrar')}</label>
          <ul className="space-y-1">
            {data.contains.map((item: string) => (
              <li key={item} className="text-xs text-white/65 bg-white/5 px-2 py-1.5 rounded leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}
      {data.risks?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Risker')}</label>
          <ul className="space-y-1">
            {data.risks.map((r: string) => (
              <li key={r} className="text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 px-2 py-1.5 rounded leading-relaxed">{r}</li>
            ))}
          </ul>
        </div>
      )}
      {data.sources?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Källor')}</label>
          <ul className="space-y-1">
            {data.sources.map((s: string) => (
              <li key={s} className="text-[10px] text-white/35 font-mono">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function getEdgeCategory(edge: any): 'data' | 'fallback' | 'arch' | 'process' {
  const stroke = String(edge?.data?.baseStyle?.stroke || edge?.style?.stroke || '');
  if (edge?.data?.edgeKind === 'data' || edge?.data?.edgeStyle === 'data' || stroke === '#38bdf8' || stroke === '#22d3ee') return 'data';
  if (stroke === '#94a3b8') return 'arch';
  if (stroke === '#8b5cf6' || stroke === '#a78bfa') return 'fallback';
  return 'process';
}

function EdgeMeta({
  edge,
  sourceLabel,
  targetLabel,
  language,
}: {
  edge: any;
  sourceLabel?: string;
  targetLabel?: string;
  language: Language;
}) {
  const t = (value: string) => translateText(value, language);
  const data = localizeValue(edge?.data || {}, language) as any;
  const category = getEdgeCategory(edge);
  const categoryLabel = category === 'data'
    ? t('Dataflöde')
    : category === 'fallback'
      ? t('Fallbackflöde')
      : category === 'arch'
        ? t('Arkitekturkoppling')
        : t('Processflöde');
  const renderList = (label: string, items?: string[], tone = 'default') => {
    if (!items?.length) return null;
    const itemClass = tone === 'info'
      ? 'text-xs text-cyan-100/85 bg-cyan-500/10 border border-cyan-400/20 px-2 py-1.5 rounded leading-relaxed'
      : 'text-xs text-white/65 bg-white/5 px-2 py-1.5 rounded leading-relaxed';
    return (
      <div>
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t(label)}</label>
        <ul className="space-y-1">
          {items.map((item: string) => (
            <li key={item} className={itemClass}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded border border-white/8 bg-white/4 px-3 py-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Från')}</label>
          <div className="text-xs text-white/80 leading-relaxed">{sourceLabel || '—'}</div>
        </div>
        <div className="rounded border border-white/8 bg-white/4 px-3 py-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Till')}</label>
          <div className="text-xs text-white/80 leading-relaxed">{targetLabel || '—'}</div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Kantkategori')}</label>
        <div className="text-xs text-white/70 bg-white/5 px-2 py-1.5 rounded leading-relaxed">{categoryLabel}</div>
      </div>

      {typeof edge?.label === 'string' && edge.label.trim() && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Kantetikett')}</label>
          <div className="text-xs text-white/70 bg-white/5 px-2 py-1.5 rounded leading-relaxed">{t(edge.label)}</div>
        </div>
      )}

      {data.details && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t(category === 'data' ? 'Dataflöde' : 'Beskrivning')}</label>
          <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">{data.details}</p>
        </div>
      )}

      {category === 'data' ? (
        <>
          {data.operation && (
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Operation')}</label>
              <div className="text-xs text-cyan-100/85 bg-cyan-500/10 border border-cyan-400/20 px-2 py-1.5 rounded leading-relaxed">{data.operation}</div>
            </div>
          )}
          {renderList('Hämtar / skriver', data.fields, 'info')}
          {data.why && (
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Varför flödet finns')}</label>
              <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">{data.why}</p>
            </div>
          )}
        </>
      ) : !data.details ? (
        <div className="text-xs text-white/50 bg-white/5 px-2 py-1.5 rounded leading-relaxed">
          {t('Ingen extra metadata för denna kanttyp.')}
        </div>
      ) : null}
    </div>
  );
}

// ─── Walk animation ───────────────────────────────────────────────────────────

function ViewportTracker({ onUpdate }: { onUpdate: (x: number, y: number, zoom: number) => void }) {
  const { x, y, zoom } = useViewport();
  useEffect(() => { onUpdate(x, y, zoom); }, [x, y, zoom, onUpdate]);
  return null;
}

// ── Retro pixel sprite ────────────────────────────────────────────────────────

const PX = 3; // css px per "pixel"  (8×12 grid → 24×36 CSS px)
const CHAR_PAL: Record<string, string | null> = {
  K: '#cc2222', // red cap
  H: '#1a0800', // dark hair / outline
  S: '#f5c5a3', // skin
  E: '#2a1800', // eyes
  B: '#2850c8', // blue jacket
  W: '#dce8ff', // white shirt detail
  P: '#18182a', // dark pants
  G: '#5c3418', // boots
  '.': null,
};

// Side-view 8×12 sprites, character faces right
const SPRITE_STAND = [
  '..KKKK..',
  '.HKKKKHH',
  '.HSSSSSH',
  '.SEESSE.',
  '...SS...',
  '..BWWB..',
  '.BBBBBB.',
  'B.BBBB.B',
  '..BBBB..',
  '..PPPP..',
  '..PP.PP.',
  '..GG.GG.',
];
const SPRITE_WALK_A = [
  '..KKKK..',
  '.HKKKKHH',
  '.HSSSSSH',
  '.SEESSE.',
  '...SS...',
  '..BWWB..',
  '.BBBBBB.',
  'BB.BBB..',  // left arm forward
  '..BBBB..',
  '..PPPP..',
  '...PP.PP',  // right leg forward
  '...GG.GG',
];
const SPRITE_WALK_B = [
  '..KKKK..',
  '.HKKKKHH',
  '.HSSSSSH',
  '.SEESSE.',
  '...SS...',
  '..BWWB..',
  '.BBBBBB.',
  '..BBB.BB',  // right arm forward
  '..BBBB..',
  '..PPPP..',
  '.PP.PP..',  // left leg forward
  '.GG.GG..',
];
const WALK_FRAMES = [SPRITE_WALK_A, SPRITE_WALK_B];

function PixelChar({ frame }: { frame: string[] }) {
  return (
    <div style={{ display: 'inline-block', lineHeight: 0 }}>
      {frame.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.split('').map((c, x) => (
            <div key={x} style={{ width: PX, height: PX, backgroundColor: CHAR_PAL[c] ?? 'transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function getNodeDims(type?: string) {
  if (type === 'event')   return { w: 48, h: 48 };
  if (type === 'gateway') return { w: 64, h: 64 };
  if (type === 'database') return { w: 270, h: 168 };
  if (type === 'service') return { w: 220, h: 84 };
  if (type === 'note') return { w: 280, h: 160 };
  if (type === 'zone') return { w: 480, h: 180 };
  return { w: 160, h: 50 };
}

// Build interpolated waypoints along the smoothstep edge path
function buildEdgeWaypoints(
  src: { position: { x: number; y: number }; type?: string },
  tgt: { position: { x: number; y: number }; type?: string },
  stepsPerSegment = 7,
): Array<{ x: number; y: number }> {
  const sd = getNodeDims(src.type), td = getNodeDims(tgt.type);
  const x0 = src.position.x + sd.w, y0 = src.position.y + sd.h / 2;
  const x3 = tgt.position.x,        y3 = tgt.position.y + td.h / 2;
  const xMid = (x0 + x3) / 2;
  const corners = [{ x: x0, y: y0 }, { x: xMid, y: y0 }, { x: xMid, y: y3 }, { x: x3, y: y3 }];
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < corners.length - 1; i++) {
    const a = corners[i], b = corners[i + 1];
    for (let s = 0; s <= stepsPerSegment; s++) {
      const t = s / stepsPerSegment;
      pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return pts;
}

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#ff8e7d' },
  style: { strokeWidth: 2, stroke: '#ff8e7d' },
};

function hydrateEdge(edge: any) {
  return edge;
}

function normalizeEdge(edge: any, nodesOrLookup?: any[] | Map<string, any>) {
  const nodeLookup = nodesOrLookup instanceof Map
    ? nodesOrLookup
    : new Map((nodesOrLookup || []).map((node: any) => [node.id, node]));
  const rawStyle = edge?.data?.baseStyle || edge?.style || defaultEdgeOptions.style;
  const baseStyle = {
    ...defaultEdgeOptions.style,
    ...(rawStyle || {}),
  };
  delete (baseStyle as any).filter;
  delete (baseStyle as any).strokeOpacity;

  const rawMarkerEnd = edge?.data?.baseMarkerEnd || edge?.markerEnd || defaultEdgeOptions.markerEnd;
  const baseMarkerEnd = {
    ...defaultEdgeOptions.markerEnd,
    ...(rawMarkerEnd || {}),
    color: rawMarkerEnd?.color || baseStyle.stroke || defaultEdgeOptions.style.stroke,
  };

  const sourceNode = nodeLookup.get(edge?.source);
  const targetNode = nodeLookup.get(edge?.target);
  const pathMode = EDGE_PATH_MODES.has(edge?.data?.pathMode)
    ? edge.data.pathMode
    : EDGE_PATH_MODES.has(edge?.type)
      ? edge.type
      : defaultEdgeOptions.type;

  const normalized: any = {
    ...edge,
    type: pathMode,
    style: { ...baseStyle },
    markerEnd: { ...baseMarkerEnd },
    data: {
      ...(edge?.data || {}),
      baseStyle,
      baseMarkerEnd,
      pathMode,
    },
  };

  const sourceHandle = normalizeHandleForNode(sourceNode, normalized.sourceHandle);
  const targetHandle = normalizeHandleForNode(targetNode, normalized.targetHandle);

  if (sourceHandle) normalized.sourceHandle = sourceHandle;
  else delete normalized.sourceHandle;

  if (targetHandle) normalized.targetHandle = targetHandle;
  else delete normalized.targetHandle;

  return normalized;
}

function applyEdgeVisualState(edge: any, mode: 'base' | 'highlight' | 'dim', nodesOrLookup?: any[] | Map<string, any>) {
  const hydrated = normalizeEdge(hydrateEdge(edge), nodesOrLookup);
  const baseStyle = hydrated.data.baseStyle || defaultEdgeOptions.style;
  const baseMarkerEnd = hydrated.data.baseMarkerEnd || defaultEdgeOptions.markerEnd;

  if (mode === 'highlight') {
    return {
      ...hydrated,
      style: {
        ...baseStyle,
        strokeWidth: (baseStyle.strokeWidth || 2) + 1.25,
        strokeOpacity: 1,
        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.28))',
      },
      markerEnd: { ...baseMarkerEnd },
      zIndex: 12,
      data: { ...hydrated.data, edgeHighlighted: true, dimmed: false },
    };
  }

  if (mode === 'dim') {
    return {
      ...hydrated,
      style: {
        ...baseStyle,
        strokeOpacity: 0.18,
      },
      markerEnd: { ...baseMarkerEnd },
      zIndex: 0,
      data: { ...hydrated.data, edgeHighlighted: false, dimmed: true },
    };
  }

  return {
    ...hydrated,
    style: { ...baseStyle },
    markerEnd: { ...baseMarkerEnd },
    zIndex: 0,
    data: { ...hydrated.data, edgeHighlighted: false, dimmed: false },
  };
}

function sanitizeEdgeForStorage(edge: any, nodesOrLookup?: any[] | Map<string, any>) {
  const hydrated = normalizeEdge(hydrateEdge(edge), nodesOrLookup);
  const data = { ...(hydrated.data || {}) };
  delete data.edgeHighlighted;
  delete data.dimmed;
  return {
    ...hydrated,
    style: { ...(hydrated.data?.baseStyle || hydrated.style || defaultEdgeOptions.style) },
    markerEnd: { ...(hydrated.data?.baseMarkerEnd || hydrated.markerEnd || defaultEdgeOptions.markerEnd) },
    zIndex: 0,
    data,
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const FLOW_SCHEMA_VERSION = '2026-03-cloud-lane-swap-v8';
const STORAGE_NODES = `jy-bpmn-nodes:${FLOW_SCHEMA_VERSION}`;
const STORAGE_EDGES = `jy-bpmn-edges:${FLOW_SCHEMA_VERSION}`;
const STORAGE_LANGUAGE = 'jy-bpmn-language';

const loadNodes = () => {
  try {
    const s = localStorage.getItem(STORAGE_NODES);
    const ns: any[] = s ? JSON.parse(s) : pilotNodes;
    // Migrate: assign poolId to lanes that don't have one yet (Y-range heuristic, one-time migration)
    const pools = ns.filter(n => n.type === 'pool').sort((a: any, b: any) => a.position.y - b.position.y);
    return ns.map((n: any) => {
      let next = n;
      if (n.type === 'database' && typeof n.data?.collapsed !== 'boolean') {
        next = { ...next, data: { ...next.data, collapsed: true } };
      }
      if (next.type !== 'lane' || next.data?.poolId) return next;
      const pool = pools.find((p: any) =>
        next.position.y >= p.position.y && next.position.y < p.position.y + (p.data?.heightPx || 300)
      );
      return pool ? { ...next, data: { ...next.data, poolId: pool.id } } : next;
    });
  } catch { return pilotNodes; }
};
const loadEdges = (nodes: any[] = pilotNodes) => {
  try {
    const s = localStorage.getItem(STORAGE_EDGES);
    const raw = s ? JSON.parse(s) : pilotEdges;
    return raw.map((edge: any) => applyEdgeVisualState(edge, 'base', nodes));
  } catch { return pilotEdges.map((edge: any) => applyEdgeVisualState(edge, 'base', nodes)); }
};

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Lane Row (used in lanes panel) ──────────────────────────────────────────

function LaneRow({ lane, isFirst, isLast, onMove, onRename, onDelete, onResize, pools, onMoveToPool, language }: {
  lane: any; isFirst: boolean; isLast: boolean;
  onMove: (dir: 'up' | 'down') => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onResize: (heightPx: number) => void;
  pools: any[];
  onMoveToPool: (poolId: string) => void;
  language: Language;
}) {
  const t = (value: string) => translateText(value, language);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(lane.data.label));
  const commit = () => {
    if (draft.trim() && draft.trim() !== String(lane.data.label)) onRename(draft.trim());
    setEditing(false);
  };
  const currentHeight = lane.data.heightPx || parseInt(String(lane.data.height || '200')) || 200;
  const currentPoolId = String((lane.data as any).poolId ?? '');
  const currentPool = pools.find(p => p.id === currentPoolId);
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex flex-col gap-0.5 shrink-0">
        <button onClick={() => onMove('up')} disabled={isFirst}
          className="text-[10px] text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed leading-none px-0.5">▲</button>
        <button onClick={() => onMove('down')} disabled={isLast}
          className="text-[10px] text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed leading-none px-0.5">▼</button>
      </div>
      <select
        value={currentPoolId}
        onChange={e => onMoveToPool(e.target.value)}
        title={t('Pool')}
        className="shrink-0 w-3 h-3 rounded-full border-0 outline-none cursor-pointer appearance-none"
        style={{ background: currentPool?.data?.color ?? '#ffffff33', accentColor: currentPool?.data?.color }}
      >
        <option value="">–</option>
        {pools.map(p => <option key={p.id} value={p.id}>{t(String(p.data.label))}</option>)}
      </select>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          className="flex-1 text-xs text-white bg-[#1a1a1a] px-2 py-0.5 rounded border border-primary outline-none"
        />
      ) : (
        <span
          className="flex-1 text-xs text-white/80 cursor-pointer hover:text-white"
          onDoubleClick={() => { setDraft(String(lane.data.label)); setEditing(true); }}
          title={t('Dubbelklicka för att byta namn')}
        >
          {t(String(lane.data.label))}
        </span>
      )}
      <div className="flex items-center gap-1 shrink-0" title={t('Höjd (px)')}>
        <span className="text-[9px] text-white/25">h:</span>
        <input
          type="number" min={80} max={600} step={40}
          value={currentHeight}
          onChange={e => { const v = parseInt(e.target.value); if (v >= 80 && v <= 600) onResize(v); }}
          className="w-12 text-[10px] text-white/60 bg-[#1a1a1a] px-1 py-0.5 rounded border border-white/10 focus:border-primary outline-none text-center"
        />
      </div>
      <button
        onClick={() => { setDraft(String(lane.data.label)); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/40 hover:text-white px-1 transition-all"
        title={t('Byt namn')}
      >✎</button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/30 hover:text-red-400 px-1 transition-all"
        title={t('Ta bort lane')}
      >×</button>
    </div>
  );
}

// ─── Pool Row (used in lanes panel pools section) ────────────────────────────

function PoolRow({ pool, onRename, onDelete, onMove, isFirst, isLast, onAddLane, language }: {
  pool: any;
  onRename: (name: string) => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  onAddLane: () => void;
  language: Language;
}) {
  const t = (value: string) => translateText(value, language);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(pool.data.label));
  const commit = () => { if (draft.trim()) onRename(draft.trim()); setEditing(false); };
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded border border-white/5 group"
      style={{ background: `${pool.data.color}15` }}
    >
      <div className="flex flex-col shrink-0">
        <button disabled={isFirst} onClick={() => onMove('up')} className="text-[10px] text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed leading-none px-0.5">▲</button>
        <button disabled={isLast} onClick={() => onMove('down')} className="text-[10px] text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed leading-none px-0.5">▼</button>
      </div>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: pool.data.color }} />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          className="flex-1 text-xs text-white bg-[#1a1a1a] px-2 py-0.5 rounded border border-primary outline-none"
        />
      ) : (
        <span
          className="flex-1 text-xs font-bold cursor-pointer hover:text-white"
          style={{ color: pool.data.color }}
          onDoubleClick={() => { setDraft(String(pool.data.label)); setEditing(true); }}
          title={t('Dubbelklicka för att byta namn')}
        >
          {t(String(pool.data.label))}
        </span>
      )}
      <button
        onClick={onAddLane}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-400 hover:text-emerald-300 px-1 transition-all"
        title={t('Lägg till lane i denna pool')}
      >＋</button>
      <button
        onClick={() => { setDraft(String(pool.data.label)); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/40 hover:text-white px-1 transition-all"
        title={t('Byt namn')}
      >✎</button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/30 hover:text-red-400 px-1 transition-all"
        title={t('Ta bort pool')}
      >×</button>
    </div>
  );
}

const ROLLER_KRAV = [
  {
    endpoint: 'GET /booking/{ref}',
    docUrl: 'https://docs.roller.app/docs/rest-api/olt8a8nxs75ev',
    priority: 'CRITICAL',
    label: 'Hämta bokning',
    desc: 'Returnerar: gästnamn, email, produktlista, biljettantal, betalningsstatus, sessionstid',
  },
  {
    endpoint: 'GET /products',
    docUrl: 'https://docs.roller.app/docs/roller-api/7bbac8eaac480-get-products',
    priority: 'CRITICAL',
    label: 'Hämta produkter',
    desc: 'Alla köpbara produkter med pris per venue (strumpor, upplevelser, tillägg)',
  },
  {
    endpoint: 'POST /booking/costs',
    docUrl: 'https://docs.roller.app/docs/rest-api/branches/main/62e21c34b7ef3',
    priority: 'HIGH',
    label: 'Beräkna kostnad',
    desc: 'Kostnadsberäkning med tillagda produkter — utan att skapa bokning',
  },
  {
    endpoint: 'PUT /booking/{ref}',
    docUrl: 'https://docs.roller.app/docs/rest-api/v4mzj4t4erwa9-update-a-booking',
    priority: 'CRITICAL',
    label: 'Uppdatera bokning',
    desc: 'Lägg till produkter i befintlig bokning (lägger till i SAMMA bokning, ej ny)',
  },
  {
    endpoint: 'POST /booking/payment',
    docUrl: 'https://docs.roller.app/docs/rest-api/a86n5aasxe98r-add-transaction-record',
    priority: 'CRITICAL',
    label: 'Registrera betalning',
    desc: 'Registrera Adyen-transaktion mot bokning — fungerar för initial + tillägg. Endpoint: Add transaction record',
  },
  {
    endpoint: 'POST /tickets/redeem',
    docUrl: 'https://docs.roller.app/docs/rest-api/fb1d84952285f-redeem-tickets',
    priority: 'CRITICAL',
    label: 'Lös in biljetter',
    desc: 'ETT anrop per biljett-ID. Status uppdateras direkt i Roller-dashboard. Waivers: EJ AKTUELLT hos JumpYard',
  },
  {
    endpoint: 'Webhook: ticket check-in',
    docUrl: 'https://docs.roller.app/docs/rest-api/3a934c551891e-create-webhook',
    priority: 'HIGH',
    label: 'Check-in bekräftelse',
    desc: 'Triggas vid inlösning (ingen direkt GET-endpoint för check-in-status)',
  },
  {
    endpoint: 'Sandbox-miljö',
    priority: 'CRITICAL',
    label: 'Testmiljö',
    desc: 'Tillgänglig under evalueringsfas. NDA kan krävas. Rate limit: 600 req / 60s',
  },
];

function DataKravPanel({ onClose, language }: { onClose: () => void; language: Language }) {
  const t = (value: string) => translateText(value, language);
  return (
    <div className="fixed top-0 right-0 h-full w-[380px] z-50 bg-[#0e0e0e]/98 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-white">{t('Datakravslista')}</div>
          <div className="text-[10px] text-white/40 mt-0.5">{t('Roller API — bekräftade endpoints')}</div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white text-lg leading-none px-1">×</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {ROLLER_KRAV.map((k, i) => (
          <div key={i} className="rounded border border-white/8 bg-white/3 p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <code className="text-[11px] text-[#ff8e7d] font-mono leading-snug">{k.endpoint}</code>
              <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${k.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {k.priority}
              </span>
            </div>
            <div className="text-[11px] font-bold text-white/80 mb-1">{t(k.label)}</div>
            <div className="text-[10px] text-white/50 leading-relaxed">{t(k.desc)}</div>
            {k.docUrl && (
              <a
                href={k.docUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-[10px] font-bold text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
              >
                {t('Dokumentation')}
              </a>
            )}
          </div>
        ))}
        <div className="pt-2 pb-1 text-[9px] text-white/25 text-center">
          {t('Källa: Roller API Requirements — bekräftad av account manager')}
        </div>
      </div>
    </div>
  );
}

const ROLLER_API_MAP = ROLLER_API_STAGE_MAP;

function ArchitecturePanel({ onClose, language, nodes }: { onClose: () => void; language: Language; nodes: any[] }) {
  const t = (value: string) => translateText(value, language);
  const byCanvasOrder = (a: any, b: any) => (a.position.x - b.position.x) || (a.position.y - b.position.y);
  const projectNodeData = (predicate: (node: any) => boolean) =>
    nodes
      .filter((node) => !isCanvasHiddenNode(node))
      .filter(predicate)
      .sort(byCanvasOrder)
      .map((node) => ({ id: node.id, data: getProjectedNodeData(node, language) as any }));

  const dataNodes = projectNodeData((node) => node.type === 'database');
  const jobNodes = projectNodeData((node) => node.type === 'task' && String(node.data?.lane) === 'Ops jobs');

  return (
    <div className="fixed top-0 right-0 h-full w-[430px] z-50 bg-[#0e0e0e]/98 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-white">{t('Arkitektur / Ops')}</div>
          <div className="text-[10px] text-white/40 mt-0.5">{t('Aurora-tabellgrupper, Roller API-karta och jobb')}</div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white text-lg leading-none px-1">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <section>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/45">{t('Aurora-tabellgrupper')}</div>
          <div className="space-y-2">
            {dataNodes.map(({ id, data }) => (
              <div key={id} className={`rounded border p-3 ${data.future ? 'border-slate-300/18 bg-slate-400/5' : 'border-cyan-300/16 bg-cyan-400/5'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className={`text-[11px] font-bold ${data.future ? 'text-slate-100' : 'text-cyan-100'}`}>{data.label}</div>
                  {data.statusTag && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/55">
                      {data.statusTag}
                    </span>
                  )}
                </div>
                {data.summary && (
                  <div className="mt-1 text-[10px] leading-relaxed text-white/58">{data.summary}</div>
                )}
                {data.systems?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {data.systems.slice(0, 4).map((item: string) => (
                      <span key={item} className="rounded-full border border-sky-300/18 bg-sky-400/8 px-2 py-0.5 text-[9px] font-bold text-sky-100/80">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                {data.tables?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {data.tables.map((table: string) => (
                      <span key={table} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/68">
                        {table}
                      </span>
                    ))}
                  </div>
                )}
                {data.keyFields?.length > 0 && (
                  <div className="mt-2 text-[10px] text-white/55 leading-relaxed">
                    <span className="font-black uppercase tracking-wide text-white/38">{t('Nyckelfält')}:</span>{' '}
                    {data.keyFields.slice(0, 5).join(', ')}
                  </div>
                )}
                {data.ownedState?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {data.ownedState.slice(0, 3).map((item: string) => (
                      <li key={item} className="text-[10px] text-white/60 leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
                {data.usedBy?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {data.usedBy.slice(0, 3).map((item: string) => (
                      <span key={item} className="rounded-full border border-cyan-400/15 bg-cyan-400/8 px-2 py-0.5 text-[9px] font-bold text-cyan-100/75">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/45">{t('Roller API-karta')}</div>
          <div className="space-y-2">
            {ROLLER_API_MAP.map((item) => (
              <div key={item.stage} className="rounded border border-white/8 bg-white/3 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] font-bold text-white/82">{t(item.stage)}</div>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${item.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {item.endpoints.map((endpoint) => {
                    const ref = getRollerApiReference(endpoint);
                    return (
                      <div key={endpoint} className="rounded border border-[#ff8e7d]/16 bg-[#ff8e7d]/6 px-2.5 py-2">
                        <div className="text-[10px] font-bold text-[#ffb1a4]">{ref.name}</div>
                        {ref.docUrl ? (
                          <a
                            href={ref.docUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex text-[10px] font-bold text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                          >
                            {t(ref.docLabel || 'Dokumentation')}
                          </a>
                        ) : null}
                        {!ref.docUrl && ref.docStatus === 'confirm' && (
                          <div className="mt-1 text-[10px] text-amber-200/85">{t(ref.note || 'Doklänk att bekräfta')}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-[10px] leading-relaxed text-white/50">{t(item.desc)}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/45">{t('Jobb & kadens')}</div>
          <div className="space-y-2">
            {jobNodes.map(({ id, data }) => (
              <div key={id} className="rounded border border-emerald-300/16 bg-emerald-400/6 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] font-bold text-emerald-100">{data.label}</div>
                  {data.cadence && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white/55">
                      {data.cadence}
                    </span>
                  )}
                </div>
                {data.details && <div className="mt-1 text-[10px] leading-relaxed text-white/58">{data.details}</div>}
                {data.endpoints?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {data.endpoints.map((endpoint: string) => (
                      <span key={endpoint} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/65">
                        {endpoint}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="pt-1 pb-2 text-[9px] text-white/25 text-center">
          {t('KÃ¤lla: Roller API Requirements â€” bekrÃ¤ftad av account manager')}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { screenToFlowPosition, getViewport, setViewport: rfSetViewport } = useReactFlow();
  const initialNodesRef = useRef<any[] | null>(null);
  if (!initialNodesRef.current) initialNodesRef.current = loadNodes();
  const initialNodes = initialNodesRef.current ?? pilotNodes;
  const initialEdgesRef = useRef<any[] | null>(null);
  if (!initialEdgesRef.current) initialEdgesRef.current = loadEdges(initialNodes);
  const initialEdges = initialEdgesRef.current ?? loadEdges(initialNodes);
  const [nodes, setNodes, applyNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem(STORAGE_LANGUAGE) === 'en' ? 'en' : 'sv';
    } catch {
      return 'sv';
    }
  });
  const [selectedElements, setSelectedElements] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState<{ nodes: any[]; edges: any[] }[]>([]);
  const [walkActive, setWalkActive] = useState(false);
  const [walkCurrentId, setWalkCurrentId] = useState<string | null>(null);
  const [walkPhase, setWalkPhase] = useState<'idle' | 'walking'>('idle');
  const [walkFrame, setWalkFrame] = useState(0);
  const [charFlowPos, setCharFlowPos] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const onViewportUpdate = useCallback((x: number, y: number, zoom: number) => {
    setViewport({ x, y, zoom });
  }, []);

  // Walk engine — all mutable walk state lives here (no stale closures in interval)
  const walkEng = React.useRef({
    currentId: null as string | null,
    targetId:  null as string | null,
    history:   [] as string[],
    phase:     'idle' as 'idle' | 'walking',
    waypoints: [] as Array<{ x: number; y: number }>,
    wpIdx:     0,
  });
  const rightHeld = React.useRef(false);
  const leftHeld  = React.useRef(false);
  const nodesRef  = React.useRef(nodes);
  const edgesRef  = React.useRef(edges);
  const positionHistoryCapturedRef = React.useRef(false);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const selectedNodeId = selectedElements.nodes[0]?.id ?? null;
  const selectedEdgeId = selectedElements.edges[0]?.id ?? null;
  const rawSelectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) ?? null : null;
  const rawSelectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) ?? null : null;
  const selectedNode = rawSelectedNode && !isCanvasHiddenNode(rawSelectedNode) ? rawSelectedNode : null;
  const selectedEdge = rawSelectedEdge
    && getEdgeCategory(rawSelectedEdge) !== 'arch'
    && !HIDDEN_CANVAS_NODE_IDS.has(rawSelectedEdge.source)
    && !HIDDEN_CANVAS_NODE_IDS.has(rawSelectedEdge.target)
      ? rawSelectedEdge
      : null;
  const selectedEdgeSourceNode = selectedEdge ? nodes.find((node) => node.id === selectedEdge.source) ?? null : null;
  const selectedEdgeTargetNode = selectedEdge ? nodes.find((node) => node.id === selectedEdge.target) ?? null : null;
  const hasSelection = !!(selectedNode || selectedEdge);
  const t = (value: string) => translateText(value, language);
  const selectedNodeViewData = selectedNode ? getProjectedNodeData(selectedNode, language) : null;
  const selectedEdgeViewData = selectedEdge ? localizeValue(selectedEdge.data || {}, language) : null;
  const selectedNodeViewLabel = selectedNodeViewData?.label || (selectedNode?.type === 'lane' ? t('Lane') : t('Nod'));
  const selectedEdgeSourceLabel = selectedEdgeSourceNode ? String((getProjectedNodeData(selectedEdgeSourceNode, language) as any)?.label || selectedEdgeSourceNode.id) : '—';
  const selectedEdgeTargetLabel = selectedEdgeTargetNode ? String((getProjectedNodeData(selectedEdgeTargetNode, language) as any)?.label || selectedEdgeTargetNode.id) : '—';

  useEffect(() => {
    if (editMode) return;
    setSelectedElements((current) => ({
      nodes: current.nodes.filter((node) => node.type !== 'lane' && node.type !== 'pool'),
      edges: current.edges,
    }));
  }, [editMode]);

  const collectRelatedGraph = useCallback((seedNodeIds: string[], depth = 1) => {
    const nodeIds = new Set(seedNodeIds);
    const edgeIds = new Set<string>();
    let frontier = new Set(seedNodeIds);

    for (let level = 0; level < depth; level++) {
      const next = new Set<string>();
      for (const edge of edgesRef.current) {
        if (!frontier.has(edge.source) && !frontier.has(edge.target)) continue;
        edgeIds.add(edge.id);
        if (!nodeIds.has(edge.source)) { nodeIds.add(edge.source); next.add(edge.source); }
        if (!nodeIds.has(edge.target)) { nodeIds.add(edge.target); next.add(edge.target); }
      }
      if (!next.size) break;
      frontier = next;
    }

    return { nodeIds, edgeIds };
  }, []);

  useEffect(() => {
    const clean = nodes.map(n => {
      const data = { ...(n.data as any) };
      delete data.edgeHighlighted;
      delete data.dimmed;
      return { ...n, data };
    });
    localStorage.setItem(STORAGE_NODES, JSON.stringify(clean));
  }, [nodes]);
  useEffect(() => {
    const nodeLookup = new Map(nodes.map((node) => [node.id, node]));
    localStorage.setItem(STORAGE_EDGES, JSON.stringify(edges.map((edge) => sanitizeEdgeForStorage(edge, nodeLookup))));
  }, [edges, nodes]);
  useEffect(() => {
    localStorage.setItem(STORAGE_LANGUAGE, language);
  }, [language]);

  // ── Export ────────────────────────────────────────────────────────────────
  const flowRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);

  const captureFlow = async (pixelRatio: number): Promise<string> => {
    if (!flowRef.current) throw new Error('No ref');
    const el = flowRef.current;
    const prevVp = getViewport();

    // Compute full bounding box of all nodes at zoom=1
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      const w = (n as any).measured?.width ?? ((n.data as any).widthPx ?? 150);
      const h = (n as any).measured?.height ?? ((n.data as any).heightPx ?? 60);
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + w);
      maxY = Math.max(maxY, n.position.y + h);
    }
    const pad = 80;
    const contentW = Math.ceil(maxX - minX + pad * 2);
    const contentH = Math.ceil(maxY - minY + pad * 2);

    // Temporarily expand the container to content size at zoom=1
    const s = el.style;
    const orig = { position: s.position, width: s.width, height: s.height, left: s.left, top: s.top, zIndex: s.zIndex };
    s.position = 'fixed'; s.left = '0'; s.top = '0';
    s.width = contentW + 'px'; s.height = contentH + 'px'; s.zIndex = '9998';
    rfSetViewport({ x: -minX + pad, y: -minY + pad, zoom: 1 }, { duration: 0 });
    await new Promise(r => setTimeout(r, 200));

    try {
      return await toPng(el, {
        backgroundColor: '#0e0e0e',
        pixelRatio,
        width: contentW,
        height: contentH,
        filter: (node) =>
          !node.classList?.contains('react-flow__minimap') &&
          !node.classList?.contains('react-flow__controls'),
      });
    } finally {
      s.position = orig.position; s.width = orig.width; s.height = orig.height;
      s.left = orig.left; s.top = orig.top; s.zIndex = orig.zIndex;
      rfSetViewport(prevVp, { duration: 0 });
    }
  };

  const exportToPng = async () => {
    if (!flowRef.current) return;
    setExporting('png');
    try {
      const dataUrl = await captureFlow(2);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `jumpyard-bpmn-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } finally {
      setExporting(null);
    }
  };

  const exportToPdf = async () => {
    if (!flowRef.current) return;
    setExporting('pdf');
    try {
      const dataUrl = await captureFlow(1.5);
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => { img.onload = r; });
      const w = img.width, h = img.height;
      const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);
      pdf.save(`jumpyard-bpmn-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setExporting(null);
    }
  };

  // ── Walk engine (interval-based, hold → to walk along live edges) ─────────
  useEffect(() => {
    if (!walkActive) {
      rightHeld.current = false;
      leftHeld.current  = false;
      return;
    }

    // Init: place char at start-event or first non-lane node
    const allNodes = nodesRef.current;
    const startNode =
      allNodes.find(n => n.type === 'event' && (n.data as any).type === 'start') ||
      allNodes.find(n => n.type !== 'lane');
    if (!startNode) return;

    const eng = walkEng.current;
    eng.currentId = startNode.id;
    eng.targetId  = null;
    eng.history   = [];
    eng.phase     = 'idle';
    eng.waypoints = [];
    eng.wpIdx     = 0;

    setWalkCurrentId(startNode.id);
    setWalkPhase('idle');
    const d0 = getNodeDims(startNode.type);
    setCharFlowPos({ x: startNode.position.x + d0.w / 2, y: startNode.position.y - 18 });

    const id = setInterval(() => {
      const eng   = walkEng.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      if (eng.phase === 'idle') {
        // Snap char to current node centre
        const cur = nodes.find(n => n.id === eng.currentId);
        if (cur) {
          const d = getNodeDims(cur.type);
          setCharFlowPos({ x: cur.position.x + d.w / 2, y: cur.position.y - 18 });
        }

        if (rightHeld.current && eng.currentId) {
          // Follow first outgoing edge from current node
          const edge = edges.find(e => e.source === eng.currentId);
          if (edge) {
            const src = nodes.find(n => n.id === edge.source);
            const tgt = nodes.find(n => n.id === edge.target);
            if (src && tgt && tgt.type !== 'lane') {
              eng.targetId  = tgt.id;
              eng.waypoints = buildEdgeWaypoints(src, tgt);
              eng.wpIdx     = 0;
              eng.phase     = 'walking';
              setWalkPhase('walking');
            }
          }
        }
      } else {
        // Walking phase
        if (eng.wpIdx >= eng.waypoints.length) {
          // Arrived at target
          if (eng.targetId) {
            eng.history.push(eng.currentId!);
            eng.currentId = eng.targetId;
            eng.targetId  = null;
            setWalkCurrentId(eng.currentId);
          }
          eng.phase = 'idle';
          setWalkPhase('idle');
          return;
        }

        if (!rightHeld.current) {
          // Key released — freeze in place, show standing sprite
          setWalkFrame(0);
          return;
        }

        const wp = eng.waypoints[eng.wpIdx];
        setCharFlowPos({ x: wp.x, y: wp.y - 18 });
        setWalkFrame(f => (f + 1) % 2);
        eng.wpIdx++;
      }
    }, 90);

    return () => clearInterval(id);
  }, [walkActive]);

  const saveHistory = useCallback(() => {
    setHistory(h => [...h.slice(-29), { nodes, edges }]);
  }, [nodes, edges]);

  const onNodesChange = useCallback((changes: any[]) => {
    const hasPositionChange = changes.some((change) => change.type === 'position');
    if (editMode && hasPositionChange && !positionHistoryCapturedRef.current) {
      positionHistoryCapturedRef.current = true;
      saveHistory();
    }

    applyNodesChange(changes);

    const positionSequenceFinished = changes.some(
      (change) => change.type === 'position' && change.dragging === false,
    );
    if (positionSequenceFinished || !hasPositionChange) {
      positionHistoryCapturedRef.current = false;
    }
  }, [applyNodesChange, editMode, saveHistory]);

  const toggleDatabaseCollapse = useCallback((id: string) => {
    saveHistory();
    setNodes(nds => nds.map((node) => {
      if (node.id !== id || node.type !== 'database') return node;
      return { ...node, data: { ...node.data, collapsed: !node.data?.collapsed } };
    }));
  }, [saveHistory, setNodes]);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      return h.slice(0, -1);
    });
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo]);

  const saveAsDefault = async () => {
    try {
      const res = await fetch('/api/save-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const json = await res.json();
      if (json.ok) alert(`✓ ${t('Sparat som ursprungsdata i pilotFlow.ts')}`);
      else alert(`Error: ${JSON.stringify(json)}`);
    } catch (e) {
      alert(t('Kunde inte nå /api/save-flow — är dev-servern igång?'));
    }
  };

  const resetToDefaults = () => {
    if (!confirm(t('Återställ till ursprungsdata? Alla ändringar tas bort.'))) return;
    localStorage.removeItem(STORAGE_NODES);
    localStorage.removeItem(STORAGE_EDGES);
    setNodes(pilotNodes);
    setEdges(pilotEdges.map((edge: any) => applyEdgeVisualState(edge, 'base', pilotNodes)));
    setHistory([]);
  };

  const onConnect = useCallback(
    (params: any) => {
      saveHistory();
      setEdges(eds => addEdge(normalizeEdge({
        ...params,
        ...defaultEdgeOptions,
        data: {
          baseStyle: { ...defaultEdgeOptions.style },
          baseMarkerEnd: { ...defaultEdgeOptions.markerEnd },
          edgeStyle: 'solid',
          pathMode: defaultEdgeOptions.type,
        },
      }, nodes), eds));
    },
    [nodes, saveHistory, setEdges],
  );

  const onReconnect = useCallback(
    (oldEdge: any, newConnection: any) => {
      saveHistory();
      setEdges(eds => reconnectEdge(oldEdge, newConnection, eds));
    },
    [saveHistory, setEdges],
  );

  const clearGraphFocus = useCallback(() => {
    setNodes(nds => nds.map(n => {
      if (n.type === 'lane' || n.type === 'pool') return n;
      if (!(n.data as any).edgeHighlighted && !(n.data as any).dimmed) return n;
      return { ...n, data: { ...n.data, edgeHighlighted: false, dimmed: false } };
    }));
    setEdges(eds => eds.map(e => applyEdgeVisualState(e, 'base')));
  }, [setEdges, setNodes]);

  const onSelectionChange = useCallback((elements: any) => {
    const filteredElements = {
      nodes: (elements.nodes || []).filter((n: any) => editMode || (n.type !== 'lane' && n.type !== 'pool')),
      edges: elements.edges || [],
    };
    const onlyStructuralSelection =
      filteredElements.edges.length === 0 &&
      filteredElements.nodes.length > 0 &&
      filteredElements.nodes.every((node: any) => node.type === 'lane' || node.type === 'pool');

    if (onlyStructuralSelection) {
      setSelectedElements(editMode ? filteredElements : { nodes: [], edges: [] });
      clearGraphFocus();
      return;
    }

    setSelectedElements(filteredElements);

    const pickedNodes = filteredElements.nodes
      .filter((n: any) => n.type !== 'lane' && n.type !== 'pool')
      .map((n: any) => n.id);
    const pickedEdgeIds = new Set(filteredElements.edges.map((e: any) => e.id));

    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();

    if (pickedNodes.length > 0) {
      const related = collectRelatedGraph(pickedNodes, 1);
      related.nodeIds.forEach(id => nodeIds.add(id));
      related.edgeIds.forEach(id => edgeIds.add(id));
    }

    if (pickedEdgeIds.size > 0) {
      for (const edge of edgesRef.current) {
        if (!pickedEdgeIds.has(edge.id)) continue;
        edgeIds.add(edge.id);
        nodeIds.add(edge.source);
        nodeIds.add(edge.target);
      }
    }

    const hasGraphFocus = nodeIds.size > 0 || edgeIds.size > 0;

    setNodes(nds => nds.map(n => {
      if (n.type === 'lane' || n.type === 'pool') return n;
      const highlighted = nodeIds.has(n.id);
      const dimmed = hasGraphFocus && !highlighted;
      if (!!(n.data as any).edgeHighlighted === highlighted && !!(n.data as any).dimmed === dimmed) return n;
      return { ...n, data: { ...n.data, edgeHighlighted: highlighted, dimmed } };
    }));

    setEdges(eds => eds.map(e => {
      const mode = hasGraphFocus ? (edgeIds.has(e.id) ? 'highlight' : 'dim') : 'base';
      return applyEdgeVisualState(e, mode);
    }));
  }, [clearGraphFocus, collectRelatedGraph, editMode, setEdges, setNodes]);

  const onNodeClick = useCallback((_: any, node: any) => {
    if (!editMode) return;
    if (node.type !== 'lane' && node.type !== 'pool') return;
    setSelectedElements({ nodes: [node], edges: [] });
    clearGraphFocus();
  }, [clearGraphFocus, editMode]);

  const addNode = (type: string) => {
    saveHistory();
    const id = `${type}-${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type,
      position: screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      data: {
        label: type === 'note' ? t('Ny annotation') : `${t('Ny')} ${type}`,
        lane: type === 'lane' ? undefined : type === 'note' ? 'JumpYard Cloud' : 'Gäst',
        index: type === 'lane' ? nds.filter(n => n.type === 'lane').length : undefined,
        height: type === 'lane' ? '200px' : undefined,
        tone: type === 'note' ? 'info' : undefined,
        details: type === 'note' ? t('Kort förklaring eller öppet frågetecken.') : undefined,
      },
      zIndex: type === 'lane' ? -1 : 0,
    }]);
  };

  const addEventNode = (eventType: 'start' | 'end') => {
    saveHistory();
    const id = `event-${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type: 'event',
      position: screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      data: { label: eventType === 'start' ? t('Start') : t('Slut'), type: eventType, tags: ['main'] },
    }]);
  };

  const updateNodeData = (id: string, key: string, value: string) => {
    saveHistory();
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n));
  };

  const addToNodeArray = (id: string, key: string, value: string) => {
    saveHistory();
    setNodes(nds => nds.map(n => n.id === id ? {
      ...n, data: { ...n.data, [key]: [...((n.data[key] as string[]) || []), value] }
    } : n));
  };

  const removeFromNodeArray = (id: string, key: string, index: number) => {
    saveHistory();
    setNodes(nds => nds.map(n => n.id === id ? {
      ...n, data: { ...n.data, [key]: ((n.data[key] as string[]) || []).filter((_, i) => i !== index) }
    } : n));
  };

  const updateEdgeLabel = (id: string, label: string) => {
    saveHistory();
    setEdges(eds => eds.map(e => e.id === id ? { ...e, label, labelStyle: { fill: '#fff', fontWeight: 700 }, labelBgStyle: { fill: '#1a1a1a' } } : e));
  };

  const updateEdgeStyle = (id: string, style: 'solid' | 'dashed' | 'data') => {
    saveHistory();
    const cfg: Record<string, { color: string; dash?: string; w: number }> = {
      solid:  { color: '#ff8e7d', w: 2 },
      dashed: { color: '#8b5cf6', dash: '6,6', w: 2 },
      data:   { color: '#22d3ee', dash: '3,5', w: 1.5 },
    };
    const { color, dash, w } = cfg[style];
    setEdges(eds => eds.map(e => {
      if (e.id !== id) return e;
      const nextData: any = {
        ...(e.data || {}),
        edgeStyle: style,
        baseStyle: { strokeWidth: w, stroke: color, ...(dash ? { strokeDasharray: dash } : {}) },
        baseMarkerEnd: { type: MarkerType.ArrowClosed, color },
      };
      if (style === 'data') nextData.edgeKind = 'data';
      else delete nextData.edgeKind;
      const updated = {
        ...e,
        data: nextData,
      };
      return applyEdgeVisualState(updated, e.data?.edgeHighlighted ? 'highlight' : e.data?.dimmed ? 'dim' : 'base', nodes);
    }));
  };

  const updateEdgePathMode = (id: string, pathMode: 'smoothstep' | 'step' | 'straight') => {
    saveHistory();
    setEdges(eds => eds.map(e => {
      if (e.id !== id) return e;
      const updated = {
        ...e,
        type: pathMode,
        data: {
          ...(e.data || {}),
          pathMode,
        },
      };
      return applyEdgeVisualState(updated, e.data?.edgeHighlighted ? 'highlight' : e.data?.dimmed ? 'dim' : 'base', nodes);
    }));
  };

  const updateEdgeHandle = (id: string, side: 'sourceHandle' | 'targetHandle', handleId: string) => {
    saveHistory();
    setEdges(eds => eds.map(e => {
      if (e.id !== id) return e;
      const updated: any = {
        ...e,
        [side]: handleId || undefined,
      };
      if (!handleId) delete updated[side];
      return applyEdgeVisualState(updated, e.data?.edgeHighlighted ? 'highlight' : e.data?.dimmed ? 'dim' : 'base', nodes);
    }));
  };

  const updateEdgeData = (id: string, key: string, value: string) => {
    saveHistory();
    setEdges(eds => eds.map(e => {
      if (e.id !== id) return e;
      const updated = {
        ...e,
        data: {
          ...(e.data || {}),
          [key]: value,
        },
      };
      return applyEdgeVisualState(updated, e.data?.edgeHighlighted ? 'highlight' : e.data?.dimmed ? 'dim' : 'base', nodes);
    }));
  };

  const addToEdgeArray = (id: string, key: string, value: string) => {
    saveHistory();
    setEdges(eds => eds.map(e => {
      if (e.id !== id) return e;
      const updated = {
        ...e,
        data: {
          ...(e.data || {}),
          [key]: [...(((e.data || {})[key] as string[]) || []), value],
        },
      };
      return applyEdgeVisualState(updated, e.data?.edgeHighlighted ? 'highlight' : e.data?.dimmed ? 'dim' : 'base', nodes);
    }));
  };

  const removeFromEdgeArray = (id: string, key: string, index: number) => {
    saveHistory();
    setEdges(eds => eds.map(e => {
      if (e.id !== id) return e;
      const updated = {
        ...e,
        data: {
          ...(e.data || {}),
          [key]: ((((e.data || {})[key] as string[]) || []).filter((_, i) => i !== index)),
        },
      };
      return applyEdgeVisualState(updated, e.data?.edgeHighlighted ? 'highlight' : e.data?.dimmed ? 'dim' : 'base', nodes);
    }));
  };

  const deleteSelected = () => {
    saveHistory();
    if (selectedElements.nodes.length > 0) {
      const ids = new Set(selectedElements.nodes.map(n => n.id));
      setNodes(nds => nds.filter(n => !ids.has(n.id)));
    }
    if (selectedElements.edges.length > 0) {
      const ids = new Set(selectedElements.edges.map(e => e.id));
      setEdges(eds => eds.filter(e => !ids.has(e.id)));
    }
    setSelectedElements({ nodes: [], edges: [] });
  };

  // ── Alignment helpers ──────────────────────────────────────────────────────
  const alignNodes = (type: 'left' | 'centerH' | 'right' | 'top' | 'centerV' | 'bottom') => {
    const sel = selectedElements.nodes.filter(n => n.type !== 'lane');
    if (sel.length < 2) return;
    saveHistory();
    const wd = sel.map(n => ({ n, d: getNodeDims(n.type) }));
    const xs = wd.map(({ n }) => n.position.x);
    const ys = wd.map(({ n }) => n.position.y);
    const xe = wd.map(({ n, d }) => n.position.x + d.w);
    const ye = wd.map(({ n, d }) => n.position.y + d.h);
    const anchors: Record<string, number> = {
      left:    Math.min(...xs),
      centerH: (Math.min(...xs) + Math.max(...xe)) / 2,
      right:   Math.max(...xe),
      top:     Math.min(...ys),
      centerV: (Math.min(...ys) + Math.max(...ye)) / 2,
      bottom:  Math.max(...ye),
    };
    const anchor = anchors[type];
    const selIds = new Set(sel.map(n => n.id));
    setNodes(nds => nds.map(n => {
      if (!selIds.has(n.id)) return n;
      const d = getNodeDims(n.type);
      const p = { ...n.position };
      if (type === 'left')    p.x = anchor;
      if (type === 'centerH') p.x = anchor - d.w / 2;
      if (type === 'right')   p.x = anchor - d.w;
      if (type === 'top')     p.y = anchor;
      if (type === 'centerV') p.y = anchor - d.h / 2;
      if (type === 'bottom')  p.y = anchor - d.h;
      return { ...n, position: p };
    }));
  };

  const distributeNodes = (axis: 'h' | 'v') => {
    const sel = selectedElements.nodes.filter(n => n.type !== 'lane');
    if (sel.length < 3) return;
    saveHistory();
    const wd = sel.map(n => ({ n, d: getNodeDims(n.type) }));
    if (axis === 'h') {
      const sorted = [...wd].sort((a, b) => a.n.position.x - b.n.position.x);
      const span = sorted[sorted.length - 1].n.position.x + sorted[sorted.length - 1].d.w - sorted[0].n.position.x;
      const totalW = sorted.reduce((s, { d }) => s + d.w, 0);
      const gap = (span - totalW) / (sorted.length - 1);
      let x = sorted[0].n.position.x;
      const map = new Map(sorted.map(({ n, d }, i) => { const cx = x; x += d.w + gap; return [n.id, cx]; }));
      setNodes(nds => nds.map(n => map.has(n.id) ? { ...n, position: { ...n.position, x: map.get(n.id)! } } : n));
    } else {
      const sorted = [...wd].sort((a, b) => a.n.position.y - b.n.position.y);
      const span = sorted[sorted.length - 1].n.position.y + sorted[sorted.length - 1].d.h - sorted[0].n.position.y;
      const totalH = sorted.reduce((s, { d }) => s + d.h, 0);
      const gap = (span - totalH) / (sorted.length - 1);
      let y = sorted[0].n.position.y;
      const map = new Map(sorted.map(({ n, d }) => { const cy = y; y += d.h + gap; return [n.id, cy]; }));
      setNodes(nds => nds.map(n => map.has(n.id) ? { ...n, position: { ...n.position, y: map.get(n.id)! } } : n));
    }
  };

  const snapToLane = () => {
    const sel = selectedElements.nodes.filter(n => n.type !== 'lane');
    if (sel.length === 0) return;
    saveHistory();
    const laneNodes = nodes.filter(n => n.type === 'lane');
    const selIds = new Set(sel.map(n => n.id));
    setNodes(nds => nds.map(n => {
      if (!selIds.has(n.id)) return n;
      const lane = laneNodes.find(l => l.data.label === n.data.lane);
      if (!lane) return n;
      const lh = parseInt(String(lane.data.height || '150'));
      const nh = getNodeDims(n.type).h;
      return { ...n, position: { ...n.position, y: lane.position.y + lh / 2 - nh / 2 } };
    }));
  };

  const multiSel = selectedElements.nodes.filter(n => n.type !== 'lane');

  // ── Lane manager ─────────────────────────────────────────────────────────────
  const [lanesPanelOpen, setLanesPanelOpen] = useState(false);
  const [datakravOpen, setDatakravOpen] = useState(false);

  const sortedLanes = nodes
    .filter(n => n.type === 'lane')
    .sort((a, b) => a.position.y - b.position.y);

  const moveLane = (laneId: string, dir: 'up' | 'down') => {
    const idx = sortedLanes.findIndex(l => l.id === laneId);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedLanes.length) return;
    saveHistory();
    const laneA = sortedLanes[idx];
    const laneB = sortedLanes[swapIdx];
    const labelA = String(laneA.data.label);
    const labelB = String(laneB.data.label);
    const yA = laneA.position.y, yB = laneB.position.y;
    setNodes(nds => nds.map(n => {
      if (n.id === laneA.id) return { ...n, position: { ...n.position, y: yB }, data: { ...n.data, index: swapIdx } };
      if (n.id === laneB.id) return { ...n, position: { ...n.position, y: yA }, data: { ...n.data, index: idx } };
      if (n.type !== 'lane' && String(n.data.lane) === labelA) return { ...n, position: { ...n.position, y: n.position.y + (yB - yA) } };
      if (n.type !== 'lane' && String(n.data.lane) === labelB) return { ...n, position: { ...n.position, y: n.position.y + (yA - yB) } };
      return n;
    }));
  };

  const renameLane = (laneId: string, newName: string) => {
    const lane = nodes.find(n => n.id === laneId);
    if (!lane) return;
    const oldName = String(lane.data.label);
    setNodes(nds => nds.map(n => {
      if (n.id === laneId) return { ...n, data: { ...n.data, label: newName } };
      if (n.type !== 'lane' && String(n.data.lane) === oldName) return { ...n, data: { ...n.data, lane: newName } };
      return n;
    }));
  };

  const addLaneFn = () => {
    saveHistory();
    const last = sortedLanes[sortedLanes.length - 1];
    const newY = last ? last.position.y + parseInt(String(last.data.height || '200')) : 0;
    const id = `lane-${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type: 'lane',
      position: { x: -100, y: newY },
      data: { label: 'Ny lane', index: sortedLanes.length, height: '200px', width: '6200px' },
      selectable: true, draggable: false, zIndex: -1,
    }]);
  };

  const deleteLaneFn = (laneId: string) => {
    if (!confirm(t('Ta bort lane? Noder i lanen finns kvar men utan lane-tillhörighet.'))) return;
    saveHistory();
    setNodes(nds => nds.filter(n => n.id !== laneId));
  };

  // ── Pool management ──────────────────────────────────────────────────────────
  const POOL_COLORS = ['#ff8e7d', '#6366f1', '#f59e0b', '#22d3ee', '#22c55e', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

  const sortedPools = nodes
    .filter(n => n.type === 'pool')
    .sort((a, b) => a.position.y - b.position.y);

  const addPoolFn = () => {
    saveHistory();
    const last = sortedPools[sortedPools.length - 1] ?? sortedLanes[sortedLanes.length - 1];
    const lastH = (last?.data as any)?.heightPx || parseInt(String((last?.data as any)?.height || '200')) || 200;
    const newY = last ? last.position.y + lastH + 20 : 0;
    const usedColors = new Set(sortedPools.map(p => (p.data as any).color));
    const nextColor = POOL_COLORS.find(c => !usedColors.has(c)) ?? POOL_COLORS[sortedPools.length % POOL_COLORS.length];
    const id = `pool-${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type: 'pool',
      position: { x: -280, y: newY },
      data: { label: 'Ny pool', color: nextColor, heightPx: 240, widthPx: 6600 },
      selectable: false, draggable: false, zIndex: -2,
    }]);
  };

  const deletePoolFn = (poolId: string) => {
    if (!confirm(t('Ta bort pool? Lanes och noder påverkas inte.'))) return;
    saveHistory();
    setNodes(nds => nds.filter(n => n.id !== poolId));
  };

  const renamePoolFn = (poolId: string, newName: string) => {
    setNodes(nds => nds.map(n => n.id === poolId ? { ...n, data: { ...n.data, label: newName } } : n));
  };

  const movePool = (poolId: string, dir: 'up' | 'down') => {
    const sorted = [...nodes].filter(n => n.type === 'pool').sort((a, b) => a.position.y - b.position.y);
    const idx = sorted.findIndex(p => p.id === poolId);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    saveHistory();
    const pA = sorted[idx], pB = sorted[swapIdx];
    const delta = pB.position.y - pA.position.y;
    const lanesOf = (pool: any) => nodes
      .filter(n => n.type === 'lane' && n.position.y >= pool.position.y && n.position.y < pool.position.y + ((pool.data as any).heightPx || 300))
      .map(l => String(l.data.label));
    const labelsA = new Set(lanesOf(pA));
    const labelsB = new Set(lanesOf(pB));
    setNodes(nds => nds.map(n => {
      if (n.id === pA.id) return { ...n, position: { ...n.position, y: n.position.y + delta } };
      if (n.id === pB.id) return { ...n, position: { ...n.position, y: n.position.y - delta } };
      if (n.type === 'lane' && labelsA.has(String(n.data.label))) return { ...n, position: { ...n.position, y: n.position.y + delta } };
      if (n.type === 'lane' && labelsB.has(String(n.data.label))) return { ...n, position: { ...n.position, y: n.position.y - delta } };
      if (n.type !== 'lane' && n.type !== 'pool' && labelsA.has(String(n.data.lane))) return { ...n, position: { ...n.position, y: n.position.y + delta } };
      if (n.type !== 'lane' && n.type !== 'pool' && labelsB.has(String(n.data.lane))) return { ...n, position: { ...n.position, y: n.position.y - delta } };
      return n;
    }));
  };

  const updateLaneHeight = (laneId: string, newHeightPx: number) => {
    saveHistory();
    setNodes(nds => {
      const lane = nds.find(n => n.id === laneId);
      if (!lane) return nds;
      const oldH = (lane.data as any).heightPx || parseInt(String((lane.data as any).height || '200')) || 200;
      const delta = newHeightPx - oldH;
      if (delta === 0) return nds;
      const laneY = lane.position.y;
      return nds.map(n => {
        if (n.id === laneId) {
          return { ...n, data: { ...n.data, heightPx: newHeightPx, height: `${newHeightPx}px` } };
        }
        // Shift all lanes and nodes below this lane
        if (n.position.y > laneY && n.type === 'lane') {
          return { ...n, position: { ...n.position, y: n.position.y + delta } };
        }
        if (n.position.y > laneY && n.type !== 'lane' && n.type !== 'pool') {
          return { ...n, position: { ...n.position, y: n.position.y + delta } };
        }
        // Resize pool nodes that contain this lane
        if (n.type === 'pool') {
          const poolTop = n.position.y;
          const poolBot = poolTop + ((n.data as any).heightPx || 300);
          if (laneY >= poolTop && laneY < poolBot) {
            return { ...n, data: { ...n.data, heightPx: (n.data as any).heightPx + delta } };
          }
          if (n.position.y > laneY) {
            return { ...n, position: { ...n.position, y: n.position.y + delta } };
          }
        }
        return n;
      });
    });
  };

  // ── Add lane to specific pool ────────────────────────────────────────────────
  const addLaneToPool = (poolId: string) => {
    saveHistory();
    setNodes(nds => {
      const pool = nds.find(n => n.id === poolId);
      if (!pool) return nds;
      const poolLanes = nds
        .filter(n => n.type === 'lane' && String((n.data as any).poolId) === poolId)
        .sort((a, b) => a.position.y - b.position.y);
      const newH = 200;
      const oldPoolBottom = pool.position.y + ((pool.data as any).heightPx || 300);
      const insertY = poolLanes.length > 0
        ? poolLanes[poolLanes.length - 1].position.y + ((poolLanes[poolLanes.length - 1].data as any).heightPx || 200)
        : pool.position.y + 20;
      const newIndex = nds.filter(n => n.type === 'lane').length;
      const newId = `lane-${Date.now()}`;
      const updated = nds.map(n => {
        if (n.id === poolId) return { ...n, data: { ...n.data, heightPx: (n.data as any).heightPx + newH } };
        if (n.id !== poolId && n.position.y >= oldPoolBottom) return { ...n, position: { ...n.position, y: n.position.y + newH } };
        return n;
      });
      return [...updated, {
        id: newId, type: 'lane',
        position: { x: -100, y: insertY },
        data: { label: 'Ny lane', index: newIndex, height: `${newH}px`, width: '6200px', heightPx: newH, poolId },
        selectable: true, draggable: false, zIndex: -1,
      }];
    });
  };

  // ── Move lane to different pool ───────────────────────────────────────────────
  const moveLaneToPool = (laneId: string, newPoolId: string) => {
    saveHistory();
    setNodes(nds => {
      const lane = nds.find(n => n.id === laneId);
      if (!lane) return nds;
      const oldPoolId = String((lane.data as any).poolId ?? '');
      if (oldPoolId === newPoolId) return nds;
      const laneH = (lane.data as any).heightPx || 200;
      const laneY = lane.position.y;
      const laneLabel = String(lane.data.label);

      // Pass 1: remove lane from old pool — shift everything strictly below laneY up by laneH
      const pass1 = nds.map(n => {
        if (n.id === laneId) return n; // repositioned in pass 2
        if (n.type !== 'lane' && n.type !== 'pool' && String(n.data.lane) === laneLabel) return n; // tasks follow in pass 2
        if (n.id === oldPoolId) return { ...n, data: { ...n.data, heightPx: (n.data as any).heightPx - laneH } };
        if (n.position.y > laneY) return { ...n, position: { ...n.position, y: n.position.y - laneH } };
        return n;
      });

      // Pass 2: insert at bottom of new pool
      const newPoolNode = pass1.find(n => n.id === newPoolId);
      if (!newPoolNode) return nds;
      const newPoolBottom = newPoolNode.position.y + ((newPoolNode.data as any).heightPx || 300);
      const insertY = newPoolBottom;
      const deltaY = insertY - laneY;

      return pass1.map(n => {
        if (n.id === laneId) return { ...n, position: { ...n.position, y: insertY }, data: { ...n.data, poolId: newPoolId } };
        if (n.type !== 'lane' && n.type !== 'pool' && String(n.data.lane) === laneLabel) return { ...n, position: { ...n.position, y: n.position.y + deltaY } };
        if (n.id === newPoolId) return { ...n, data: { ...n.data, heightPx: (n.data as any).heightPx + laneH } };
        if (n.position.y >= newPoolBottom) return { ...n, position: { ...n.position, y: n.position.y + laneH } };
        return n;
      });
    });
  };

  // ── Snap guides ─────────────────────────────────────────────────────────────

  // ── Walk key listeners (hold → to walk, single ← to step back) ─────────────
  useEffect(() => {
    if (!walkActive) return;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        rightHeld.current = true;
      }
      // ← goes back one node per keypress (ignore repeats)
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowDown') && !e.repeat) {
        e.preventDefault();
        const eng = walkEng.current;
        if (eng.history.length > 0) {
          // Cancel any in-progress walk
          eng.phase     = 'idle';
          eng.waypoints = [];
          eng.wpIdx     = 0;
          eng.targetId  = null;
          eng.currentId = eng.history.pop()!;
          setWalkPhase('idle');
          setWalkCurrentId(eng.currentId);
          const node = nodesRef.current.find(n => n.id === eng.currentId);
          if (node) {
            const d = getNodeDims(node.type);
            setCharFlowPos({ x: node.position.x + d.w / 2, y: node.position.y - 18 });
          }
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') rightHeld.current = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [walkActive]);

  const edgeStyle: 'solid' | 'dashed' | 'data' = selectedEdge
    ? ((selectedEdge.data as any)?.edgeStyle ??
       ((selectedEdge.style as any)?.strokeDasharray ? 'dashed' : 'solid'))
    : 'solid';
  const edgePathMode: 'smoothstep' | 'step' | 'straight' = selectedEdge
    ? (((selectedEdge.data as any)?.pathMode || selectedEdge.type || 'smoothstep') as 'smoothstep' | 'step' | 'straight')
    : 'smoothstep';

  const displayNodes = nodes
    .filter((node) => !isCanvasHiddenNode(node))
    .map((node) => {
    const data = getProjectedNodeData(node, language) as any;
    data.layoutSelected =
      editMode &&
      selectedElements.edges.length === 0 &&
      selectedElements.nodes.some((selectedNode) => selectedNode.id === node.id && (selectedNode.type === 'lane' || selectedNode.type === 'pool'));
    data.editMode = editMode;
    if (node.type === 'database') {
      data.onToggleCollapse = () => toggleDatabaseCollapse(node.id);
      data.expandLabel = t('Fäll ut');
      data.collapseLabel = t('Fäll ihop');
      data.expandHint = t('Visa lagrad data');
    }
    if (node.type === 'pool') {
      return { ...node, data, draggable: !!data.layoutSelected, selectable: editMode, selected: false, zIndex: -2 };
    }
    if (node.type === 'lane') {
      return { ...node, data, draggable: !!data.layoutSelected, selectable: editMode, selected: false, zIndex: -1 };
    }
    return { ...node, data, draggable: editMode };
  });

  const displayEdges = edges
    .filter((edge) => getEdgeCategory(edge) !== 'arch')
    .filter((edge) => !HIDDEN_CANVAS_NODE_IDS.has(edge.source) && !HIDDEN_CANVAS_NODE_IDS.has(edge.target))
    .map((edge) => (
      typeof edge.label === 'string'
        ? { ...edge, label: t(edge.label) }
        : edge
    ));

  return (
    <div className="bg-background text-on-surface font-manrope selection:bg-primary selection:text-white min-h-screen flex flex-col">

      {/* ── Header ── */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5 z-50 gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-2xl font-black italic epilogue text-white uppercase tracking-widest shrink-0">
            JUMPYARD<span className="text-primary">_BPMN</span>
          </span>
          <div className="hidden md:block text-[#ff8e7d] font-bold italic epilogue border-b-2 border-[#ff8e7d] pb-1 tracking-tighter whitespace-nowrap">
            {t('Gemensamt WebApp-flöde')}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setLanguage('sv')}
              title={t('Byt språk')}
              className={`rounded px-2 py-1 text-[10px] font-black tracking-widest transition-colors ${language === 'sv' ? 'bg-white text-[#0e0e0e]' : 'text-white/55 hover:text-white hover:bg-white/10'}`}
            >
              SV
            </button>
            <button
              onClick={() => setLanguage('en')}
              title={t('Byt språk')}
              className={`rounded px-2 py-1 text-[10px] font-black tracking-widest transition-colors ${language === 'en' ? 'bg-white text-[#0e0e0e]' : 'text-white/55 hover:text-white hover:bg-white/10'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setEditMode(m => !m)}
            title={editMode ? t('Byt till visningsläge') : t('Byt till redigeringsläge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-all ${editMode ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            {editMode ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editMode ? t('Visa') : t('Redigera')}
          </button>

          {editMode && (
            <button onClick={undo} disabled={history.length === 0} title={t('Ångra (Ctrl+Z)')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Undo2 className="w-3.5 h-3.5" />{t('Ångra')}
            </button>
          )}

          {editMode && (
            <button onClick={saveAsDefault} title={t('Spara nuläge som ursprungsdata i källkoden')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
              {t('Spara som standard')}
            </button>
          )}

          {editMode && (
            <button onClick={resetToDefaults} title={t('Återställ till ursprungsdata')}
              className="p-2 rounded border border-white/10 bg-white/5 text-white/40 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              if (walkActive) { setWalkActive(false); setWalkCurrentId(null); setWalkPhase('idle'); }
              else { setWalkActive(true); }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-all ${walkActive ? 'bg-orange-500/20 border-orange-400 text-orange-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            {walkActive ? `⏹ ${t('Stoppa')}` : `▶ ${t('Kör igenom')}`}
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <div className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            {localStorage.getItem(STORAGE_NODES) ? t('Lokalt sparat') : t('Live Draft')}
          </div>
          <div className="flex items-center gap-1 border border-white/10 rounded px-1 py-0.5">
            <button
              onClick={exportToPng}
              disabled={exporting !== null}
              title={t('Exportera som PNG')}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 rounded transition-all disabled:opacity-40"
            >
              <Download className="w-3 h-3" />PNG
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={exportToPdf}
              disabled={exporting !== null}
              title={t('Exportera som PDF')}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 rounded transition-all disabled:opacity-40"
            >
              <Download className="w-3 h-3" />PDF
            </button>
          </div>
        </div>
      </header>

      {/* ── Selected-edge highlight CSS ── */}
      <style>{`.react-flow__edge.selected .react-flow__edge-path { stroke-width: 3px !important; filter: drop-shadow(0 0 6px rgba(255,255,255,0.32)); }`}</style>

      {/* ── Lanes panel ── */}
      {editMode && lanesPanelOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div className="px-6 py-3 max-w-2xl relative">
            <button
              onClick={() => setLanesPanelOpen(false)}
              className="absolute top-2 right-4 text-white/30 hover:text-white text-lg leading-none px-2 py-1 rounded hover:bg-white/5 transition-all"
              title={t('Stäng')}
            >×</button>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('Lanes')}</span>
              <button
                onClick={addLaneFn}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                + {t('Lägg till lane')}
              </button>
            </div>
            <div className="space-y-1">
              {sortedLanes.map((lane, idx) => (
                <LaneRow
                  key={lane.id}
                  lane={lane}
                  isFirst={idx === 0}
                  isLast={idx === sortedLanes.length - 1}
                  onMove={(dir) => moveLane(lane.id, dir)}
                  onRename={(name) => renameLane(lane.id, name)}
                  onDelete={() => deleteLaneFn(lane.id)}
                  onResize={(h) => updateLaneHeight(lane.id, h)}
                  pools={sortedPools}
                  onMoveToPool={(newPoolId) => moveLaneToPool(lane.id, newPoolId)}
                  language={language}
                />
              ))}
            </div>
            {/* Pool management */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('Pooler')}</span>
                <button
                  onClick={addPoolFn}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >+ {t('Lägg till pool')}</button>
              </div>
              <div className="space-y-1">
                {sortedPools.map((pool, idx) => (
                  <PoolRow
                    key={pool.id}
                    pool={pool}
                    isFirst={idx === 0}
                    isLast={idx === sortedPools.length - 1}
                    onMove={(dir) => movePool(pool.id, dir)}
                    onRename={name => renamePoolFn(pool.id, name)}
                    onDelete={() => deletePoolFn(pool.id)}
                    onAddLane={() => addLaneToPool(pool.id)}
                    language={language}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-1 relative flex"
        style={{ marginTop: editMode && lanesPanelOpen ? `calc(5rem + ${44 + sortedLanes.length * 40 + 44 + sortedPools.length * 36}px)` : '5rem' }}
      >
        <div className="flex-1 relative" ref={flowRef}>
          <ReactFlow
            nodes={displayNodes} edges={displayEdges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onSelectionChange={onSelectionChange}
            onNodeClick={onNodeClick}
            onReconnect={editMode ? onReconnect : undefined}

            nodeTypes={nodeTypes} defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
            nodesDraggable={editMode} nodesConnectable={editMode}
            edgesFocusable={editMode} edgesUpdatable={editMode}
            deleteKeyCode={editMode ? ['Delete', 'Backspace'] : []}
            elementsSelectable={true}
            fitView fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1} maxZoom={2}
            className="bg-[#707070]"
          >
            <Background color="#9a9a9a" gap={20} size={1.5} opacity={0.25} />
            <Controls className="bg-[#1a1a1a] border-white/10 fill-white" showInteractive={false} />
            <ViewportTracker onUpdate={onViewportUpdate} />

            {editMode && (
              <Panel position="top-left" className="bg-[#1a1a1a] p-2 rounded-lg border border-white/10 shadow-xl m-4 flex gap-2 flex-wrap">
                <button onClick={() => addEventNode('start')} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold rounded transition-colors">● {t('Start')}</button>
                <button onClick={() => addEventNode('end')}   className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded transition-colors">● {t('Slut')}</button>
                <div className="w-px bg-white/10 self-stretch mx-1" />
                <button onClick={() => addNode('task')}     className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ {t('Task')}</button>
                <button onClick={() => addNode('gateway')}  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ {t('Gateway')}</button>
                <button onClick={() => addNode('database')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ {t('DB')}</button>
                <button onClick={() => addNode('note')}     className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ {t('Note')}</button>
                <button
                  onClick={() => setLanesPanelOpen(v => !v)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-colors border ${lanesPanelOpen ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                >☰ {t('Lanes')}</button>
                <button
                  onClick={() => setDatakravOpen(v => !v)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-colors border ${datakravOpen ? 'bg-[#ff8e7d]/20 border-[#ff8e7d] text-[#ff8e7d]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                >⚡ {t('Arkitektur / Ops')}</button>
              </Panel>
            )}

            <Panel position="bottom-left" className="m-4 rounded-lg border border-white/10 bg-[#131313]/90 px-3 py-2 shadow-xl backdrop-blur-sm pointer-events-none">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/35">{t('Legend')}</div>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-white/65">
                  <span className="block w-6 border-t-2 border-[#ff8e7d]" />
                  {t('Primärt användarflöde')}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/65">
                  <span className="block w-6 border-t-2 border-cyan-400" style={{ borderTopStyle: 'dashed' }} />
                  {t('Dataflöde: läs, skriv och lagra')}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/65">
                  <span className="block w-6 border-t-2 border-violet-400" style={{ borderTopStyle: 'dashed' }} />
                  {t('På plats, kiosk och fallback')}
                </div>
                <div className="text-[10px] text-amber-200/85">{t('Gula notes = måste verifieras med Joao')}</div>
              </div>
            </Panel>

            <MiniMap
              nodeColor={node => {
                if (node.type === 'gateway') return '#ff8e7d';
                if (node.type === 'database') return node.data.future ? '#64748b' : '#0891b2';
                if (node.type === 'event') return node.data.type === 'start' ? '#22c55e' : '#ef4444';
                if (node.type === 'zone') return node.data.theme === 'future' ? '#64748b' : node.data.theme === 'architecture' ? '#334155' : node.data.theme === 'ops' ? '#166534' : '#0f766e';
                if (node.type === 'note') {
                  if (node.data.tone === 'warning') return '#fbbf24';
                  if (node.data.tone === 'system') return '#fb923c';
                  if (node.data.tone === 'guide') return '#94a3b8';
                  return '#22d3ee';
                }
                if (node.data?.archCategory === 'job') return '#16a34a';
                if (node.data?.archCategory === 'aws') return '#0ea5e9';
                if (node.data?.archCategory === 'roller') return '#f97316';
                return '#333';
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              className="bg-[#131313] border border-white/10 rounded-lg overflow-hidden"
            />

          </ReactFlow>


          {walkActive && (() => {
            const talkNode = walkPhase === 'idle' ? nodes.find(n => n.id === walkCurrentId) : null;
            const talkNodeData = talkNode ? localizeValue(talkNode.data, language) : null;
            const charX = charFlowPos.x * viewport.zoom + viewport.x;
            const charY = charFlowPos.y * viewport.zoom + viewport.y;
            return (
              <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
                <div className="absolute" style={{ left: charX, top: charY, transform: 'translateX(-50%) translateY(-100%)' }}>
                  {talkNode && (
                    <div className="relative mb-2 w-52 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-100 p-3 text-xs">
                      <div className="font-black text-[10px] uppercase tracking-wider mb-1.5" style={{ color: '#ff8e7d' }}>
                        {String(talkNodeData?.label)}
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {String((talkNodeData as any)?.details || (talkNodeData as any)?.note || talkNodeData?.label)}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2"
                        style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid white' }} />
                    </div>
                  )}
                  <div className="flex justify-center">
                    <PixelChar frame={walkPhase === 'walking' ? WALK_FRAMES[walkFrame] : SPRITE_STAND} />
                  </div>
                  {false && (
                  <>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Routing')}</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => updateEdgePathMode(selectedEdge.id, 'smoothstep')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'smoothstep' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        Smooth
                      </button>
                      <button
                        onClick={() => updateEdgePathMode(selectedEdge.id, 'step')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'step' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        Step
                      </button>
                      <button
                        onClick={() => updateEdgePathMode(selectedEdge.id, 'straight')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'straight' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        Straight
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Från handle')}</label>
                      <select
                        value={selectedEdge.sourceHandle || ''}
                        onChange={e => updateEdgeHandle(selectedEdge.id, 'sourceHandle', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                      >
                        {getHandleOptionsForNode(selectedEdgeSourceNode).map((option) => (
                          <option key={option.value || 'auto'} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Till handle')}</label>
                      <select
                        value={selectedEdge.targetHandle || ''}
                        onChange={e => updateEdgeHandle(selectedEdge.id, 'targetHandle', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                      >
                        {getHandleOptionsForNode(selectedEdgeTargetNode).map((option) => (
                          <option key={option.value || 'auto'} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Routing')}</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => updateEdgePathMode(selectedEdge.id, 'smoothstep')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'smoothstep' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        Smooth
                      </button>
                      <button
                        onClick={() => updateEdgePathMode(selectedEdge.id, 'step')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'step' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        Step
                      </button>
                      <button
                        onClick={() => updateEdgePathMode(selectedEdge.id, 'straight')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'straight' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        Straight
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Från handle')}</label>
                      <select
                        value={selectedEdge.sourceHandle || ''}
                        onChange={e => updateEdgeHandle(selectedEdge.id, 'sourceHandle', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                      >
                        {getHandleOptionsForNode(selectedEdgeSourceNode).map((option) => (
                          <option key={option.value || 'auto'} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Till handle')}</label>
                      <select
                        value={selectedEdge.targetHandle || ''}
                        onChange={e => updateEdgeHandle(selectedEdge.id, 'targetHandle', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                      >
                        {getHandleOptionsForNode(selectedEdgeTargetNode).map((option) => (
                          <option key={option.value || 'auto'} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  </>
                  )}
                </div>
                {/* Hint overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 items-center">
                  <div className="bg-black/70 text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    {t('Håll')} <kbd className="text-white">→</kbd> {t('för att gå')} · <kbd className="text-white">←</kbd> {t('för att backa')}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Detail / Inspector Panel ── */}
        {hasSelection && (
          <div className="w-80 bg-[#131313] border-l border-white/10 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 overflow-y-auto">

            <div className="px-6 pt-6 pb-4 border-b border-white/5">
              <h2 className="text-lg font-epilogue italic font-black text-white">
                {selectedNode
                  ? selectedNodeViewLabel
                  : t('Kant')}
              </h2>
              {selectedNodeViewData?.note && (
                <p className="text-xs text-white/40 mt-1 leading-relaxed">{selectedNodeViewData.note}</p>
              )}
            </div>

            <div className="p-6 space-y-5">

              {/* ── Alignment toolbar (multi-select) ── */}
              {editMode && multiSel.length >= 2 && (
                <div className="pb-4 border-b border-white/5 space-y-3">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                    {`${t('Justera')} (${multiSel.length} ${t('markerade')})`}
                  </p>

                  {/* Align row */}
                  <div className="grid grid-cols-6 gap-1">
                    {([
                      ['left',    '⫤', '⬅', 'Vänsterjustera'],
                      ['centerH', '⬛', '↔', 'Centrera horisontellt'],
                      ['right',   '⊣', '➡', 'Högerjustera'],
                      ['top',     '⊤', '↑', 'Toppjustera'],
                      ['centerV', '↕', '↕', 'Centrera vertikalt'],
                      ['bottom',  '⊥', '↓', 'Bottenjustera'],
                    ] as const).map(([key, , icon, title]) => (
                      <button key={key} onClick={() => alignNodes(key as any)} title={t(title)}
                        className="py-1.5 text-sm bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded border border-white/10 transition-colors flex items-center justify-center">
                        {icon}
                      </button>
                    ))}
                  </div>

                  {/* Labels row */}
                  <div className="grid grid-cols-6 gap-1">
                    {['L', 'C↔', 'R', 'T', 'C↕', 'B'].map(lbl => (
                      <div key={lbl} className="text-[9px] text-white/25 text-center font-bold tracking-widest">{lbl}</div>
                    ))}
                  </div>

                  {/* Distribute + snap */}
                  <div className="grid grid-cols-2 gap-1">
                    <button onClick={() => distributeNodes('h')} disabled={multiSel.length < 3}
                      title={t('Fördela jämnt horisontellt')}
                      className="py-1.5 text-xs font-bold bg-white/5 hover:bg-white/15 text-white/60 hover:text-white rounded border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      {t('Fördela ↔')}
                    </button>
                    <button onClick={() => distributeNodes('v')} disabled={multiSel.length < 3}
                      title={t('Fördela jämnt vertikalt')}
                      className="py-1.5 text-xs font-bold bg-white/5 hover:bg-white/15 text-white/60 hover:text-white rounded border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      {t('Fördela ↕')}
                    </button>
                  </div>
                  <button onClick={snapToLane}
                    title={t('Centrera markerade noder vertikalt i sin lane')}
                    className="w-full py-1.5 text-xs font-bold bg-white/5 hover:bg-white/15 text-white/60 hover:text-white rounded border border-white/10 transition-colors">
                    {t('Centrera i lane ↕')}
                  </button>
                </div>
              )}

              {/* ── Label / lane edit ── */}
              {editMode && selectedNode && (
                <div className="space-y-3 pb-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">{t('Redigera')}</p>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Label')}</label>
                    <input type="text" value={selectedNode.data.label || ''}
                      onChange={e => updateNodeData(selectedNode.id, 'label', e.target.value)}
                      className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none" />
                  </div>
                  {selectedNode.type !== 'lane' && (
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Lane')}</label>
                      <select
                        value={String(selectedNode.data.lane || '')}
                        onChange={e => updateNodeData(selectedNode.id, 'lane', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                      >
                        <option value="">{t('— välj lane —')}</option>
                        {nodes.filter(n => n.type === 'lane').map(l => (
                          <option key={l.id} value={String(l.data.label)}>{t(String(l.data.label))}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* ── Edge edit ── */}
              {editMode && selectedEdge && (
                <div className="space-y-3 pb-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">{t('Redigera kant')}</p>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Label')}</label>
                    <input type="text" value={typeof selectedEdge.label === 'string' ? selectedEdge.label : ''}
                      onChange={e => updateEdgeLabel(selectedEdge.id, e.target.value)}
                      className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Kanttyp')}</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, 'solid')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgeStyle === 'solid' ? 'bg-[#ff8e7d]/20 border-[#ff8e7d] text-[#ff8e7d]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        ——<br/><span className="text-[9px]">{t('Process')}</span>
                      </button>
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, 'dashed')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgeStyle === 'dashed' ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        - -<br/><span className="text-[9px]">{t('Fallback')}</span>
                      </button>
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, 'data')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgeStyle === 'data' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        ···<br/><span className="text-[9px]">{t('Data')}</span>
                      </button>
                    </div>
                  </div>
                  <EdgeMeta edge={selectedEdge} sourceLabel={selectedEdgeSourceLabel} targetLabel={selectedEdgeTargetLabel} language={language} />
                  {getEdgeCategory(selectedEdge) === 'data' && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Dataflöde')}</label>
                        <textarea value={String(selectedEdge.data?.details || '')}
                          onChange={e => updateEdgeData(selectedEdge.id, 'details', e.target.value)}
                          rows={3}
                          className="w-full text-xs text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none resize-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Operation')}</label>
                        <input
                          type="text"
                          value={String(selectedEdge.data?.operation || '')}
                          onChange={e => updateEdgeData(selectedEdge.id, 'operation', e.target.value)}
                          className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                        />
                      </div>
                      <ArrayField
                        label={t('Hämtar / skriver')}
                        items={((selectedEdge.data?.fields as string[]) || [])}
                        onAdd={(value) => addToEdgeArray(selectedEdge.id, 'fields', value)}
                        onRemove={(index) => removeFromEdgeArray(selectedEdge.id, 'fields', index)}
                        placeholder={t('Lägg till fält...')}
                      />
                      <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Varför flödet finns')}</label>
                        <textarea value={String(selectedEdge.data?.why || '')}
                          onChange={e => updateEdgeData(selectedEdge.id, 'why', e.target.value)}
                          rows={2}
                          className="w-full text-xs text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none resize-none" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Editable metadata (edit mode) ── */}
              {editMode && selectedNode && selectedNode.type !== 'lane' && (
                <div className="space-y-4 pt-1 border-t border-white/5">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">{t('Metadata')}</p>

                  {selectedNode.type === 'event' && (
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Typ')}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => updateNodeData(selectedNode.id, 'type', 'start')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${selectedNode.data.type === 'start' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                          ● {t('Start')}
                        </button>
                        <button onClick={() => updateNodeData(selectedNode.id, 'type', 'intermediate')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${selectedNode.data.type === 'intermediate' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                          ● {t('Mellan')}
                        </button>
                        <button onClick={() => updateNodeData(selectedNode.id, 'type', 'end')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${selectedNode.data.type === 'end' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                          ● {t('Slut')}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedNode.type === 'note' && (
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Ton')}</label>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          ['guide', 'Guide'],
                          ['info', 'Cloud'],
                          ['warning', 'Fraga'],
                          ['system', 'System'],
                        ].map(([tone, label]) => (
                          <button
                            key={tone}
                            onClick={() => updateNodeData(selectedNode.id, 'tone', tone)}
                            className={`py-1.5 text-[10px] font-bold rounded border transition-all ${
                              selectedNode.data.tone === tone
                                ? 'bg-white/15 border-white/25 text-white'
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                            }`}
                          >
                            {t(label)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Beskrivning')}</label>
                    <textarea value={(selectedNode.data as any).details || ''}
                      onChange={e => updateNodeData(selectedNode.id, 'details', e.target.value)}
                      rows={3} placeholder={t('Beskriv vad steget gör...')}
                      className="w-full text-xs text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none resize-none" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Varför noden finns')}</label>
                    <textarea value={(selectedNode.data as any).why || ''}
                      onChange={e => updateNodeData(selectedNode.id, 'why', e.target.value)}
                      rows={2} placeholder={t('Motivering...')}
                      className="w-full text-xs text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none resize-none" />
                  </div>

                  <ArrayField label={t('System')}
                    items={(selectedNode.data as any).systems || []}
                    onAdd={v => addToNodeArray(selectedNode.id, 'systems', v)}
                    onRemove={i => removeFromNodeArray(selectedNode.id, 'systems', i)}
                    placeholder={t('Lägg till system...')} />

                  <ArrayField label={t('Risker')}
                    items={(selectedNode.data as any).risks || []}
                    onAdd={v => addToNodeArray(selectedNode.id, 'risks', v)}
                    onRemove={i => removeFromNodeArray(selectedNode.id, 'risks', i)}
                    placeholder={t('Lägg till risk...')} />

                  <ArrayField label={t('Källor')}
                    items={(selectedNode.data as any).sources || []}
                    onAdd={v => addToNodeArray(selectedNode.id, 'sources', v)}
                    onRemove={i => removeFromNodeArray(selectedNode.id, 'sources', i)}
                    placeholder={t('Lägg till källa...')} />
                </div>
              )}

              {/* ── Read-only metadata (view mode) ── */}
              {!editMode && selectedEdge && (
                <EdgeMeta edge={{ ...selectedEdge, data: selectedEdgeViewData || selectedEdge.data }} sourceLabel={selectedEdgeSourceLabel} targetLabel={selectedEdgeTargetLabel} language={language} />
              )}
              {!editMode && !selectedEdge && selectedNodeViewData && <NodeMeta data={selectedNodeViewData as any} language={language} />}

              {/* ── Delete ── */}
              {editMode && (
                <div className="pt-2 border-t border-white/5">
                  <button onClick={deleteSelected}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-bold rounded transition-colors">
                    {t('Ta bort markerade')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {false && editMode && selectedEdge && (
        <div className="fixed right-[21rem] top-24 z-40 w-72 rounded-xl border border-white/10 bg-[#111111]/96 p-4 shadow-2xl backdrop-blur-xl">
          <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">{t('Pilar & routing')}</div>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">{t('Routing')}</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => updateEdgePathMode(selectedEdge.id, 'smoothstep')}
                  className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'smoothstep' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                >
                  {t('Smooth')}
                </button>
                <button
                  onClick={() => updateEdgePathMode(selectedEdge.id, 'step')}
                  className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'step' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                >
                  {t('Step')}
                </button>
                <button
                  onClick={() => updateEdgePathMode(selectedEdge.id, 'straight')}
                  className={`py-1.5 text-xs font-bold rounded border transition-all ${edgePathMode === 'straight' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                >
                  {t('Straight')}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Från handle')}</label>
                <select
                  value={selectedEdge.sourceHandle || ''}
                  onChange={e => updateEdgeHandle(selectedEdge.id, 'sourceHandle', e.target.value)}
                  className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                >
                  {getHandleOptionsForNode(selectedEdgeSourceNode).map((option) => (
                    <option key={option.value || 'auto'} value={option.value}>{t(option.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{t('Till handle')}</label>
                <select
                  value={selectedEdge.targetHandle || ''}
                  onChange={e => updateEdgeHandle(selectedEdge.id, 'targetHandle', e.target.value)}
                  className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                >
                  {getHandleOptionsForNode(selectedEdgeTargetNode).map((option) => (
                    <option key={option.value || 'auto'} value={option.value}>{t(option.label)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-[10px] leading-relaxed text-white/45">
              {t('Tips: välj annan handle eller routingtyp för att styra hur pilen lämnar och går in i noderna.')}
            </div>
          </div>
        </div>
      )}

      {datakravOpen && <ArchitecturePanel onClose={() => setDatakravOpen(false)} language={language} nodes={nodes} />}
    </div>
  );
}
