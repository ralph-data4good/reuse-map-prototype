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
  | "Second-hand Reuse";

export interface ReuseCategoryConfig {
  /** Hex color used for pins and the legend swatch. */
  color: string;
  /** Sub-categories from the Reuse Framework. */
  subCategories: string[];
}

export const REUSE_CATEGORIES: Record<ReuseCategory, ReuseCategoryConfig> = {
  "Packaging Reuse": {
    color: "#1E5F74",
    subCategories: [
      "Pre-filled Reuse Systems",
      "Onsite Reuse Systems",
      "Takeaway & Delivery Reuse Systems",
      "Serveware Reuse System",
      "Secondary Packaging Reuse Systems",
    ],
  },
  "Refill": {
    color: "#C9A24B",
    subCategories: ["Onsite Refill System", "Refill at Home System"],
  },
  "Product Reuse": {
    color: "#4E9F3D",
    subCategories: ["Product Reuse System"],
  },
  "Use of Reusable Product Alternatives": {
    color: "#C56B3E",
    subCategories: [
      "Reusable Product Alternatives (Self-Maintained)",
      "Reusable Product Alternatives (Service-Maintained)",
    ],
  },
  "Second-hand Reuse": {
    color: "#6B4E9F",
    subCategories: ["Second-hand Reuse Systems"],
  },
};

/** Fallback color for rows with a missing or unrecognized category. */
export const DEFAULT_CATEGORY_COLOR = "#6B7280";

/** Ordered category names (use for the filter dropdown + legend order). */
export const REUSE_CATEGORY_NAMES = Object.keys(
  REUSE_CATEGORIES
) as ReuseCategory[];

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
