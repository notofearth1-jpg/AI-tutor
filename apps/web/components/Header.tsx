"use client";

import Link from "next/link";
import { clearSession, getRole } from "../lib/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Header() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => { setRole(getRole()); }, []);

  async function logout() {
    try { await apiFetch("/auth/logout", { method: "POST" }); } catch { }
    clearSession();
    router.push("/");
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">AI Tutor Platform</h1>
          <p className="text-sm text-slate-300">
            Learn AI, LLMs, SLMs, Prompting, RAG, Agents, Workflows, and AI Automation
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
          <Link href="/admin" className="hover:text-cyan-400">Admin</Link>
          {role ? (
            <button
              onClick={logout}
              className="rounded-lg border border-slate-700 px-3 py-2 hover:border-cyan-400 hover:text-cyan-400"
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
