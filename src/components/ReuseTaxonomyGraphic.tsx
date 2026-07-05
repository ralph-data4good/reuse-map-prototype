import { Fragment } from "react";
import { CategoryIconBadge } from "@/components/CategoryIcon";
import { getCategoryColor } from "@/lib/reuse-categories";
import { getCategoryDefinition } from "@/lib/tooltips";
import { cn } from "@/lib/utils";

// Visual of the Reuse Classification Matrix that anchors the data model: the five
// canonical categories emerge from the interaction of Asset Type (rows) and
// Ownership Structure (columns). Category cells are filled with their live
// framework colors so the categories stay the highlight; headers/axes stay neutral.
const OWNERSHIP = ["System-Owned", "User-Owned", "Transfer of Ownership"] as const;

// Rows keyed by asset type. `null` marks a combination with no defined category.
const MATRIX: { asset: string; cells: (string | null)[] }[] = [
  { asset: "Packaging", cells: ["Packaging Reuse", "Refill", null] },
  {
    asset: "Product",
    cells: [
      "Product Reuse",
      "Use of Reusable Product Alternatives",
      "Transfer-based Reuse",
    ],
  },
];

export function ReuseTaxonomyGraphic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-navy/70 bg-white p-4 shadow-card sm:p-5",
        className
      )}
    >
      <p className="text-center font-heading text-sm font-bold uppercase tracking-[0.12em] text-navy">
        Reuse Classification Matrix
      </p>
      <p className="mb-3 mt-1 text-center text-[11px] leading-snug text-muted">
        Classifying reuse solutions by asset type and ownership model.
      </p>

      <div
        className="grid gap-1.5 text-[10px] sm:text-[11px]"
        style={{ gridTemplateColumns: "minmax(2.25rem,auto) repeat(3,minmax(0,1fr))" }}
      >
        {/* Header row: corner + ownership columns */}
        <div className="flex items-end justify-center pb-0.5 text-center text-[9px] font-semibold uppercase leading-none tracking-wide text-muted">
          Own. →
        </div>
        {OWNERSHIP.map((h) => (
          <div
            key={h}
            className="flex flex-col items-center justify-center gap-1 rounded-md bg-navy/5 px-1 py-1 text-center font-semibold uppercase leading-tight tracking-wide text-navy"
          >
            <CategoryIconBadge
              category={h}
              size="sm"
              iconColor="#1E3A4C"
            />
            <span className="text-[8px] sm:text-[9px]">{h}</span>
          </div>
        ))}

        {/* Asset-type rows */}
        {MATRIX.map((row) => (
          <Fragment key={row.asset}>
            <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-navy/5 px-1 py-1 text-center font-semibold uppercase leading-tight tracking-wide text-navy">
              <CategoryIconBadge
                category={row.asset}
                size="sm"
                iconColor="#1E3A4C"
              />
              <span className="text-[8px] sm:text-[9px]">{row.asset}</span>
            </div>
            {row.cells.map((cat, i) =>
              cat ? (
                <div
                  key={cat}
                  title={getCategoryDefinition(cat)}
                  className="flex min-h-[3.75rem] flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-1.5 text-center font-semibold leading-tight text-white"
                  style={{ backgroundColor: getCategoryColor(cat) }}
                >
                  <CategoryIconBadge category={cat} size="md" />
                  <span className="text-[9px] leading-tight sm:text-[10px]">{cat}</span>
                </div>
              ) : (
                <div
                  key={`${row.asset}-empty-${i}`}
                  className="flex min-h-[3rem] items-center justify-center rounded-md bg-navy/[0.03] text-base text-muted/50"
                  aria-hidden="true"
                >
                  –
                </div>
              )
            )}
          </Fragment>
        ))}
      </div>

      <p className="mt-3 border-t border-border pt-3 text-[11px] leading-snug text-muted">
        This framework draws from GAIA Asia Pacific&rsquo;s work on Reuse Taxonomy
        with members and allies across the region.
      </p>
    </div>
  );
}
