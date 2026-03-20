/**
 * Structured Report Types for AI Accountant V2
 *
 * Two main sections:
 * 1. Dashboard: numeric metrics for charts and data visualization
 * 2. CoachFlow: coaching narrative in fixed order with interactive sections
 */

// ── Severity & Trend ────────────────────────────────────────────────────────

export type Severity = "critical" | "warning" | "healthy" | "info";

export type TrendDirection = "up" | "down" | "flat";

export interface TrendDelta {
  direction: TrendDirection;
  amount: number;
  pctChange: number;
  label: string;
}

// ── Dashboard (for charts + summary cards) ──────────────────────────────────

export type ProfitFirstStage = "Survival" | "Stability" | "Growth" | "Scale";
export type Force4Status = "excellent" | "good" | "developing" | "needs_attention";

export interface DashboardData {
  force4Score: number;
  force4Status: Force4Status;
  stage: ProfitFirstStage;
  stageProgress: number;
  nextStageThreshold: number;
  totalRevenue: number;
  realRevenue: number;
  realRevenuePct: number;
  allocations: {
    cpb: number;
    profit: number;
    ownerPay: number;
    tax: number;
    opex: number;
  };
  trendArrows?: {
    realRevenue?: TrendDelta;
    force4?: TrendDelta;
    totalRevenue?: TrendDelta;
  };
}

// ── Allocation Bucket ───────────────────────────────────────────────────────

export interface AllocationBucket {
  name: string;
  description: string;
  currentPct: number;
  targetPct: number;
  currentDollar: number;
  targetDollar: number;
  benchmarkRange: string;
  severity: Severity;
}

// ── Expense Item ────────────────────────────────────────────────────────────

export interface ExpenseItem {
  vendor: string;
  category: string;
  monthlyAmount: number;
  annualEstimate: number;
  severity: Severity;
  flag?: string;
}

// ── Report Section (for detailed financial data panels) ─────────────────────

export interface ReportSection {
  title: string;
  severity: Severity;
  summary: string;
  metrics?: Array<{
    label: string;
    value: string;
    note?: string;
    severity?: Severity;
  }>;
}

// ── CoachFlow Types (coaching narrative) ─────────────────────────────────────

export type WinsMode = "improvement" | "baseline";

export interface WinTile {
  title: string;
  summary: string;
  details: string;
  nextMonthPrompt: string;
}

export interface Bottleneck {
  title: string;
  severity: Severity;
  whatItIs: string;
  whyItMatters: string;
  whatToDoNext: string;
}

export interface ActionItem {
  step: string;
  when: string;
  howMeasured: string;
}

export interface CoachFlow {
  coachOpener: { text: string };

  winsSection: {
    winsMode: WinsMode;
    bannerText: string;
    winsTiles: WinTile[];
    coachPrompt: string;
  };

  stageMeaning: { bullets: [string, string, string] };

  bottlenecks: {
    items: [Bottleneck, Bottleneck, Bottleneck];
  };

  actionPlan: {
    items: [ActionItem, ActionItem, ActionItem];
    closeNudge: string;
  };

  coachClose: { text: string };

  progressDisclosure: {
    hasPreviousMonth: boolean;
    comparisonSummary: string;
  };
}

// ── Sections (detailed financial data) ──────────────────────────────────────

export interface ReportSections {
  foundation: ReportSection;
  financialDashboard: ReportSection;
  profitFirstStage: ReportSection;
  moneyBuckets: {
    section: ReportSection;
    buckets: AllocationBucket[];
  };
  expenseBreakdown?: {
    section: ReportSection;
    expenses: ExpenseItem[];
    totalOpexPct: number;
  };
}

// ── Full Structured Report ──────────────────────────────────────────────────

export interface StructuredReport {
  dashboard: DashboardData;
  coachFlow: CoachFlow;
  sections: ReportSections;
  meta: {
    salonName: string;
    businessModel: string;
    analysisDate: string;
    ownerFirstName?: string;
  };
}
