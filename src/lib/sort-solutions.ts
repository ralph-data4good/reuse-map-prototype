import type { ReuseSolution } from "@/lib/types";

export type SortOption = "verified" | "name" | "country" | "category";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "verified", label: "Recently verified" },
  { value: "name", label: "Name A–Z" },
  { value: "country", label: "Country A–Z" },
  { value: "category", label: "Category A–Z" },
];

export const DEFAULT_SORT: SortOption = "verified";

export function parseSortOption(raw: string | null): SortOption {
  if (raw === "name" || raw === "country" || raw === "category") return raw;
  return DEFAULT_SORT;
}

function providerSortKey(s: ReuseSolution): string {
  return (s.serviceProviderName ?? s.name ?? "").trim().toLowerCase();
}

function dateSortKey(s: ReuseSolution): number {
  const raw = s.lastUpdated ?? s.updatedAt;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function sortSolutions(
  items: ReuseSolution[],
  sort: SortOption
): ReuseSolution[] {
  const copy = [...items];
  switch (sort) {
    case "name":
      return copy.sort((a, b) =>
        providerSortKey(a).localeCompare(providerSortKey(b))
      );
    case "country":
      return copy.sort((a, b) =>
        (a.country ?? "").localeCompare(b.country ?? "")
      );
    case "category":
      return copy.sort((a, b) =>
        (a.primaryCategory ?? "").localeCompare(b.primaryCategory ?? "")
      );
    case "verified":
    default:
      return copy.sort((a, b) => dateSortKey(b) - dateSortKey(a));
  }
}
