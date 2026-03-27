"use client";

import Header from "../components/Header";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

export default function HomePage() {
  useEffect(() => { trackEvent("homepage_viewed"); }, []);

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Personalized AI Learning with Multi-Agent Tutoring
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Learn AI fundamentals, prompting, LLMs, SLMs, AI agents, workflows, RAG,
            integration, automation, machine learning, and more based on your current
            skill level and performance.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <SignUpForm />
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
