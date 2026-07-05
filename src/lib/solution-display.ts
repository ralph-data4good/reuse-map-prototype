import type { ReuseSolution } from "@/lib/types";

/**
 * Provider-first display name for a solution. The service provider is the
 * headline; the solution name becomes a secondary line only when it differs.
 * Shared by the gallery, table, map popup, and detail page so all surfaces
 * label entries identically.
 */
export function providerDisplay(s: ReuseSolution): {
  title: string;
  secondary: string | null;
} {
  const provider = s.serviceProviderName?.trim();
  const title = provider || s.name;
  const secondary =
    provider && s.name.trim() !== provider ? s.name : null;
  return { title, secondary };
}
