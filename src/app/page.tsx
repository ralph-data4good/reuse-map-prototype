"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Static export can't do server redirects, so send visitors to /reuse on the
// client. useRouter().replace() automatically respects the configured basePath.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/reuse");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream">
      <p className="text-sm text-muted">Loading Reuse Solutions…</p>
    </main>
  );
}
