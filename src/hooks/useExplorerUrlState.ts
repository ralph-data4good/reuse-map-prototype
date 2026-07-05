"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ViewMode } from "@/lib/url-state";
import { toggleCategoryFilter } from "@/lib/reuse-categories";
import {
  buildCountryLookups,
  explorerStatesEqual,
  parseExplorerParams,
  serializeExplorerParams,
  type ExplorerUrlState,
} from "@/lib/url-state";
import { type SortOption } from "@/lib/sort-solutions";
import { type Filters, type ReuseSolution } from "@/lib/types";

const DEFAULT_PAGE_SIZE = 20;

export function useExplorerUrlState(all: ReuseSolution[], loading: boolean) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    all.forEach((s) => {
      if (s.country) set.add(s.country);
      s.operatingCountries.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [all]);

  const countryLookups = useMemo(() => buildCountryLookups(all), [all]);

  const parsedFromUrl = useMemo(
    () =>
      parseExplorerParams(searchParams, {
        availableCountries,
        nameByIso: countryLookups.nameByIso,
      }),
    [searchParams, availableCountries, countryLookups.nameByIso]
  );

  const [view, setViewState] = useState<ViewMode>(parsedFromUrl.view);
  const [filters, setFiltersState] = useState<Filters>(parsedFromUrl.filters);
  const [page, setPageState] = useState(parsedFromUrl.page);
  const [pageSize, setPageSizeState] = useState(parsedFromUrl.pageSize);
  const [sort, setSortState] = useState<SortOption>(parsedFromUrl.sort);

  const skipUrlWrite = useRef(false);
  const hydrated = useRef(false);

  useEffect(() => {
    skipUrlWrite.current = true;
    setViewState(parsedFromUrl.view);
    setFiltersState(parsedFromUrl.filters);
    setPageState(parsedFromUrl.page);
    setPageSizeState(parsedFromUrl.pageSize);
    setSortState(parsedFromUrl.sort);
    hydrated.current = true;
  }, [parsedFromUrl]);

  const currentState = useMemo<ExplorerUrlState>(
    () => ({ view, filters, page, pageSize, sort }),
    [view, filters, page, pageSize, sort]
  );

  const replaceUrl = useCallback(
    (next: ExplorerUrlState) => {
      if (!hydrated.current || loading) return;
      if (explorerStatesEqual(next, parsedFromUrl)) return;

      const params = serializeExplorerParams(next);
      const qs = params.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.replace(href, { scroll: false });
    },
    [loading, parsedFromUrl, pathname, router]
  );

  useEffect(() => {
    if (skipUrlWrite.current) {
      skipUrlWrite.current = false;
      return;
    }
    replaceUrl(currentState);
  }, [currentState, replaceUrl]);

  const setView = useCallback((next: ViewMode) => {
    setViewState(next);
    setPageState(1);
  }, []);

  const setFilters = useCallback(
    (next: Filters | ((prev: Filters) => Filters)) => {
      setFiltersState((prev) =>
        typeof next === "function" ? next(prev) : next
      );
      setPageState(1);
    },
    []
  );

  const setPage = useCallback((next: number) => {
    setPageState(next);
  }, []);

  const setPageSize = useCallback((next: number) => {
    setPageSizeState(next);
    setPageState(1);
  }, []);

  const setSort = useCallback((next: SortOption) => {
    setSortState(next);
    setPageState(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState((prev) => ({
      ...prev,
      search: "",
      countries: [],
      categories: [],
      subcategories: [],
      natures: [],
      affiliations: [],
    }));
    setPageState(1);
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFiltersState((prev) => ({
      ...prev,
      categories: toggleCategoryFilter(category, prev.categories),
    }));
    setPageState(1);
  }, []);

  const showAllCategories = useCallback(() => {
    setFiltersState((prev) => ({ ...prev, categories: [] }));
    setPageState(1);
  }, []);

  const toggleSubcategory = useCallback((subcategory: string) => {
    setFiltersState((prev) => {
      const selected = prev.subcategories;
      const next = selected.includes(subcategory)
        ? selected.filter((s) => s !== subcategory)
        : [...selected, subcategory];
      return { ...prev, subcategories: next };
    });
    setPageState(1);
  }, []);

  const hasActiveFilters =
    filters.countries.length > 0 ||
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.natures.length > 0 ||
    filters.affiliations.length > 0 ||
    filters.search.trim().length > 0;

  return {
    view,
    setView,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
    clearFilters,
    toggleCategory,
    showAllCategories,
    toggleSubcategory,
    hasActiveFilters,
    availableCountries,
    defaultPageSize: DEFAULT_PAGE_SIZE,
  };
}
