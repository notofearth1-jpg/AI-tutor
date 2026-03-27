"use client";

import { useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import { apiFetch } from "../lib/api";
import { setSession } from "../lib/storage";
import { useRouter } from "next/navigation";
import { unwrapApiResponse } from "../lib/unwrap";

export default function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setLoading(true);
    setMessage("");
    try {
      const resultRaw = await apiFetch<any>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form)
      });
      const result = unwrapApiResponse<{ id: string; email: string; role: string; accessToken: string }>(resultRaw);
      setSession({ userId: result.id, role: result.role, accessToken: result.accessToken });
      setMessage(`Account created for ${result.email}`);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <SectionTitle title="Create Account" subtitle="Create a student account to start your personalized AI learning journey." />
      <div className="grid gap-4">
        <input className="rounded-lg p-3" placeholder="Email" value={form.email}
          onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
        <input className="rounded-lg p-3" placeholder="Password" type="password" value={form.password}
          onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} />
        <select className="rounded-lg p-3" value={form.role}
          onChange={(e) => setForm((v) => ({ ...v, role: e.target.value }))}>
          <option value="student">student</option>
          <option value="admin">admin</option>
          <option value="content_manager">content_manager</option>
          <option value="ai_ops">ai_ops</option>
        </select>
        <button onClick={submit} disabled={loading}
          className="rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50">
          {loading ? "Creating..." : "Sign Up"}
        </button>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </Card>
  );
}
