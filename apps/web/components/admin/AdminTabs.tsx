"use client";

type TabKey = "runs" | "users" | "prompts" | "jobs" | "analytics" | "costs";

export default function AdminTabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  const tabs: TabKey[] = ["runs", "users", "prompts", "jobs", "analytics", "costs"];
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button key={tab} onClick={() => onChange(tab)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            active === tab ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}>
          {tab}
        </button>
      ))}
    </div>
  );
}
