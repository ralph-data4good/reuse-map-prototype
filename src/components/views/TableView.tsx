"use client";

import { Button } from "@/components/ui/button";
import { VerificationChip } from "@/components/VerificationChip";
import { SubCategoryTerms } from "@/components/SubCategoryTerms";
import type { ReuseSolution } from "@/lib/types";

export function TableView({ items }: { items: ReuseSolution[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-white p-10 text-center text-muted">
        No reuse solutions match your filters.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category / Type</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Sub-Category</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr
              key={s.id}
              className="border-b border-border/70 last:border-0 hover:bg-cream/60"
            >
              <td className="max-w-xs px-4 py-3 align-top">
                <div className="font-medium text-ink">{s.name}</div>
                <div className="mt-1">
                  <VerificationChip
                    status={s.verificationStatus}
                    source={s.verificationSource}
                  />
                </div>
              </td>
              <td className="px-4 py-3 align-top text-ink">
                {s.primaryCategory ?? "—"}
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
              <td className="px-4 py-3 text-right align-top">
                <Button variant="navy" size="sm">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
