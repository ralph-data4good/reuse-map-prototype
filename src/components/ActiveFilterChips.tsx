"use client";

import { X } from "lucide-react";
import { COPY } from "@/lib/taxonomy";
import type { Filters } from "@/lib/types";

type Chip = { key: string; label: string; onRemove: () => void };

/** Filters whose value is a string[] of independently-removable selections. */
type ListFilterKey = Extract<
  {
    [K in keyof Filters]: Filters[K] extends string[] ? K : never;
  }[keyof Filters],
  string
>;

const LIST_FILTER_GROUPS: { field: ListFilterKey; keyPrefix: string }[] = [
  { field: "countries", keyPrefix: "country" },
  { field: "categories", keyPrefix: "category" },
  { field: "subcategories", keyPrefix: "subcategory" },
  { field: "natures", keyPrefix: "nature" },
  { field: "affiliations", keyPrefix: "affiliation" },
];

function buildFilterChips(
  filters: Filters,
  onChange: (next: Filters) => void
): Chip[] {
  const chips: Chip[] = [];

  if (filters.search.trim()) {
    chips.push({
      key: "search",
      label: `Search: ${filters.search.trim()}`,
      onRemove: () => onChange({ ...filters, search: "" }),
    });
  }

  for (const { field, keyPrefix } of LIST_FILTER_GROUPS) {
    for (const value of filters[field]) {
      chips.push({
        key: `${keyPrefix}-${value}`,
        label: value,
        onRemove: () =>
          onChange({
            ...filters,
            [field]: filters[field].filter((v) => v !== value),
          }),
      });
    }
  }

  return chips;
}

export function ActiveFilterChips({
  filters,
  onChange,
  onClearAll,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onClearAll: () => void;
}) {
  const chips = buildFilterChips(filters, onChange);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-white py-1 pl-2.5 pr-1 text-xs text-ink shadow-sm"
        >
          <span className="truncate">{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="rounded-full p-0.5 text-muted hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-brand hover:underline"
      >
        {COPY.clearAll}
      </button>
    </div>
  );
}
