import { supabase } from "@/services/db/supabase";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Report not found
      </main>
    );
  }

  const audit = data.audit_data?.result;
  const summary = data.audit_data?.summary;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 rounded-2xl p-8 space-y-6">
        <h1 className="text-4xl font-bold">AI Spend Audit Report</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800 p-4 rounded-xl">
            <p className="text-sm text-zinc-400">Monthly Savings</p>
            <p className="text-3xl font-bold">${data.total_savings}</p>
          </div>

          <div className="bg-zinc-800 p-4 rounded-xl">
            <p className="text-sm text-zinc-400">Annual Savings</p>
            <p className="text-3xl font-bold">${data.total_savings * 12}</p>
          </div>
        </div>

        {summary && (
          <div className="bg-zinc-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">AI Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Recommendations</h2>

          {audit?.recommendations?.map((rec: any, index: number) => (
            <div
              key={index}
              className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
            >
              <p className="font-bold capitalize">{rec.tool}</p>
              <p>Current Spend: ${rec.currentSpend}</p>
              <p>Recommended Plan: {rec.recommendedPlan}</p>
              <p>Savings: ${rec.savings}</p>
              <p className="text-zinc-400">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}