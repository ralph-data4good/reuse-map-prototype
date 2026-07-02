"use client";

import { Button } from "@/components/ui/button";

const PAGE_SIZES = [10, 20, 50];

// ZWA-style results header: "Showing X of Y", page indicator, rows-per-page,
// Prev/Next. Pagination applies to Gallery and Table (Map shows all pins).
export function ResultsBar({
  total,
  shown,
  page,
  pageSize,
  paginated,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  shown: number;
  page: number;
  pageSize: number;
  paginated: boolean;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-heading text-xl font-bold text-ink">
          Showing {shown} of {total} results
        </h2>
        {paginated && (
          <p className="mt-0.5 text-sm text-muted">
            Page {page} of {totalPages} · {total} results
          </p>
        )}
      </div>

      {paginated && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">
              Rows per page
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-btn border border-border bg-white px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
