"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
import { RefineSidebar } from "@/components/RefineSidebar";
import { ReuseTaxonomyGraphic } from "@/components/ReuseTaxonomyGraphic";
import { ResultsBar } from "@/components/ResultsBar";
import { GalleryView } from "@/components/views/GalleryView";
import { TableView } from "@/components/views/TableView";
import { fetchReuseSolutions, applyFilters } from "@/lib/data";
import { EMPTY_FILTERS, type Filters, type ReuseSolution } from "@/lib/types";
import { COPY } from "@/lib/taxonomy";

// Map view is client-only (Mapbox touches the DOM), so load it without SSR.
const MapView = dynamic(
  () => import("@/components/views/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-card border border-border bg-white text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading map…
      </div>
    ),
  }
);

export function ReuseExplorer() {
  const [all, setAll] = useState<ReuseSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<ViewMode>("map");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showHowTo, setShowHowTo] = useState(false);

  // Floating "jump to map" button: only shown until the controls scroll into view.
  const controlsRef = useRef<HTMLDivElement>(null);
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
    controlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToContribute = () => {
    document
      .getElementById("contribute")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  // Countries present in the data (narrows the country filter list).
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    all.forEach((s) => {
      if (s.country) set.add(s.country);
      s.operatingCountries.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [all]);

  // Affiliations present in the data (narrows the affiliation filter list).
  const availableAffiliations = useMemo(() => {
    const set = new Set<string>();
    all.forEach((s) => s.affiliations.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [all]);

  // Reset to first page when filters or page size change.
  useEffect(() => {
    setPage(1);
  }, [filters, pageSize, view]);

  const paginated = view !== "map";
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = paginated
    ? filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filtered;

  return (
    <div className="container py-6">
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

      {/* Landing banner: taxonomy graphic (1/3) + standout title and blurb (2/3) */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-hover p-6 shadow-pop sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
          <ReuseTaxonomyGraphic className="lg:col-span-1" />
          <div className="lg:col-span-2">
            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              {COPY.pageTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-lg">
              {COPY.intro}
            </p>

            {showHowTo && (
              <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-lg">
                {COPY.introMore}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHowTo((v) => !v)}
                aria-expanded={showHowTo}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {showHowTo ? "Show less" : "How to use this directory"}
                {showHowTo ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={scrollToControls}
                className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              >
                Explore the map
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search + view toggle */}
      <div ref={controlsRef} className="scroll-mt-20 space-y-4">
        <SearchBar
          value={filters.search}
          onChange={(v) => setFilters((f) => ({ ...f, search: v }))}
        />
        <div className="flex items-center justify-end">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <RefineSidebar
          filters={filters}
          onChange={setFilters}
          availableCountries={availableCountries}
          availableAffiliations={availableAffiliations}
        />

        <section className="space-y-4">
          <ResultsBar
            total={filtered.length}
            shown={pageItems.length}
            page={currentPage}
            pageSize={pageSize}
            paginated={paginated}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />

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
            <MapView items={filtered} />
          ) : view === "gallery" ? (
            <GalleryView items={pageItems} />
          ) : (
            <TableView items={pageItems} />
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
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-pop transition-colors hover:bg-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Scroll down to the map and results"
        >
          <ArrowDown className="h-4 w-4" />
          Jump to map
        </button>
      )}
    </div>
  );
}
