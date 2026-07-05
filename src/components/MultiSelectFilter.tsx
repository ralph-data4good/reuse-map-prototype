"use client";

import { ChevronDown, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

export type FilterOption = {
  value: string;
  label: string;
  description?: string; // shown as a hover tooltip when present
  color?: string; // small color dot (categories)
};

export function MultiSelectFilter({
  label,
  placeholder,
  options,
  selected,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
    else onChange([...selected, value]);
  };

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-ink">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-btn border border-border bg-white px-3 py-2 text-left text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30",
              selected.length === 0 ? "text-muted" : "text-ink"
            )}
          >
            <span className="truncate">{summary}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="max-h-72 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-cream"
            >
              <Checkbox
                id={`${label}-${opt.value}`}
                checked={selected.includes(opt.value)}
                onCheckedChange={() => toggle(opt.value)}
              />
              {opt.color ? (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: opt.color }}
                >
                  <CategoryIcon
                    category={opt.label}
                    className="h-3 w-3"
                    color="#ffffff"
                  />
                </span>
              ) : null}
              <label
                htmlFor={`${label}-${opt.value}`}
                className="flex-1 cursor-pointer text-sm text-ink"
              >
                {opt.label}
              </label>
              {opt.description ? (
                <InfoTooltip
                  content={opt.description}
                  ariaLabel={`${opt.label} definition`}
                  side="right"
                  className="text-muted hover:text-navy"
                >
                  <Info className="h-3.5 w-3.5" />
                </InfoTooltip>
              ) : null}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
