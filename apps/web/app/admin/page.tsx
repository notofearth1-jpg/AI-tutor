"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Card from "../../components/Card";
import SectionTitle from "../../components/SectionTitle";
import { getRole } from "../../lib/storage";
import AdminTabs from "../../components/admin/AdminTabs";
import UsersTable from "../../components/admin/UsersTable";
import PromptManager from "../../components/admin/PromptManager";
import JobsMonitor from "../../components/admin/JobsMonitor";
import AnalyticsEventsCard from "../../components/admin/AnalyticsEventsCard";
import AgentCostsCard from "../../components/admin/AgentCostsCard";
import AgentRunsEnhancedCard from "../../components/admin/AgentRunsEnhancedCard";
import {
  fetchAdminAgentCosts, fetchAdminAgentRuns, fetchAdminAnalytics,
  fetchAdminPrompts, fetchAdminUsers
} from "../../lib/admin";

type TabKey = "runs" | "users" | "prompts" | "jobs" | "analytics" | "costs";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("runs");
  const [runs, setRuns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [costs, setCosts] = useState<Record<string, any>>({});

  useEffect(() => {
    const role = getRole();
    if (role === "admin" || role === "ai_ops") {
      setAuthorized(true);
      loadAll();
    }
  }, []);

  async function loadAll() {
    try {
      const [r, u, p, a, c] = await Promise.all([
        fetchAdminAgentRuns().catch(() => []),
        fetchAdminUsers().catch(() => []),
        fetchAdminPrompts().catch(() => []),
        fetchAdminAnalytics().catch(() => []),
        fetchAdminAgentCosts().catch(() => ({}))
      ]);
      setRuns(r);
      setUsers(u);
      setPrompts(p);
      setAnalytics(a);
      setCosts(c);
    } catch { }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-8">
        {!authorized ? (
          <Card>
            <SectionTitle title="Unauthorized" subtitle="You must be an admin or ai_ops role to access this page." />
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <SectionTitle title="Admin Dashboard" subtitle="Manage agents, prompts, users, jobs, analytics, and costs." />
              <AdminTabs active={activeTab} onChange={setActiveTab} />
            </Card>
            {activeTab === "runs" && <AgentRunsEnhancedCard runs={runs} />}
            {activeTab === "users" && <UsersTable users={users} />}
            {activeTab === "prompts" && <PromptManager prompts={prompts} onRefresh={loadAll} />}
            {activeTab === "jobs" && <JobsMonitor />}
            {activeTab === "analytics" && <AnalyticsEventsCard events={analytics} />}
            {activeTab === "costs" && <AgentCostsCard costs={costs} />}
          </div>
        )}
      </div>
    </main>
  );
}
