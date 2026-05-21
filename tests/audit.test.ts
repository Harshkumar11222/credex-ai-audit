import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/audit/engine";

describe("Audit Engine", () => {
  it("calculates ChatGPT savings", () => {
    const result = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [
        {
          tool: "chatgpt",
          plan: "team",
          monthlySpend: 100,
          seats: 2,
        },
      ],
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });
});