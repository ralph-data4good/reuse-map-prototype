import {
  DEFAULT_SORT,
  parseSortOption,
  type SortOption,
} from "@/lib/sort-solutions";
import {
  CATEGORY_NAME_BY_SLUG,
  CATEGORY_SLUG_BY_NAME,
  REUSE_CATEGORY_NAMES,
  type ReuseCategory,
} from "@/lib/reuse-categories";
import { AFFILIATIONS, NATURES_OF_SERVICE, SUB_CATEGORIES } from "@/lib/taxonomy";
import { EMPTY_FILTERS, type Filters } from "@/lib/types";
import type { ReuseSolution } from "@/lib/types";

/** The three explorer result views. Owned here alongside ExplorerUrlState. */
export type ViewMode = "map" | "gallery" | "table";

export type ExplorerUrlState = {
  view: ViewMode;
  filters: Filters;
  page: number;
  pageSize: number;
  sort: SortOption;
};

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZES = new Set([10, 20, 50]);

/** ISO2 codes for countries present in seed data (extend as data grows). */
const COUNTRY_ISO2_TO_NAME: Record<string, string> = {
  id: "Indonesia",
  cn: "Mainland China",
  hk: "Hong Kong (China)",
  th: "Thailand",
  vn: "Vietnam",
  ph: "Philippines",
  in: "India",
  bd: "Bangladesh",
};

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitList(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

export function buildCountryLookups(items: ReuseSolution[]) {
  const nameByIso: Record<string, string> = {};
  Object.entries(COUNTRY_ISO2_TO_NAME).forEach(([iso, name]) => {
    nameByIso[iso.toUpperCase()] = name;
  });

  const isoByName: Record<string, string> = {};
  Object.values(nameByIso).forEach((name) => {
    const iso = Object.entries(nameByIso).find(([, n]) => n === name)?.[0];
    if (iso) isoByName[name] = iso;
  });

  items.forEach((s) => {
    if (s.country && s.countryIso2) {
      const iso = s.countryIso2.toUpperCase();
      isoByName[s.country] = iso;
      nameByIso[iso] = s.country;
    }
  });

  return { isoByName, nameByIso };
}

function resolveCountryToken(
  token: string,
  availableCountries: string[],
  nameByIso: Record<string, string>
): string | null {
  const trimmed = token.trim();
  if (!trimmed) return null;

  if (trimmed.length === 2) {
    const byIso = nameByIso[trimmed.toUpperCase()];
    if (byIso && availableCountries.includes(byIso)) return byIso;
  }

  const slug = toSlug(trimmed);
  return (
    availableCountries.find((country) => toSlug(country) === slug) ??
    null
  );
}

function resolveCategoryToken(token: string): ReuseCategory | null {
  const normalized = token.trim().toLowerCase().replace(/_/g, "-");
  return CATEGORY_NAME_BY_SLUG[normalized] ?? null;
}

function resolveNatureToken(token: string): string | null {
  const slug = toSlug(token);
  return (
    NATURES_OF_SERVICE.find((n) => toSlug(n.label) === slug)?.label ?? null
  );
}

function resolveProviderToken(token: string): string | null {
  const slug = toSlug(token);
  return AFFILIATIONS.find((a) => toSlug(a) === slug) ?? null;
}

function resolveSubcategoryToken(token: string): string | null {
  const slug = toSlug(token);
  return SUB_CATEGORIES.find((sub) => toSlug(sub) === slug) ?? null;
}

export function parseExplorerParams(
  params: URLSearchParams,
  ctx: {
    availableCountries: string[];
    nameByIso: Record<string, string>;
  }
): ExplorerUrlState {
  const viewParam = params.get("view");
  const view: ViewMode =
    viewParam === "gallery" || viewParam === "table" || viewParam === "map"
      ? viewParam
      : "map";

  const categories = uniqueSorted(
    splitList(params.get("category"))
      .map(resolveCategoryToken)
      .filter((c): c is ReuseCategory => Boolean(c))
  );

  const countries = uniqueSorted(
    splitList(params.get("country"))
      .map((token) =>
        resolveCountryToken(token, ctx.availableCountries, ctx.nameByIso)
      )
      .filter((c): c is string => Boolean(c))
  );

  const natures = uniqueSorted(
    splitList(params.get("service"))
      .map(resolveNatureToken)
      .filter((n): n is string => Boolean(n))
  );

  const affiliations = uniqueSorted(
    splitList(params.get("provider"))
      .map(resolveProviderToken)
      .filter((a): a is string => Boolean(a))
  );

  const subcategories = uniqueSorted(
    splitList(params.get("subcategory"))
      .map(resolveSubcategoryToken)
      .filter((s): s is string => Boolean(s))
  );

  const search = params.get("q")?.trim() ?? "";

  const pageRaw = Number(params.get("page") ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  const pageSizeRaw = Number(params.get("pageSize") ?? String(DEFAULT_PAGE_SIZE));
  const pageSize = PAGE_SIZES.has(pageSizeRaw) ? pageSizeRaw : DEFAULT_PAGE_SIZE;

  const sort = parseSortOption(params.get("sort"));

  return {
    view,
    filters: {
      countries,
      categories,
      subcategories,
      natures,
      affiliations,
      search,
    },
    page: view === "map" ? 1 : page,
    pageSize: view === "map" ? DEFAULT_PAGE_SIZE : pageSize,
    sort,
  };
}

export function serializeExplorerParams(state: ExplorerUrlState): URLSearchParams {
  const params = new URLSearchParams();
  const { view, filters, page, pageSize, sort } = state;

  if (view !== "map") params.set("view", view);
  if (filters.search.trim()) params.set("q", filters.search.trim());

  if (filters.categories.length) {
    params.set(
      "category",
      filters.categories
        .map((name) => CATEGORY_SLUG_BY_NAME[name as ReuseCategory])
        .filter(Boolean)
        .join(",")
    );
  }

  if (filters.countries.length) {
    params.set(
      "country",
      filters.countries
        .map((country) => toSlug(country))
        .join(",")
    );
  }

  if (filters.natures.length) {
    params.set(
      "service",
      filters.natures.map((n) => toSlug(n)).join(",")
    );
  }

  if (filters.affiliations.length) {
    params.set(
      "provider",
      filters.affiliations.map((a) => toSlug(a)).join(",")
    );
  }

  if (filters.subcategories.length) {
    params.set(
      "subcategory",
      filters.subcategories.map((s) => toSlug(s)).join(",")
    );
  }

  if (sort !== DEFAULT_SORT) params.set("sort", sort);

  if (view !== "map") {
    if (page > 1) params.set("page", String(page));
    if (pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(pageSize));
  }

  return params;
}

export function explorerStatesEqual(a: ExplorerUrlState, b: ExplorerUrlState): boolean {
  const joinSorted = (values: string[]) => [...values].sort().join("|");
  return (
    a.view === b.view &&
    a.page === b.page &&
    a.pageSize === b.pageSize &&
    a.sort === b.sort &&
    a.filters.search === b.filters.search &&
    joinSorted(a.filters.countries) === joinSorted(b.filters.countries) &&
    joinSorted(a.filters.categories) === joinSorted(b.filters.categories) &&
    joinSorted(a.filters.subcategories) === joinSorted(b.filters.subcategories) &&
    joinSorted(a.filters.natures) === joinSorted(b.filters.natures) &&
    joinSorted(a.filters.affiliations) === joinSorted(b.filters.affiliations)
  );
}

export function isDefaultExplorerState(state: ExplorerUrlState): boolean {
  return (
    state.view === "map" &&
    state.page === 1 &&
    state.pageSize === DEFAULT_PAGE_SIZE &&
    state.sort === DEFAULT_SORT &&
    state.filters.countries.length === 0 &&
    state.filters.categories.length === 0 &&
    state.filters.subcategories.length === 0 &&
    state.filters.natures.length === 0 &&
    state.filters.affiliations.length === 0 &&
    state.filters.search.trim() === ""
  );
}

/** Guard against unknown category tokens in shared URLs. */
export function sanitizeCategoryFilters(categories: string[]): string[] {
  return categories.filter((c) =>
    REUSE_CATEGORY_NAMES.includes(c as ReuseCategory)
  );
}

export { EMPTY_FILTERS };
