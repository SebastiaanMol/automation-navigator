import { NodeProps } from "@xyflow/react"

export interface ClusterNodeData {
  label: string
  color: string
  count: number
  expanded: boolean
  severity?: string // "error" | "warning" | "info" | undefined
}

export function ClusterNode({ data }: NodeProps) {
  const d = data as ClusterNodeData
  const severityColor = d.severity === "error" ? "#ef4444"
    : d.severity === "warning" ? "#f59e0b"
    : null

  return (
    <div style={{
      border: `2px dashed ${severityColor ?? d.color}`,
      borderRadius: 14,
      background: `${d.color}0d`,
      padding: "12px 18px",
      minWidth: 160,
      cursor: "pointer",
      boxShadow: severityColor ? `0 0 0 3px ${severityColor}33` : "none",
      transition: "box-shadow 0.2s",
      userSelect: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: severityColor ?? d.color,
        }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{d.label}</span>
        {severityColor && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "1px 5px",
            borderRadius: 10, background: `${severityColor}22`,
            color: severityColor, border: `1px solid ${severityColor}`,
          }}>
            ⚠
          </span>
        )}
      </div>
      <div style={{ marginTop: 4, fontSize: 11, color: "#64748b" }}>
        {d.count} automatisering{d.count !== 1 ? "en" : ""}
      </div>
      <div style={{ marginTop: 6, fontSize: 10, color: d.color, fontWeight: 600 }}>
        {d.expanded ? "▲ Inklappen" : "▼ Uitklappen"}
      </div>
    </div>
  )
}
