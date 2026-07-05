// ============================================================================
// Reuse taxonomy tooltip definitions.
// Canonical content source: src/data/reuse_microsite_tooltip_definitions.csv
// This module is the typed, importable projection of that CSV. If the CSV
// changes, update the records below to match (keep `cursorKey` / `id` stable).
//
// source_* and notes_for_editor are retained internally but NOT surfaced in the
// UI for now. UI code should only read `definition` via the helpers.
// ============================================================================

export type TooltipLevel = "main" | "sub-category";

export type TooltipRecord = {
  /** Stable row id from the CSV. */
  id: string;
  /** Stable data key (CSV cursor_key). Use this as the element key. */
  cursorKey: string;
  level: TooltipLevel;
  /** Reuse Framework Category (exact label). */
  category: string;
  /** Sub-category (exact label) or null for main categories. */
  subCategory: string | null;
  /** Exact display label. */
  label: string;
  /** Visible tooltip text. */
  definition: string;
  // --- internal only (not shown in UI) ---
  sourceAlignment: string;
  sourceBasis: string;
  sourceTitle: string;
  sourceUrl: string;
  notesForEditor: string;
};

export const TOOLTIP_FALLBACK = "Definition coming soon.";

// Transcribed from the CSV. Labels preserved exactly.
export const TOOLTIP_RECORDS: TooltipRecord[] = [
  {
    id: "main-packaging-reuse",
    cursorKey: "packagingReuse",
    level: "main",
    category: "Packaging Reuse",
    subCategory: null,
    label: "Packaging Reuse",
    definition:
      "Packaging that is used again and again. It is returned, cleaned, refilled, and sent back out instead of being thrown away.",
    sourceAlignment: "direct/adapted",
    sourceBasis:
      "GAIA describes packaging reuse as systems where packaging is used multiple times for the same purpose, supported by cleaning, logistics, collection, redistribution, and partnerships.",
    sourceTitle: "GAIA | Unpacking Reuse in Asia",
    sourceUrl: "https://plasticsmartcities.org/unpacking-reuse-in-asia/",
    notesForEditor: "Use for the main category tooltip.",
  },
  {
    id: "main-refill",
    cursorKey: "refill",
    level: "main",
    category: "Refill",
    subCategory: null,
    label: "Refill",
    definition:
      "You refill your own or a borrowed container, either at a shop or at home, so you avoid buying new packaging each time.",
    sourceAlignment: "direct/adapted",
    sourceBasis:
      "GAIA/ARC framing distinguishes refill from return: consumers refill reusable packaging and usually handle washing, using consumer-owned or retailer-loaned containers.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor: "Use for the main category tooltip.",
  },
  {
    id: "main-product-reuse",
    cursorKey: "productReuse",
    level: "main",
    category: "Product Reuse",
    subCategory: null,
    label: "Product Reuse",
    definition:
      "Keeping everyday products in use for longer through repair, renting, sharing, refurbishing, or reselling them.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA zero waste framing that prioritizes waste reduction, reuse, repair, recycling, and composting, and from broader product reuse language.",
    sourceTitle: "ZERO WASTE AND ECONOMIC RECOVERY",
    sourceUrl:
      "https://www.no-burn.org/wp-content/uploads/Jobs-Report-ENGLISH-1.pdf",
    notesForEditor:
      "Microsite taxonomy adaptation, not a direct named category in the cited packaging reuse report.",
  },
  {
    id: "main-reusable-product-alternatives",
    cursorKey: "reusableProductAlternatives",
    level: "main",
    category: "Use of Reusable Product Alternatives",
    subCategory: null,
    label: "Use of Reusable Product Alternatives",
    definition:
      "Durable items that replace throwaway ones and are made to be washed and used many times, like a reusable cup instead of a disposable one.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA examples on reusable tableware, containers, and zero waste practices that prioritize reuse and repair over disposal.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use when the taxonomy focuses on alternatives to disposable products, not packaging formats alone.",
  },
  {
    id: "main-transfer-based-reuse",
    cursorKey: "transferBasedReuse",
    level: "main",
    category: "Transfer-based Reuse",
    subCategory: null,
    label: "Transfer-based Reuse",
    definition:
      "Passing usable items on to someone else through lending, donating, swapping, reselling, or take-back schemes.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA zero waste framing on reuse, repair, and recovery of products, packaging, and materials.",
    sourceTitle: "Beyond Recycling: On the Road to Zero Waste",
    sourceUrl:
      "https://www.no-burn.org/beyond-recycling-on-the-road-to-zero-waste/",
    notesForEditor:
      "Microsite taxonomy adaptation; best used for exchange or ownership-transfer models.",
  },
  {
    id: "sub-pre-filled-reuse-systems",
    cursorKey: "preFilledReuseSystems",
    level: "sub-category",
    category: "Packaging Reuse",
    subCategory: "Pre-filled Reuse Systems",
    label: "Pre-filled Reuse Systems",
    definition:
      "Products come already filled in reusable packaging. Once empty, the packaging is returned, cleaned, and refilled for the next customer.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA return-system framing where service providers collect, wash, redistribute, and refill packaging for re-consumption.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Equivalent to return/pre-filled packaging logic; avoid presenting as consumer refill.",
  },
  {
    id: "sub-onsite-reuse-systems",
    cursorKey: "onsiteReuseSystems",
    level: "sub-category",
    category: "Packaging Reuse",
    subCategory: "Onsite Reuse Systems",
    label: "Onsite Reuse Systems",
    definition:
      "Reusable items are used and returned in the same place, like offices, canteens, venues, or dine-in restaurants.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA case categories on onsite dining and reusable tableware/container systems used in closed or semi-closed settings.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use for controlled settings where return, washing, and reuse happen onsite or through a site-managed system.",
  },
  {
    id: "sub-takeaway-delivery-reuse-systems",
    cursorKey: "takeawayDeliveryReuseSystems",
    level: "sub-category",
    category: "Packaging Reuse",
    subCategory: "Takeaway & Delivery Reuse Systems",
    label: "Takeaway & Delivery Reuse Systems",
    definition:
      "Reusable containers for takeout or delivery that you return later through pick-up, drop-off, or partner return points.",
    sourceAlignment: "direct/adapted",
    sourceBasis:
      "GAIA includes reusable tableware and containers for food and beverage takeaway, with return points, drop-off cabinets, washing, and redistribution.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use for food delivery, takeout, self-pickup, or partner-return reusable packaging models.",
  },
  {
    id: "sub-serveware-reuse-system",
    cursorKey: "servewareReuseSystem",
    level: "sub-category",
    category: "Packaging Reuse",
    subCategory: "Serveware Reuse System",
    label: "Serveware Reuse System",
    definition:
      "Reusable plates, cups, and cutlery used instead of disposables for meals, meetings, gatherings, or events.",
    sourceAlignment: "direct/adapted",
    sourceBasis:
      "GAIA case studies include crockery banks, reusable tableware for events, and reusable tableware/container systems for onsite dining.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use for event kits, crockery/cutlery banks, reusable dine-in ware, and similar systems.",
  },
  {
    id: "sub-secondary-packaging-reuse-systems",
    cursorKey: "secondaryPackagingReuseSystems",
    level: "sub-category",
    category: "Packaging Reuse",
    subCategory: "Secondary Packaging Reuse Systems",
    label: "Secondary Packaging Reuse Systems",
    definition:
      "Reusable boxes, crates, bags, or pallets that move goods between suppliers, shops, and customers again and again.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA reuse-system framing on logistics, collection, cleaning, redistribution, and supply-chain collaboration.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use for business-to-business or transport packaging, not the primary container directly holding the product.",
  },
  {
    id: "sub-onsite-refill-system",
    cursorKey: "onsiteRefillSystem",
    level: "sub-category",
    category: "Refill",
    subCategory: "Onsite Refill System",
    label: "Onsite Refill System",
    definition:
      "You refill your container on the spot, at a store, refill station, market, or community refill point.",
    sourceAlignment: "direct/adapted",
    sourceBasis:
      "GAIA describes refill systems where consumers bring reusable packaging to the store for product restocking.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use for refill on-the-go, refill stations, community stores, and bring-your-own-container systems.",
  },
  {
    id: "sub-refill-at-home-system",
    cursorKey: "refillAtHomeSystem",
    level: "sub-category",
    category: "Refill",
    subCategory: "Refill at Home System",
    label: "Refill at Home System",
    definition:
      "You refill at home using concentrates, bulk deliveries, or refill packs that use less packaging.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from refill model classifications referenced in GAIA's report, including refill at home and refill on the go.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use when refilling happens after purchase or delivery, outside a store/refill station.",
  },
  {
    id: "sub-product-reuse-system",
    cursorKey: "productReuseSystem",
    level: "sub-category",
    category: "Product Reuse",
    subCategory: "Product Reuse System",
    label: "Product Reuse System",
    definition:
      "Durable products kept in use through repair, refurbishing, lending, renting, reselling, or repeated shared use.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA zero waste practices that prioritize waste reduction, reuse, repair, recycling, and composting.",
    sourceTitle: "ZERO WASTE AND ECONOMIC RECOVERY",
    sourceUrl:
      "https://www.no-burn.org/wp-content/uploads/Jobs-Report-ENGLISH-1.pdf",
    notesForEditor: "Use as the sub-category under Product Reuse.",
  },
  {
    id: "sub-reusable-product-alternatives-self-maintained",
    cursorKey: "reusableProductAlternativesSelfMaintained",
    level: "sub-category",
    category: "Use of Reusable Product Alternatives",
    subCategory: "Reusable Product Alternatives (Self-Maintained)",
    label: "Reusable Product Alternatives (Self-Maintained)",
    definition:
      "You own the reusable item and look after it yourself, including washing, storing, and replacing it when needed.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA refill framing where consumers use and maintain containers, and from zero waste reuse/repair principles.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use where responsibility for maintenance sits mainly with the user.",
  },
  {
    id: "sub-reusable-product-alternatives-service-maintained",
    cursorKey: "reusableProductAlternativesServiceMaintained",
    level: "sub-category",
    category: "Use of Reusable Product Alternatives",
    subCategory: "Reusable Product Alternatives (Service-Maintained)",
    label: "Reusable Product Alternatives (Service-Maintained)",
    definition:
      "A provider supplies, collects, cleans, and repairs the reusable items for you, your business, or an event.",
    sourceAlignment: "direct/adapted",
    sourceBasis:
      "GAIA return-system framing describes service providers handling collection, washing, and redistribution of reusable packaging.",
    sourceTitle: "Unpacking Reuse in Asia: A Brief Report",
    sourceUrl:
      "https://plasticsmartcities.org/wp-content/uploads/2025/04/Upacking-Reuse-in-Asia.pdf",
    notesForEditor:
      "Use where maintenance is handled by a reuse service provider.",
  },
  {
    id: "sub-transfer-based-reuse-systems",
    cursorKey: "transferBasedReuseSystems",
    level: "sub-category",
    category: "Transfer-based Reuse",
    subCategory: "Transfer-based Reuse Systems",
    label: "Transfer-based Reuse Systems",
    definition:
      "Usable goods passed between people through donating, lending, sharing, swapping, reselling, or organized take-back.",
    sourceAlignment: "adapted",
    sourceBasis:
      "Adapted from GAIA zero waste framing on reuse and recovery of products, packaging, and materials.",
    sourceTitle: "Beyond Recycling: On the Road to Zero Waste",
    sourceUrl:
      "https://www.no-burn.org/beyond-recycling-on-the-road-to-zero-waste/",
    notesForEditor: "Use as the sub-category under Transfer-based Reuse.",
  },
];

