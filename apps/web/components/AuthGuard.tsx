"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function AuthGuard({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    apiFetch("/auth/me")
      .then(() => setAuthenticated(true))
      .catch(async () => {
        try {
          await apiFetch("/auth/refresh", { method: "POST" });
          await apiFetch("/auth/me");
          setAuthenticated(true);
        } catch {
          setAuthenticated(false);
        }
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return <p className="text-slate-300">Loading...</p>;
  if (!authenticated) return fallback ?? <p className="text-slate-300">You must log in first.</p>;
  return <>{children}</>;
}
