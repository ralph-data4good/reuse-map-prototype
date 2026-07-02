"use client";

import { Fragment } from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { getSubCategoryDefinition, getStableKey } from "@/lib/tooltips";
import { cn } from "@/lib/utils";

// Renders a comma-separated list of sub-categories, each an accessible tooltip
// term (hover / focus / tap) sourced from the canonical CSV definitions.
export function SubCategoryTerms({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <span className={className}>
      {items.map((sub, i) => (
        <Fragment key={sub}>
          {i > 0 && <span aria-hidden="true">, </span>}
          <InfoTooltip
            content={getSubCategoryDefinition(sub)}
            ariaLabel={`${sub} definition`}
            dataKey={getStableKey(sub)}
            className={cn(
              "align-baseline underline decoration-dotted decoration-muted underline-offset-2",
              "hover:decoration-navy"
            )}
          >
            <span>{sub}</span>
          </InfoTooltip>
        </Fragment>
      ))}
    </span>
  );
}
