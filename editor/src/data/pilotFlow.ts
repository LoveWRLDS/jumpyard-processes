import { MarkerType } from '@xyflow/react';

const POOL = {
  guest: 'Gäst',
  webapp: 'WebApp',
  cloud: 'JumpYard Cloud',
  roller: 'Roller',
  staff: 'Staff / parkpersonal',
} as const;

const LANE = {
  guest: 'Gäst',
  webapp: 'WebApp',
  ops: 'Ops jobs',
  aws: 'AWS + Aurora',
  roller: 'Roller API',
  staff: 'Staff / parkpersonal',
} as const;

const COLORS = {
  guest: '#f59e0b',
  webapp: '#38bdf8',
  cloud: '#22c55e',
  roller: '#8b5cf6',
  staff: '#fb7185',
} as const;

const CANVAS_WIDTH = 4600;

function pool(id: string, label: string, y: number, heightPx: number, color: string) {
  return {
    id,
    type: 'pool',
    position: { x: 56, y },
    data: { label, color, widthPx: CANVAS_WIDTH, heightPx },
    draggable: true,
    selectable: true,
    zIndex: -3,
  };
}

function lane(id: string, label: string, y: number, heightPx: number, index: number, poolId: string) {
  return {
    id,
    type: 'lane',
    position: { x: 56, y },
    data: { label, width: `${CANVAS_WIDTH}px`, heightPx, index, poolId },
    draggable: true,
    selectable: true,
    zIndex: -2,
  };
}

function task(id: string, label: string, x: number, y: number, laneLabel: string, extra: Record<string, any> = {}) {
  return {
    id,
    type: 'task',
    position: { x, y },
    data: { label, lane: laneLabel, ...extra },
  };
}

function service(id: string, label: string, x: number, y: number, laneLabel: string, extra: Record<string, any> = {}) {
  return {
    id,
    type: 'service',
    position: { x, y },
    data: { label, lane: laneLabel, ...extra },
  };
}

function gateway(id: string, label: string, x: number, y: number, laneLabel: string, extra: Record<string, any> = {}) {
  return {
    id,
    type: 'gateway',
    position: { x, y },
    data: { label, lane: laneLabel, ...extra },
  };
}

function event(
  id: string,
  label: string,
  eventType: 'start' | 'end' | 'intermediate',
  x: number,
  y: number,
  laneLabel: string,
  extra: Record<string, any> = {},
) {
  return {
    id,
    type: 'event',
    position: { x, y },
    data: { label, type: eventType, lane: laneLabel, ...extra },
  };
}

function store(id: string, label: string, x: number, y: number, laneLabel: string, extra: Record<string, any> = {}) {
  return {
    id,
    type: 'database',
    position: { x, y },
    data: {
      label,
      lane: laneLabel,
      collapsed: true,
      expandLabel: 'Expandera databas',
      collapseLabel: 'Fäll ihop databas',
      ...extra,
    },
  };
}

function note(id: string, label: string, x: number, y: number, laneLabel: string, extra: Record<string, any> = {}) {
  return {
    id,
    type: 'note',
    position: { x, y },
    data: { label, lane: laneLabel, ...extra },
  };
}

function edge(id: string, source: string, target: string, extra: Record<string, any> = {}) {
  return {
    id,
    source,
    target,
    type: extra.type || 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ff8e7d' },
    style: { strokeWidth: 2, stroke: '#ff8e7d' },
    ...extra,
  };
}

function labeledEdge(id: string, source: string, target: string, label: string, extra: Record<string, any> = {}) {
  return edge(id, source, target, {
    label,
    labelStyle: { fill: '#fff', fontWeight: 700 },
    labelBgStyle: { fill: '#1a1a1a' },
    ...extra,
  });
}