// The app taxonomy now matches the canonical CSV labels exactly, so no aliasing
// is needed. Keep this map for any future label that diverges from the CSV.
const LABEL_ALIASES: Record<string, string> = {};

const MAIN_BY_LABEL = new Map<string, TooltipRecord>();
const SUB_BY_LABEL = new Map<string, TooltipRecord>();
const BY_KEY = new Map<string, TooltipRecord>();

for (const r of TOOLTIP_RECORDS) {
  BY_KEY.set(r.cursorKey, r);
  BY_KEY.set(r.id, r);
  if (r.level === "main") MAIN_BY_LABEL.set(r.category, r);
  else if (r.subCategory) SUB_BY_LABEL.set(r.subCategory, r);
}

function resolve(
  map: Map<string, TooltipRecord>,
  label?: string | null
): TooltipRecord | null {
  if (!label) return null;
  const key = label.trim();
  return map.get(key) ?? map.get(LABEL_ALIASES[key] ?? "") ?? null;
}

/** Full record for a main category by its exact label (alias-aware). */
export function getCategoryRecord(label?: string | null): TooltipRecord | null {
  return resolve(MAIN_BY_LABEL, label);
}

/** Full record for a sub-category by its exact label (alias-aware). */
export function getSubCategoryRecord(
  label?: string | null
): TooltipRecord | null {
  return resolve(SUB_BY_LABEL, label);
}

/** Visible tooltip text for a main category (falls back gracefully). */
export function getCategoryDefinition(label?: string | null): string {
  return getCategoryRecord(label)?.definition ?? TOOLTIP_FALLBACK;
}

/** Visible tooltip text for a sub-category (falls back gracefully). */
export function getSubCategoryDefinition(label?: string | null): string {
  return getSubCategoryRecord(label)?.definition ?? TOOLTIP_FALLBACK;
}

/** Stable data key for an element, preferring cursorKey, then id. */
export function getStableKey(label?: string | null): string | null {
  const rec = resolve(MAIN_BY_LABEL, label) ?? resolve(SUB_BY_LABEL, label);
  return rec?.cursorKey ?? rec?.id ?? null;
}
