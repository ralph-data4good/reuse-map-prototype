import type { VerificationStatus } from "./taxonomy";

// Flat shape the views consume. Built from the joined Supabase query.
export type ReuseSolution = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** Optional reference URL stored in directories.details.reference_url. */
  referenceUrl: string | null;

  // Primary category (from directory_types) drives pin color + main badge.
  primaryCategory: string | null;
  primaryCategorySlug: string | null;
  // All categories a solution belongs to (from the reuse details array).
  categories: string[];

  subCategories: string[];
  naturesOfService: string[];
  affiliations: string[];
  operatingCountries: string[];
  serviceProviderName: string | null;

  // Single pin location.
  city: string | null;
  province: string | null;
  country: string | null;
  countryIso2: string | null;
  latitude: number | null;
  longitude: number | null;

  verificationStatus: VerificationStatus;
  verificationSource: string | null;
  hasPhysicalLocation: boolean;
  lastUpdated: string | null;
  updatedAt: string | null;

  // Optional external image stored in directories.details.image_url.
  imageUrl: string | null;
};

// Shared filter state across all three views.
export type Filters = {
  countries: string[];
  categories: string[];
  subcategories: string[];
  natures: string[];
  affiliations: string[];
  search: string;
};

export const EMPTY_FILTERS: Filters = {
  countries: [],
  categories: [],
  subcategories: [],
  natures: [],
  affiliations: [],
  search: "",
};
