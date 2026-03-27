"use client";

import { useState } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import { getJobStatus } from "../../lib/jobs";

export default function JobsMonitor() {
  const [jobType, setJobType] = useState("lesson");
  const [jobId, setJobId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function checkJob() {
    setLoading(true);
    try { setResult(await getJobStatus(jobType as any, jobId)); }
    finally { setLoading(false); }
  }

  return (
    <Card>
      <SectionTitle title="Job Monitor" subtitle="Inspect lesson, assignment, or grading queue jobs." />
      <div className="grid gap-4 md:grid-cols-[200px_1fr_auto]">
        <select className="rounded-lg p-3 text-black" value={jobType}
          onChange={(e) => setJobType(e.target.value)}>
          <option value="lesson">lesson</option>
          <option value="assignment">assignment</option>
          <option value="grading">grading</option>
        </select>
        <input className="rounded-lg p-3" placeholder="Job ID" value={jobId}
          onChange={(e) => setJobId(e.target.value)} />
        <button onClick={checkJob} disabled={loading || !jobId}
          className="rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black disabled:opacity-50">
          {loading ? "Checking..." : "Check"}
        </button>
      </div>
      {result ? (
        <pre className="mt-6 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </Card>
  );
}
