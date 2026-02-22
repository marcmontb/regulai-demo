export type Locale = "en" | "es";

export interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  status: "approved" | "pending" | "under_review" | "rejected";
  lastAudit: string;
}

export interface Material {
  id: string;
  name: string;
  cas: string;
  category: string;
  supplierId: string;
  supplierName: string;
  status: "active" | "pending" | "under_review";
}

export interface HomologationComparison {
  field: string;
  category: string;
  previousValue: string;
  currentValue: string;
  status: "unchanged" | "changed" | "out_of_spec" | "missing";
  expectedRange?: string;
  riskLevel?: "low" | "medium" | "high";
}

export interface QuestionnaireField {
  id: string;
  question: string;
  aiAnswer: string;
  confidence: number;
  source: string;
  editable: boolean;
}

export interface FlowchartNode {
  id: string;
  type: "process" | "decision" | "input" | "output";
  label: string;
  processType?: string;
  conditions?: { key: string; value: string }[];
  position: { x: number; y: number };
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ReachSubstance {
  id: string;
  name: string;
  cas: string;
  annualQuota: number;
  consumed: number;
  unit: string;
  monthlyData: { month: string; current: number; previous: number }[];
  alertLevel: "normal" | "warning" | "critical";
}

export interface ChangeRecord {
  id: string;
  type: "regulatory" | "specification" | "supplier" | "formulation";
  title: string;
  description: string;
  date: string;
  status: "detected" | "under_review" | "notified" | "completed";
  affectedClients: { name: string; products: string[]; notified: boolean }[];
  aiDraftEmail?: string;
}

export interface KPIData {
  pendingHomologations: number;
  openQuestionnaires: number;
  reachAlerts: number;
  pendingChanges: number;
}

export interface ActivityItem {
  id: string;
  type: "homologation" | "questionnaire" | "flowchart" | "reach" | "change";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "in_progress" | "alert";
}
