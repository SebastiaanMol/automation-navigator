import { CheckCircle, Eye, GitFork, Share2, Trash2, Zap } from "lucide-react"
import { useEffect, useRef } from "react"

export interface ContextMenuItem {
  label: string
  icon: React.ReactNode
  action: () => void
  danger?: boolean
  divider?: boolean
}

interface Props {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  // Keep within viewport
  const left = Math.min(x, window.innerWidth - 220)
  const top  = Math.min(y, window.innerHeight - items.length * 40 - 20)

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left,
        top,
        zIndex: 9999,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        boxShadow: "0 8px 24px #00000018",
        minWidth: 200,
        overflow: "hidden",
        animation: "fadeIn 0.1s ease",
      }}
    >
      {items.map((item, i) => (
        <div key={i}>
          {item.divider && i > 0 && (
            <div style={{ borderTop: "1px solid #f1f5f9", margin: "2px 0" }} />
          )}
          <button
            onClick={() => { item.action(); onClose() }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "9px 14px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: item.danger ? "#ef4444" : "#0f172a",
              textAlign: "left",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = item.danger ? "#fef2f2" : "#f8fafc")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <span style={{ color: item.danger ? "#ef4444" : "#64748b", display: "flex" }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        </div>
      ))}
    </div>
  )
}

// Convenience icon exports for menu items
export { CheckCircle, Eye, GitFork, Share2, Trash2, Zap }
