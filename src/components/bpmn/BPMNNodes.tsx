import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

// ─── Colors ──────────────────────────────────────────────────────────────────

const SYSTEM_COLORS: Record<string, string> = {
  HubSpot: "#ff7a59",
  Zapier: "#ff4a00",
  Typeform: "#262627",
  SharePoint: "#038387",
  WeFact: "#f5a623",
  Docufy: "#6c3fc5",
  Backend: "#0066cc",
  "E-mail": "#10b981",
  API: "#64748b",
  Anders: "#a855f7",
};

const STATUS_ICONS: Record<string, string> = {
  Actief: "✅",
  Verouderd: "⚠️",
  "In review": "🔍",
  Uitgeschakeld: "❌",
};

// ─── Activity Node (rounded rectangle like BPMN) ────────────────────────────

export interface ActivityNodeData {
  label: string;
  autoId: string;
  status: string;
  systemen: string[];
  trigger: string;
  owner: string;
}

export const ActivityNode = memo(({ data }: NodeProps) => {
  const d = data as unknown as ActivityNodeData;
  const primarySystem = d.systemen?.[0] || "Anders";
  const color = SYSTEM_COLORS[primarySystem] || "#64748b";

  return (
    <div
      style={{
        background: "#fffde7",
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: "8px 14px",
        minWidth: 140,
        maxWidth: 200,
        fontSize: 11,
        fontFamily: "IBM Plex Sans, sans-serif",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: color, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: color, width: 8, height: 8 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
        <span style={{ fontSize: 9, color: "#64748b", fontFamily: "monospace" }}>{d.autoId}</span>
        <span>{STATUS_ICONS[d.status] || ""}</span>
      </div>
      <div style={{ fontWeight: 600, color: "#1e293b", lineHeight: 1.3, wordBreak: "break-word" }}>
        {d.label}
      </div>
      <div style={{ marginTop: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
        {d.systemen?.slice(0, 3).map((s) => (
          <span
            key={s}
            style={{
              fontSize: 8,
              padding: "1px 5px",
              borderRadius: 4,
              background: `${SYSTEM_COLORS[s] || "#64748b"}18`,
              color: SYSTEM_COLORS[s] || "#64748b",
              border: `1px solid ${SYSTEM_COLORS[s] || "#64748b"}44`,
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
});
ActivityNode.displayName = "ActivityNode";

// ─── Start Event Node (circle) ──────────────────────────────────────────────

export interface EventNodeData {
  label: string;
  type: "start" | "end";
}

export const EventNode = memo(({ data }: NodeProps) => {
  const d = data as unknown as EventNodeData;
  const isStart = d.type === "start";

  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: isStart ? "#dcfce7" : "#fecaca",
        border: `3px solid ${isStart ? "#22c55e" : "#ef4444"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 8,
        fontWeight: 700,
        color: isStart ? "#166534" : "#991b1b",
        textAlign: "center",
      }}
    >
      {isStart ? (
        <Handle type="source" position={Position.Right} style={{ background: "#22c55e", width: 8, height: 8 }} />
      ) : (
        <Handle type="target" position={Position.Left} style={{ background: "#ef4444", width: 8, height: 8 }} />
      )}
      {isStart ? "▶" : "■"}
    </div>
  );
});
EventNode.displayName = "EventNode";

// ─── Gateway Node (diamond) ─────────────────────────────────────────────────

export interface GatewayNodeData {
  label: string;
}

export const GatewayNode = memo(({ data }: NodeProps) => {
  const d = data as unknown as GatewayNodeData;

  return (
    <div style={{ position: "relative", width: 50, height: 50 }}>
      <Handle type="target" position={Position.Left} style={{ background: "#65a30d", width: 8, height: 8, left: -4 }} />
      <Handle type="source" position={Position.Right} style={{ background: "#65a30d", width: 8, height: 8, right: -4 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: "#65a30d", width: 8, height: 8, bottom: -4 }} />
      <div
        style={{
          width: 50,
          height: 50,
          background: "#ecfccb",
          border: "2px solid #65a30d",
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ transform: "rotate(-45deg)", fontSize: 16, color: "#65a30d", fontWeight: 700 }}>✦</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -18,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          color: "#64748b",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        {d.label}
      </div>
    </div>
  );
});
GatewayNode.displayName = "GatewayNode";

// ─── Lane Header Node (label for the swimming lane) ─────────────────────────

export interface LaneHeaderData {
  label: string;
  color: string;
  count: number;
}

export const LaneHeaderNode = memo(({ data }: NodeProps) => {
  const d = data as unknown as LaneHeaderData;

  return (
    <div
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        transform: "rotate(180deg)",
        background: `${d.color}15`,
        border: `2px solid ${d.color}40`,
        borderRadius: 6,
        padding: "12px 8px",
        fontWeight: 700,
        fontSize: 12,
        color: d.color,
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <span>{d.label}</span>
      <span style={{ fontSize: 9, opacity: 0.7 }}>({d.count})</span>
    </div>
  );
});
LaneHeaderNode.displayName = "LaneHeaderNode";
