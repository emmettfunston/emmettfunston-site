"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Webhooks usually arrive before the student returns from Checkout. If not,
 * refresh the server-rendered access check briefly; this never grants access.
 */
export function PurchaseStatusPoller() {
  const router = useRouter();

  useEffect(() => {
    const interval = window.setInterval(() => router.refresh(), 2000);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 30000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [router]);

  return null;
}
