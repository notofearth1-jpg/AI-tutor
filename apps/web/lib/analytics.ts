import { apiFetch } from "./api";

export async function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  try {
    await apiFetch("/analytics/track", {
      method: "POST",
      body: JSON.stringify({ eventName, properties })
    });
  } catch {
    // silently ignore analytics errors
  }
}
