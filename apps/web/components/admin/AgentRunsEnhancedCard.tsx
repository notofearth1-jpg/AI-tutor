import Card from "../Card";
import SectionTitle from "../SectionTitle";

export default function AgentRunsEnhancedCard({ runs }: { runs: any[] }) {
  return (
    <Card>
      <SectionTitle title="Agent Runs" subtitle="Operational view of model runs, latency, prompt version, and estimated cost." />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-300">
              <th className="px-3 py-2">Agent</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Latency</th>
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2">Prompt Version</th>
              <th className="px-3 py-2">Tokens</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-b border-slate-800">
                <td className="px-3 py-2">{run.agentType}</td>
                <td className="px-3 py-2">{run.status}</td>
                <td className="px-3 py-2">{run.latencyMs ?? "-"}</td>
                <td className="px-3 py-2">{run.modelUsed ?? "-"}</td>
                <td className="px-3 py-2">{run.promptVersion ?? "-"}</td>
                <td className="px-3 py-2">{run.tokenUsage ?? 0}</td>
                <td className="px-3 py-2">${(run.costEstimate ?? 0).toFixed(6)}</td>
                <td className="px-3 py-2">{new Date(run.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
