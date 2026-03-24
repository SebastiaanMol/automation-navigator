import { Node, Edge, MarkerType } from "@xyflow/react";
import { Automatisering, KlantFase } from "@/lib/types";
import { ActivityNodeData, EventNodeData, GatewayNodeData, LaneHeaderData } from "./BPMNNodes";

const LANE_HEIGHT = 160;
const NODE_WIDTH = 180;
const NODE_GAP_X = 60;
const LANE_LABEL_WIDTH = 50;
const START_X = 80;
const LANE_GAP = 20;

const CATEGORY_COLORS: Record<string, string> = {
  "HubSpot Workflow": "#ff7a59",
  "Zapier Zap": "#ff4a00",
  "Backend Script": "#0066cc",
  "HubSpot + Zapier": "#ff7a59",
  Typeform: "#262627",
  SharePoint: "#038387",
  WeFact: "#f5a623",
  Docufy: "#6c3fc5",
  "E-mail": "#10b981",
  API: "#64748b",
  Anders: "#a855f7",
};

const PHASE_COLORS: Record<string, string> = {
  Marketing: "#6366f1",
  Sales: "#f43f5e",
  Onboarding: "#0ea5e9",
  Boekhouding: "#f97316",
  Offboarding: "#8b5cf6",
};

export type LaneGrouping = "categorie" | "fase";

export function buildBPMNGraph(
  data: Automatisering[],
  grouping: LaneGrouping
): { nodes: Node[]; edges: Edge[]; width: number; height: number } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group automations into lanes
  const lanes: Map<string, Automatisering[]> = new Map();

  if (grouping === "fase") {
    const FASEN: KlantFase[] = ["Marketing", "Sales", "Onboarding", "Boekhouding", "Offboarding"];
    for (const fase of FASEN) {
      const items = data.filter((a) => a.fasen?.includes(fase));
      if (items.length > 0) lanes.set(fase, items);
    }
    // Items without a phase
    const noPhase = data.filter((a) => !a.fasen || a.fasen.length === 0);
    if (noPhase.length > 0) lanes.set("Geen fase", noPhase);
  } else {
    for (const a of data) {
      const cat = a.categorie || "Anders";
      if (!lanes.has(cat)) lanes.set(cat, []);
      lanes.get(cat)!.push(a);
    }
  }

  // Track node positions for edge routing
  const nodePositions: Map<string, { x: number; y: number }> = new Map();
  let currentY = 40;
  let maxX = 0;

  const laneEntries = Array.from(lanes.entries());

  for (const [laneName, items] of laneEntries) {
    const laneColor =
      grouping === "fase"
        ? PHASE_COLORS[laneName] || "#64748b"
        : CATEGORY_COLORS[laneName] || "#64748b";

    const rowCount = Math.ceil(items.length / 5); // max 5 per row
    const laneHeight = Math.max(LANE_HEIGHT, rowCount * 100 + 60);

    // Lane header node
    nodes.push({
      id: `lane-${laneName}`,
      type: "laneHeader",
      position: { x: 0, y: currentY },
      data: { label: laneName, color: laneColor, count: items.length } satisfies LaneHeaderData,
      draggable: false,
      selectable: false,
    });

    // Lane background (using a group node style)
    nodes.push({
      id: `lane-bg-${laneName}`,
      type: "group",
      position: { x: LANE_LABEL_WIDTH, y: currentY - 10 },
      data: {},
      style: {
        width: Math.max(items.length * (NODE_WIDTH + NODE_GAP_X) + START_X + 100, 600),
        height: laneHeight,
        background: `${laneColor}06`,
        border: `1px solid ${laneColor}25`,
        borderRadius: 8,
        zIndex: -1,
      },
      draggable: false,
      selectable: false,
    });

    // Place activity nodes in this lane
    items.forEach((a, idx) => {
      const row = Math.floor(idx / 5);
      const col = idx % 5;
      const x = LANE_LABEL_WIDTH + START_X + col * (NODE_WIDTH + NODE_GAP_X);
      const y = currentY + 20 + row * 100;

      nodePositions.set(a.id, { x, y });

      nodes.push({
        id: a.id,
        type: "activity",
        position: { x, y },
        data: {
          label: a.naam.length > 45 ? a.naam.slice(0, 42) + "..." : a.naam,
          autoId: a.id,
          status: a.status,
          systemen: a.systemen,
          trigger: a.trigger,
          owner: a.owner,
        } satisfies ActivityNodeData,
      });

      const endX = x + NODE_WIDTH;
      if (endX > maxX) maxX = endX;
    });

    currentY += laneHeight + LANE_GAP;
  }

  // Add edges from koppelingen
  for (const a of data) {
    for (const k of a.koppelingen) {
      if (nodePositions.has(k.doelId)) {
        edges.push({
          id: `e-${a.id}-${k.doelId}`,
          source: a.id,
          target: k.doelId,
          label: k.label ? (k.label.length > 30 ? k.label.slice(0, 27) + "..." : k.label) : undefined,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#475569", strokeWidth: 2 },
          labelStyle: { fontSize: 9, fill: "#64748b" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#475569", width: 16, height: 16 },
        });
      }
    }
  }

  return {
    nodes,
    edges,
    width: maxX + 100,
    height: currentY + 40,
  };
}
