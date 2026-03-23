import { Node, Edge, MarkerType } from "@xyflow/react"

// ─── Node type keys ───────────────────────────────────────────────────────────
export type DomainNodeType =
  | "entity"      // Contact, Company, Deal, Dossier
  | "pipeline"    // Sales, BTW, Jaarrekening, IB, VPB, KB
  | "clienttype"  // Softwarepakket, Portaal/CSV, Software
  | "techfn"      // findcorrectstage, routebtw, Python Backend
  | "critical"    // Bankkoppeling — the bottleneck
  | "leadsource"  // Website, Facebook, Solvari, Trustoo
  | "extsystem"   // HubSpot, Zapier, Mollie, Exact, Moneybird…

// ─── Colour palette per domain type ──────────────────────────────────────────
export const DOMAIN_COLORS: Record<DomainNodeType, string> = {
  entity:     "#3b82f6",  // blue
  pipeline:   "#6366f1",  // indigo
  clienttype: "#10b981",  // emerald
  techfn:     "#ef4444",  // red
  critical:   "#f97316",  // orange
  leadsource: "#64748b",  // slate
  extsystem:  "#8b5cf6",  // violet
}

// ─── Edge style helpers ───────────────────────────────────────────────────────
const arrow = { type: MarkerType.ArrowClosed }

function triggerEdge(id: string, source: string, target: string, label?: string): Edge {
  return {
    id, source, target,
    label,
    type: "smoothstep",
    markerEnd: arrow,
    style: { stroke: "#6366f1", strokeWidth: 2 },
    labelStyle: { fontSize: 10, fill: "#475569" },
    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
  }
}

function blocksEdge(id: string, source: string, target: string, label = "blokkeert"): Edge {
  return {
    id, source, target,
    label,
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    style: { stroke: "#ef4444", strokeWidth: 3, strokeDasharray: "6 3" },
    labelStyle: { fontSize: 10, fill: "#ef4444", fontWeight: 700 },
    labelBgStyle: { fill: "#fff1f0", fillOpacity: 0.95 },
  }
}

function usesEdge(id: string, source: string, target: string, label?: string): Edge {
  return {
    id, source, target,
    label,
    type: "straight",
    markerEnd: arrow,
    style: { stroke: "#94a3b8", strokeWidth: 1.5, strokeDasharray: "4 3" },
    labelStyle: { fontSize: 9, fill: "#94a3b8" },
    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.8 },
  }
}

function createsEdge(id: string, source: string, target: string, label = "maakt aan"): Edge {
  return {
    id, source, target,
    label,
    type: "smoothstep",
    markerEnd: arrow,
    style: { stroke: "#10b981", strokeWidth: 2 },
    labelStyle: { fontSize: 10, fill: "#10b981" },
    labelBgStyle: { fill: "#f0fdf4", fillOpacity: 0.9 },
  }
}

function monitorsEdge(id: string, source: string, target: string, label = "monitort"): Edge {
  return {
    id, source, target,
    label,
    type: "smoothstep",
    markerEnd: arrow,
    style: { stroke: "#f97316", strokeWidth: 2, strokeDasharray: "5 3" },
    labelStyle: { fontSize: 10, fill: "#f97316" },
    labelBgStyle: { fill: "#fff7ed", fillOpacity: 0.9 },
  }
}

// ─── Nodes ────────────────────────────────────────────────────────────────────

