"use client";

import { useState } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import { activatePrompt, createPrompt } from "../../lib/admin";

export default function PromptManager({ prompts, onRefresh }: { prompts: any[]; onRefresh: () => void }) {
  const [form, setForm] = useState({
    agentType: "teacher", version: "", promptText: "",
    responseSchema: '{ "type": "object" }', active: false
  });
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      await createPrompt({
        agentType: form.agentType, version: form.version, promptText: form.promptText,
        responseSchema: JSON.parse(form.responseSchema), active: form.active
      });
      onRefresh();
      setForm({ agentType: "teacher", version: "", promptText: "", responseSchema: '{ "type": "object" }', active: false });
    } finally { setLoading(false); }
  }

  async function handleActivate(promptId: string) {
    setLoading(true);
    try { await activatePrompt(promptId); onRefresh(); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle title="Create Prompt Template" subtitle="Manage prompt versions and activate them without redeploying." />
        <div className="grid gap-4">
          <select className="rounded-lg p-3 text-black" value={form.agentType}
            onChange={(e) => setForm((v) => ({ ...v, agentType: e.target.value }))}>
            <option value="course_creator">course_creator</option>
            <option value="teacher">teacher</option>
            <option value="invigilator">invigilator</option>
            <option value="supervisor">supervisor</option>
            <option value="progress_coach">progress_coach</option>
          </select>
          <input className="rounded-lg p-3" placeholder="Version (e.g. v2)" value={form.version}
            onChange={(e) => setForm((v) => ({ ...v, version: e.target.value }))} />
          <textarea rows={8} className="rounded-lg p-3" placeholder="Prompt template text with variables like {{studentProfile}}"
            value={form.promptText} onChange={(e) => setForm((v) => ({ ...v, promptText: e.target.value }))} />
          <textarea rows={4} className="rounded-lg p-3" placeholder="JSON response schema"
            value={form.responseSchema} onChange={(e) => setForm((v) => ({ ...v, responseSchema: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.active}
              onChange={(e) => setForm((v) => ({ ...v, active: e.target.checked }))} />
            Activate immediately
          </label>
          <button onClick={handleCreate} disabled={loading}
            className="rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black disabled:opacity-50">
            {loading ? "Saving..." : "Create Prompt"}
          </button>
        </div>
      </Card>
      <Card>
        <SectionTitle title="Prompt Templates" subtitle="Activate a prompt version per agent." />
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="rounded-xl border border-slate-700 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-cyan-400">{prompt.agentType} — {prompt.version}</p>
                  <p className="mt-1 text-sm text-slate-300">Active: {prompt.active ? "Yes" : "No"}</p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
                    {prompt.promptText.substring(0, 200)}{prompt.promptText.length > 200 ? "..." : ""}
                  </pre>
                </div>
                <button onClick={() => handleActivate(prompt.id)} disabled={loading || prompt.active}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white hover:bg-cyan-500 hover:text-black disabled:opacity-50">
                  {prompt.active ? "Active" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
