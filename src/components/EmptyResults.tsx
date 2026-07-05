"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/taxonomy";
import {
  contributePrefillFromFilters,
  contributeUrl,
  emptyStateHeadline,
} from "@/lib/contribute-link";
import type { Filters } from "@/lib/types";

export function EmptyResults({
  filters,
  onClearFilters,
  hasActiveFilters,
}: {
  filters?: Filters;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}) {
  const headline = filters
    ? emptyStateHeadline(filters)
    : COPY.noResultsTitle;
  const prefill = filters ? contributePrefillFromFilters(filters) : undefined;
  const contributeHref = contributeUrl(prefill);

  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-border bg-white p-10 text-center">
      <SearchX className="h-8 w-8 text-muted" />
      <h3 className="mt-3 font-heading text-lg font-semibold text-ink">
        {headline}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted">
        Know one?{" "}
        <Link
          href={contributeHref}
          className="font-semibold text-navy underline underline-offset-2 hover:text-navy-hover"
        >
          Contribute it →
        </Link>
      </p>
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
