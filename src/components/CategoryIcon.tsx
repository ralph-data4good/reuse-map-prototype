import { CATEGORY_ICON_SVGS } from "@/lib/category-icon-svgs.generated";
import { getCategoryColor } from "@/lib/reuse-categories";
import { cn } from "@/lib/utils";

function getIconData(label?: string | null) {
  if (!label) return null;
  return CATEGORY_ICON_SVGS[label] ?? null;
}

/** Render a reuse category or matrix axis icon from the bundled SVG set. */
export function CategoryIcon({
  category,
  className,
  color = "currentColor",
  strokeScale = 1,
}: {
  category?: string | null;
  className?: string;
  color?: string;
  /** Multiply native stroke width — useful at small render sizes. */
  strokeScale?: number;
}) {
  const data = getIconData(category);
  if (!data) {
    return (
      <span
        className={cn("inline-block rounded-full bg-muted", className)}
        aria-hidden
      />
    );
  }
  const strokeWidth = parseFloat(data.strokeWidth) * strokeScale;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <g dangerouslySetInnerHTML={{ __html: data.inner }} />
    </svg>
  );
}

type MarkupOptions = {
  /** Multiply the SVG's native stroke width (helps legibility at small sizes). */
  strokeScale?: number;
};

/** Inline SVG string for map markers (raw HTML). */
export function categoryIconMarkup(
  category?: string | null,
  color = "#ffffff",
  size = 12,
  options: MarkupOptions = {}
): string {
  const data = getIconData(category);
  if (!data) return "";
  const strokeWidth = (
    parseFloat(data.strokeWidth) * (options.strokeScale ?? 1)
  ).toFixed(2);
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${data.inner}</svg>`;
}

/** Icon on a white rounded square — reads clearly on colored backgrounds. */
export function CategoryIconBadge({
  category,
  className,
  size = "md",
  iconColor,
}: {
  category?: string | null;
  className?: string;
  size?: "sm" | "md";
  iconColor?: string;
}) {
  const badgeSize = size === "sm" ? "h-6 w-6 rounded-md" : "h-7 w-7 rounded-md";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const tint = iconColor ?? getCategoryColor(category);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-white shadow-sm",
        badgeSize,
        className
      )}
    >
      <CategoryIcon
        category={category}
        className={iconSize}
        color={tint}
        strokeScale={1.4}
      />
    </span>
  );
}
