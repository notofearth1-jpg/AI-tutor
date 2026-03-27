export function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  console.log("PostHog config detected for Web.");
}
