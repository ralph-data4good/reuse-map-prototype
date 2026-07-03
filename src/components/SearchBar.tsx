"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/taxonomy";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-card bg-panel p-4 sm:p-5">
      <label className="mb-2 block text-sm font-semibold text-ink">
        {COPY.searchLabel}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={COPY.searchPlaceholder}
            className="w-full rounded-btn border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30"
          />
        </div>
        <Button variant="navy" size="lg" className="sm:w-40">
          Search
        </Button>
      </div>
    </div>
  );
}
