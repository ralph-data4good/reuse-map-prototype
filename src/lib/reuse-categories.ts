/**
 * reuse-categories.ts
 * Single source of truth for the Reuse Framework taxonomy.
 *
 * Drives:
 *   1. Pin color (custom HTML/SVG markers)  -> getCategoryColor()
 *   2. Native Mapbox layer paint            -> buildCategoryColorExpression()
 *   3. Legend                               -> REUSE_CATEGORY_LEGEND
 *   4. "Reuse Framework Category" filter     -> REUSE_CATEGORY_NAMES
 *   5. Optional sub-category filter         -> REUSE_SUBCATEGORIES
 *
 * Colors match the current live map. Change a color once here and every
 * consumer (pins, legend, filter, badges) updates.
 */

export type ReuseCategory =
  | "Packaging Reuse"
  | "Refill"
  | "Product Reuse"
  | "Use of Reusable Product Alternatives"
  | "Transfer-based Reuse";

export interface ReuseCategoryConfig {
  /** Hex color used for pins and the legend swatch. */
  color: string;
  /** Optional badge label/icon color when auto-contrast picks the wrong tone. */
  chipTextColor?: string;
  /** Sub-categories from the Reuse Framework. */
  subCategories: string[];
}

export const REUSE_CATEGORIES: Record<ReuseCategory, ReuseCategoryConfig> = {
  "Packaging Reuse": {
    color: "#355E70",
    subCategories: [
      "Pre-filled Reuse Systems",
      "Onsite Reuse Systems",
      "Takeaway & Delivery Reuse Systems",
      "Serveware Reuse System",
      "Secondary Packaging Reuse Systems",
    ],
  },
  Refill: {
    color: "#C1A158",
    chipTextColor: "#FFFFFF",
    subCategories: ["Onsite Refill System", "Refill at Home System"],
  },
  "Product Reuse": {
    color: "#639B4A",
    subCategories: ["Product Reuse System"],
  },
  "Use of Reusable Product Alternatives": {
    color: "#B76F47",
    subCategories: [
      "Reusable Product Alternatives (Self-Maintained)",
      "Reusable Product Alternatives (Service-Maintained)",
    ],
  },
  "Transfer-based Reuse": {
    color: "#665096",
    subCategories: ["Transfer-based Reuse Systems"],
  },
};

/** Fallback color for rows with a missing or unrecognized category. */
export const DEFAULT_CATEGORY_COLOR = "#6B7280";

/** Ordered category names (use for the filter dropdown + legend order). */
export const REUSE_CATEGORY_NAMES = Object.keys(
  REUSE_CATEGORIES
) as ReuseCategory[];

/** URL-safe slugs aligned with directory_types.slug in Supabase. */
export const CATEGORY_SLUG_BY_NAME: Record<ReuseCategory, string> = {
  "Packaging Reuse": "packaging-reuse",
  Refill: "refill",
  "Product Reuse": "product-reuse",
  "Use of Reusable Product Alternatives": "reusable-product-alternatives",
  "Transfer-based Reuse": "transfer-based-reuse",
};

export const CATEGORY_NAME_BY_SLUG: Record<string, ReuseCategory> =
  Object.fromEntries(
    REUSE_CATEGORY_NAMES.map((name) => [CATEGORY_SLUG_BY_NAME[name], name])
  ) as Record<string, ReuseCategory>;

export function getCategorySlug(name?: string | null): string | null {
  if (!name) return null;
  return CATEGORY_SLUG_BY_NAME[name as ReuseCategory] ?? null;
}

export function resolveCategoryName(token: string): ReuseCategory | null {
  const normalized = token.trim().toLowerCase().replace(/_/g, "-");
  return CATEGORY_NAME_BY_SLUG[normalized] ?? null;
}

