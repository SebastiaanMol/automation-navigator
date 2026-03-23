import { Automatisering, getVerificatieStatus } from "./types"
import { buildAdjacency } from "./graphAnalysis"

export type ProblemType =
  | "orphan"
  | "missing-owner"
  | "missing-trigger"
  | "missing-systems"
  | "outdated"
  | "unverified"
  | "no-goal"
  | "broken-link"

export type Severity = "error" | "warning" | "info"

export interface GraphProblem {
  id: string
  automationId: string
  naam: string
  type: ProblemType
  severity: Severity
  message: string
  suggestion: string
}

const SEVERITY: Record<ProblemType, Severity> = {
  "broken-link":    "error",
  "outdated":       "error",
  "orphan":         "warning",
  "missing-owner":  "warning",
  "missing-trigger":"warning",
  "missing-systems":"warning",
  "unverified":     "info",
  "no-goal":        "info",
}

const LABEL: Record<ProblemType, string> = {
  "broken-link":    "Gebroken koppeling",
  "outdated":       "Verouderd",
  "orphan":         "Geen koppelingen",
  "missing-owner":  "Geen eigenaar",
  "missing-trigger":"Geen trigger",
  "missing-systems":"Geen systemen",
  "unverified":     "Niet geverifieerd",
  "no-goal":        "Geen doel",
}

export function detectProblems(automations: Automatisering[]): GraphProblem[] {
  const problems: GraphProblem[] = []
  const allIds = new Set(automations.map(a => a.id))
  const adj = buildAdjacency(automations)

  for (const a of automations) {
    const push = (type: ProblemType, message: string, suggestion: string) =>
      problems.push({
        id: `${a.id}-${type}`,
        automationId: a.id,
        naam: a.naam,
        type,
        severity: SEVERITY[type],
        message,
        suggestion,
      })

    // Broken links — koppeling targets that don't exist
    for (const k of (a.koppelingen ?? [])) {
      if (!allIds.has(k.doelId)) {
        push("broken-link",
          `Koppeling naar '${k.doelId}' bestaat niet meer`,
          `Verwijder of herstel de koppeling naar ${k.doelId}`)
      }
    }

    // Outdated / Uitgeschakeld
    if (a.status === "Verouderd") {
      push("outdated",
        `Status is 'Verouderd'`,
        `Update of archiveer deze automatisering`)
    }

    // Orphan — no connections at all
    const connections = adj.get(a.id)?.size ?? 0
    if (connections === 0) {
      push("orphan",
        `Staat volledig los — geen koppelingen`,
        `Koppel aan gerelateerde automatiseringen of verwijder`)
    }

    // Missing owner
    if (!a.owner?.trim()) {
      push("missing-owner",
        `Geen eigenaar ingesteld`,
        `Wijs een verantwoordelijke toe`)
    }

    // Missing trigger
    if (!a.trigger?.trim()) {
      push("missing-trigger",
        `Geen trigger gedefinieerd`,
        `Beschrijf wat deze automatisering activeert`)
    }

    // Missing systems
    if (!a.systemen?.length) {
      push("missing-systems",
        `Geen systemen gekoppeld`,
        `Geef aan welke tools/systemen dit gebruikt`)
    }

    // Unverified > 90 days
    const vs = getVerificatieStatus(a)
    if (vs === "verouderd") {
      push("unverified",
        `Niet geverifieerd in 90+ dagen`,
        `Controleer of deze automatisering nog klopt`)
    } else if (vs === "nooit") {
      push("unverified",
        `Nog nooit geverifieerd`,
        `Verifieer deze automatisering voor het eerst`)
    }

    // No goal
    if (!a.doel?.trim()) {
      push("no-goal",
        `Geen doel beschreven`,
        `Voeg een korte doelomschrijving toe`)
    }
  }

  return problems
}

export function problemNodeIds(problems: GraphProblem[]): Map<string, Severity> {
  const map = new Map<string, Severity>()
  for (const p of problems) {
    // Keep highest severity
    const cur = map.get(p.automationId)
    if (!cur || severityRank(p.severity) > severityRank(cur)) {
      map.set(p.automationId, p.severity)
    }
  }
  return map
}

export function severityRank(s: Severity): number {
  return s === "error" ? 2 : s === "warning" ? 1 : 0
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  error:   "#ef4444",
  warning: "#f59e0b",
  info:    "#3b82f6",
}

export const TYPE_LABELS = LABEL
