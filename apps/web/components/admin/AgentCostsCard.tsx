import Card from "../Card";
import SectionTitle from "../SectionTitle";

export default function AgentCostsCard({ costs }: { costs: Record<string, { totalCost: number; totalTokens: number; count: number }> }) {
  const entries = Object.entries(costs || {});
  return (
    <Card>
      <SectionTitle title="Agent Cost Summary" subtitle="Estimated cost and token usage by agent/model combination." />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-300">
              <th className="px-3 py-2">Agent / Model</th>
              <th className="px-3 py-2">Runs</th>
              <th className="px-3 py-2">Total Tokens</th>
              <th className="px-3 py-2">Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key} className="border-b border-slate-800">
                <td className="px-3 py-2">{key}</td>
                <td className="px-3 py-2">{value.count}</td>
                <td className="px-3 py-2">{value.totalTokens}</td>
                <td className="px-3 py-2">${value.totalCost.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
