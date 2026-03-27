"use client";

import { useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import { apiFetch } from "../lib/api";

type Props = { userId: string; onCreated: () => void };

export default function ProfileForm({ userId, onCreated }: Props) {
  const [form, setForm] = useState({
    userId,
    fullName: "",
    ageRange: "",
    educationBackground: "",
    goals: "",
    selfReportedLevel: "beginner",
    preferredLanguage: "en",
    preferredLearningStyle: "mixed",
    knownTopics: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setLoading(true);
    setMessage("");
    try {
      await apiFetch("/students/profile", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          knownTopics: form.knownTopics.split(",").map((x) => x.trim()).filter(Boolean)
        })
      });
      setMessage("Profile created successfully.");
      onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <SectionTitle title="Student Profile" subtitle="Tell the tutor about your background, goals, and current skill level." />
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg p-3" placeholder="Full name" value={form.fullName}
          onChange={(e) => setForm((v) => ({ ...v, fullName: e.target.value }))} />
        <input className="rounded-lg p-3" placeholder="Age range" value={form.ageRange}
          onChange={(e) => setForm((v) => ({ ...v, ageRange: e.target.value }))} />
        <textarea className="rounded-lg p-3 md:col-span-2" placeholder="Education background" value={form.educationBackground}
          onChange={(e) => setForm((v) => ({ ...v, educationBackground: e.target.value }))} />
        <textarea className="rounded-lg p-3 md:col-span-2" placeholder="Goals" value={form.goals}
          onChange={(e) => setForm((v) => ({ ...v, goals: e.target.value }))} />
        <select className="rounded-lg p-3" value={form.selfReportedLevel}
          onChange={(e) => setForm((v) => ({ ...v, selfReportedLevel: e.target.value }))}>
          <option value="beginner">beginner</option>
          <option value="intermediate">intermediate</option>
          <option value="advanced">advanced</option>
        </select>
        <input className="rounded-lg p-3" placeholder="Preferred language" value={form.preferredLanguage}
          onChange={(e) => setForm((v) => ({ ...v, preferredLanguage: e.target.value }))} />
        <input className="rounded-lg p-3" placeholder="Preferred learning style" value={form.preferredLearningStyle}
          onChange={(e) => setForm((v) => ({ ...v, preferredLearningStyle: e.target.value }))} />
        <input className="rounded-lg p-3" placeholder="Known topics (comma separated slugs)" value={form.knownTopics}
          onChange={(e) => setForm((v) => ({ ...v, knownTopics: e.target.value }))} />
      </div>
      <button onClick={submit} disabled={loading}
        className="mt-4 rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50">
        {loading ? "Saving..." : "Save Profile"}
      </button>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </Card>
  );
}
