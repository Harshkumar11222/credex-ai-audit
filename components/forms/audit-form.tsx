"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState("coding");

  const [chatgptSpend, setChatgptSpend] = useState(20);
  const [claudeSpend, setClaudeSpend] = useState(20);
  const [cursorSpend, setCursorSpend] = useState(20);

  const [chatgptPlan, setChatgptPlan] = useState("team");
  const [claudePlan, setClaudePlan] = useState("team");
  const [cursorPlan, setCursorPlan] = useState("business");

  const [result, setResult] = useState<any>(null);
  const [summary, setSummary] = useState("");

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

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
        {
          tool: "claude",
          plan: claudePlan,
          monthlySpend: claudeSpend,
          seats: teamSize,
        },
        {
          tool: "cursor",
          plan: cursorPlan,
          monthlySpend: cursorSpend,
          seats: teamSize,
        },
      ],
    });

    setResult(auditResult);
    setSummary(
      "Your AI stack has optimization opportunities that could reduce operating costs."
    );
  };

  const saveLead = async () => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        company_name: company,
        role,
        team_size: teamSize,
        total_savings: result.totalMonthlySavings,
        audit_data: {
          result,
          summary,
        },
      }),
    });

    const data = await res.json();

    if (res.ok && data.id) {
      router.push(`/report/${data.id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 w-full">
      <h1 className="text-4xl font-bold text-center">AI Spend Audit</h1>

      <Input
        type="number"
        placeholder="Team Size"
        value={teamSize}
        onChange={(e) => setTeamSize(Number(e.target.value))}
      />

      <Select onValueChange={setUseCase}>
        <SelectTrigger>
          <SelectValue placeholder="Use Case" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="coding">Coding</SelectItem>
          <SelectItem value="writing">Writing</SelectItem>
          <SelectItem value="research">Research</SelectItem>
          <SelectItem value="data">Data</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="ChatGPT Spend"
        value={chatgptSpend}
        onChange={(e) => setChatgptSpend(Number(e.target.value))}
      />

      <Input
        type="number"
        placeholder="Claude Spend"
        value={claudeSpend}
        onChange={(e) => setClaudeSpend(Number(e.target.value))}
      />

      <Input
        type="number"
        placeholder="Cursor Spend"
        value={cursorSpend}
        onChange={(e) => setCursorSpend(Number(e.target.value))}
      />

      <Button onClick={handleAudit} className="w-full">
        Run Full Audit
      </Button>

      {result && (
        <div className="bg-zinc-900 p-6 rounded-xl text-white space-y-4">
          <h2 className="text-2xl font-bold">Audit Result</h2>

          <p>Monthly Savings: ${result.totalMonthlySavings}</p>
          <p>Annual Savings: ${result.totalAnnualSavings}</p>

          <div className="bg-zinc-800 p-4 rounded">
            <p>{summary}</p>
          </div>

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <Input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Button className="w-full" onClick={saveLead}>
            Save & Generate Report
          </Button>
        </div>
      )}
    </div>
  );
}