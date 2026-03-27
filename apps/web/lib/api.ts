const isBrowser = typeof window !== 'undefined';
const isProd = isBrowser && !window.location.hostname.includes('localhost');

const DEFAULT_API = isProd
  ? "https://ai-tutor-api-production.up.railway.app/api"
  : "http://localhost:4000/api";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API).replace(/\/$/, "");

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    credentials: "include",
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}
