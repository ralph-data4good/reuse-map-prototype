import type { Filters } from "@/lib/types";

/** Explorer page path (basePath is handled by Next.js Link). */
export const EXPLORER_PATH = "/reuse";

export type ContributePrefill = {
  category?: string | null;
  country?: string | null;
};

/** Build a URL that opens the contribute section with optional prefill params. */
export function contributeUrl(
  prefill?: ContributePrefill,
  explorerPath = EXPLORER_PATH
): string {
  const params = new URLSearchParams();
  params.set("contribute", "1");
  if (prefill?.category) params.set("contributeCategory", prefill.category);
  if (prefill?.country) params.set("contributeCountry", prefill.country);
  return `${explorerPath}?${params.toString()}#contribute`;
}

/** Derive the best single category/country from active filters for prefill. */
export function contributePrefillFromFilters(
  filters: Filters
): ContributePrefill {
  return {
    category:
      filters.categories.length === 1 ? filters.categories[0] : undefined,
    country: filters.countries.length === 1 ? filters.countries[0] : undefined,
  };
}

/** Human-readable empty-state headline from filter context. */
export function emptyStateHeadline(filters: Filters): string {
  const category =
    filters.categories.length === 1 ? filters.categories[0] : null;
  const country = filters.countries.length === 1 ? filters.countries[0] : null;

  if (category && country) {
    return `No ${category} solutions in ${country} yet.`;
  }
  if (category) {
    return `No ${category} solutions match your filters yet.`;
  }
  if (country) {
    return `No reuse solutions in ${country} yet.`;
  }
  if (filters.search.trim()) {
    return `No results for "${filters.search.trim()}".`;
  }
  return "No reuse solutions match your filters yet.";
}
