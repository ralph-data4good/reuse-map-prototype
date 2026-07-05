"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpDown } from "lucide-react";
import { EmptyResults } from "@/components/EmptyResults";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TableTrustIndicator } from "@/components/TrustBadge";
import { VisitProviderLink } from "@/components/VisitProviderLink";
import { SubCategoryTerms } from "@/components/SubCategoryTerms";
import { solutionDetailPath } from "@/lib/solution-paths";
import { providerDisplay } from "@/lib/solution-display";
import type { SortOption } from "@/lib/sort-solutions";
import { cn } from "@/lib/utils";
import type { Filters, ReuseSolution } from "@/lib/types";

function SortableHeader({
  label,
  column,
  sort,
  onSort,
  className,
}: {
  label: string;
  column: SortOption;
  sort: SortOption;
  onSort: (next: SortOption) => void;
  className?: string;
}) {
  const active = sort === column;
  return (
    <th className={cn("px-4 py-3", className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wide transition-colors",
          "hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          active ? "text-ink" : "text-muted"
        )}
      >
        {label}
        {active ? (
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
        )}
      </button>
    </th>
  );
}

export function TableView({
  items,
  filters,
  onClearFilters,
  hasActiveFilters,
  activeSubcategories = [],
  onSubcategorySelect,
  sort,
  onSort,
}: {
  items: ReuseSolution[];
  filters?: Filters;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  activeSubcategories?: string[];
  onSubcategorySelect?: (subcategory: string) => void;
  sort: SortOption;
  onSort: (next: SortOption) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyResults
        filters={filters}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white shadow-card">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold">
            <SortableHeader
              label="Name"
              column="name"
              sort={sort}
              onSort={onSort}
            />
            <SortableHeader
              label="Country"
              column="country"
              sort={sort}
              onSort={onSort}
            />
            <SortableHeader
              label="Category"
              column="category"
              sort={sort}
              onSort={onSort}
            />
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Sub-Category
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
              Visit
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => {
            const { title: providerTitle, secondary: description } =
              providerDisplay(s);

            return (
              <tr
                key={s.id}
                className="border-b border-border/70 last:border-0 hover:bg-cream/60"
              >
                <td className="max-w-xs px-4 py-2.5 align-top">
                  <div className="flex items-start gap-2">
                    <TableTrustIndicator
                      status={s.verificationStatus}
                      source={s.verificationSource}
                      lastUpdated={s.lastUpdated}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <Link
                        href={solutionDetailPath(s.slug)}
                        className="font-semibold text-ink hover:text-navy hover:underline"
                      >
                        {providerTitle}
                      </Link>
                      {description && (
                        <div className="mt-0.5 text-xs leading-snug text-muted">
                          {description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 align-top text-ink">
                  {s.country ?? "—"}
                </td>
                <td className="px-4 py-2.5 align-top">
                  {s.primaryCategory ? (
                    <CategoryBadge
                      category={s.primaryCategory}
                      compact
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2.5 align-top text-muted">
                  {s.subCategories.length ? (
                    <SubCategoryTerms
                      items={s.subCategories}
                      activeSubcategories={activeSubcategories}
                      onSelect={onSubcategorySelect}
                    />
                  ) : (
                    s.naturesOfService.join(", ") || "—"
                  )}
                </td>
                <td className="px-4 py-2.5 text-right align-top">
                  <VisitProviderLink serviceProviderName={s.serviceProviderName} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
