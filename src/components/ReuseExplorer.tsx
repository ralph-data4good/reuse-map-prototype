"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ViewToggle } from "@/components/ViewToggle";
import { RefineSidebar } from "@/components/RefineSidebar";
import { ReuseTaxonomyGraphic } from "@/components/ReuseTaxonomyGraphic";
import { HowToSteps } from "@/components/HowToSteps";
import { ResultsBar } from "@/components/ResultsBar";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { SortControl } from "@/components/SortControl";
import { GalleryView } from "@/components/views/GalleryView";
import { TableView } from "@/components/views/TableView";
import { fetchReuseSolutions, applyFilters } from "@/lib/data";
import { sortSolutions } from "@/lib/sort-solutions";
import type { ReuseSolution } from "@/lib/types";
import { COPY } from "@/lib/taxonomy";
import { useExplorerUrlState } from "@/hooks/useExplorerUrlState";
import {
  HOWTO_COLLAPSED_KEY,
  scrollIntoViewRespectingMotion,
} from "@/lib/motion";
import { contributeUrl } from "@/lib/contribute-link";
import { solutionDetailPath } from "@/lib/solution-paths";
import { safeStorageGet, safeStorageSet } from "@/lib/safe-storage";
import { cn } from "@/lib/utils";

// Map view is client-only (Mapbox touches the DOM), so load it without SSR.
const MapView = dynamic(
  () => import("@/components/views/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] items-center justify-center rounded-card border border-border bg-white text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading map…
      </div>
    ),
  }
);

/** sessionStorage key for the hero classification-matrix expand/collapse state. */
const MATRIX_EXPANDED_KEY = "reuse-matrix-expanded";

