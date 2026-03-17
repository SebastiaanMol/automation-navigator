export type Categorie = 
  | "HubSpot Workflow"
  | "Zapier Zap"
  | "Backend Script"
  | "HubSpot + Zapier"
  | "Anders";

export type Systeem = "HubSpot" | "Zapier" | "Backend" | "E-mail" | "API";

export type Status = "Actief" | "Verouderd" | "In review" | "Uitgeschakeld";

export interface Automatisering {
  id: string;
  naam: string;
  categorie: Categorie;
  doel: string;
  trigger: string;
  systemen: Systeem[];
  stappen: string[];
  afhankelijkheden: string;
  owner: string;
  status: Status;
  verbeterideeën: string;
  mermaidDiagram: string;
  createdAt: string;
}

export const CATEGORIEEN: Categorie[] = [
  "HubSpot Workflow",
  "Zapier Zap",
  "Backend Script",
  "HubSpot + Zapier",
  "Anders",
];

export const SYSTEMEN: Systeem[] = ["HubSpot", "Zapier", "Backend", "E-mail", "API"];

export const STATUSSEN: Status[] = ["Actief", "Verouderd", "In review", "Uitgeschakeld"];
