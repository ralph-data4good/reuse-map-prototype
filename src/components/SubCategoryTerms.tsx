"use client";

import { cn } from "@/lib/utils";
import { getSubCategoryDefinition } from "@/lib/tooltips";

export function SubCategoryTerms({
  items,
  activeSubcategories = [],
  onSelect,
  className,
}: {
  items: string[];
  activeSubcategories?: string[];
  onSelect?: (subcategory: string) => void;
  className?: string;
}) {
  if (!items.length) return null;

  if (!onSelect) {
    return (
      <span className={cn("text-muted", className)}>
        {items.join(", ")}
      </span>
    );
  }

  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((sub) => {
        const active = activeSubcategories.includes(sub);
        return (
          <button
            key={sub}
            type="button"
            title={getSubCategoryDefinition(sub)}
            aria-pressed={active}
            aria-label={`Filter by ${sub}`}
            onClick={() => onSelect(sub)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] font-medium leading-snug transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              active
                ? "border-navy bg-navy text-white"
                : "border-border bg-cream text-muted hover:border-navy/30 hover:text-ink"
            )}
          >
            {sub}
          </button>
        );
      })}
    </span>
  );
}
