import { CATEGORY_ICON_SVGS } from "@/lib/category-icon-svgs.generated";
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
}: {
  category?: string | null;
  className?: string;
  color?: string;
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
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={data.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <g dangerouslySetInnerHTML={{ __html: data.inner }} />
    </svg>
  );
}

/** Inline SVG string for map markers (raw HTML). */
export function categoryIconMarkup(
  category?: string | null,
  color = "#ffffff",
  size = 12
): string {
  const data = getIconData(category);
  if (!data) return "";
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${color}" stroke-width="${data.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${data.inner}</svg>`;
}