function dataEdge(
  id: string,
  source: string,
  target: string,
  details: string,
  operation: string,
  fields: string[],
  why: string,
  extra: Record<string, any> = {},
) {
  const color = '#22d3ee';
  return {
    id,
    source,
    target,
    type: extra.type || 'step',
    style: { strokeWidth: 1.5, stroke: color, strokeDasharray: '3,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color },
    data: {
      edgeKind: 'data',
      edgeStyle: 'data',
      baseStyle: { strokeWidth: 1.5, stroke: color, strokeDasharray: '3,5' },
      baseMarkerEnd: { type: MarkerType.ArrowClosed, color },
      pathMode: extra.type || 'step',
      details,
      operation,
      fields,
      why,
    },
    ...extra,
  };
}

function archEdge(id: string, source: string, target: string, details = '') {
  const color = '#94a3b8';
  return {
    id,
    source,
    target,
    type: 'step',
    style: { strokeWidth: 1.75, stroke: color, strokeDasharray: '6,6' },
    markerEnd: { type: MarkerType.ArrowClosed, color },
    data: {
      edgeStyle: 'arch',
      baseStyle: { strokeWidth: 1.75, stroke: color, strokeDasharray: '6,6' },
      baseMarkerEnd: { type: MarkerType.ArrowClosed, color },
      pathMode: 'step',
      details,
    },
  };
}

function fallbackEdge(id: string, source: string, target: string, label?: string, extra: Record<string, any> = {}) {
  const color = '#8b5cf6';
  return {
    id,
    source,
    target,
    type: 'step',
    label,
    labelStyle: label ? { fill: '#fff', fontWeight: 700 } : undefined,
    labelBgStyle: label ? { fill: '#1a1a1a' } : undefined,
    style: { strokeWidth: 2, stroke: color, strokeDasharray: '6,6' },
    markerEnd: { type: MarkerType.ArrowClosed, color },
    data: {
      edgeStyle: 'dashed',
      baseStyle: { strokeWidth: 2, stroke: color, strokeDasharray: '6,6' },
      baseMarkerEnd: { type: MarkerType.ArrowClosed, color },
      pathMode: 'step',
    },
    ...extra,
  };
}

const pools = [
  pool('pool-guest', POOL.guest, 0, 170, COLORS.guest),
  pool('pool-staff', POOL.staff, 210, 180, COLORS.staff),
  pool('pool-webapp', POOL.webapp, 430, 300, COLORS.webapp),
  pool('pool-cloud', POOL.cloud, 790, 410, COLORS.cloud),
  pool('pool-roller', POOL.roller, 1250, 170, COLORS.roller),
];

const lanes = [
  lane('lane-guest', LANE.guest, 0, 170, 0, 'pool-guest'),
  lane('lane-staff', LANE.staff, 210, 180, 1, 'pool-staff'),
  lane('lane-webapp', LANE.webapp, 430, 300, 2, 'pool-webapp'),
  lane('lane-cloud-ops', LANE.ops, 790, 130, 3, 'pool-cloud'),
  lane('lane-cloud-aws', LANE.aws, 920, 280, 4, 'pool-cloud'),
  lane('lane-roller', LANE.roller, 1250, 170, 5, 'pool-roller'),
];

const guestNodes = [
  event('guest-start', 'Bokning skapad', 'start', 140, 58, LANE.guest, { details: 'Piloten startar när en bokning redan finns.' }),
  task('guest-open', 'Check-in startar', 240, 46, LANE.guest, { details: 'Gästen går in i check-in-flödet via länk, QR eller kiosk.' }),
  task('guest-review', 'Granska bokning', 470, 46, LANE.guest, { details: 'Gästen ser bokning, deltagare och vad som redan ingår.' }),
  task('guest-safety', 'Slutför safety', 720, 46, LANE.guest, { details: 'Safety slutförs innan bekräftelse och handoff.' }),
  task('guest-addons', 'Välj tillägg och connected', 980, 46, LANE.guest, { details: 'Samma huvudsteg oavsett om gästen kommer via mobil eller kiosk.' }),
  task('guest-pay', 'Betala vid behov', 1280, 46, LANE.guest, { details: 'Hoppas över när totalen är 0 efter tillägg och connected-val.' }),
  task('guest-confirm', 'Se bekräftelse + QR + kod', 1540, 46, LANE.guest, { details: 'Bekräftelsen används sedan vid handoff hos staff.' }),
  task('guest-arrive', 'Anländ till staff', 1820, 46, LANE.guest, { details: 'Piloten avslutas inte i self-service. Staff tar över sista steget.' }),
  task('guest-present', 'Visa QR-kod eller bokningskod hos staff', 2080, 46, LANE.guest, {
    details: 'Det här är gästens sista steg före utlämning och bandkoppling.',
    givesGuest: ['Tydlig QR-kod', 'Kort bokningskod som reservväg'],
    staffVerifies: ['QR-kod', 'Bokningskod'],
  }),
  event('guest-end', 'Redo för park', 'end', 2380, 58, LANE.guest, { details: 'Parkresan fortsätter efter att staff har slutfört handoff.' }),
];

const webAppNodes = [
  task('app-start', 'VY: Start / länk', 220, 520, LANE.webapp, {
    details: 'Gemensam ingång för mobil PWA och kiosk på plats.',
    reads: ['checkin_token', 'channel_hint', 'venue context'],
    shownWhen: ['SMS-länk öppnas', 'QR-kod vid park skannas', 'Kiosk startas på plats'],
    givesGuest: ['Tydlig startpunkt för samma check-in-flöde'],
  }),
  gateway('gw-channel', 'Kanal?', 430, 514, LANE.webapp, { details: 'Kanalvalet sker tidigt. Därefter är huvudflödet gemensamt.' }),
  task('app-mobile', 'Mobil i telefonens PWA', 620, 468, LANE.webapp, {
    details: 'Mobilspåret avgör om gästen kommer via personlig SMS-länk eller parkens allmänna QR.',
    shownWhen: ['Gästen använder egen telefon'],
    skippedWhen: ['Gästen väljer kiosk på plats'],
  }),
  gateway('gw-mobile-entry', 'Öppnad via?', 860, 462, LANE.webapp, {
    details: 'SMS-länk med token går direkt in i bokningen. Park-QR går via en allmän sida och sedan lookup.',
  }),
  task('app-onsite', 'Park-QR / allmän sida', 1030, 468, LANE.webapp, {
    details: 'Publik startsida från parkens QR där gästen kan välja att hitta befintlig bokning eller köpa på plats.',
    reads: ['venue context', 'channel = park_qr'],
    shownWhen: ['Park-QR öppnas i mobilen'],
    skippedWhen: ['SMS-länk med token används'],
    givesGuest: ['Tydlig start med val mellan befintlig bokning och köp på plats'],
  }),
  task('kiosk-entry', 'Kiosk på plats', 620, 602, LANE.webapp, {
    details: 'Kiosk är en alternativ ingång till samma WebApp-flöde.',
    shownWhen: ['Gästen väljer kiosk i parken'],
    skippedWhen: ['Gästen använder egen telefon'],
  }),
  gateway('gw-kiosk-existing', 'Har du befintlig bokning?', 900, 596, LANE.webapp, { details: 'Delad gateway för Park-QR och kiosk: antingen hitta befintlig bokning eller köpa på plats.' }),
  task('kiosk-lookup', 'Hitta befintlig bokning', 1250, 536, LANE.webapp, {
    details: 'Gemensam lookup för mobil via Park-QR och kiosk med befintlig bokning.',
    reads: ['booking_ref', 'telefon + efternamn', 'QR-matchning'],
    shownWhen: ['Park-QR öppnas i mobilen', 'Kiosk används och gästen redan har bokning'],
    skippedWhen: ['SMS-länk med token går direkt till bokningen'],
  }),
  task('kiosk-buy', 'Köp biljett på plats', 1120, 650, LANE.webapp, {
    details: 'Det här är kioskens huvudsakliga avvikelse från mobilflödet.',
    writes: ['walk_in_purchase', 'nya deltagare', 'provisorisk operativ state'],
    shownWhen: ['Kiosk används och ingen befintlig bokning hittas'],
    givesGuest: ['Ny bokning som går vidare in i samma check-in-flöde'],
  }),
  task('app-booking', 'VY: Bokning & deltagare', 1540, 560, LANE.webapp, {
    details: 'Gemensamt huvudsteg för både mobil och kiosk efter att bokningen är identifierad.',
    reads: ['bokningssammanfattning', 'deltagare', 'produkter', 'betalningsstatus'],
    shownWhen: ['Bokning finns eller har skapats'],
  }),
  task('app-safety', 'VY: Safety', 1810, 560, LANE.webapp, {
    details: 'Samma safetysteg oavsett kanal.',
    writes: ['safety_status', 'safety_completed_at'],
    givesGuest: ['Klart safety-läge inför resten av check-in-resan'],
  }),
  task('app-addons', 'VY: Tillägg', 2060, 560, LANE.webapp, {
    details: 'Val av tillägg och eventuell connected-produkt innan betalningsbeslut.',
    reads: ['produktkatalog', 'prisregler'],
    writes: ['valda tillägg', 'connected_selected'],
  }),
  gateway('gw-app-connected', 'Connected valt?', 2320, 554, LANE.webapp, { details: 'Connected-profiler visas bara om produkten valts.' }),
  task('app-connected', 'VY: Connected-profiler', 2530, 478, LANE.webapp, {
    details: 'Fyra lätta profiler med namn och ikonval skapas i pilotens operativa state.',
    writes: ['connected_profile_1..4', 'ikonval', 'connected_profile_status'],
    shownWhen: ['Connected-produkt är vald'],
    skippedWhen: ['Ingen connected-produkt är vald'],
    givesGuest: ['Fyra profiler redo för bandkoppling hos staff'],
  }),
  gateway('gw-app-payment', 'Betalning krävs?', 2790, 554, LANE.webapp, { details: 'No-payment-vägen är explicit i pilotflödet.' }),
  task('app-payment', 'VY: Betalning', 3000, 478, LANE.webapp, {
    details: 'Gemensamt betalsteg när totalen är större än 0.',
    writes: ['payment_status', 'payment_reference', 'pending_writeback'],
    shownWhen: ['Totalen är större än 0'],
    skippedWhen: ['Inga nya tillägg valdes eller totalen är 0'],
  }),
  task('app-confirm', 'VY: Bekräftelse + QR + kod', 3240, 560, LANE.webapp, {
    details: 'Gemensam slutskärm med QR och kort bokningskod för handoff hos staff.',
    reads: ['confirmation_code', 'token_payload', 'payment_status'],
    givesGuest: ['QR-kod', 'Kort bokningskod', 'Bekräftelse att check-in-flödet är klart'],
  }),
  task('kiosk-print', 'Skriv ut kvitto / confirmation', 3490, 456, LANE.webapp, {
    details: 'Valfri kioskavvikelse efter avslutat flöde. Mobilen behöver normalt inte detta steg.',
    shownWhen: ['Kanal = kiosk och utskrift behövs'],
    skippedWhen: ['Kanal = mobil eller ingen utskrift behövs'],
    givesGuest: ['Utskriven confirmation eller kvitto'],
  }),
  task('app-present', 'VY: Visa QR / bokningskod', 3530, 560, LANE.webapp, {
    details: 'Sista WebApp-vyn före staff-handoff.',
    reads: ['QR payload', 'booking code', 'connected_profile_status'],
    givesGuest: ['Det som ska visas upp hos staff'],
    staffVerifies: ['QR-kod', 'Bokningskod'],
  }),
];

const opsNodes = [
  service('job-daily', 'Daglig seed', 1120, 814, LANE.ops, {
    details: 'Laddar dagens Roller-data till den lokala snapshoten tidigt på dagen.',
    cadence: '05:00 daily',
    jobs: ['Hämtar dagens bokningar', 'Upserta snapshot', 'Förbereder SMS-fönster'],
    endpoints: ['Get attendance', 'Get tickets', 'Get payments'],
  }),
  service('job-delta', 'Delta-synk', 1370, 814, LANE.ops, {
    details: 'Håller snapshoten färsk utan att lägga bulklogik i användarflödet.',
    cadence: 'Every 5 min',
    jobs: ['Diff mot payload_hash', 'Uppdatera ändrade rader', 'Skriv sync-event'],
    endpoints: ['Get attendance', 'Get tickets', 'Get payments'],
  }),
  service('job-sms', 'SMS-trigger', 1620, 814, LANE.ops, {
    details: 'Skapar token och skickar länk inför ankomst.',
    cadence: 'Every 1 min',
    jobs: ['Hitta bokningar om 30 min', 'Skapa token', 'Skriv sms_outbox'],
  }),
  service('job-refresh', 'Refresh vid länköppning', 1870, 814, LANE.ops, {
    details: 'Kör live-refresh när länk eller på plats-lookup kräver färsk detalj.',
    cadence: 'On demand',
    endpoints: ['Get detail of a booking'],
  }),
  service('job-retry', 'Retry för writeback', 2130, 814, LANE.ops, {
    details: 'Tar om writeback och redeem om externa anrop fallerar.',
    cadence: 'Retry queue',
    endpoints: ['Edit booking', 'Add transaction record', 'Redeem tickets'],
  }),
];

const awsNodes = [
  service('aws-rdb', 'Aurora PostgreSQL', 180, 996, LANE.aws, {
    details: 'Primär operativ databas för JumpYard Cloud.',
  }),
  service('aws-redis', 'Redis (valfri i V1)', 430, 996, LANE.aws, {
    details: 'Kortlivade tokens, sessionscache och rate limiting vid behov.',
  }),
  service('aws-s3', 'S3 rå-payloads', 180, 1106, LANE.aws, {
    details: 'Rå Roller-payloads, exportfiler och senare analysdump.',
  }),
  service('aws-sqs', 'SQS / EventBridge', 430, 1106, LANE.aws, {
    details: 'Köar SMS, retryjobb och andra asynkrona steg.',
  }),
  store('store-snapshot', 'Aurora / Roller Snapshot', 960, 968, LANE.aws, {
    summary: 'Lokal snapshot av Roller-bokningar, tickets, produkter och betalningar.',
    summaryItems: ['bookings', 'booking_tickets', 'booking_products'],
    tables: ['bookings', 'booking_tickets', 'booking_products', 'booking_payments'],
    keyFields: ['roller_booking_ref', 'ticket_ids', 'payment_status', 'payload_hash', 'last_seen_from_roller_at'],
    writePattern: 'Upsertas av daily seed, delta sync och link-open refresh.',
    reads: ['WebApp: VY: Bokning & deltagare', 'WebApp: Hitta befintlig bokning'],
    writes: ['Ops jobs: daily seed', 'Ops jobs: delta sync', 'Ops jobs: link-open refresh'],
    usedBy: ['WebApp bokningsvy', 'Kiosk lookup', 'Staff validering'],
    endpoints: ['Get attendance', 'Get tickets', 'Get payments', 'Get detail of a booking'],
    contains: ['Bokning', 'Tickets per booking', 'Produktsammanfattning', 'Betalningssnapshot'],
  }),
  store('store-operational', 'Aurora / Operativ state', 1260, 968, LANE.aws, {
    summary: 'Pilotens egen state för safety, token, check-in, connected-profiler och handoff.',
    summaryItems: ['booking_operational_state', 'checkin_tokens', 'connected_profile_drafts'],
    tables: ['booking_operational_state', 'checkin_tokens', 'sms_outbox', 'guest_profiles', 'connected_profile_drafts'],
    keyFields: ['local_checkin_status', 'confirmation_code', 'token_hash', 'safety_status', 'connected_profile_status'],
    writePattern: 'Skrivs av WebApp, staff-handoff och SMS-jobb. Läser inför redeem och utlämning.',
    reads: ['WebApp: VY: Safety', 'WebApp: VY: Tillägg', 'WebApp: VY: Betalning', 'Staff: Utlämning hos staff'],
    writes: ['WebApp: Safety', 'WebApp: Connected-profiler', 'WebApp: Betalning', 'Staff: Handoff'],
    ownedState: ['Safety completion', 'Confirmation code', 'Connected-profiler', 'Handoff-status'],
    usedBy: ['SMS-trigger', 'WebApp huvudflöde', 'Utlämning hos staff'],
    endpoints: ['Get products', 'Booking costs', 'Edit booking', 'Add transaction record', 'Redeem tickets'],
    contains: ['Operativ status', 'Tokens', 'SMS-logg', 'Lätta profilutkast för connected'],
  }),
  store('store-events', 'Aurora / Event & observability', 1560, 968, LANE.aws, {
    summary: 'Append-only eventspår och sync-observability för pilotens drift.',
    summaryItems: ['booking_events', 'sync_runs', 'error_summary'],
    tables: ['booking_events', 'sync_runs'],
    keyFields: ['event_type', 'event_source', 'booking_id', 'status', 'error_summary'],
    writePattern: 'Append-only från WebApp, staff och ops jobs.',
    usedBy: ['Support', 'Drift', 'Funnelanalys'],
    jobs: ['Daglig seed', 'Delta-synk', 'Retry för writeback'],
    contains: ['Visit events', 'SMS-händelser', 'Sync-resultat', 'Felspår'],
  }),
  store('store-future', 'Connected experience senare', 1860, 968, LANE.aws, {
    future: true,
    statusTag: 'Senare',
    summary: 'Framtida full session- och device-modell, skild från pilotens lätta profilutkast.',
    summaryItems: ['connected_sessions', 'device_pairings', 'live session state'],
    tables: ['connected_sessions', 'device_pairings'],
    keyFields: ['session_started_at', 'band_assigned', 'device_id'],
    writePattern: 'Senare scope. Inte aktivt i pilotens check-in.',
    contains: ['Bandkoppling', 'Session state', 'Device pairing'],
  }),
];

const rollerNodes = [
  service('roller-bulk', 'Get attendance / Get tickets / Get payments', 980, 1292, LANE.roller, {
    details: 'Bulk- och snapshotsync för ops jobben.',
    endpoints: ['Get attendance', 'Get tickets', 'Get payments'],
  }),
  service('roller-booking', 'Get detail of a booking', 1320, 1292, LANE.roller, {
    details: 'Live-detail när bokning eller lookup behöver en färsk källa.',
    endpoints: ['Get detail of a booking'],
  }),
  service('roller-products', 'Get products / Booking costs', 1660, 1292, LANE.roller, {
    details: 'Produktkatalog och kostnadsberäkning för tillägg och connected.',
    endpoints: ['Get products', 'Booking costs'],
  }),
  service('roller-writeback', 'Edit booking / Add transaction record', 2000, 1292, LANE.roller, {
    details: 'Writeback till Roller efter betalning och tillägg.',
    endpoints: ['Edit booking', 'Add transaction record'],
  }),
  service('roller-redeem', 'Redeem tickets', 2340, 1292, LANE.roller, {
    details: 'Kritisk slutpunkt när staff slutför handoff i piloten.',
    endpoints: ['Redeem tickets'],
  }),
];

const staffNodes = [
  task('staff-assist', 'Assisterad fallback', 1760, 262, LANE.staff, {
    details: 'Används vid mismatch, saknad kod eller andra undantag.',
  }),
  task('staff-manual', 'Manuell kontroll', 1990, 262, LANE.staff, {
    details: 'Staff kan kontrollera bokning manuellt innan utlämning eller alternativ hantering.',
  }),
  task('staff-handoff', 'Utlämning hos staff', 2220, 262, LANE.staff, {
    details: 'Piloten avslutas hos staff efter att check-in-flödet är klart.',
    why: 'Staff verifierar QR-kod eller bokningskod, ger ut tillägg och kopplar Connected Experience-band till profilerna från check-in-flödet.',
    reads: ['Bekräftad bokning', 'QR-kod eller bokningskod', 'Connected-profiler från operativ state'],
    writes: ['Redeem-status', 'visit event', 'utlämning klar', 'bandkoppling slutförd'],
    givesGuest: ['Tillägg', 'Connected Experience-band', 'Klartecken att gå vidare'],
    staffVerifies: ['QR-kod', 'Bokningskod'],
    endpoints: ['Redeem tickets'],
  }),
  event('staff-api-end', 'Manuell åtgärd klar', 'end', 2510, 274, LANE.staff, {
    details: 'Fallbackgrenen avslutas här när normalen inte kunde användas.',
  }),
];

export const pilotNodes: any[] = [
  ...pools,
  ...lanes,
  ...guestNodes,
  ...webAppNodes,
  ...opsNodes,
  ...awsNodes,
  ...rollerNodes,
  ...staffNodes,
];

export const pilotEdges: any[] = [
  edge('g1', 'guest-start', 'guest-open', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g2', 'guest-open', 'guest-review', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g3', 'guest-review', 'guest-safety', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g4', 'guest-safety', 'guest-addons', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g5', 'guest-addons', 'guest-pay', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g6', 'guest-pay', 'guest-confirm', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g7', 'guest-confirm', 'guest-arrive', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g8', 'guest-arrive', 'guest-present', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('g8b', 'guest-present', 'staff-handoff', { sourceHandle: 'bottom', targetHandle: 'top', type: 'step' }),
  edge('g9', 'staff-handoff', 'guest-end', { sourceHandle: 'right', targetHandle: 'left' }),

  edge('w1', 'app-start', 'gw-channel', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  labeledEdge('w2', 'gw-channel', 'app-mobile', 'Mobil', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  labeledEdge('w3', 'gw-channel', 'kiosk-entry', 'Kiosk', { sourceHandle: 'bottom', targetHandle: 'left', type: 'step' }),
  edge('w4', 'app-mobile', 'gw-mobile-entry', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  labeledEdge('w5', 'gw-mobile-entry', 'app-booking', 'SMS-länk med token', { sourceHandle: 'top', targetHandle: 'left', type: 'step' }),
  labeledEdge('w6', 'gw-mobile-entry', 'app-onsite', 'Park-QR', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  edge('w6b', 'app-onsite', 'gw-kiosk-existing', { sourceHandle: 'bottom', targetHandle: 'left', type: 'step' }),
  edge('w7', 'kiosk-entry', 'gw-kiosk-existing', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  labeledEdge('w8', 'gw-kiosk-existing', 'kiosk-lookup', 'Ja', { sourceHandle: 'top', targetHandle: 'left', type: 'step' }),
  labeledEdge('w9', 'gw-kiosk-existing', 'kiosk-buy', 'Nej', { sourceHandle: 'bottom', targetHandle: 'left', type: 'step' }),
  edge('w10', 'kiosk-lookup', 'app-booking', { sourceHandle: 'right', targetHandle: 'bottom-left', type: 'step' }),
  edge('w11', 'kiosk-buy', 'app-booking', { sourceHandle: 'right', targetHandle: 'bottom', type: 'step' }),
  edge('w12', 'app-booking', 'app-safety', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('w13', 'app-safety', 'app-addons', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('w14', 'app-addons', 'gw-app-connected', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  labeledEdge('w15', 'gw-app-connected', 'app-connected', 'Ja', { sourceHandle: 'top', targetHandle: 'left', type: 'step' }),
  labeledEdge('w16', 'gw-app-connected', 'gw-app-payment', 'Nej', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  edge('w17', 'app-connected', 'gw-app-payment', { sourceHandle: 'right', targetHandle: 'top', type: 'step' }),
  labeledEdge('w18', 'gw-app-payment', 'app-payment', 'Ja', { sourceHandle: 'top', targetHandle: 'left', type: 'step' }),
  labeledEdge('w19', 'gw-app-payment', 'app-confirm', 'Nej', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  edge('w20', 'app-payment', 'app-confirm', { sourceHandle: 'right', targetHandle: 'top', type: 'step' }),
  labeledEdge('w21', 'app-confirm', 'kiosk-print', 'kiosk / utskrift', { sourceHandle: 'top', targetHandle: 'left', type: 'step' }),
  labeledEdge('w22', 'app-confirm', 'app-present', 'mobil / ingen utskrift', { sourceHandle: 'right', targetHandle: 'left', type: 'step' }),
  edge('w23', 'kiosk-print', 'app-present', { sourceHandle: 'right', targetHandle: 'top', type: 'step' }),
  edge('w24', 'app-present', 'guest-present', { sourceHandle: 'top', targetHandle: 'bottom', type: 'step' }),

  edge('o1', 'job-daily', 'job-delta', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('o2', 'job-delta', 'job-sms', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('o3', 'job-sms', 'job-refresh', { sourceHandle: 'right', targetHandle: 'left' }),
  edge('o4', 'job-refresh', 'job-retry', { sourceHandle: 'right', targetHandle: 'left' }),

  dataEdge(
    'd1',
    'kiosk-lookup',
    'store-snapshot',
    'Gemensam lookup läser en matchbar bokning från snapshoten.',
    'Läsning',
    ['booking_ref', 'telefon + efternamn', 'QR-matchning', 'sessionstid'],
    'Samma lookup ska fungera för mobil via Park-QR och kiosk med befintlig bokning.',
    { sourceHandle: 'bottom', targetHandle: 'top-left' },
  ),
  dataEdge(
    'd3',
    'kiosk-buy',
    'store-operational',
    'Walk-in-köp skriver första operativa state innan gemensamt huvudflöde fortsätter.',
    'Skrivning',
    ['walk_in_purchase', 'nya deltagare', 'channel = kiosk', 'preliminary confirmation'],
    'Kiosk behöver kunna skapa en lokal operativ grund innan writeback och bekräftelse.',
    { sourceHandle: 'bottom-right', targetHandle: 'top-left' },
  ),
  dataEdge(
    'd4',
    'app-booking',
    'store-snapshot',
    'Bokningsvyn läser den senaste snapshoten för gemensam visning.',
    'Läsning',
    ['bokningssammanfattning', 'deltagare', 'produktlista', 'betalningsstatus'],
    'Både mobil och kiosk ska visa samma bokningsbild efter att bokningen hittats.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd5',
    'app-safety',
    'store-operational',
    'Safetyresultat skrivs till operativ state.',
    'Skrivning',
    ['safety_status', 'safety_completed_at'],
    'Safety ägs lokalt i JumpYard Cloud under piloten.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd6',
    'app-addons',
    'store-operational',
    'Tilläggsval och connected-flagga sparas inför betalningsbeslut och writeback.',
    'Skrivning',
    ['selected_addons', 'connected_selected', 'pricing_context'],
    'WebApp behöver en lokal operativ state innan Roller-writeback sker.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd7',
    'app-connected',
    'store-operational',
    'Connected-profiler sparas som lätta profilutkast i piloten.',
    'Skrivning',
    ['4 profilnamn', 'ikonval', 'connected_profile_status'],
    'Staff ska kunna koppla band till profilerna som skapades i check-in-flödet.',
    { sourceHandle: 'bottom', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd8',
    'app-payment',
    'store-operational',
    'Betalningsresultat skrivs innan writeback och bekräftelse.',
    'Skrivning',
    ['payment_status', 'payment_reference', 'writeback_pending'],
    'No-payment- och betalningsspåret behöver mötas i samma lokala state.',
    { sourceHandle: 'bottom', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd9',
    'app-confirm',
    'store-operational',
    'Bekräftelsevyn läser token, QR och bokningskod från operativ state.',
    'Läsning',
    ['confirmation_code', 'token_payload', 'payment_status'],
    'Samma slutbild måste fungera för både mobil och kiosk.',
    { sourceHandle: 'bottom-left', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd10',
    'kiosk-print',
    'store-operational',
    'Kiosk läser confirmation-data inför eventuell utskrift.',
    'Läsning',
    ['confirmation_code', 'QR payload', 'print status'],
    'Kioskens utskrift är ett litet sidospår efter det delade flödet.',
    { sourceHandle: 'bottom-left', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd11',
    'app-present',
    'store-operational',
    'Slutvyn läser det som gästen ska visa upp hos staff.',
    'Läsning',
    ['QR-kod', 'bokningskod', 'connected_profile_status'],
    'Staff-handoff behöver en tydlig och stabil slutvy oavsett kanal.',
    { sourceHandle: 'bottom', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd12',
    'staff-handoff',
    'store-operational',
    'Staff läser och uppdaterar operativ state när handoff slutförs.',
    'Läsning + skrivning',
    ['QR-kod eller bokningskod', 'connected-profiler', 'utlämning klar', 'bandkoppling'],
    'Piloten avslutas hos staff, inte i self-service.',
    { sourceHandle: 'top-left', targetHandle: 'bottom-right' },
  ),
  dataEdge(
    'd13',
    'staff-handoff',
    'store-events',
    'Staff skriver visit event och utlämningsspår.',
    'Skrivning',
    ['handoff_completed', 'redeem_succeeded', 'band_paired'],
    'Append-only eventspår behövs för drift, analys och felsökning.',
    { sourceHandle: 'top', targetHandle: 'bottom-right' },
  ),
  dataEdge(
    'd14',
    'job-daily',
    'roller-bulk',
    'Daglig seed hämtar dagens Roller-data.',
    'Sync',
    ['attendance', 'tickets', 'payments'],
    'Skapar dagens första lokala snapshot inför SMS och check-in.',
    { sourceHandle: 'bottom', targetHandle: 'top-left' },
  ),
  dataEdge(
    'd15',
    'job-daily',
    'store-snapshot',
    'Daglig seed skriver dagens snapshot till Aurora.',
    'Skrivning',
    ['bookings', 'booking_tickets', 'booking_products', 'booking_payments'],
    'Pilotens WebApp läser alltid lokal snapshot först.',
    { sourceHandle: 'bottom-left', targetHandle: 'top' },
  ),
  dataEdge(
    'd16',
    'job-delta',
    'roller-bulk',
    'Delta-synk hämtar ändringar under dagen.',
    'Sync',
    ['uppdaterade attendance-rader', 'ändrade tickets', 'nya payments'],
    'Snapshoten behöver hållas färsk utan att belasta happy path.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd17',
    'job-delta',
    'store-snapshot',
    'Delta-synk uppdaterar bara ändrade delar av snapshoten.',
    'Skrivning',
    ['payload_hash', 'changed rows', 'last_seen_from_roller_at'],
    'Minskar onödiga fulla omladdningar och håller datan begriplig.',
    { sourceHandle: 'bottom-left', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd18',
    'job-sms',
    'store-operational',
    'SMS-jobbet läser bokningar redo för utskick och skriver token/outbox-status.',
    'Läsning + skrivning',
    ['checkin_tokens', 'sms_outbox', 'checkin_link_sent_at'],
    'Unik länk måste skapas och spåras innan gästen öppnar flödet.',
    { sourceHandle: 'bottom-left', targetHandle: 'top-left' },
  ),
  dataEdge(
    'd19',
    'job-refresh',
    'roller-booking',
    'Refresh vid länköppning hämtar färsk booking detail.',
    'Läsning',
    ['booking detail', 'produktstatus', 'betalningsstatus', 'tickets'],
    'Behövs när länk öppnas eller på plats-lookup kräver färsk data.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd20',
    'job-refresh',
    'store-snapshot',
    'Färsk booking detail skrivs tillbaka till snapshoten.',
    'Skrivning',
    ['raw_payload_json', 'payload_hash', 'updated booking snapshot'],
    'WebApp ska fortsätta läsa lokal snapshot även efter live-refresh.',
    { sourceHandle: 'bottom-left', targetHandle: 'top-right' },
  ),
  dataEdge(
    'd21',
    'store-operational',
    'roller-products',
    'Cloud använder produkts- och kostnadsendpoints för tilläggssteget.',
    'Läsning',
    ['produktkatalog', 'prisberäkning', 'connected-produkt'],
    'Tillägg och connected måste räknas innan betalningsbeslutet tas.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd22',
    'job-retry',
    'roller-writeback',
    'Retryjobbet tar om writeback när betalning eller bokningsändring inte gick igenom.',
    'Writeback',
    ['Edit booking payload', 'transaction record payload', 'retry context'],
    'Externa Roller-anrop behöver ett separat återförsöksspår.',
    { sourceHandle: 'bottom', targetHandle: 'top' },
  ),
  dataEdge(
    'd23',
    'store-operational',
    'roller-writeback',
    'Operativ state driver writeback till Roller efter tillägg och betalning.',
    'Writeback',
    ['selected_addons', 'payment_status', 'transaction reference'],
    'Cloud äger ordningen mellan lokal state och extern skrivning.',
    { sourceHandle: 'bottom-right', targetHandle: 'top-left' },
  ),
  dataEdge(
    'd24',
    'staff-handoff',
    'roller-redeem',
    'Staff-handoff triggar redeem när QR-kod eller bokningskod verifierats.',
    'Writeback',
    ['ticket_ids', 'redeem request per ticket', 'verified handoff context'],
    'Piloten är inte klar förrän staff slutfört handoff och check-in i Roller.',
    { sourceHandle: 'top-right', targetHandle: 'bottom-left' },
  ),

  archEdge('a1', 'aws-rdb', 'store-snapshot', 'Aurora bär de operativa tabellgrupperna.'),
  archEdge('a2', 'aws-rdb', 'store-operational', 'Aurora bär pilotens egen operativa state.'),
  archEdge('a3', 'aws-rdb', 'store-events', 'Aurora bär observability och eventlogg.'),
  archEdge('a4', 'aws-rdb', 'store-future', 'Aurora kan senare bära full connected session state.'),
  archEdge('a5', 'aws-redis', 'store-operational', 'Redis kan cachea tokens och aktiv sessionstate i V1.'),
  archEdge('a6', 'aws-s3', 'store-snapshot', 'S3 kan lagra rå payloads och exportfiler vid behov.'),
  archEdge('a7', 'aws-sqs', 'job-sms', 'Asynkrona utskick och retryjobb kan gå via kö.'),
  archEdge('a8', 'aws-sqs', 'job-retry', 'Retryjobbet kan drivas via kö eller events.'),

  fallbackEdge('f1', 'guest-present', 'staff-assist', 'saknar kod / mismatch', {
    sourceHandle: 'bottom',
    targetHandle: 'top',
  }),
  fallbackEdge('f2', 'staff-assist', 'staff-manual', undefined, {
    sourceHandle: 'right',
    targetHandle: 'left',
  }),
  fallbackEdge('f3', 'staff-manual', 'staff-handoff', undefined, {
    sourceHandle: 'right',
    targetHandle: 'left',
  }),
  fallbackEdge('f4', 'job-retry', 'staff-assist', 'kritisk avvikelse', {
    sourceHandle: 'bottom',
    targetHandle: 'top-left',
  }),
  fallbackEdge('f5', 'staff-assist', 'staff-api-end', 'manuell väg', {
    sourceHandle: 'right',
    targetHandle: 'left',
  }),
];

void note;
