"use client";

import { useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import { apiFetch } from "../lib/api";
import { unwrapApiResponse } from "../lib/unwrap";

type Assignment = { id: string; title: string; instructions: string; questions: { type: string; question: string }[] };
type Grade = { id: string; score: number; maxScore: number; feedback: string; strengths: string[]; improvements: string[]; nextRecommendedTopic: string };

export default function AssignmentCard({ userId, assignment }: { userId: string; assignment: Assignment | null }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);

  async function submitAssignment() {
    if (!assignment) return;
    setLoading(true);
    try {
      const result = await apiFetch<any>("/assignments/submit", {
        method: "POST",
        body: JSON.stringify({ userId, assignmentId: assignment.id, answers })
      });
      const data = unwrapApiResponse<{ submission: any; grade: Grade }>(result);
      setGrade(data.grade);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <SectionTitle title="Assignment" subtitle="Created and graded by the Invigilator Agent." />
      {!assignment ? (
        <p className="text-slate-300">No assignment generated yet.</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-cyan-400">{assignment.title}</h3>
            <p className="mt-1 text-slate-300">{assignment.instructions}</p>
          </div>
          <div className="space-y-4">
            {assignment.questions?.map((question, index) => (
              <div key={index} className="rounded-xl border border-slate-700 p-4">
                <p className="font-medium">{index + 1}. {question.question}</p>
                <p className="mt-1 text-xs uppercase text-slate-400">{question.type}</p>
                <textarea
                  rows={4}
                  className="mt-3 w-full rounded-lg p-3"
                  value={answers[index] || ""}
                  onChange={(e) => {
                    const next = [...answers];
                    next[index] = e.target.value;
                    setAnswers(next);
                  }}
                />
              </div>
            ))}
          </div>
          <button onClick={submitAssignment} disabled={loading}
            className="rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
          {grade ? (
            <div className="rounded-xl border border-cyan-700 bg-slate-800 p-4">
              <h4 className="text-lg font-semibold text-cyan-400">Score: {grade.score}/{grade.maxScore}</h4>
              <p className="mt-2 text-slate-300">{grade.feedback}</p>
              <div className="mt-4">
                <h5 className="font-semibold">Strengths</h5>
                <ul className="mt-2 list-disc pl-5 text-slate-300">
                  {grade.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <h5 className="font-semibold">Improvements</h5>
                <ul className="mt-2 list-disc pl-5 text-slate-300">
                  {grade.improvements?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <h5 className="font-semibold">Next Recommended Topic</h5>
                <p className="text-cyan-400">{grade.nextRecommendedTopic}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
