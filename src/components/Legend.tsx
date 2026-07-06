"use client";

import { ChevronDown } from "lucide-react";
import {
  REUSE_CATEGORY_LEGEND,
  isCategoryVisible,
} from "@/lib/reuse-categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

export function Legend({
  selectedCategories,
  onToggleCategory,
  onShowAll,
  collapsed = false,
  onCollapsedChange,
  className,
}: {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onShowAll: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}) {
  const totalCategories = REUSE_CATEGORY_LEGEND.length;
  const anyCategoryFiltered = selectedCategories.length > 0;
  const visibleCount = anyCategoryFiltered
    ? selectedCategories.length
    : totalCategories;

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-white/95 shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
        <button
          type="button"
          onClick={() => onCollapsedChange?.(!collapsed)}
          aria-expanded={!collapsed}
          aria-controls="map-legend-list"
          className={cn(
            "flex flex-1 items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-muted",
            onCollapsedChange &&
              "rounded-md py-0.5 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          )}
        >
          <span>Pin color by category</span>
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none tracking-normal",
              anyCategoryFiltered
                ? "bg-cream text-navy"
                : "bg-navy text-white"
            )}
          >
            {anyCategoryFiltered ? `${visibleCount} of ${totalCategories}` : "All"}
          </span>
          {onCollapsedChange && (
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 shrink-0 transition-transform",
                collapsed && "-rotate-90"
              )}
            />
          )}
        </button>
        {anyCategoryFiltered && !collapsed && (
          <button
            type="button"
            onClick={onShowAll}
            className="shrink-0 text-xs font-medium text-brand hover:underline"
          >
            Show all
          </button>
        )}
      </div>

      {!collapsed && (
        <ul id="map-legend-list" className="space-y-1.5 p-3">
          {REUSE_CATEGORY_LEGEND.map((row) => {
            const active = isCategoryVisible(row.category, selectedCategories);
            return (
              <li key={row.category}>
                <button
                  type="button"
                  onClick={() => onToggleCategory(row.category)}
                  aria-pressed={active}
                  title={
                    active
                      ? `Hide ${row.category} pins`
                      : `Show ${row.category} pins`
                  }
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-1 py-1 text-left text-xs text-ink transition-opacity",
                    "hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                    !active && "opacity-40"
                  )}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: row.color }}
                  >
                    <CategoryIcon
                      category={row.category}
                      className="h-3.5 w-3.5"
                      color="#ffffff"
                      strokeScale={1.25}
                    />
                  </span>
                  <span className="leading-snug">{row.category}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
