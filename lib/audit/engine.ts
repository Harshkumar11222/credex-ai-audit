import { AuditInput, AuditResult } from "@/types/audit";

export function runAudit(input: AuditInput): AuditResult {
  let totalMonthlySavings = 0;

  const recommendations = input.tools.map((tool) => {
    let recommendedSpend = tool.monthlySpend;
    let recommendedPlan = tool.plan;
    let reason = "Current plan looks optimal.";

    if (tool.seats <= 2 && tool.plan === "team") {
      recommendedPlan = "pro";
      recommendedSpend = tool.monthlySpend * 0.5;
      reason = "Small teams usually do not need team plans.";
    }

    const savings = tool.monthlySpend - recommendedSpend;
    totalMonthlySavings += savings;

    return {
      tool: tool.tool,
      currentSpend: tool.monthlySpend,
      recommendedPlan,
      recommendedSpend,
      savings,
      reason,
    };
  });

  return {
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    recommendations,
  };
}