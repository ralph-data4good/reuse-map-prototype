"use client";

import { forwardRef } from "react";
import { Map, LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "map" | "gallery" | "table";

const OPTIONS: { value: ViewMode; label: string; icon: typeof Map }[] = [
  { value: "map", label: "Map", icon: Map },
  { value: "gallery", label: "Gallery", icon: LayoutGrid },
  { value: "table", label: "Table", icon: Table2 },
];

export const ViewToggle = forwardRef<
  HTMLDivElement,
  {
    value: ViewMode;
    onChange: (v: ViewMode) => void;
    id?: string;
  }
>(function ViewToggle({ value, onChange, id = "view-toggle" }, ref) {
  return (
    <div
      ref={ref}
      id={id}
      role="radiogroup"
      aria-label="Results view"
      className="inline-flex items-center gap-1 rounded-full bg-panel p-1"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            id={`${id}-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${opt.label} view`}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold motion-safe:transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50 focus-visible:ring-offset-2",
              active
                ? "bg-navy text-white shadow-sm"
                : "text-navy/70 hover:text-navy"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});
