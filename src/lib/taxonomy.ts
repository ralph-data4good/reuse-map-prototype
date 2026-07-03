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
  pageTitle: "Mapping Reuse Solutions in Asia",
  intro:
    "Across Asia Pacific, communities, cooperatives, businesses, and local groups are building practical reuse systems that keep packaging and products in circulation. This directory brings together refill stations, returnable packaging models, reusable product alternatives, repair services, and second-hand networks, so we can see what already works and connect with the people behind them.",
  introMore:
    "Start with the map to see where reuse solutions operate across Asia Pacific. Use the filters to narrow results by country, reuse category, nature of service, or provider type. Switch to gallery or table view to compare entries and read more details. Open any result to learn what the solution does, where it works, and who is behind it. Know a solution we should add? Share it through the contribution form so our team can review and include it in the directory.",
  tagline: "Explore reuse, refill, and second-hand solutions across Asia-Pacific.",
  searchLabel: "Search the directory",
  searchPlaceholder: "Try typing water refill to see water refilling stations...",
  refinePanelTitle: "Refine results",
  clearAll: "Clear filters",
  noResultsTitle: "No reuse solutions found",
  noResultsBody:
    "Try adjusting your search or filters, or share a reuse solution that should be added to the directory.",
  ctaHeading: "Know a reuse solution we should add?",
  ctaBody:
    "Help grow the directory by sharing a reuse, refill, repair, or transfer-based reuse solutions from your community, city, or country. Submissions will be reviewed before they appear on the public map.",
  ctaButton: "Share a reuse solution",
  noImage: "No image",
};

// Default map view, centered on Asia-Pacific to match the ZWA reference.
export const MAP_DEFAULTS = {
  center: [105, 15] as [number, number],
  zoom: 3,
};
