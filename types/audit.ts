export type ToolName =
  | "chatgpt"
  | "claude"
  | "cursor"
  | "copilot"
  | "gemini"
  | "openai_api"
  | "anthropic_api"
  | "windsurf";

export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "data"
  | "mixed";

export interface ToolInput {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

export interface AuditRecommendation {
  tool: ToolName;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSpend: number;
  savings: number;
  reason: string;
}

export interface AuditResult {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: AuditRecommendation[];
}