/** Toggle one category in the inclusive multi-select (empty = all visible). */
export function toggleCategoryFilter(
  category: string,
  selected: string[]
): string[] {
  const visible =
    selected.length === 0
      ? [...REUSE_CATEGORY_NAMES]
      : selected.filter((c) => REUSE_CATEGORY_NAMES.includes(c as ReuseCategory));
  const isVisible = visible.includes(category as ReuseCategory);
  const next = isVisible
    ? visible.filter((c) => c !== category)
    : [...visible, category];
  if (next.length === REUSE_CATEGORY_NAMES.length) return [];
  return next;
}

export function isCategoryVisible(
  category: string,
  selected: string[]
): boolean {
  if (selected.length === 0) return true;
  return selected.includes(category);
}

/**
 * 1. Custom HTML / SVG markers.
 * Look up a color when you build each marker element.
 */
export function getCategoryColor(category?: string | null): string {
  return (
    REUSE_CATEGORIES[category as ReuseCategory]?.color ??
    DEFAULT_CATEGORY_COLOR
  );
}

const CHIP_LIGHT = "#FFFFFF";
const CHIP_DARK = "#1A1A1A";
const AA_NORMAL_TEXT = 4.5;

function srgbChannel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbChannel(r) +
    0.7152 * srgbChannel(g) +
    0.0722 * srgbChannel(b)
  );
}

function contrastRatio(foreground: string, background: string): number {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Chip foreground/background tuned for WCAG AA contrast on category colors. */
export function getCategoryChipColors(category?: string | null): {
  backgroundColor: string;
  color: string;
  iconColor: string;
} {
  const backgroundColor = getCategoryColor(category);
  const config =
    category && category in REUSE_CATEGORIES
      ? REUSE_CATEGORIES[category as ReuseCategory]
      : null;
  if (config?.chipTextColor) {
    return {
      backgroundColor,
      color: config.chipTextColor,
      iconColor: config.chipTextColor,
    };
  }
  const whiteOk = contrastRatio(CHIP_LIGHT, backgroundColor) >= AA_NORMAL_TEXT;
  const color = whiteOk ? CHIP_LIGHT : CHIP_DARK;
  return { backgroundColor, color, iconColor: color };
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/**
 * Bottom-anchored gradient in a category's color, fading up to transparent.
 * Overlaid on solution photos so the category badge stays legible and the card
 * reads as belonging to its reuse category. Works in React style objects and in
 * the raw-HTML map popup.
 */
export function categoryOverlayGradient(category?: string | null): string {
  const [r, g, b] = hexToRgb(getCategoryColor(category));
  return `linear-gradient(to top, rgba(${r},${g},${b},0.92) 0%, rgba(${r},${g},${b},0.55) 28%, rgba(${r},${g},${b},0) 62%)`;
}

/**
 * 2. Native Mapbox layers (circle-color, icon-color, etc.).
 * Returns a data-driven 'match' expression keyed off a feature property.
 * Cast to mapboxgl.ExpressionSpecification at the call site if you use types.
 *
 *   map.addLayer({
 *     id: "reuse-pins",
 *     type: "circle",
 *     source: "reuse",
 *     paint: { "circle-color": buildCategoryColorExpression("category") },
 *   });
 */
export function buildCategoryColorExpression(
  propertyName = "category"
): (string | string[])[] {
  const expr: (string | string[])[] = ["match", ["get", propertyName]];
  for (const name of REUSE_CATEGORY_NAMES) {
    expr.push(name, REUSE_CATEGORIES[name].color);
  }
  expr.push(DEFAULT_CATEGORY_COLOR); // fallback
  return expr;
}

/** 3. Legend rows, in display order. */
export const REUSE_CATEGORY_LEGEND = REUSE_CATEGORY_NAMES.map((name) => ({
  category: name,
  color: REUSE_CATEGORIES[name].color,
}));

/** 4. Flat sub-category list, each tagged with its parent (for a 2nd filter). */
export const REUSE_SUBCATEGORIES = REUSE_CATEGORY_NAMES.flatMap((name) =>
  REUSE_CATEGORIES[name].subCategories.map((subCategory) => ({
    category: name,
    subCategory,
  }))
);
