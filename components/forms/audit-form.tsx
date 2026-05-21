"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runAudit } from "@/lib/audit/engine";

export default function AuditForm() {
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState("coding");
  const [chatgptSpend, setChatgptSpend] = useState(20);
  const [chatgptPlan, setChatgptPlan] = useState("team");
  const [result, setResult] = useState<any>(null);

  const handleAudit = () => {
    const auditResult = runAudit({
      teamSize,
      useCase: useCase as any,
      tools: [
        {
          tool: "chatgpt",
          plan: chatgptPlan,
          monthlySpend: chatgptSpend,
          seats: teamSize,
        },
      ],
    });

    setResult(auditResult);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 w-full">
      <h1 className="text-4xl font-bold text-center">AI Spend Audit</h1>

      <Input
        type="number"
        placeholder="Team Size"
        value={teamSize}
        onChange={(e) => setTeamSize(Number(e.target.value))}
      />

      <Select onValueChange={setUseCase}>
        <SelectTrigger>
          <SelectValue placeholder="Select Use Case" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="coding">Coding</SelectItem>
          <SelectItem value="writing">Writing</SelectItem>
          <SelectItem value="research">Research</SelectItem>
          <SelectItem value="data">Data</SelectItem>
          <SelectItem value="mixed">Mixed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setChatgptPlan}>
        <SelectTrigger>
          <SelectValue placeholder="ChatGPT Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="plus">Plus</SelectItem>
          <SelectItem value="team">Team</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="ChatGPT Monthly Spend"
        value={chatgptSpend}
        onChange={(e) => setChatgptSpend(Number(e.target.value))}
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