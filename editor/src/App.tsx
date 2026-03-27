import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Bell, User, Undo2, RotateCcw, Eye, Pencil, Download } from 'lucide-react';
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

// ─── Custom Node Components ────────────────────────────────────────────────────

const TaskNode = ({ data }: any) => (
  <div className={`px-4 py-3 shadow-md rounded-md bg-surface-container border-2 ${data.edgeHighlighted ? 'border-[#ff8e7d] shadow-[0_0_12px_rgba(255,142,125,0.5)]' : data.isPrimary ? 'border-primary shadow-primary/20 kinetic-glow' : 'border-white/10'} w-fit max-w-[220px] text-center transition-shadow`}>
    <Handle type="source" position={Position.Left}   id="left"   className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Top}    id="top"    className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Right}  id="right"  className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-primary" />
    <div className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-wider">{data.lane}</div>
    <div className={`text-xs font-black italic epilogue uppercase break-words leading-snug whitespace-normal ${data.isPrimary ? 'text-primary' : 'text-white'}`}>
      {data.label}
    </div>
  </div>
);

const GatewayNode = ({ data }: any) => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <Handle type="source" position={Position.Left}   id="left"   className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={{ opacity: 1 }} />
    <Handle type="source" position={Position.Top}    id="top"    className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={{ opacity: 1 }} />
    <Handle type="source" position={Position.Right}  id="right"  className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={{ opacity: 1 }} />
    <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !bg-primary !border-0 !rounded-full" style={{ opacity: 1 }} />
    <div className={`absolute inset-0 transform rotate-45 border-2 bg-[#1a1a1a] pointer-events-none ${data.edgeHighlighted ? 'border-white shadow-[0_0_16px_rgba(255,142,125,0.7)]' : 'border-[#ff8e7d] shadow-[0_0_15px_rgba(255,142,125,0.2)]'}`}></div>
    <div className="relative z-10 text-[10px] font-black text-[#ff8e7d] italic text-center px-1">{data.label}</div>
  </div>
);