export const DOMAIN_NODES: Node[] = [

  // ── Lead sources ──────────────────────────────────────────────────────────
  { id: "ls-website",   type: "domainNode", position: { x: 0,   y: 0 }, data: { domainType: "leadsource", label: "Website",  sub: "Leads via contactformulier" } },
  { id: "ls-facebook",  type: "domainNode", position: { x: 220, y: 0 }, data: { domainType: "leadsource", label: "Facebook", sub: "Lead Ads" } },
  { id: "ls-solvari",   type: "domainNode", position: { x: 440, y: 0 }, data: { domainType: "leadsource", label: "Solvari",  sub: "Offerte-aanvragen" } },
  { id: "ls-trustoo",   type: "domainNode", position: { x: 660, y: 0 }, data: { domainType: "leadsource", label: "Trustoo",  sub: "Reviews & leads" } },

  // ── External trigger systems ──────────────────────────────────────────────
  { id: "sys-zapier",   type: "domainNode", position: { x: 100, y: 160 }, data: { domainType: "extsystem", label: "Zapier", sub: "Lead-integraties & reminders" } },
  { id: "sys-backend",  type: "domainNode", position: { x: 420, y: 160 }, data: { domainType: "extsystem", label: "Python Backend", sub: "API-calls & property-checks" } },

  // ── Sales pipeline ────────────────────────────────────────────────────────
  { id: "pipe-sales", type: "domainNode", position: { x: 260, y: 300 },
    data: { domainType: "pipeline", label: "Sales Pipeline",
      sub: "Stages: Nieuw → Gekwalificeerd → Offerte → Gewonnen/Verloren",
      badge: "HubSpot" } },

  // ── Core entities ─────────────────────────────────────────────────────────
  { id: "ent-contact",  type: "domainNode", position: { x: 0,   y: 480 }, data: { domainType: "entity", label: "Contact",          sub: "Naam, e-mail, telefoon" } },
  { id: "ent-company",  type: "domainNode", position: { x: 230, y: 480 }, data: { domainType: "entity", label: "Company",          sub: "KvK, BTW-nummer" } },
  { id: "ent-deal-s",   type: "domainNode", position: { x: 460, y: 480 }, data: { domainType: "entity", label: "Deal (Sales)",     sub: "1 deal per contact" } },
  { id: "ent-dossier",  type: "domainNode", position: { x: 230, y: 640 }, data: { domainType: "entity", label: "Dossier",          sub: "Bundelt contact + company + deals (actieve klanten)" } },

  // ── Client type classification ────────────────────────────────────────────
  { id: "ct-sw-pakket", type: "domainNode", position: { x: -200, y: 820 },
    data: { domainType: "clienttype", label: "Softwarepakketklanten",
      sub: "Beheerd door Otto\nMollie · Exact Online · ECAT · e-Boekhouden" } },
  { id: "ct-portaal",   type: "domainNode", position: { x: 230,  y: 820 },
    data: { domainType: "clienttype", label: "Portaal / CSV-klanten",
      sub: "Regulier team\nData via CSV of klantportaal" } },
  { id: "ct-software",  type: "domainNode", position: { x: 660,  y: 820 },
    data: { domainType: "clienttype", label: "Softwareklanten",
      sub: "Eigen boekhouding (Moneybird)\nBrand: controle · BTW · Jaarrekening" } },

  // ── Software tools ────────────────────────────────────────────────────────
  { id: "sys-mollie",     type: "domainNode", position: { x: -500, y: 980 }, data: { domainType: "extsystem", label: "Mollie",         sub: "Betalingen" } },
  { id: "sys-exact",      type: "domainNode", position: { x: -310, y: 980 }, data: { domainType: "extsystem", label: "Exact Online",   sub: "Boekhoudpakket" } },
  { id: "sys-ecat",       type: "domainNode", position: { x: -120, y: 980 }, data: { domainType: "extsystem", label: "ECAT",           sub: "Boekhoudpakket" } },
  { id: "sys-eboek",      type: "domainNode", position: { x: 70,   y: 980 }, data: { domainType: "extsystem", label: "e-Boekhouden",   sub: "Boekhoudpakket" } },
  { id: "sys-moneybird",  type: "domainNode", position: { x: 660,  y: 980 }, data: { domainType: "extsystem", label: "Moneybird",      sub: "Eigen boekhouding" } },

  // ── Klantenbestand pipeline ───────────────────────────────────────────────
  { id: "pipe-kb", type: "domainNode", position: { x: 230, y: 1000 },
    data: { domainType: "pipeline", label: "Klantenbestand Pipeline",
      sub: "Maakt automatisch Product Deals aan per company",
      badge: "HubSpot" } },

  // ── Deal KB ───────────────────────────────────────────────────────────────
  { id: "ent-deal-kb", type: "domainNode", position: { x: 230, y: 1160 },
    data: { domainType: "entity", label: "Deal (Klantenbestand)", sub: "1 deal per company" } },

  // ── Bankkoppeling — CRITICAL BOTTLENECK ──────────────────────────────────
  { id: "crit-bank", type: "domainNode", position: { x: 230, y: 1320 },
    data: { domainType: "critical",
      label: "Bankkoppeling",
      sub: "⚠️ Kritiek knelpunt\nAls inactief → blokkade in gehele BTW/Jaarrekening/IB-keten" } },

  // ── BTW pipeline ──────────────────────────────────────────────────────────
  { id: "pipe-btw", type: "domainNode", position: { x: 230, y: 1500 },
    data: { domainType: "pipeline", label: "BTW Pipeline",
      sub: "Controleert Bankkoppeling → Gegevens gereed\nAutomatische e-mails bij Toegewezen / In uitvoering",
      badge: "HubSpot + Backend" } },

  // ── Jaarrekening pipeline ─────────────────────────────────────────────────
  { id: "pipe-jaar", type: "domainNode", position: { x: 230, y: 1680 },
    data: { domainType: "pipeline", label: "Jaarrekening Pipeline",
      sub: "Brugproces — auto-update als Q1–Q4 geboekt\nShift naar: Q1 t/m Q4 geboekt",
      badge: "HubSpot + Backend" } },

  // ── IB / VPB pipelines ────────────────────────────────────────────────────
  { id: "pipe-ib",  type: "domainNode", position: { x: 0,   y: 1860 },
    data: { domainType: "pipeline", label: "Inkomstenbelasting (IB)",
      sub: "Gestart na Jaarrekening → Gecontroleerd/Gefactureerd",
      badge: "HubSpot" } },
  { id: "pipe-vpb", type: "domainNode", position: { x: 480, y: 1860 },
    data: { domainType: "pipeline", label: "VPB Pipeline",
      sub: "Auto-move naar: VPB kan gemaakt worden\nPrioriteit verhoogd na Jaarrekening",
      badge: "HubSpot" } },

  // ── Technical functions ───────────────────────────────────────────────────
  { id: "fn-findstage", type: "domainNode", position: { x: 780, y: 300 },
    data: { domainType: "techfn", label: "findcorrectstage",
      sub: "Bepaalt beginstage o.b.v.\nVIG-machtiging & intensiteit" } },
  { id: "fn-routebtw",  type: "domainNode", position: { x: 780, y: 1500 },
    data: { domainType: "techfn", label: "routebtwbydealidandupdate",
      sub: "Continu monitor:\ncontroleert bankverbinding per deal" } },
  { id: "fn-pybackend", type: "domainNode", position: { x: 780, y: 1680 },
    data: { domainType: "techfn", label: "Python Backend Check",
      sub: "Controleert Geboekte kwartalen\nvalideert pipeline-shifts" } },
]

