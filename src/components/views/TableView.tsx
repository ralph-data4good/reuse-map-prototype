"use client";

import { EmptyResults } from "@/components/EmptyResults";
import { CategoryIcon } from "@/components/CategoryIcon";
import { VerificationChip } from "@/components/VerificationChip";
import { VisitProviderButton } from "@/components/VisitProviderButton";
import { SubCategoryTerms } from "@/components/SubCategoryTerms";
import { getCategoryColor } from "@/lib/reuse-categories";
import { providerLink } from "@/lib/provider-links";
import type { ReuseSolution } from "@/lib/types";

export function TableView({
  items,
  onClearFilters,
  hasActiveFilters,
}: {
  items: ReuseSolution[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}) {
  if (items.length === 0) {
    return (
      <EmptyResults
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    );
  }
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white shadow-card">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Sub-Category</th>
            <th className="px-4 py-3">Service Provider</th>
            <th className="px-4 py-3 text-right">Visit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => {
            const color = getCategoryColor(s.primaryCategory);
            return (
              <tr
                key={s.id}
                className="border-b border-border/70 last:border-0 hover:bg-cream/60"
              >
                <td className="max-w-xs px-4 py-3 align-top">
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: color }}
                      title={s.primaryCategory ?? undefined}
                    >
                      <CategoryIcon
                        category={s.primaryCategory}
                        className="h-3.5 w-3.5"
                        color="#ffffff"
                      />
                    </span>
                    <div>
                      <div className="font-medium text-ink">{s.name}</div>
                      <div className="mt-1">
                        <VerificationChip
                          status={s.verificationStatus}
                          source={s.verificationSource}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-ink">
                  {s.country ?? "—"}
                </td>
                <td className="px-4 py-3 align-top text-muted">
                  {s.subCategories.length ? (
                    <SubCategoryTerms items={s.subCategories} />
                  ) : (
                    s.naturesOfService.join(", ") || "—"
                  )}
                </td>
                <td className="px-4 py-3 align-top text-ink">
                  {s.serviceProviderName ?? "—"}
                </td>
                <td className="px-4 py-3 text-right align-top">
                  {providerLink(s.serviceProviderName) ? (
                    <VisitProviderButton
                      serviceProviderName={s.serviceProviderName}
                      size="sm"
                    />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
