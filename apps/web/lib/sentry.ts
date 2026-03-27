export function initSentryWeb() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  console.log("Sentry DSN detected for Web.");
}
