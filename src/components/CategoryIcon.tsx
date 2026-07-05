import type { ComponentType } from "react";
import type { ReuseCategory } from "@/lib/reuse-categories";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
  /** Stroke/fill color. Defaults to currentColor. */
  color?: string;
};

// Simplified line-art icons inspired by the Reuse Classification Matrix.
// Each maps 1:1 to a Reuse Framework category.

function PackagingReuseIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4.5a3.5 3.5 0 0 1 3.5 3.5v1.5H8.5V8A3.5 3.5 0 0 1 12 4.5Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M9 9.5h6v8a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 17.5v-8Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M7 12.5a5 5 0 0 1 10 0"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M16.5 11.5l1 .8M7.5 11.5l-1 .8"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefillIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 8.5v9a1.5 1.5 0 0 0 1.5 1.5H9V8.5H6Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M7.5 6.5v2M8.5 6h-2" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M14 5.5h3.5v2.5l-1.5 1.5v8.5H14V5.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11 10.5c.5 1 1.5 1.5 2.5 1.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="11.5" cy="13" r="0.6" fill={color} />
      <circle cx="10.5" cy="14.5" r="0.5" fill={color} />
    </svg>
  );
}

function ProductReuseIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="6.5" cy="12" r="1.8" stroke={color} strokeWidth="1.3" />
      <circle cx="17.5" cy="12" r="1.8" stroke={color} strokeWidth="1.3" />
      <rect
        x="9"
        y="8.5"
        width="6"
        height="7"
        rx="1"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10.5" r="1.2" stroke={color} strokeWidth="1.2" />
      <path
        d="M8.5 12a3.5 3.5 0 0 1 7 0"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReusableAlternativesIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5.5 9.5 8 7l2 1.5 1.5-2 2 1.5v5.5H5.5V9.5Z"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 7.5h2v7h-2V7.5Z"
        stroke={color}
        strokeWidth="1.3"
      />
      <path
        d="M17 8.5h2.5v1.5H17V8.5Z M17 11h2.5v1.5H17V11Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 16.5c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransferBasedReuseIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="6.5" cy="12" r="1.8" stroke={color} strokeWidth="1.3" />
      <circle cx="17.5" cy="12" r="1.8" stroke={color} strokeWidth="1.3" />
      <path
        d="M10 8.5h4l1 2-1 2h-4l-1-2 1-2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12a3.5 3.5 0 0 1 7 0"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS: Record<ReuseCategory, ComponentType<IconProps>> = {
  "Packaging Reuse": PackagingReuseIcon,
  Refill: RefillIcon,
  "Product Reuse": ProductReuseIcon,
  "Use of Reusable Product Alternatives": ReusableAlternativesIcon,
  "Transfer-based Reuse": TransferBasedReuseIcon,
};

/** Render the simplified icon for a reuse category. */
export function CategoryIcon({
  category,
  className,
  color,
}: {
  category?: string | null;
  className?: string;
  color?: string;
}) {
  const Icon = category ? ICONS[category as ReuseCategory] : null;
  if (!Icon) {
    return (
      <span
        className={cn("inline-block rounded-full bg-muted", className)}
        aria-hidden
      />
    );
  }
  return <Icon className={className} color={color} />;
}

/** Inline SVG string for map markers (raw HTML, white icon on colored pin). */
export function categoryIconMarkup(
  category?: string | null,
  color = "#ffffff"
): string {
  const icons: Record<ReuseCategory, string> = {
    "Packaging Reuse": `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5a3 3 0 0 1 3 3v1H9V8a3 3 0 0 1 3-3Z" stroke="${color}" stroke-width="1.6"/><path d="M9.5 9h5v7.5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V9Z" stroke="${color}" stroke-width="1.6"/><path d="M7.5 12a4.5 4.5 0 0 1 9 0" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    Refill: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 9v8.5H9V9H6.5Z" stroke="${color}" stroke-width="1.6"/><path d="M14 6h3v2.5l-1.5 1.5v7H14V6Z" stroke="${color}" stroke-width="1.6"/><circle cx="11" cy="12.5" r=".7" fill="${color}"/></svg>`,
    "Product Reuse": `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="12" r="1.6" stroke="${color}" stroke-width="1.4"/><circle cx="17" cy="12" r="1.6" stroke="${color}" stroke-width="1.4"/><rect x="9.5" y="9" width="5" height="6" rx=".8" stroke="${color}" stroke-width="1.6"/><path d="M8.5 12a3.5 3.5 0 0 1 7 0" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    "Use of Reusable Product Alternatives": `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10l2-2 1.5 1 1.5-1.5 1.5 1v4.5H6V10Z" stroke="${color}" stroke-width="1.4"/><path d="M14 8h2v6h-2V8Z" stroke="${color}" stroke-width="1.4"/><path d="M16.5 9h2v1h-2V9Z" stroke="${color}" stroke-width="1.2"/></svg>`,
    "Transfer-based Reuse": `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="12" r="1.6" stroke="${color}" stroke-width="1.4"/><circle cx="17" cy="12" r="1.6" stroke="${color}" stroke-width="1.4"/><path d="M10.5 9h3l.8 1.5-.8 1.5h-3l-.8-1.5.8-1.5Z" stroke="${color}" stroke-width="1.6"/><path d="M8.5 12a3.5 3.5 0 0 1 7 0" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  };
  return icons[category as ReuseCategory] ?? "";
}
