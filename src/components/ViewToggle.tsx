"use client";

import { Map, LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "map" | "gallery" | "table";

const OPTIONS: { value: ViewMode; label: string; icon: typeof Map }[] = [
  { value: "map", label: "Map", icon: Map },
  { value: "gallery", label: "Gallery", icon: LayoutGrid },
  { value: "table", label: "Table", icon: Table2 },
];

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-panel p-1">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              active
                ? "bg-navy text-white shadow-sm"
                : "text-navy/70 hover:text-navy"
            )}
          >
            <Icon className="h-4 w-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
