"use client";

import "./globals.css";
import React, { useEffect } from "react";
import { initSentryWeb } from "../lib/sentry";
import { initPostHog } from "../lib/posthog";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initSentryWeb();
    initPostHog();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
