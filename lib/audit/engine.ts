import { AuditInput, AuditResult } from "@/types/audit";
import { PRICING } from "@/lib/constants/pricing";

export function runAudit(input: AuditInput): AuditResult {
  let totalMonthlySavings = 0;

  const recommendations = input.tools.map((tool) => {
    let recommendedPlan = tool.plan;
    let recommendedSpend = tool.monthlySpend;
    let reason = "Current plan looks optimal.";

    if (tool.tool === "chatgpt") {
      if (tool.seats <= 2 && tool.plan === "team") {
        recommendedPlan = "plus";
        recommendedSpend = PRICING.chatgpt.plus * tool.seats;
        reason = "Small teams can use ChatGPT Plus instead of Team.";
      }
    }

    if (tool.tool === "claude") {
      if (tool.seats <= 2 && tool.plan === "team") {
        recommendedPlan = "pro";
        recommendedSpend = PRICING.claude.pro * tool.seats;
        reason = "Claude Team is costly for small teams.";
      }
    }

    if (tool.tool === "cursor") {
      if (tool.seats <= 3 && tool.plan === "business") {
        recommendedPlan = "pro";
        recommendedSpend = PRICING.cursor.pro * tool.seats;
        reason = "Cursor Business is unnecessary for small teams.";
      }
    }

    const savings = Math.max(0, tool.monthlySpend - recommendedSpend);
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