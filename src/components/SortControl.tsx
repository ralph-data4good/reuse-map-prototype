"use client";

import { SORT_OPTIONS, type SortOption } from "@/lib/sort-solutions";

export function SortControl({
  value,
  onChange,
  id = "sort-results",
}: {
  value: SortOption;
  onChange: (next: SortOption) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-xs font-semibold text-muted">
        Sort by
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-btn border border-border bg-white px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
