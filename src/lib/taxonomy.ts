// ============================================================================
// Taxonomy + copy for the Reuse Solutions microsite.
// Reuse Framework Category colors, names, sub-categories, legend, and the
// Mapbox paint expression are the single source of truth in ./reuse-categories.
// This module holds everything else: category tooltip copy, natures of service,
// affiliations, countries, verification, and page copy.
// Helper `description` fields with a TODO are shown as tooltips in the filters.
// ============================================================================

// Category colors, names, sub-categories, legend, and the Mapbox paint
// expression all live in the single source of truth: ./reuse-categories.
// This module keeps only app-specific extras (tooltip copy, other taxonomies).
import { REUSE_SUBCATEGORIES } from "./reuse-categories";

// Category tooltip copy now lives in the canonical CSV projection
// (src/lib/tooltips.ts, sourced from reuse_microsite_tooltip_definitions.csv).

// Flat list of every sub-category, derived from the source of truth (no
// duplicated list). Available for a future sub-category filter.
export const SUB_CATEGORIES: string[] = REUSE_SUBCATEGORIES.map(
  (s) => s.subCategory
);

export type NatureOfService = {
  label: string;
  description: string;
};

// The 6 Natures of Service. Each shows its helper description on hover.
export const NATURES_OF_SERVICE: NatureOfService[] = [
  { label: "Technology Provider- Dispenser", description: "" /* TODO */ },
  { label: "Packaging Reuse System Operator", description: "" /* TODO */ },
  { label: "Reusable Containers Provider", description: "" /* TODO */ },
  { label: "Running Refill Station/ Store", description: "" /* TODO */ },
  { label: "Supporting retailers to set up refill service", description: "" /* TODO */ },
  { label: "Collection Service to enable product reuse", description: "" /* TODO */ },
];

export function getNature(label?: string | null): NatureOfService | undefined {
  if (!label) return undefined;
  const needle = label.trim().toLowerCase();
  return NATURES_OF_SERVICE.find((n) => n.label.toLowerCase() === needle);
}

// The 6 Affiliations.
export const AFFILIATIONS: string[] = [
  "Social Enterprise",
  "Local government",
  "Civil Society Organisation",
  "Community led initiative",
  "Waste Picker or wastepicker union led initiative",
  "Packaging or Product Manufacturers",
];

// The 50 countries in scope (Asia-Pacific + neighbours).
export const COUNTRIES: string[] = [
  "Afghanistan",
  "Armenia",
  "Australia",
  "Azerbaijan",
  "Bangladesh",
  "Bhutan",
  "Brunei Darussalam",
  "Cambodia",
  "China",
  "Fiji",
  "Georgia",
  "Hong Kong",
  "India",
  "Indonesia",
  "Iran",
  "Japan",
  "Kazakhstan",
  "Kiribati",
  "Kyrgyzstan",
  "Lao PDR",
  "Malaysia",
  "Maldives",
  "Marshall Islands",
  "Micronesia",
  "Mongolia",
  "Myanmar",
  "Nauru",
  "Nepal",
  "New Zealand",
  "North Korea",
  "Pakistan",
  "Palau",
  "Papua New Guinea",
  "Philippines",
  "Russia",
  "Samoa",
  "Singapore",
  "Solomon Islands",
  "South Korea",
  "Sri Lanka",
  "Tajikistan",
  "Thailand",
  "Timor-Leste",
  "Tonga",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uzbekistan",
  "Vanuatu",
  "Vietnam",
];

// Verification status labels + chip style keys (see globals.css chip classes).
export type VerificationStatus =
  | "unverified"
  | "staff_verified"
  | "partner_verified";

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  staff_verified: "Staff-Verified",
  partner_verified: "Partner-Verified",
};

// Chip label. Partner-verified entries show the verifying org, e.g.
// "Verified by GAIA AP", echoing ZWA's "Verified by YPBB" chips.
export function verificationLabel(
  status: VerificationStatus,
  source?: string | null
): string {
  if (status === "partner_verified" && source) return `Verified by ${source}`;
  return VERIFICATION_LABELS[status];
}

// Map + page copy lives here so it is edited in one place. No em dashes.
export const COPY = {
  siteTitle: "Reuse Solutions",
  pageTitle: "Mapping Reuse Solutions",
  intro:
    "Across Asia-Pacific, businesses, cooperatives, and local groups are building practical alternatives to single-use, from refill stations and container-return schemes to repair and second-hand networks. This directory gathers those reuse solutions in one place, so you can see what already works and connect with the people behind them.",
  introMore:
    "Start on the map to find where solutions operate, switch to the gallery or table for the full details, and filter by country, reuse category, nature of service, or affiliation. Know a solution that belongs here? Add it and help the map grow.",
  tagline: "Explore reuse, refill, and second-hand solutions across Asia-Pacific.",
  searchPlaceholder: "Search reuse solutions",
  refinePanelTitle: "Refine Results",
  clearAll: "Clear all",
  ctaHeading: "Know a reuse solution we're missing?",
  ctaBody:
    "Help grow the map. Share a reuse, refill, or second-hand solution and our team will review it before it goes live.",
  ctaButton: "Contribute a solution",
  noImage: "No image",
};

// Default map view, centered on Asia-Pacific to match the ZWA reference.
export const MAP_DEFAULTS = {
  center: [105, 15] as [number, number],
  zoom: 3,
};
