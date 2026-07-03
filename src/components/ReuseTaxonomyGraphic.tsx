import { REUSE_CATEGORY_NAMES, getCategoryColor } from "@/lib/reuse-categories";
import { getCategoryDefinition } from "@/lib/tooltips";
import { cn } from "@/lib/utils";

// Visual of the Reuse Framework taxonomy that anchors the data model: the five
// canonical categories as color-coded blocks (colors + names from the single
// source of truth). Used in the hero to give a compact, less text-heavy entry
// point, especially on mobile.
export function ReuseTaxonomyGraphic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-navy/70 bg-white p-4 shadow-card sm:p-5",
        className
      )}
    >
      <p className="mb-3 text-center font-heading text-sm font-bold uppercase tracking-[0.15em] text-navy">
        Reuse Framework
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {REUSE_CATEGORY_NAMES.map((name) => (
          <li
            key={name}
            title={getCategoryDefinition(name)}
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl px-3 py-2 text-center text-xs font-semibold leading-tight text-white sm:text-sm"
            style={{ backgroundColor: getCategoryColor(name) }}
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-border pt-3 text-[11px] leading-snug text-muted">
        This reuse framework is based on an ongoing reuse taxonomy effort of GAIA
        Asia Pacific and its allied members.
      </p>
    </div>
  );
}
