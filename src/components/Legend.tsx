import { REUSE_CATEGORY_LEGEND } from "@/lib/reuse-categories";

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
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: row.color }}
            />
            {row.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
