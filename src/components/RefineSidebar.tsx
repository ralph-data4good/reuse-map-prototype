"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { MultiSelectFilter, type FilterOption } from "@/components/MultiSelectFilter";
import { COPY, NATURES_OF_SERVICE, AFFILIATIONS } from "@/lib/taxonomy";
import { REUSE_CATEGORY_NAMES, getCategoryColor } from "@/lib/reuse-categories";
import { getCategoryDefinition } from "@/lib/tooltips";
import { cn } from "@/lib/utils";
import type { Filters } from "@/lib/types";

// Natures of service are not in the tooltip CSV yet; until filled, show a
// placeholder so the tooltip affordance is still present.
const NATURE_TOOLTIP_FALLBACK = "Helper description coming soon.";

export function RefineSidebar({
  filters,
  onChange,
  availableCountries,
  availableAffiliations,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  availableCountries: string[];
  availableAffiliations: string[];
}) {
  const countryOptions: FilterOption[] = availableCountries.map((c) => ({
    value: c,
    label: c,
  }));

  // Keep canonical affiliation order, limited to values present in the data.
  const affiliationOptions: FilterOption[] = AFFILIATIONS.filter((a) =>
    availableAffiliations.includes(a)
  ).map((a) => ({ value: a, label: a }));

  const categoryOptions: FilterOption[] = REUSE_CATEGORY_NAMES.map((name) => ({
    value: name,
    label: name,
    color: getCategoryColor(name),
    description: getCategoryDefinition(name),
  }));

  const natureOptions: FilterOption[] = NATURES_OF_SERVICE.map((n) => ({
    value: n.label,
    label: n.label,
    description: n.description || NATURE_TOOLTIP_FALLBACK,
  }));

  // Collapsed by default on mobile so the map is visible; always open on desktop.
  const [open, setOpen] = useState(false);

  const activeCount =
    filters.countries.length +
    filters.categories.length +
    filters.natures.length +
    filters.affiliations.length;
  const hasAny = activeCount > 0;

  return (
    <aside className="sticky top-20 z-30 max-h-[calc(100vh-6rem)] self-start overflow-y-auto rounded-card border border-border bg-panel p-4 shadow-card lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="refine-filters"
          className="flex flex-1 items-center gap-2 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:flex-none lg:pointer-events-none lg:hover:bg-transparent"
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-navy lg:hidden" />
          <h2 className="font-heading text-lg font-semibold text-ink">
            {COPY.refinePanelTitle}
          </h2>
          {hasAny && (
            <span className="rounded-full bg-navy px-1.5 py-0.5 text-xs font-semibold text-white lg:hidden">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "ml-auto h-5 w-5 shrink-0 text-muted transition-transform lg:hidden",
              open && "rotate-180"
            )}
          />
        </button>
        {hasAny ? (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                countries: [],
                categories: [],
                natures: [],
                affiliations: [],
              })
            }
            className="text-sm font-medium text-brand hover:underline"
          >
            {COPY.clearAll}
          </button>
        ) : null}
      </div>

      <div
        id="refine-filters"
        className={cn("mt-4 space-y-4 lg:block", open ? "block" : "hidden")}
      >
        <MultiSelectFilter
          label="Country"
          placeholder="Select countries"
          options={countryOptions}
          selected={filters.countries}
          onChange={(v) => onChange({ ...filters, countries: v })}
        />
        <MultiSelectFilter
          label="Reuse Framework Category"
          placeholder="Select categories"
          options={categoryOptions}
          selected={filters.categories}
          onChange={(v) => onChange({ ...filters, categories: v })}
        />
        <MultiSelectFilter
          label="Nature of Service"
          placeholder="Select natures of service"
          options={natureOptions}
          selected={filters.natures}
          onChange={(v) => onChange({ ...filters, natures: v })}
        />
        {affiliationOptions.length > 0 && (
          <MultiSelectFilter
            label="Affiliation of Service Provider"
            placeholder="Select affiliations"
            options={affiliationOptions}
            selected={filters.affiliations}
            onChange={(v) => onChange({ ...filters, affiliations: v })}
          />
        )}
      </div>
    </aside>
  );
}
