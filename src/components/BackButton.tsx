"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Returns the user to wherever they came from (preserving explorer filters and
 * view via browser history), falling back to a stable link when the page was
 * opened directly (e.g. a shared permalink).
 */
export function BackButton({
  fallbackHref,
  label = "Back to results",
}: {
  fallbackHref: string;
  label?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-btn border border-border bg-white px-3 py-1.5 text-sm font-medium text-navy shadow-sm transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
