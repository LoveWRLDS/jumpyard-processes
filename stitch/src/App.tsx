import React, { useCallback, useState, useEffect } from 'react';
import { Bell, User, Undo2, RotateCcw, Eye, Pencil } from 'lucide-react';
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
  <div className={`px-4 py-3 shadow-md rounded-md bg-surface-container border-2 ${data.isPrimary ? 'border-primary shadow-primary/20 kinetic-glow' : 'border-white/10'} min-w-[150px] text-center`}>
    <Handle type="source" position={Position.Left}   id="left"   className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Top}    id="top"    className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Right}  id="right"  className="w-2 h-2 !bg-primary" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-primary" />
    <div className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-wider">{data.lane}</div>
    <div className={`text-xs font-black italic epilogue uppercase ${data.isPrimary ? 'text-primary' : 'text-white'}`}>
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
    <div className="absolute inset-0 transform rotate-45 border-2 border-[#ff8e7d] bg-[#1a1a1a] shadow-[0_0_15px_rgba(255,142,125,0.2)]"></div>
    <div className="relative z-10 text-[10px] font-black text-[#ff8e7d] italic text-center px-1">{data.label}</div>
  </div>
);

const EventNode = ({ data }: any) => (
  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${data.type === 'start' ? 'border-green-500 bg-green-500/20' : data.type === 'end' ? 'border-red-500 bg-red-500/20' : 'border-yellow-500 bg-yellow-500/20'}`}>
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

const LaneNode = ({ data, selected }: any) => (
  <div
    className={`border-b border-white/5 flex items-stretch ${data.index % 2 === 0 ? 'bg-[#0e0e0e]' : 'bg-[#131313]/50'} ${selected ? 'border-t-2 border-b-2 border-primary bg-primary/5' : ''}`}
    style={{ height: data.height || '150px', width: data.width || '5000px' }}
  >
    <div className="w-12 bg-[#1a1a1a] border-r border-white/10 flex items-center justify-center shadow-[5px_0_15px_rgba(0,0,0,0.5)] shrink-0">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transform -rotate-90 whitespace-nowrap">
        {data.label}
      </span>
    </div>
  </div>
);

const nodeTypes = { task: TaskNode, gateway: GatewayNode, event: EventNode, database: DatabaseNode, lane: LaneNode };

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

const WALK_PATH = [
  'p_start', 'p_checkout', 'p_fetch', 'p_sms', 'p_open', 'p_auth',
  'p_detail', 'p_show', 'p_quiz', 'p_store_quiz', 'p_addons',
  'p_products', 'p_pay', 'p_provider', 'p_edit', 'p_qr',
  'p_arrive', 'p_gate_ready', 'p_validate', 'p_redeem',
  'p_confirm', 'p_pickup', 'p_enter',
];

function ViewportTracker({ onUpdate }: { onUpdate: (x: number, y: number, zoom: number) => void }) {
  const { x, y, zoom } = useViewport();
  useEffect(() => { onUpdate(x, y, zoom); }, [x, y, zoom, onUpdate]);
  return null;
}

// ── Retro pixel sprite ────────────────────────────────────────────────────────

const PX = 3; // css px per "pixel"
const CHAR_PAL: Record<string, string | null> = {
  K: '#cc2222', // hat red
  H: '#1a0800', // hair / eye
  S: '#f5c5a3', // skin
  B: '#2850c8', // blue shirt
  P: '#1a1a2c', // dark pants
  G: '#4c2c10', // shoes
  '.': null,
};

// Side-view 8×10 sprites, character faces right (PX=3 → 24×30 CSS px)
const SPRITE_STAND = [
  '..KKKK..',
  '.HKKKKS.',
  '.SSSSSS.',
  '..SHSS..',
  '..BBBB..',
  '.BBBBBB.',
  '.BB..BB.',
  '..PPPP..',
  '..P..P..',
  '..G..G..',
];
const SPRITE_WALK_A = [
  '..KKKK..',
  '.HKKKKS.',
  '.SSSSSS.',
  '..SHSS..',
  '..BBBB..',
  '.BBBBBB.',
  'B.BB....',   // left arm swings forward
  '..PPPP..',
  '...P.PP.',   // right leg forward
  '...G.GG.',
];
const SPRITE_WALK_B = [
  '..KKKK..',
  '.HKKKKS.',
  '.SSSSSS.',
  '..SHSS..',
  '..BBBB..',
  '.BBBBBB.',
  '....BB.B',   // right arm swings forward
  '..PPPP..',
  '.PP.P...',   // left leg forward
  '.GG.G...',
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
  try { const s = localStorage.getItem(STORAGE_NODES); return s ? JSON.parse(s) : pilotNodes; }
  catch { return pilotNodes; }
};
const loadEdges = () => {
  try { const s = localStorage.getItem(STORAGE_EDGES); return s ? JSON.parse(s) : pilotEdges; }
  catch { return pilotEdges; }
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(loadNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadEdges());
  const [selectedElements, setSelectedElements] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState<{ nodes: any[]; edges: any[] }[]>([]);
  const [walkActive, setWalkActive] = useState(false);
  const [walkStep, setWalkStep] = useState(0);
  const [walkPhase, setWalkPhase] = useState<'talking' | 'walking'>('talking');
  const [walkWaypoints, setWalkWaypoints] = useState<Array<{ x: number; y: number }>>([]);
  const [walkWpIdx, setWalkWpIdx] = useState(0);
  const [walkFrame, setWalkFrame] = useState(0);
  const [charFlowPos, setCharFlowPos] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const onViewportUpdate = useCallback((x: number, y: number, zoom: number) => {
    setViewport({ x, y, zoom });
  }, []);

  const selectedNodeId = selectedElements.nodes[0]?.id ?? null;
  const selectedEdgeId = selectedElements.edges[0]?.id ?? null;
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) ?? null : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) ?? null : null;
  const hasSelection = !!(selectedNode || selectedEdge);

  useEffect(() => { localStorage.setItem(STORAGE_NODES, JSON.stringify(nodes)); }, [nodes]);
  useEffect(() => { localStorage.setItem(STORAGE_EDGES, JSON.stringify(edges)); }, [edges]);

  // ── Walk animation driver
  useEffect(() => {
    if (!walkActive) return;
    const currentNode = nodes.find(n => n.id === WALK_PATH[walkStep]);
    if (!currentNode) return;
    let t: ReturnType<typeof setTimeout>;

    if (walkPhase === 'talking') {
      const dims = getNodeDims(currentNode.type);
      setCharFlowPos({ x: currentNode.position.x + dims.w / 2, y: currentNode.position.y - 18 });

      t = setTimeout(() => {
        if (walkStep >= WALK_PATH.length - 1) { setWalkActive(false); setWalkStep(0); return; }
        const nextNode = nodes.find(n => n.id === WALK_PATH[walkStep + 1]);
        if (!nextNode) { setWalkStep(s => s + 1); return; }
        setWalkWaypoints(buildEdgeWaypoints(currentNode, nextNode));
        setWalkWpIdx(0);
        setWalkFrame(0);
        setWalkPhase('walking');
      }, 4500);
    } else {
      if (walkWpIdx >= walkWaypoints.length) {
        setWalkStep(s => s + 1);
        setWalkPhase('talking');
        return;
      }
      const wp = walkWaypoints[walkWpIdx];
      setCharFlowPos({ x: wp.x, y: wp.y - 18 });
      setWalkFrame(f => (f + 1) % 2);
      t = setTimeout(() => setWalkWpIdx(i => i + 1), 230);
    }

    return () => clearTimeout(t);
  }, [walkActive, walkPhase, walkStep, walkWpIdx, walkWaypoints, nodes]);

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

  const onSelectionChange = useCallback((elements: any) => { setSelectedElements(elements); }, []);

  const addNode = (type: string) => {
    saveHistory();
    const id = `${type}-${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type,
      position: { x: 200, y: 200 },
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
      position: { x: 300, y: 200 },
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

  const updateEdgeStyle = (id: string, dashed: boolean) => {
    saveHistory();
    const color = dashed ? '#8b5cf6' : '#ff8e7d';
    setEdges(eds => eds.map(e => e.id === id ? {
      ...e,
      style: { strokeWidth: 2, stroke: color, ...(dashed ? { strokeDasharray: '6,6' } : {}) },
      markerEnd: { type: MarkerType.ArrowClosed, color },
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

  // ── Snap guides ─────────────────────────────────────────────────────────────
  const [snapGuides, setSnapGuides] = useState<Array<{ axis: 'x' | 'y'; pos: number }>>([]);
  const SNAP_THRESH = 6;

  const onNodeDrag = useCallback((_: any, dragged: any) => {
    if (!editMode) return;
    const d = getNodeDims(dragged.type);
    const dl = dragged.position.x, dc = dragged.position.x + d.w / 2, dr = dragged.position.x + d.w;
    const dt = dragged.position.y, dm = dragged.position.y + d.h / 2, db = dragged.position.y + d.h;
    const seenX = new Set<number>(), seenY = new Set<number>();
    const guides: Array<{ axis: 'x' | 'y'; pos: number }> = [];
    for (const n of nodes) {
      if (n.id === dragged.id || n.type === 'lane') continue;
      const nd = getNodeDims(n.type);
      const nl = n.position.x, nc = nl + nd.w / 2, nr = nl + nd.w;
      const nt = n.position.y, nm = nt + nd.h / 2, nb = nt + nd.h;
      for (const nx of [nl, nc, nr]) {
        if (!seenX.has(nx) && [dl, dc, dr].some(v => Math.abs(v - nx) < SNAP_THRESH)) {
          guides.push({ axis: 'x', pos: nx }); seenX.add(nx);
        }
      }
      for (const ny of [nt, nm, nb]) {
        if (!seenY.has(ny) && [dt, dm, db].some(v => Math.abs(v - ny) < SNAP_THRESH)) {
          guides.push({ axis: 'y', pos: ny }); seenY.add(ny);
        }
      }
    }
    setSnapGuides(guides);
  }, [nodes, editMode]);

  const onNodeDragStop = useCallback(() => setSnapGuides([]), []);

  // ── Arrow-key walk control ───────────────────────────────────────────────────
  useEffect(() => {
    if (!walkActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (walkPhase === 'talking' && walkStep < WALK_PATH.length - 1) {
          const cur = nodes.find(n => n.id === WALK_PATH[walkStep]);
          const nxt = nodes.find(n => n.id === WALK_PATH[walkStep + 1]);
          if (cur && nxt) {
            setWalkWaypoints(buildEdgeWaypoints(cur, nxt));
            setWalkWpIdx(0); setWalkFrame(0); setWalkPhase('walking');
          }
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (walkStep > 0) {
          setWalkStep(s => s - 1); setWalkPhase('talking');
          setWalkWaypoints([]); setWalkWpIdx(0);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [walkActive, walkPhase, walkStep, nodes]);

  const edgeIsDashed = selectedEdge ? !!(selectedEdge.style as any)?.strokeDasharray : false;

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
              if (walkActive) { setWalkActive(false); setWalkStep(0); }
              else { setWalkStep(0); setWalkPhase('talking'); setWalkActive(true); }
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
          <button className="p-2 hover:bg-white/5 transition-all duration-300 rounded-full"><Bell className="text-white/70 w-5 h-5" /></button>
          <button className="p-2 hover:bg-white/5 transition-all duration-300 rounded-full"><User className="text-white/70 w-5 h-5" /></button>
        </div>
      </header>

      <div className="flex-1 mt-20 relative flex">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onSelectionChange={onSelectionChange}
            onReconnect={editMode ? onReconnect : undefined}
            onNodeDrag={onNodeDrag} onNodeDragStop={onNodeDragStop}
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
                <button onClick={() => addNode('lane')}     className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded transition-colors">+ Lane</button>
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

          {/* ── Snap guides ── */}
          {snapGuides.map((g, i) =>
            g.axis === 'x' ? (
              <div key={i} className="absolute inset-y-0 pointer-events-none"
                style={{ left: g.pos * viewport.zoom + viewport.x, width: 1, background: '#ff8e7d', opacity: 0.65, zIndex: 40 }} />
            ) : (
              <div key={i} className="absolute inset-x-0 pointer-events-none"
                style={{ top: g.pos * viewport.zoom + viewport.y, height: 1, background: '#ff8e7d', opacity: 0.65, zIndex: 40 }} />
            )
          )}

          {walkActive && (() => {
            const talkNode = walkPhase === 'talking' ? nodes.find(n => n.id === WALK_PATH[walkStep]) : null;
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
                    <PixelChar frame={walkPhase === 'talking' ? SPRITE_STAND : WALK_FRAMES[walkFrame]} />
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
                      <input type="text" value={selectedNode.data.lane || ''}
                        onChange={e => updateNodeData(selectedNode.id, 'lane', e.target.value)}
                        className="w-full text-sm text-white bg-[#1a1a1a] p-2 rounded border border-white/10 focus:border-primary outline-none" />
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
                    <div className="flex gap-2">
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, false)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${!edgeIsDashed ? 'bg-[#ff8e7d]/20 border-[#ff8e7d] text-[#ff8e7d]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        <span className="mr-1">——</span> Heldragen
                      </button>
                      <button onClick={() => updateEdgeStyle(selectedEdge.id, true)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded border transition-all ${edgeIsDashed ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        <span className="mr-1">- - -</span> Streckad
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
    </div>
  );
}
