"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { runAudit } from "@/lib/audit/engine";

export default function AuditForm() {
  const [teamSize, setTeamSize] = useState(1);
  const [monthlySpend, setMonthlySpend] = useState(20);
  const [result, setResult] = useState<any>(null);

  const handleAudit = () => {
    const auditResult = runAudit({
      teamSize,
      useCase: "coding",
      tools: [
        {
          tool: "chatgpt",
          plan: "team",
          monthlySpend,
          seats: teamSize,
        },
      ],
    });

    setResult(auditResult);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Input
        type="number"
        placeholder="Team Size"
        value={teamSize}
        onChange={(e) => setTeamSize(Number(e.target.value))}
      />

      <Input
        type="number"
        placeholder="Monthly Spend"
        value={monthlySpend}
        onChange={(e) => setMonthlySpend(Number(e.target.value))}
      />

      <Button onClick={handleAudit} className="w-full">
        Run Audit
      </Button>

      {result && (
        <div className="bg-zinc-900 p-6 rounded-xl text-white">
          <h2 className="text-2xl font-bold mb-4">Audit Result</h2>
          <p>Monthly Savings: ${result.totalMonthlySavings}</p>
          <p>Annual Savings: ${result.totalAnnualSavings}</p>
        </div>
      )}
    </div>
  );
}