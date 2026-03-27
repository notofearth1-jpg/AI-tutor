import { apiFetch } from "./api";
import { unwrapApiResponse } from "./unwrap";

export async function fetchAdminAgentRuns(limit = 50) {
  const res = await apiFetch(`/admin/agent-runs?limit=${limit}`);
  return unwrapApiResponse<any[]>(res);
}

export async function fetchAdminUsers(limit = 50) {
  const res = await apiFetch(`/admin/users?limit=${limit}`);
  return unwrapApiResponse<any[]>(res);
}

export async function fetchAdminPrompts() {
  const res = await apiFetch(`/admin/prompts`);
  return unwrapApiResponse<any[]>(res);
}

export async function fetchAdminAnalytics(limit = 100) {
  const res = await apiFetch(`/admin/analytics-events?limit=${limit}`);
  return unwrapApiResponse<any[]>(res);
}

export async function fetchAdminAgentCosts() {
  const res = await apiFetch(`/admin/agent-costs`);
  return unwrapApiResponse<Record<string, { totalCost: number; totalTokens: number; count: number }>>(res);
}

export async function activatePrompt(promptId: string) {
  const res = await apiFetch(`/prompts/${promptId}/activate`, { method: "PATCH" });
  return unwrapApiResponse(res);
}

export async function createPrompt(payload: {
  agentType: string;
  version: string;
  promptText: string;
  responseSchema: unknown;
  active?: boolean;
}) {
  const res = await apiFetch(`/prompts`, { method: "POST", body: JSON.stringify(payload) });
  return unwrapApiResponse(res);
}