// ─── Edges ────────────────────────────────────────────────────────────────────

export const DOMAIN_EDGES: Edge[] = [

  // Lead sources → Zapier / Backend
  triggerEdge("e-ls-web-zap",   "ls-website",  "sys-zapier"),
  triggerEdge("e-ls-fb-zap",    "ls-facebook", "sys-zapier"),
  triggerEdge("e-ls-sol-zap",   "ls-solvari",  "sys-zapier"),
  triggerEdge("e-ls-tru-back",  "ls-trustoo",  "sys-backend"),

  // Zapier / Backend → Sales Pipeline
  triggerEdge("e-zap-sales",    "sys-zapier",   "pipe-sales", "triggert"),
  triggerEdge("e-back-sales",   "sys-backend",  "pipe-sales", "triggert"),

  // Sales Pipeline → Core entities
  createsEdge("e-sales-contact", "pipe-sales", "ent-contact", "maakt aan"),
  createsEdge("e-sales-company", "pipe-sales", "ent-company", "maakt aan"),
  createsEdge("e-sales-deal",    "pipe-sales", "ent-deal-s",  "maakt aan"),

  // Entities → Dossier
  triggerEdge("e-contact-dos",  "ent-contact",  "ent-dossier", "onderdeel van"),
  triggerEdge("e-company-dos",  "ent-company",  "ent-dossier", "onderdeel van"),
  triggerEdge("e-dealsale-dos", "ent-deal-s",   "ent-dossier", "onderdeel van"),

  // Dossier → Client types
  triggerEdge("e-dos-ct-swpak", "ent-dossier", "ct-sw-pakket", "Software/Portaal/CSV"),
  triggerEdge("e-dos-ct-port",  "ent-dossier", "ct-portaal",   "Software/Portaal/CSV"),
  triggerEdge("e-dos-ct-sw",    "ent-dossier", "ct-software",  "Software/Portaal/CSV"),

  // Softwarepakketklanten → software tools
  usesEdge("e-swpak-mollie",  "ct-sw-pakket", "sys-mollie"),
  usesEdge("e-swpak-exact",   "ct-sw-pakket", "sys-exact"),
  usesEdge("e-swpak-ecat",    "ct-sw-pakket", "sys-ecat"),
  usesEdge("e-swpak-eboek",   "ct-sw-pakket", "sys-eboek"),

  // Softwareklanten → Moneybird
  usesEdge("e-sw-money", "ct-software", "sys-moneybird"),

  // Dossier → Klantenbestand Pipeline
  triggerEdge("e-dos-kb", "ent-dossier", "pipe-kb", "actieve klant"),

  // KB Pipeline → Deal KB
  createsEdge("e-kb-dealkb", "pipe-kb", "ent-deal-kb", "maakt aan"),

  // Deal KB → Bankkoppeling (check)
  triggerEdge("e-dealkb-bank", "ent-deal-kb", "crit-bank", "controleert"),

  // CRITICAL PATH: Bankkoppeling → BTW → Jaarrekening → IB/VPB
  blocksEdge("e-bank-btw",   "crit-bank",  "pipe-btw",  "activeert / blokkeert"),
  blocksEdge("e-btw-jaar",   "pipe-btw",   "pipe-jaar", "triggert na voltooiing"),
  blocksEdge("e-jaar-ib",    "pipe-jaar",  "pipe-ib",   "triggert"),
  blocksEdge("e-jaar-vpb",   "pipe-jaar",  "pipe-vpb",  "triggert + verhoog prioriteit"),

  // Technical functions
  usesEdge("e-fn-find-sales", "fn-findstage",  "pipe-sales",  "bepaalt beginstage"),
  usesEdge("e-fn-find-kb",    "fn-findstage",  "pipe-kb",     "bepaalt beginstage"),
  monitorsEdge("e-fn-route-btw",  "fn-routebtw",   "pipe-btw",    "monitort per deal"),
  monitorsEdge("e-fn-route-bank", "fn-routebtw",   "crit-bank",   "controleert"),
  monitorsEdge("e-fn-py-jaar",    "fn-pybackend",  "pipe-jaar",   "valideert kwartalen"),
]

// ─── Critical path IDs (for highlighting) ────────────────────────────────────
export const CRITICAL_PATH_NODES = new Set([
  "crit-bank", "pipe-btw", "pipe-jaar", "pipe-ib", "pipe-vpb",
])

export const CRITICAL_PATH_EDGES = new Set([
  "e-bank-btw", "e-btw-jaar", "e-jaar-ib", "e-jaar-vpb",
])
