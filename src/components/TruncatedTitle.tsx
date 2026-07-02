"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Long Solution titles get a "see more" toggle. Threshold in characters.
export function TruncatedTitle({
  text,
  limit = 60,
  className,
  as: Tag = "h3",
}: {
  text: string;
  limit?: number;
  className?: string;
  as?: "h2" | "h3" | "h4" | "span";
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > limit;
  const shown = expanded || !isLong ? text : text.slice(0, limit).trimEnd() + "…";

  return (
    <Tag className={cn(className)}>
      {shown}
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="ml-1 align-baseline text-xs font-medium text-navy underline underline-offset-2 hover:text-navy-hover"
        >
          {expanded ? "see less" : "see more"}
        </button>
      )}
    </Tag>
  );
}
