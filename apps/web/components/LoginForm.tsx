"use client";

import { useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import { apiFetch } from "../lib/api";
import { setSession } from "../lib/storage";
import { useRouter } from "next/navigation";
import { unwrapApiResponse } from "../lib/unwrap";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setLoading(true);
    setMessage("");
    try {
      const resultRaw = await apiFetch<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      const result = unwrapApiResponse<{ id: string; email: string; role: string; accessToken: string }>(resultRaw);
      setSession({ userId: result.id, role: result.role, accessToken: result.accessToken });
      router.push(result.role === "student" ? "/dashboard" : "/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <SectionTitle title="Login" subtitle="Use your account to access the student or admin workspace." />
      <div className="grid gap-4">
        <input className="rounded-lg p-3" placeholder="Email" value={form.email}
          onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
        <input className="rounded-lg p-3" placeholder="Password" type="password" value={form.password}
          onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} />
        <button onClick={submit} disabled={loading}
          className="rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </Card>
  );
}