export function ReuseExplorer() {
  const router = useRouter();
  const [all, setAll] = useState<ReuseSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
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
  } = useExplorerUrlState(all, loading);

  const [showHowTo, setShowHowTo] = useState(() => {
    if (typeof window === "undefined") return false;
    return safeStorageGet("local", HOWTO_COLLAPSED_KEY) !== "true";
  });
  const [showMatrix, setShowMatrix] = useState(false);
  const [refineHighlight, setRefineHighlight] = useState(false);
  const [refineMobileOpen, setRefineMobileOpen] = useState(false);

  const setHowToExpanded = useCallback((expanded: boolean) => {
    setShowHowTo(expanded);
    safeStorageSet("local", HOWTO_COLLAPSED_KEY, expanded ? "false" : "true");
  }, []);

  useEffect(() => {
    const stored = safeStorageGet("session", MATRIX_EXPANDED_KEY);
    if (stored !== null) {
      setShowMatrix(stored === "true");
      return;
    }
    // Default collapsed so map/results sit higher on laptop viewports.
    setShowMatrix(false);
  }, []);

  const toggleMatrix = () => {
    setShowMatrix((v) => {
      const next = !v;
      safeStorageSet("session", MATRIX_EXPANDED_KEY, String(next));
      return next;
    });
  };

  // Floating "jump to map" button: only shown until the controls scroll into view.
  const controlsRef = useRef<HTMLDivElement>(null);
  const mapResultsRef = useRef<HTMLElement>(null);
  const refineAsideRef = useRef<HTMLElement>(null);
  const [showJump, setShowJump] = useState(true);

  useEffect(() => {
    const el = controlsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowJump(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToControls = () => {
    scrollIntoViewRespectingMotion(controlsRef.current, { block: "start" });
  };

  const scrollToContribute = () => {
    scrollIntoViewRespectingMotion(document.getElementById("contribute"), {
      block: "start",
    });
  };

  const handleHowToStep = useCallback(
    (index: number) => {
      switch (index) {
        case 0:
          setView("map");
          scrollIntoViewRespectingMotion(mapResultsRef.current, {
            block: "start",
          });
          break;
        case 1:
          scrollIntoViewRespectingMotion(refineAsideRef.current, {
            block: "start",
          });
          setRefineMobileOpen(true);
          setRefineHighlight(true);
          window.setTimeout(() => setRefineHighlight(false), 1500);
          window.setTimeout(() => {
            document.getElementById("filter-country-trigger")?.focus();
          }, 300);
          break;
        case 2:
          scrollIntoViewRespectingMotion(controlsRef.current, {
            block: "start",
          });
          window.setTimeout(() => {
            document.getElementById(`view-toggle-${view}`)?.focus();
          }, 300);
          break;
        case 3: {
          const top = sortSolutions(all, "verified")[0];
          if (top) {
            router.push(solutionDetailPath(top.slug));
          } else {
            scrollIntoViewRespectingMotion(mapResultsRef.current, {
              block: "start",
            });
          }
          break;
        }
        case 4:
          router.push(contributeUrl());
          scrollToContribute();
          break;
        default:
          break;
      }
    },
    [all, router, setView, view]
  );

  useEffect(() => {
    let active = true;
    fetchReuseSolutions().then((res) => {
      if (!active) return;
      setAll(res.data);
      setError(res.error);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => applyFilters(all, filters), [all, filters]);
  const sorted = useMemo(
    () => sortSolutions(filtered, sort),
    [filtered, sort]
  );

  const availableAffiliations = useMemo(() => {
    const set = new Set<string>();
    all.forEach((s) => s.affiliations.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [all]);

  const paginated = view !== "map";
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = paginated
    ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sorted;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-1.5 text-sm"
      >
        <a
          href="https://zerowaste.asia/directories?page=1&pageSize=20&view=grid"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-muted hover:text-navy hover:underline"
        >
          Directory
        </a>
        <ChevronRight className="h-4 w-4 text-muted" />
        <span className="font-semibold text-ink">Reuse Solutions</span>
      </nav>

      {/* Hero: matrix (left col) + heading/intro/how-to (right col) on desktop;
          single column on mobile ordered heading -> intro -> steps -> matrix. */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-hover p-5 shadow-pop sm:p-6">
        <div
          className={cn(
            "grid grid-cols-1 gap-5",
            showMatrix &&
              "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start"
          )}
        >
          {/* Matrix column (only when expanded) */}
          {showMatrix && (
            <div className="order-last lg:order-first">
              <ReuseTaxonomyGraphic
                onCollapse={toggleMatrix}
                collapseControlId="matrix-toggle"
              />
            </div>
          )}

          {/* Right column: heading, intro, how-to disclosure */}
          <div className="order-first min-w-0 lg:order-last">
            <h1 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
              {COPY.pageTitle}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
              {COPY.intro}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/85 sm:text-base">
              {COPY.introSecondary}
            </p>

            {/* How-to disclosure: single toggle at its own top edge */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setHowToExpanded(!showHowTo)}
                aria-expanded={showHowTo}
                aria-controls="how-to-panel"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white motion-safe:transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {showHowTo ? "Show less" : "How to use this directory"}
                {showHowTo ? (
                  <ChevronUp className="h-4 w-4" aria-hidden />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden />
                )}
              </button>

              {showHowTo && (
                <div id="how-to-panel">
                  <HowToSteps
                    steps={COPY.howToSteps}
                    onStepAction={handleHowToStep}
                  />
                </div>
              )}
            </div>

            {/* Re-open matrix + primary CTA (only shown when their panel is closed) */}
            {(!showMatrix || !showHowTo) && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!showMatrix && (
                  <button
                    type="button"
                    onClick={toggleMatrix}
                    aria-expanded={false}
                    id="matrix-toggle"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white motion-safe:transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    {COPY.matrixToggle}
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </button>
                )}
                {!showHowTo && (
                  <button
                    type="button"
                    onClick={scrollToControls}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-sm font-semibold text-white motion-safe:transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    Explore the map
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div ref={controlsRef} className="scroll-mt-20">
        <SearchBar
          value={filters.search}
          onChange={(v) => setFilters((f) => ({ ...f, search: v }))}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <RefineSidebar
          filters={filters}
          onChange={setFilters}
          availableCountries={availableCountries}
          availableAffiliations={availableAffiliations}
          highlight={refineHighlight}
          asideRef={refineAsideRef}
          mobileOpen={refineMobileOpen}
        />

        <section ref={mapResultsRef} id="map-results" className="space-y-4 scroll-mt-20">
          <div className="sticky top-20 z-30 flex items-center justify-end bg-cream/90 py-2 backdrop-blur">
            <ViewToggle value={view} onChange={setView} />
          </div>

          <ActiveFilterChips
            filters={filters}
            onChange={setFilters}
            onClearAll={clearFilters}
          />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <ResultsBar
              total={sorted.length}
              shown={pageItems.length}
              page={currentPage}
              pageSize={pageSize}
              paginated={paginated}
              showPageSize={view === "table"}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
            {view !== "map" && (
              <SortControl value={sort} onChange={setSort} />
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-card border border-chip-unverified-bg bg-chip-unverified-bg/60 p-4 text-sm text-chip-unverified-fg">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-card border border-border bg-white text-muted">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading reuse
              solutions…
            </div>
          ) : view === "map" ? (
            <MapView
              items={sorted}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              selectedCategories={filters.categories}
              onToggleCategory={toggleCategory}
              onShowAllCategories={showAllCategories}
            />
          ) : view === "gallery" ? (
            <GalleryView
              items={pageItems}
              filters={filters}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              activeSubcategories={filters.subcategories}
              onSubcategorySelect={toggleSubcategory}
            />
          ) : (
            <TableView
              items={pageItems}
              filters={filters}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              activeSubcategories={filters.subcategories}
              onSubcategorySelect={toggleSubcategory}
              sort={sort}
              onSort={setSort}
            />
          )}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={scrollToContribute}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
            >
              <Plus className="h-4 w-4" />
              Contribute reuse solutions!
            </button>
          </div>
        </section>
      </div>

      {/* Floating jump-to-map button (hidden once the controls are in view) */}
      {showJump && (
        <button
          type="button"
          onClick={scrollToControls}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-pop motion-safe:transition-colors hover:bg-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2"
          aria-label="Scroll down to the map and results"
        >
          <ArrowDown className="h-4 w-4" />
          Jump to map
        </button>
      )}
    </div>
  );
}
