import { REUSE_CATEGORY_LEGEND } from "@/lib/reuse-categories";
import { CategoryIcon } from "@/components/CategoryIcon";

// Small legend mapping pin color to Reuse Framework Category.
// Rows come from the single source of truth (reuse-categories.ts).
export function Legend() {
  return (
    <div className="rounded-card border border-border bg-white/95 p-3 shadow-card">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Pin color by category
      </div>
      <ul className="space-y-1.5">
        {REUSE_CATEGORY_LEGEND.map((row) => (
          <li
            key={row.category}
            className="flex items-center gap-2 text-xs text-ink"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: row.color }}
            >
              <CategoryIcon category={row.category} className="h-3 w-3" color="#ffffff" />
            </span>
            {row.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