const EventNode = ({ data }: any) => (
  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-shadow ${data.edgeHighlighted ? 'shadow-[0_0_12px_rgba(255,142,125,0.6)]' : ''} ${data.type === 'start' ? 'border-green-500 bg-green-500/20' : data.type === 'end' ? 'border-red-500 bg-red-500/20' : 'border-yellow-500 bg-yellow-500/20'}`}>
    <Handle type="source" position={Position.Left}   id="left"   className="w-2 h-2 !bg-primary opacity-0" />
    <Handle type="source" position={Position.Right}  id="right"  className="w-2 h-2 !bg-primary opacity-0" />
    <div className="text-[8px] font-bold text-white uppercase text-center leading-tight">{data.label}</div>
  </div>
);

const DatabaseNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-md rounded-md bg-[#1a1a1a] border-2 border-white/20 min-w-[150px] text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-2 bg-white/10 rounded-t-[50%]"></div>
    <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10 rounded-b-[50%]"></div>
    <Handle type="source" position={Position.Left}   id="left"   className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Right}  id="right"  className="w-2 h-2 !bg-primary" />
    <div className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-wider">{data.lane}</div>
    <div className="text-xs font-black italic epilogue uppercase text-white/80">{data.label}</div>
  </div>
);

const LaneNode = ({ data, selected }: any) => {
  const h = data.heightPx ? `${data.heightPx}px` : (data.height || '200px');
  return (
    <div
      className={`border-b border-white/5 flex items-stretch ${data.index % 2 === 0 ? 'bg-[#0e0e0e]' : 'bg-[#131313]/50'} ${selected ? 'border-t-2 border-b-2 border-primary bg-primary/5' : ''}`}
      style={{ height: h, width: data.width || '5000px' }}
    >
      <div className="w-12 bg-[#1a1a1a] border-r border-white/10 flex items-center justify-center shadow-[5px_0_15px_rgba(0,0,0,0.5)] shrink-0">
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
      backgroundColor: `${data.color}0d`,
      border: `1px solid ${data.color}30`,
      borderRadius: 4,
      position: 'relative',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: -36,
        top: 0,
        bottom: 0,
        width: 32,
        backgroundColor: `${data.color}18`,
        border: `1px solid ${data.color}30`,
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

const nodeTypes = { task: TaskNode, gateway: GatewayNode, event: EventNode, database: DatabaseNode, lane: LaneNode, pool: PoolNode };

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

function NodeMeta({ data }: { data: any }) {
  return (
    <>
      {(data.details || data.note) && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Beskrivning</label>
          <p className="text-xs text-white/70 leading-relaxed">{data.details || data.note}</p>
        </div>
      )}
      {data.why && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Varför noden finns</label>
          <p className="text-xs text-white/70 leading-relaxed">{data.why}</p>
        </div>
      )}
      {data.systems?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">System</label>
          <ul className="space-y-1">
            {data.systems.map((s: string) => (
              <li key={s} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">{s}</li>
            ))}
          </ul>
        </div>
      )}
      {data.risks?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Risker</label>
          <ul className="space-y-1">
            {data.risks.map((r: string) => (
              <li key={r} className="text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 px-2 py-1.5 rounded leading-relaxed">{r}</li>
            ))}
          </ul>
        </div>
      )}
      {data.sources?.length > 0 && (
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Källor</label>
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

// ─── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_NODES = 'jy-bpmn-nodes';
const STORAGE_EDGES = 'jy-bpmn-edges';

const loadNodes = () => {
  try {
    const s = localStorage.getItem(STORAGE_NODES);
    const ns: any[] = s ? JSON.parse(s) : pilotNodes;
    // Migrate: assign poolId to lanes that don't have one yet (Y-range heuristic, one-time migration)
    const pools = ns.filter(n => n.type === 'pool').sort((a: any, b: any) => a.position.y - b.position.y);
    return ns.map((n: any) => {
      if (n.type !== 'lane' || n.data?.poolId) return n;
      const pool = pools.find((p: any) =>
        n.position.y >= p.position.y && n.position.y < p.position.y + (p.data?.heightPx || 300)
      );
      return pool ? { ...n, data: { ...n.data, poolId: pool.id } } : n;
    });
  } catch { return pilotNodes; }
};
const loadEdges = () => {
  try { const s = localStorage.getItem(STORAGE_EDGES); return s ? JSON.parse(s) : pilotEdges; }
  catch { return pilotEdges; }
};

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Lane Row (used in lanes panel) ──────────────────────────────────────────

function LaneRow({ lane, isFirst, isLast, onMove, onRename, onDelete, onResize, pools, onMoveToPool }: {
  lane: any; isFirst: boolean; isLast: boolean;
  onMove: (dir: 'up' | 'down') => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onResize: (heightPx: number) => void;
  pools: any[];
  onMoveToPool: (poolId: string) => void;
}) {
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
        title="Pool"
        className="shrink-0 w-3 h-3 rounded-full border-0 outline-none cursor-pointer appearance-none"
        style={{ background: currentPool?.data?.color ?? '#ffffff33', accentColor: currentPool?.data?.color }}
      >
        <option value="">–</option>
        {pools.map(p => <option key={p.id} value={p.id}>{String(p.data.label)}</option>)}
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
          title="Dubbelklicka för att byta namn"
        >
          {String(lane.data.label)}
        </span>
      )}
      <div className="flex items-center gap-1 shrink-0" title="Höjd (px)">
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
        title="Byt namn"
      >✎</button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/30 hover:text-red-400 px-1 transition-all"
        title="Ta bort lane"
      >×</button>
    </div>
  );
}

// ─── Pool Row (used in lanes panel pools section) ────────────────────────────

function PoolRow({ pool, onRename, onDelete, onMove, isFirst, isLast, onAddLane }: {
  pool: any;
  onRename: (name: string) => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  onAddLane: () => void;
}) {
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
          title="Dubbelklicka för att byta namn"
        >
          {String(pool.data.label)}
        </span>
      )}
      <button
        onClick={onAddLane}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-400 hover:text-emerald-300 px-1 transition-all"
        title="Lägg till lane i denna pool"
      >＋</button>
      <button
        onClick={() => { setDraft(String(pool.data.label)); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/40 hover:text-white px-1 transition-all"
        title="Byt namn"
      >✎</button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-white/30 hover:text-red-400 px-1 transition-all"
        title="Ta bort pool"
      >×</button>
    </div>
  );
}

const ROLLER_KRAV = [
  {
    endpoint: 'GET /booking/{ref}',
    priority: 'CRITICAL',
    label: 'Hämta bokning',
    desc: 'Returnerar: gästnamn, email, produktlista, biljettantal, betalningsstatus, sessionstid',
  },
  {
    endpoint: 'GET /products',
    priority: 'CRITICAL',
    label: 'Hämta produkter',
    desc: 'Alla köpbara produkter med pris per venue (strumpor, upplevelser, tillägg)',
  },
  {
    endpoint: 'POST /booking/costs',
    priority: 'HIGH',
    label: 'Beräkna kostnad',
    desc: 'Kostnadsberäkning med tillagda produkter — utan att skapa bokning',
  },
  {
    endpoint: 'PUT /booking/{ref}',
    priority: 'CRITICAL',
    label: 'Uppdatera bokning',
    desc: 'Lägg till produkter i befintlig bokning (lägger till i SAMMA bokning, ej ny)',
  },
  {
    endpoint: 'POST /booking/payment',
    priority: 'CRITICAL',
    label: 'Registrera betalning',
    desc: 'Registrera Adyen-transaktion mot bokning — fungerar för initial + tillägg. Endpoint: Add transaction record',
  },
  {
    endpoint: 'POST /tickets/redeem',
    priority: 'CRITICAL',
    label: 'Lös in biljetter',
    desc: 'ETT anrop per biljett-ID. Status uppdateras direkt i Roller-dashboard. Waivers: EJ AKTUELLT hos JumpYard',
  },
  {
    endpoint: 'Webhook: ticket check-in',
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

function DataKravPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-0 right-0 h-full w-[380px] z-50 bg-[#0e0e0e]/98 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-white">Datakravslista</div>
          <div className="text-[10px] text-white/40 mt-0.5">Roller API — bekräftade endpoints</div>
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
            <div className="text-[11px] font-bold text-white/80 mb-1">{k.label}</div>
            <div className="text-[10px] text-white/50 leading-relaxed">{k.desc}</div>
          </div>
        ))}
        <div className="pt-2 pb-1 text-[9px] text-white/25 text-center">
          Källa: Roller API Requirements — bekräftad av account manager
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { screenToFlowPosition, getViewport, setViewport: rfSetViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(loadNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadEdges());
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
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const selectedNodeId = selectedElements.nodes[0]?.id ?? null;
  const selectedEdgeId = selectedElements.edges[0]?.id ?? null;
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) ?? null : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) ?? null : null;
  const hasSelection = !!(selectedNode || selectedEdge);

  useEffect(() => {
    const clean = nodes.map(n => (n.data as any).edgeHighlighted ? { ...n, data: { ...(n.data as any), edgeHighlighted: undefined } } : n);
    localStorage.setItem(STORAGE_NODES, JSON.stringify(clean));
  }, [nodes]);
  useEffect(() => { localStorage.setItem(STORAGE_EDGES, JSON.stringify(edges)); }, [edges]);

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
      if (json.ok) alert('✓ Sparat som ursprungsdata i pilotFlow.ts');
      else alert('Fel: ' + JSON.stringify(json));
    } catch (e) {
      alert('Kunde inte nå /api/save-flow — är dev-servern igång?');
    }
  };

  const resetToDefaults = () => {
    if (!confirm('Återställ till ursprungsdata? Alla ändringar tas bort.')) return;
    localStorage.removeItem(STORAGE_NODES);
    localStorage.removeItem(STORAGE_EDGES);
    setNodes(pilotNodes);
    setEdges(pilotEdges);
    setHistory([]);
  };

  const onConnect = useCallback(
    (params: any) => { saveHistory(); setEdges(eds => addEdge({ ...params, ...defaultEdgeOptions }, eds)); },
    [saveHistory, setEdges],
  );

  const onReconnect = useCallback(
    (oldEdge: any, newConnection: any) => {
      saveHistory();
      setEdges(eds => reconnectEdge(oldEdge, newConnection, eds));
    },
    [saveHistory, setEdges],
  );

  const onSelectionChange = useCallback((elements: any) => {
    setSelectedElements(elements);
    const selEdge = elements.edges?.[0] ?? null;
    setNodes(nds => nds.map(n => {
      const highlighted = selEdge ? (n.id === selEdge.source || n.id === selEdge.target) : false;
      if (!!(n.data as any).edgeHighlighted === highlighted) return n;
      return { ...n, data: { ...n.data, edgeHighlighted: highlighted } };
    }));
  }, [setNodes]);

  const addNode = (type: string) => {
    saveHistory();
    const id = `${type}-${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type,
      position: screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      data: {
        label: `Ny ${type}`,
        lane: type === 'lane' ? undefined : 'Gäst',
        index: type === 'lane' ? nds.filter(n => n.type === 'lane').length : undefined,
        height: type === 'lane' ? '200px' : undefined,
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
      data: { label: eventType === 'start' ? 'Start' : 'Slut', type: eventType, tags: ['main'] },
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
    setEdges(eds => eds.map(e => e.id === id ? {
      ...e,
      style: { strokeWidth: w, stroke: color, ...(dash ? { strokeDasharray: dash } : {}) },
      markerEnd: { type: MarkerType.ArrowClosed, color },
      data: { ...(e.data || {}), edgeStyle: style },
    } : e));
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
    if (!confirm('Ta bort lane? Noder i lanen finns kvar men utan lane-tillhörighet.')) return;
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
    if (!confirm('Ta bort pool? Lanes och noder påverkas inte.')) return;
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

  return (
    <div className="bg-background text-on-surface font-manrope selection:bg-primary selection:text-white min-h-screen flex flex-col">

      {/* ── Header ── */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5 z-50 gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-2xl font-black italic epilogue text-white uppercase tracking-widest shrink-0">
            JUMP_YARD<span className="text-primary">_BPMN</span>
          </span>
          <nav className="hidden md:flex gap-6">
            <a className="text-[#ff8e7d] font-bold italic epilogue border-b-2 border-[#ff8e7d] pb-1 tracking-tighter whitespace-nowrap" href="#">Mobil pilot v1</a>
            <a className="text-white/30 font-medium cursor-not-allowed whitespace-nowrap" href="#" onClick={e => e.preventDefault()}>Nuläge idag</a>
            <a className="text-white/30 font-medium cursor-not-allowed whitespace-nowrap" href="#" onClick={e => e.preventDefault()}>Framtida förlängning</a>
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setEditMode(m => !m)}
            title={editMode ? 'Byt till visningsläge' : 'Byt till redigeringsläge'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-all ${editMode ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            {editMode ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {editMode ? 'Redigera' : 'Visa'}
          </button>

          {editMode && (
            <button onClick={undo} disabled={history.length === 0} title="Ångra (Ctrl+Z)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Undo2 className="w-3.5 h-3.5" />Ångra
            </button>
          )}

          {editMode && (
            <button onClick={saveAsDefault} title="Spara nuläge som ursprungsdata i källkoden"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
              Spara som standard
            </button>
          )}

          {editMode && (
            <button onClick={resetToDefaults} title="Återställ till ursprungsdata"
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
            {walkActive ? '⏹ Stoppa' : '▶ Kör igenom'}
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <div className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            {localStorage.getItem(STORAGE_NODES) ? 'Lokalt sparat' : 'Live Draft'}
          </div>
          <div className="flex items-center gap-1 border border-white/10 rounded px-1 py-0.5">
            <button
              onClick={exportToPng}
              disabled={exporting !== null}
              title="Exportera som PNG"
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 rounded transition-all disabled:opacity-40"
            >
              <Download className="w-3 h-3" />PNG
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={exportToPdf}
              disabled={exporting !== null}
              title="Exportera som PDF"
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 rounded transition-all disabled:opacity-40"
            >
              <Download className="w-3 h-3" />PDF
            </button>
          </div>
          <button className="p-2 hover:bg-white/5 transition-all duration-300 rounded-full"><Bell className="text-white/70 w-5 h-5" /></button>
          <button className="p-2 hover:bg-white/5 transition-all duration-300 rounded-full"><User className="text-white/70 w-5 h-5" /></button>
        </div>
      </header>

      {/* ── Selected-edge highlight CSS ── */}
      <style>{`.react-flow__edge.selected .react-flow__edge-path { stroke: #ff8e7d !important; stroke-width: 3px !important; filter: drop-shadow(0 0 4px rgba(255,142,125,0.6)); }`}</style>

      {/* ── Lanes panel ── */}
      {editMode && lanesPanelOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div className="px-6 py-3 max-w-2xl relative">
            <button
              onClick={() => setLanesPanelOpen(false)}
              className="absolute top-2 right-4 text-white/30 hover:text-white text-lg leading-none px-2 py-1 rounded hover:bg-white/5 transition-all"
              title="Stäng"
            >×</button>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Lanes</span>
              <button
                onClick={addLaneFn}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                + Lägg till lane
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
                />
              ))}
            </div>
            {/* Pool management */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Pooler</span>
                <button
                  onClick={addPoolFn}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >+ Lägg till pool</button>
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
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onSelectionChange={onSelectionChange}
            onReconnect={editMode ? onReconnect : undefined}

            nodeTypes={nodeTypes} defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
            nodesDraggable={editMode} nodesConnectable={editMode}
            edgesFocusable={editMode} edgesUpdatable={editMode}
            deleteKeyCode={editMode ? ['Delete', 'Backspace'] : []}
            elementsSelectable={true}
            fitView fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1} maxZoom={2}
            className="bg-transparent"
          >
            <Background color="#555555" gap={20} size={1.5} opacity={0.35} />
            <Controls className="bg-[#1a1a1a] border-white/10 fill-white" showInteractive={false} />
            <ViewportTracker onUpdate={onViewportUpdate} />

            {editMode && (
              <Panel position="top-left" className="bg-[#1a1a1a] p-2 rounded-lg border border-white/10 shadow-xl m-4 flex gap-2 flex-wrap">
                <button onClick={() => addEventNode('start')} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold rounded transition-colors">● Start</button>
                <button onClick={() => addEventNode('end')}   className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded transition-colors">● Stop</button>
                <div className="w-px bg-white/10 self-stretch mx-1" />
                <button onClick={() => addNode('task')}     className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ Task</button>
                <button onClick={() => addNode('gateway')}  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ Gateway</button>
                <button onClick={() => addNode('database')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ DB</button>
                <button
                  onClick={() => setLanesPanelOpen(v => !v)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-colors border ${lanesPanelOpen ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                >☰ Lanes</button>
                <button
                  onClick={() => setDatakravOpen(v => !v)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-colors border ${datakravOpen ? 'bg-[#ff8e7d]/20 border-[#ff8e7d] text-[#ff8e7d]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                >⚡ Datakrav</button>
              </Panel>
            )}

            <MiniMap
              nodeColor={node => {
                if (node.type === 'gateway') return '#ff8e7d';
                if (node.type === 'database') return '#555';
                if (node.type === 'event') return node.data.type === 'start' ? '#22c55e' : '#ef4444';
                return '#333';
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              className="bg-[#131313] border border-white/10 rounded-lg overflow-hidden"
            />

          </ReactFlow>


          {walkActive && (() => {
            const talkNode = walkPhase === 'idle' ? nodes.find(n => n.id === walkCurrentId) : null;
            const charX = charFlowPos.x * viewport.zoom + viewport.x;
            const charY = charFlowPos.y * viewport.zoom + viewport.y;
            return (
              <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
                <div className="absolute" style={{ left: charX, top: charY, transform: 'translateX(-50%) translateY(-100%)' }}>
                  {talkNode && (
                    <div className="relative mb-2 w-52 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-100 p-3 text-xs">
                      <div className="font-black text-[10px] uppercase tracking-wider mb-1.5" style={{ color: '#ff8e7d' }}>
                        {String(talkNode.data.label)}
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {String((talkNode.data as any).details || (talkNode.data as any).note || talkNode.data.label)}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2"
                        style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid white' }} />
                    </div>
                  )}
                  <div className="flex justify-center">
                    <PixelChar frame={walkPhase === 'walking' ? WALK_FRAMES[walkFrame] : SPRITE_STAND} />
                  </div>
                </div>
                {/* Hint overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 items-center">
                  <div className="bg-black/70 text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    Håll <kbd className="text-white">→</kbd> för att gå · <kbd className="text-white">←</kbd> för att backa
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
                  ? (selectedNode.data.label || (selectedNode.type === 'lane' ? 'Lane' : 'Nod'))
                  : 'Kant'}
              </h2>
              {selectedNode?.data.note && (
                <p className="text-xs text-white/40 mt-1 leading-relaxed">{selectedNode.data.note}</p>
              )}
            </div>

            <div className="p-6 space-y-5">

              {/* ── Alignment toolbar (multi-select) ── */}
              {editMode && multiSel.length >= 2 && (
                <div className="pb-4 border-b border-white/5 space-y-3">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                    Justera ({multiSel.length} markerade)
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
                      <button key={key} onClick={() => alignNodes(key as any)} title={title}
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
                      title="Fördela jämnt horisontellt"
                      className="py-1.5 text-xs font-bold bg-white/5 hover:bg-white/15 text-white/60 hover:text-white rounded border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      Fördela ↔
                    </button>
                    <button onClick={() => distributeNodes('v')} disabled={multiSel.length < 3}
                      title="Fördela jämnt vertikalt"
                      className="py-1.5 text-xs font-bold bg-white/5 hover:bg-white/15 text-white/60 hover:text-white rounded border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      Fördela ↕
                    </button>
                  </div>
                  <button onClick={snapToLane}
                    title="Centrera markerade noder vertikalt i sin lane"
                    className="w-full py-1.5 text-xs font-bold bg-white/5 hover:bg-white/15 text-white/60 hover:text-white rounded border border-white/10 transition-colors">
                    Centrera i lane ↕
                  </button>
                </div>
              )}

              {/* ── Label / lane edit ── */}
              {editMode && selectedNode && (
                <div className="space-y-3 pb-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Redigera</p>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Label</label>
                    <input type="text" value={selectedNode.data.label || ''}
                      onChange={e => updateNodeData(selectedNode.id, 'label', e.target.value)}
                      className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none" />
                  </div>
                  {selectedNode.type !== 'lane' && (
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Lane</label>
                      <select
                        value={String(selectedNode.data.lane || '')}
                        onChange={e => updateNodeData(selectedNode.id, 'lane', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none"
                      >
                        <option value="">— välj lane —</option>
                        {nodes.filter(n => n.type === 'lane').map(l => (
                          <option key={l.id} value={String(l.data.label)}>{String(l.data.label)}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* ── Edge edit ── */}
              {editMode && selectedEdge && (
                <div className="space-y-3 pb-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Redigera kant</p>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Label</label>
                    <input type="text" value={typeof selectedEdge.label === 'string' ? selectedEdge.label : ''}
                      onChange={e => updateEdgeLabel(selectedEdge.id, e.target.value)}
                      className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kanttyp</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, 'solid')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgeStyle === 'solid' ? 'bg-[#ff8e7d]/20 border-[#ff8e7d] text-[#ff8e7d]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        ——<br/><span className="text-[9px]">Process</span>
                      </button>
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, 'dashed')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgeStyle === 'dashed' ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        - -<br/><span className="text-[9px]">Fallback</span>
                      </button>
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, 'data')}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${edgeStyle === 'data' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        ···<br/><span className="text-[9px]">Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Editable metadata (edit mode) ── */}
              {editMode && selectedNode && selectedNode.type !== 'lane' && (
                <div className="space-y-4 pt-1 border-t border-white/5">
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Metadata</p>

                  {selectedNode.type === 'event' && (
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Typ</label>
                      <div className="flex gap-2">
                        <button onClick={() => updateNodeData(selectedNode.id, 'type', 'start')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${selectedNode.data.type === 'start' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                          ● Start
                        </button>
                        <button onClick={() => updateNodeData(selectedNode.id, 'type', 'end')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${selectedNode.data.type === 'end' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                          ● Stop
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Beskrivning</label>
                    <textarea value={(selectedNode.data as any).details || ''}
                      onChange={e => updateNodeData(selectedNode.id, 'details', e.target.value)}
                      rows={3} placeholder="Beskriv vad steget gör..."
                      className="w-full text-xs text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none resize-none" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Varför noden finns</label>
                    <textarea value={(selectedNode.data as any).why || ''}
                      onChange={e => updateNodeData(selectedNode.id, 'why', e.target.value)}
                      rows={2} placeholder="Motivering..."
                      className="w-full text-xs text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none resize-none" />
                  </div>

                  <ArrayField label="System"
                    items={(selectedNode.data as any).systems || []}
                    onAdd={v => addToNodeArray(selectedNode.id, 'systems', v)}
                    onRemove={i => removeFromNodeArray(selectedNode.id, 'systems', i)}
                    placeholder="Lägg till system..." />

                  <ArrayField label="Risker"
                    items={(selectedNode.data as any).risks || []}
                    onAdd={v => addToNodeArray(selectedNode.id, 'risks', v)}
                    onRemove={i => removeFromNodeArray(selectedNode.id, 'risks', i)}
                    placeholder="Lägg till risk..." />

                  <ArrayField label="Källor"
                    items={(selectedNode.data as any).sources || []}
                    onAdd={v => addToNodeArray(selectedNode.id, 'sources', v)}
                    onRemove={i => removeFromNodeArray(selectedNode.id, 'sources', i)}
                    placeholder="Lägg till källa..." />
                </div>
              )}

              {/* ── Read-only metadata (view mode) ── */}
              {!editMode && selectedNode && <NodeMeta data={selectedNode.data as any} />}

              {/* ── Delete ── */}
              {editMode && (
                <div className="pt-2 border-t border-white/5">
                  <button onClick={deleteSelected}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-bold rounded transition-colors">
                    Ta bort markerade
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {datakravOpen && <DataKravPanel onClose={() => setDatakravOpen(false)} />}
    </div>
  );
}
