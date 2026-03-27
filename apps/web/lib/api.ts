const isBrowser = typeof window !== 'undefined';
const isProd = isBrowser && !window.location.hostname.includes('localhost');

const DEFAULT_API = isProd
  ? "https://ai-tutor-api-production.up.railway.app/api"
  : "http://localhost:4000/api";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API).replace(/\/$/, "");

import { getAccessToken } from "./storage";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const isProd = typeof window !== "undefined" && !window.location.hostname.includes("localhost");
  
  // Debug log for authentication (Visible in F12 console)
  if (typeof window !== "undefined") {
    console.debug(`[apiFetch] Request to ${path}`, { 
      hasToken: !!token, 
      tokenPrefix: token ? token.substring(0, 8) + "..." : "none" 
    });
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    },
    // If we have a Bearer token, we don't need cookies for cross-domain requests
    credentials: token ? "omit" : "include",
    cache: "no-store"
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      console.warn("[apiFetch] 401 Unauthorized detected. Your session may have expired.");
    }
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}
