"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/taxonomy";

// Shared empty state for the Gallery and Table views when no entries match the
// current search or filters.
export function EmptyResults({
  onClearFilters,
  hasActiveFilters,
}: {
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-border bg-white p-10 text-center">
      <SearchX className="h-8 w-8 text-muted" />
      <h3 className="mt-3 font-heading text-lg font-semibold text-ink">
        {COPY.noResultsTitle}
      </h3>
      <p className="mt-1 max-w-md text-sm text-muted">{COPY.noResultsBody}</p>
      {hasActiveFilters && onClearFilters && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onClearFilters}
        >
          {COPY.clearAll}
        </Button>
      )}
    </div>
  );
}
