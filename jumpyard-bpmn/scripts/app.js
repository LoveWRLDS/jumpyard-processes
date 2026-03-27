(function () {
  const data = window.JumpYardBpmnData;

  if (!data) {
    throw new Error("JumpYard BPMN data was not loaded.");
  }

  const CFG = {
    LABEL_W: 140,
    COL_W: 148,
    TASK_W: 118,
    TASK_H: 46,
    DEC_S: 30,
    START_R: 15,
    HEADER_H: 36,
    LANE_HEIGHTS: [88, 82, 100, 105, 128, 94],
  };

  const STATUS_STYLES = {
    confirmed: { border: "#16a34a", fill: "#f0fdf4" },
    assumption: { border: "#d97706", fill: "#fffbeb" },
    "needs-verification": { border: "#dc2626", fill: "#fff1f2", dashed: true },
    exception: { border: "#dc2626", fill: "#fef2f2" },
    default: { border: "#6b7280", fill: "#f9fafb" },
  };

  const BADGE_COLORS = {
    GET: { bg: "#dbeafe", text: "#1d4ed8" },
    POST: { bg: "#dcfce7", text: "#166534" },
    POS: { bg: "#e0f2fe", text: "#0369a1" },
    WRITE: { bg: "#f3e8ff", text: "#5b21b6" },
    Webhook: { bg: "#fce7f3", text: "#9d174d" },
    OAuth2: { bg: "#f0fdf4", text: "#166534" },
  };

  const LANE_CONFIG = (() => {
    const lanes = [];
    let y = CFG.HEADER_H;

    CFG.LANE_HEIGHTS.forEach((height) => {
      lanes.push({ y, height, cy: y + height / 2 });
      y += height;
    });

    return lanes;
  })();

  const SVG_H = CFG.LANE_HEIGHTS.reduce((sum, height) => sum + height, 0) + CFG.HEADER_H;
  const zoomState = { asis: 1, tobe: 1 };

  function cx(col) {
    return CFG.LABEL_W + col * CFG.COL_W + CFG.COL_W / 2;
  }

  function lcy(laneIdx) {
    return LANE_CONFIG[laneIdx].cy;
  }

  function escXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function wrapText(text, maxChars) {
    const words = text.split(" ");
    const lines = [];
    let current = "";

    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  function getStatusStyle(status) {
    return STATUS_STYLES[status] || STATUS_STYLES.default;
  }

  function svgStart(x, y, nodeId, status) {
    const style = getStatusStyle(status);
    const radius = CFG.START_R;

    return `<g data-nid="${escXml(nodeId)}" style="cursor:pointer">
      <circle cx="${x}" cy="${y}" r="${radius}" fill="${style.fill}" stroke="${style.border}" stroke-width="2.5"/>
      <circle cx="${x}" cy="${y}" r="${radius - 5}" fill="${style.border}" stroke="none"/>
    </g>`;
  }

  function svgEnd(x, y, nodeId, status) {
    const style = getStatusStyle(status);
    const radius = CFG.START_R;

    return `<g data-nid="${escXml(nodeId)}" style="cursor:pointer">
      <circle cx="${x}" cy="${y}" r="${radius}" fill="${style.fill}" stroke="${style.border}" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="${radius - 6}" fill="none" stroke="${style.border}" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="${radius - 10}" fill="${style.border}" stroke="none"/>
    </g>`;
  }

  function svgTask(node, x, y) {
    const style = getStatusStyle(node.status);
    const width = CFG.TASK_W;
    const height = CFG.TASK_H;
    const left = x - width / 2;
    const top = y - height / 2;
    const textLines = wrapText(node.label, 16);
    const lineHeight = 12;
    const textStartY = y - ((textLines.length - 1) * lineHeight) / 2;
    const dashAttr = style.dashed ? ' stroke-dasharray="5,3"' : "";

    let typeIcon = "";
    if (node.type === "task-manual") {
      typeIcon = `<text x="${left + width - 6}" y="${top + height - 4}" font-size="8" fill="${style.border}" text-anchor="end">M</text>`;
    } else if (node.type === "task-auto") {
      typeIcon = `<text x="${left + width - 6}" y="${top + height - 4}" font-size="8" fill="${style.border}" text-anchor="end">A</text>`;
    }

    let badge = "";
    if (node.badge && BADGE_COLORS[node.badge]) {
      const badgeColor = BADGE_COLORS[node.badge];
      badge = `<rect x="${left + width - 32}" y="${top + 3}" width="28" height="11" rx="3" fill="${badgeColor.bg}"/>
        <text x="${left + width - 18}" y="${top + 11}" font-size="7" font-weight="700" fill="${badgeColor.text}" text-anchor="middle">${escXml(node.badge)}</text>`;
    }

    const stepLabel = `<text x="${left + 3}" y="${top + 9}" font-size="7" font-weight="700" fill="${style.border}" opacity="0.85">${escXml(node.id)}</text>`;
    const nodeText = textLines
      .map((line, index) => `<text x="${x}" y="${textStartY + index * lineHeight}" font-size="9.5" fill="#1e293b" text-anchor="middle" dominant-baseline="middle">${escXml(line)}</text>`)
      .join("");

    return `<g data-nid="${escXml(node.id)}" style="cursor:pointer">
      <rect x="${left}" y="${top}" width="${width}" height="${height}" rx="6" fill="${style.fill}" stroke="${style.border}" stroke-width="1.5"${dashAttr}/>
      ${stepLabel}${badge}${typeIcon}${nodeText}
    </g>`;
  }

  function svgDecision(node, x, y) {
    const style = getStatusStyle(node.status);
    const size = CFG.DEC_S;
    const dashAttr = style.dashed ? ' stroke-dasharray="5,3"' : "";
    const points = `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`;
    const lines = wrapText(node.label, 11);
    const lineHeight = 10;
    const textStartY = y - ((lines.length - 1) * lineHeight) / 2;
    const textSvg = lines
      .map((line, index) => `<text x="${x}" y="${textStartY + index * lineHeight}" font-size="8" fill="#1e293b" text-anchor="middle" dominant-baseline="middle">${escXml(line)}</text>`)
      .join("");

    return `<g data-nid="${escXml(node.id)}" style="cursor:pointer">
      <polygon points="${points}" fill="${style.fill}" stroke="${style.border}" stroke-width="1.5"${dashAttr}/>
      <text x="${x - size + 3}" y="${y - size + 8}" font-size="6.5" font-weight="700" fill="${style.border}">${escXml(node.id)}</text>
      ${textSvg}
    </g>`;
  }

  function svgException(node, x, y) {
    const width = CFG.TASK_W;
    const height = CFG.TASK_H;
    const left = x - width / 2;
    const top = y - height / 2;
    const lines = wrapText(node.label, 15);
    const lineHeight = 11;
    const textStartY = y - ((lines.length - 1) * lineHeight) / 2;
    const stepLabel = `<text x="${left + 3}" y="${top + 9}" font-size="7" font-weight="700" fill="#dc2626" opacity="0.85">${escXml(node.id)}</text>`;
    const textSvg = lines
      .map((line, index) => `<text x="${x}" y="${textStartY + index * lineHeight}" font-size="9" fill="#7f1d1d" text-anchor="middle" dominant-baseline="middle">${escXml(line)}</text>`)
      .join("");

    return `<g data-nid="${escXml(node.id)}" style="cursor:pointer">
      <rect x="${left}" y="${top}" width="${width}" height="${height}" rx="5" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
      <rect x="${left}" y="${top}" width="4" height="${height}" fill="#dc2626" stroke="none"/>
      ${stepLabel}${textSvg}
    </g>`;
  }

  function svgNote(text, x, y, width) {
    const lines = wrapText(text, Math.floor(width / 7));
    const lineHeight = 12;
    const height = lines.length * lineHeight + 12;
    const textSvg = lines
      .map((line, index) => `<text x="${x + 6}" y="${y + 8 + index * lineHeight}" font-size="9" fill="#713f12">${escXml(line)}</text>`)
      .join("");

    return `<g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" fill="#fef9c3" stroke="#fde047" stroke-width="1"/>
      ${textSvg}
    </g>`;
  }

  function nodeCenter(node) {
    return { x: cx(node.col), y: lcy(node.lane) };
  }

  function nodeEdgePoint(node, side) {
    const center = nodeCenter(node);

    if (node.type === "start" || node.type === "end") {
      const radius = CFG.START_R;
      if (side === "right") return { x: center.x + radius, y: center.y };
      if (side === "left") return { x: center.x - radius, y: center.y };
      if (side === "bottom") return { x: center.x, y: center.y + radius };
      return { x: center.x, y: center.y - radius };
    }

    if (node.type === "decision") {
      const size = CFG.DEC_S;
      if (side === "right") return { x: center.x + size, y: center.y };
      if (side === "left") return { x: center.x - size, y: center.y };
      if (side === "bottom") return { x: center.x, y: center.y + size };
      return { x: center.x, y: center.y - size };
    }

    const halfWidth = CFG.TASK_W / 2;
    const halfHeight = CFG.TASK_H / 2;
    if (side === "right") return { x: center.x + halfWidth, y: center.y };
    if (side === "left") return { x: center.x - halfWidth, y: center.y };
    if (side === "bottom") return { x: center.x, y: center.y + halfHeight };
    return { x: center.x, y: center.y - halfHeight };
  }

  function svgEdge(fromNode, toNode, style, label, exitDir) {
    const isException = style === "exception";
    const isDashed = style === "dashed";
    const isDotted = style === "dotted";

    let strokeColor = "#64748b";
    let strokeDash = "none";
    let markerEnd = "url(#arrow-gray)";

    if (isException) {
      strokeColor = "#dc2626";
      strokeDash = "5,3";
      markerEnd = "url(#arrow-red)";
    } else if (isDashed) {
      strokeColor = "#d97706";
      strokeDash = "6,4";
      markerEnd = "url(#arrow-amber)";
    } else if (isDotted) {
      strokeColor = "#94a3b8";
      strokeDash = "2,4";
    }

    const source = nodeEdgePoint(fromNode, exitDir || "right");
    const target = nodeEdgePoint(toNode, "left");
    let path;

    if (exitDir === "bottom" || isException) {
      const midY = Math.max(source.y + 30, target.y - 40);
      path = `M${source.x},${source.y} C${source.x},${source.y + 45} ${target.x - 55},${midY} ${target.x},${target.y}`;
    } else {
      const spread = Math.abs(target.y - source.y) > 20 ? 65 : 50;
      path = `M${source.x},${source.y} C${source.x + spread},${source.y} ${target.x - spread},${target.y} ${target.x},${target.y}`;
    }

    const dashAttr = strokeDash === "none" ? "" : ` stroke-dasharray="${strokeDash}"`;
    let labelSvg = "";

    if (label) {
      const labelX = (source.x + target.x) / 2;
      const labelY = (source.y + target.y) / 2 - 6;
      labelSvg = label
        .split("\n")
        .map((line, index) => `<text x="${labelX}" y="${labelY + index * 11}" font-size="8" fill="${strokeColor}" text-anchor="middle" style="paint-order:stroke;stroke:#fff;stroke-width:3px">${escXml(line)}</text>`)
        .join("");
    }

    return `<g>
      <path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="1.5"${dashAttr} marker-end="${markerEnd}"/>
      ${labelSvg}
    </g>`;
  }

  function buildSvg(flow) {
    const nodeMap = Object.fromEntries(flow.nodes.map((node) => [node.id, node]));
    const maxCol = flow.nodes.reduce((max, node) => Math.max(max, node.col), 0);
    const svgWidth = CFG.LABEL_W + (maxCol + 1) * CFG.COL_W + 20;

    const defs = `<defs>
      <marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#64748b"/>
      </marker>
      <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#dc2626"/>
      </marker>
      <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#d97706"/>
      </marker>
    </defs>`;

    let laneSvg = "";
    LANE_CONFIG.forEach((laneConfig, index) => {
      const lane = data.laneDefs[index];
      const subtitle = flow.laneSubtitles[index] || "";
      const hasNodes = flow.nodes.some((node) => node.lane === index && node.type !== "start" && node.type !== "end");
      const emptyCloudLane = index === 3 && !hasNodes;
      const labelY = laneConfig.y + laneConfig.height / 2;

      laneSvg += `<rect x="${CFG.LABEL_W}" y="${laneConfig.y}" width="${svgWidth - CFG.LABEL_W}" height="${laneConfig.height}" fill="${lane.bg}" opacity="${emptyCloudLane ? 0.45 : 1}"/>`;
      laneSvg += `<rect x="0" y="${laneConfig.y}" width="${CFG.LABEL_W}" height="${laneConfig.height}" fill="${lane.bg}" stroke="${lane.border}" stroke-width="0.5"/>`;
      laneSvg += `<text transform="rotate(-90,20,${labelY})" x="0" y="${labelY}" font-size="10" font-weight="700" fill="${lane.text}" text-anchor="middle" dominant-baseline="middle">${escXml(lane.name)}</text>`;

      if (subtitle) {
        laneSvg += `<text transform="rotate(-90,32,${labelY})" x="0" y="${labelY}" font-size="8" fill="${lane.text}" text-anchor="middle" dominant-baseline="middle" opacity="0.7">${escXml(subtitle)}</text>`;
      }

      if (emptyCloudLane) {
        const noteX = CFG.LABEL_W + 20;
        const noteY = laneConfig.cy - 12;
        laneSvg += `<rect x="${noteX}" y="${noteY}" width="240" height="22" rx="4" fill="#fef9c3" stroke="#fde047" stroke-width="1" opacity="0.9"/>`;
        laneSvg += `<text x="${noteX + 8}" y="${noteY + 15}" font-size="10" fill="#854d0e" font-style="italic">Not present in AS-IS - this lane is intentionally empty</text>`;
      }

      laneSvg += `<line x1="${CFG.LABEL_W}" y1="${laneConfig.y}" x2="${svgWidth}" y2="${laneConfig.y}" stroke="${lane.border}" stroke-width="0.5" opacity="0.5"/>`;
    });

    let headerSvg = `<rect x="0" y="0" width="${svgWidth}" height="${CFG.HEADER_H}" fill="#0f172a"/>`;
    headerSvg += `<text x="${CFG.LABEL_W + 10}" y="22" font-size="13" font-weight="700" fill="#f8fafc">${escXml(flow.title)}</text>`;

    for (let col = 0; col <= maxCol + 1; col += 1) {
      const guideX = CFG.LABEL_W + col * CFG.COL_W;
      headerSvg += `<line x1="${guideX}" y1="${CFG.HEADER_H}" x2="${guideX}" y2="${SVG_H}" stroke="#e2e8f0" stroke-width="0.4" opacity="0.5"/>`;
    }

    const edgesSvg = flow.edges.map((edge) => svgEdge(nodeMap[edge.from], nodeMap[edge.to], edge.style, edge.label, edge.exitDir)).join("");
    const nodesSvg = flow.nodes
      .map((node) => {
        const x = cx(node.col);
        const y = lcy(node.lane);
        if (node.type === "start") return svgStart(x, y, node.id, node.status);
        if (node.type === "end") return svgEnd(x, y, node.id, node.status);
        if (node.type === "decision") return svgDecision(node, x, y);
        if (node.type === "task-exception") return svgException(node, x, y);
        return svgTask(node, x, y);
      })
      .join("");

    const notesSvg = flow.annotations
      .map((annotation) => svgNote(annotation.text, cx(annotation.col) + annotation.dx, lcy(annotation.lane) + annotation.dy, annotation.width))
      .join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${SVG_H}" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      ${defs}
      ${laneSvg}
      ${headerSvg}
      ${edgesSvg}
      ${nodesSvg}
      ${notesSvg}
    </svg>`;
  }

  function applyZoom(flowKey) {
    const wrap = document.getElementById(`${flowKey}-wrap`);
    if (!wrap) return;

    wrap.style.transform = `scale(${zoomState[flowKey]})`;
    const svg = wrap.querySelector("svg");
    if (!svg) return;

    wrap.style.width = `${Number(svg.getAttribute("width")) * zoomState[flowKey]}px`;
    wrap.style.height = `${Number(svg.getAttribute("height")) * zoomState[flowKey]}px`;
  }

  function zoom(flowKey, delta) {
    zoomState[flowKey] = Math.max(0.3, Math.min(3, zoomState[flowKey] + delta));
    applyZoom(flowKey);
  }

  function fitDiagram(flowKey) {
    const viewport = document.getElementById(`${flowKey}-vp`);
    const wrap = document.getElementById(`${flowKey}-wrap`);
    const svg = wrap ? wrap.querySelector("svg") : null;
    if (!viewport || !svg) return;

    const viewportWidth = viewport.clientWidth - 20;
    zoomState[flowKey] = Math.min(1, viewportWidth / Number(svg.getAttribute("width")));
    applyZoom(flowKey);
  }

  function resetZoom(flowKey) {
    zoomState[flowKey] = 1;
    applyZoom(flowKey);
  }

  function openPanel(nodeId, flowKey) {
    const node = data.flows[flowKey].nodes.find((entry) => entry.id === nodeId);
    if (!node) return;

    const detail = node.detail || {};
    const typeLabels = {
      start: "Start Event",
      end: "End Event",
      task: "Task",
      "task-manual": "Manual Task",
      "task-auto": "Automated Task",
      decision: "Decision Gateway",
      "task-exception": "Exception Task",
    };

    document.getElementById("sp-title").textContent = `${node.id} - ${node.label}`;

    let html = `<div class="sp-field"><div class="sp-field-label">Status</div><div class="sp-field-value"><span class="sp-badge ${node.status}">${node.status.charAt(0).toUpperCase() + node.status.slice(1).replace("-", " ")}</span></div></div>`;
    html += `<div class="sp-field"><div class="sp-field-label">Step Type</div><div class="sp-field-value">${typeLabels[node.type] || node.type}</div></div>`;

    if (detail.actor) html += `<div class="sp-field"><div class="sp-field-label">Actor / Lane</div><div class="sp-field-value">${escHtml(detail.actor)}</div></div>`;
    if (detail.description) html += `<div class="sp-field"><div class="sp-field-label">Description</div><div class="sp-field-value">${escHtml(detail.description)}</div></div>`;
    if (detail.trigger) html += `<div class="sp-field"><div class="sp-field-label">Trigger</div><div class="sp-field-value">${escHtml(detail.trigger)}</div></div>`;
    if (detail.input) html += `<div class="sp-field"><div class="sp-field-label">Input Data</div><div class="sp-field-value">${escHtml(detail.input)}</div></div>`;
    if (detail.output) html += `<div class="sp-field"><div class="sp-field-label">Output / Result</div><div class="sp-field-value">${escHtml(detail.output)}</div></div>`;
    if (detail.stateChange) html += `<div class="sp-field"><div class="sp-field-label">State Change</div><div class="sp-field-value">${escHtml(detail.stateChange)}</div></div>`;
    if (detail.apiTouchpoint) html += `<div class="sp-field"><div class="sp-field-label">API Touchpoint</div><div class="sp-field-value">${escHtml(detail.apiTouchpoint)}</div></div>`;
    if (detail.docUrl) html += `<div class="sp-field"><div class="sp-field-label">Documentation</div><div class="sp-field-value"><a href="${escHtml(detail.docUrl)}" target="_blank" rel="noopener">${escHtml(detail.docLabel || detail.docUrl)}</a></div></div>`;
    if (node.note) html += `<div class="sp-note">${escHtml(node.note)}</div>`;

    if (node.badge) {
      const badgeColor = BADGE_COLORS[node.badge] || { bg: "#e5e7eb", text: "#374151" };
      html += `<div class="sp-field"><div class="sp-field-label">Method Badge</div><div class="sp-field-value"><span class="panel-method-badge" style="background:${badgeColor.bg};color:${badgeColor.text}">${escHtml(node.badge)}</span></div></div>`;
    }

    document.getElementById("sp-body").innerHTML = html;
    document.getElementById("sidePanel").classList.add("open");
    document.getElementById("overlay").classList.add("open");
  }

  function closePanel() {
    document.getElementById("sidePanel").classList.remove("open");
    document.getElementById("overlay").classList.remove("open");
  }

  function attachSvgClicks(wrapperId, flowKey) {
    const wrap = document.getElementById(wrapperId);
    if (!wrap) return;

    wrap.addEventListener("click", (event) => {
      const target = event.target.closest("[data-nid]");
      if (target) {
        openPanel(target.dataset.nid, flowKey);
      }
    });
  }

  function buildDeltaTab() {
    const grid = document.getElementById("delta-grid");
    if (!grid) return;

    grid.innerHTML = data.deltaCards.map((card) => `
      <div class="delta-card ${card.colorClass}">
        <div class="delta-card-title">${escHtml(card.icon)} ${escHtml(card.title)}</div>
        <ul>${card.items.map((item) => `<li>${escHtml(item)}</li>`).join("")}</ul>
      </div>
    `).join("");
  }

  function buildAssumptionsTable() {
    const tbody = document.getElementById("assumptions-body");
    if (!tbody) return;

    tbody.innerHTML = data.assumptions.map((item) => {
      const badgeClass = item.status === "Confirmed" ? "bp-confirmed" : item.status === "Needs verification" ? "bp-needs" : "bp-assumption";
      const source = item.sourceUrl
        ? `<a href="${escHtml(item.sourceUrl)}" target="_blank" rel="noopener">${escHtml(item.sourceLabel)}</a>`
        : (item.sourceLabel ? escHtml(item.sourceLabel) : "-");

      return `<tr>
        <td><strong>${escHtml(item.id)}</strong></td>
        <td>${escHtml(item.topic)}</td>
        <td><span class="badge-pill ${badgeClass}">${escHtml(item.status)}</span></td>
        <td>${escHtml(item.statement)}</td>
        <td>${escHtml(item.whyItMatters)}</td>
        <td>${source}</td>
      </tr>`;
    }).join("");
  }

  function buildApiTable() {
    const tbody = document.getElementById("api-body");
    if (!tbody) return;

    const methodClass = (methodType) => {
      if (methodType.startsWith("GET")) return "badge-pill method-get";
      if (methodType.startsWith("POST")) return "badge-pill method-post";
      if (methodType.includes("POS")) return "badge-pill method-pos";
      if (methodType.includes("WRITE") || methodType.includes("Internal write")) return "badge-pill method-write";
      if (methodType.includes("Webhook")) return "badge-pill method-webhook";
      if (methodType.includes("OAuth")) return "badge-pill method-oauth";
      return "badge-pill method-internal";
    };

    const statusClass = (status) => {
      if (status.startsWith("Confirmed")) return "bp-confirmed";
      if (status.startsWith("Needs")) return "bp-needs";
      return "bp-assumption";
    };

    tbody.innerHTML = data.apiTouchpoints.map((item) => {
      const doc = item.docUrl
        ? `<a href="${escHtml(item.docUrl)}" target="_blank" rel="noopener">${escHtml(item.docLabel)}</a>`
        : "-";

      return `<tr>
        <td><strong>${escHtml(item.stepId)}</strong></td>
        <td>${escHtml(item.system)}</td>
        <td>${escHtml(item.action)}</td>
        <td><span class="${methodClass(item.methodType)}">${escHtml(item.methodType)}</span></td>
        <td>${escHtml(item.readWrite)}</td>
        <td class="api-object-cell">${escHtml(item.objectTouched)}</td>
        <td><span class="badge-pill ${statusClass(item.confirmationStatus)}">${escHtml(item.confirmationStatus)}</span></td>
        <td>${doc}</td>
      </tr>`;
    }).join("");
  }

  function bindTabs() {
    document.querySelectorAll(".tab-btn").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((entry) => entry.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((entry) => entry.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(`tab-${button.dataset.tab}`).classList.add("active");
      });
    });
  }

  function bindPanel() {
    document.getElementById("sp-close").addEventListener("click", closePanel);
    document.getElementById("overlay").addEventListener("click", closePanel);
  }

  function bindDiagramControls() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-diagram-action]");
      if (!button) return;

      const { diagramAction, flow } = button.dataset;
      if (!flow) return;

      if (diagramAction === "zoom-in") zoom(flow, 0.15);
      if (diagramAction === "zoom-out") zoom(flow, -0.15);
      if (diagramAction === "fit") fitDiagram(flow);
      if (diagramAction === "reset") resetZoom(flow);
    });
  }

  function buildFlow(flowKey) {
    const flow = data.flows[flowKey];
    const wrap = document.getElementById(`${flowKey}-wrap`);
    if (!flow || !wrap) return;

    wrap.innerHTML = buildSvg(flow);
    attachSvgClicks(`${flowKey}-wrap`, flowKey);
  }

  function init() {
    bindPanel();
    bindTabs();
    bindDiagramControls();
    buildFlow("asis");
    buildFlow("tobe");
    buildDeltaTab();
    buildAssumptionsTable();
    buildApiTable();

    setTimeout(() => {
      fitDiagram("asis");
      fitDiagram("tobe");
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
