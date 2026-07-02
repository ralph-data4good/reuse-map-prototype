import { getSupabase } from "./supabase";
import type { ReuseSolution } from "./types";
import type { VerificationStatus } from "./taxonomy";

const REUSE_GROUP_SLUG = "reuse-solutions";

// Shape of the joined rows returned by Supabase. Nested relations come back as
// objects (or arrays for some relationships), so we normalize defensively.
type Row = {
  id: string;
  name: string;
  description: string | null;
  verification_status: VerificationStatus | null;
  verification_status_source: string | null;
  has_physical_location: boolean | null;
  updated_at: string | null;
  details: { image_url?: string } | null;
  directory_type:
    | {
        name: string | null;
        slug: string | null;
        group: { slug: string | null } | { slug: string | null }[] | null;
      }
    | null;
  location:
    | {
        city: string | null;
        province: string | null;
        latitude: number | null;
        longitude: number | null;
        country: { name: string | null; iso2: string | null } | null;
      }
    | null;
  reuse:
    | {
        service_provider_name: string | null;
        reuse_framework_categories: string[] | null;
        sub_categories: string[] | null;
        natures_of_service: string[] | null;
        affiliations: string[] | null;
        operating_countries: string[] | null;
        last_updated: string | null;
      }
    | {
        service_provider_name: string | null;
        reuse_framework_categories: string[] | null;
        sub_categories: string[] | null;
        natures_of_service: string[] | null;
        affiliations: string[] | null;
        operating_countries: string[] | null;
        last_updated: string | null;
      }[]
    | null;
};

function first<T>(v: T | T[] | null | undefined): T | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

// Explicit FK hints disambiguate the two directories <-> directory_locations
// relationships (directory_location_id vs directory_locations.directory_id).
const SELECT = `
  id, name, description, verification_status, verification_status_source,
  has_physical_location, updated_at, details,
  directory_type:directory_types!directories_directory_type_id_fkey (
    name, slug, group:directory_groups ( slug )
  ),
  location:directory_locations!directories_directory_location_id_fkey (
    city, province, latitude, longitude, country:countries ( name, iso2 )
  ),
  reuse:directory_reuse_details ( service_provider_name, reuse_framework_categories,
    sub_categories, natures_of_service, affiliations, operating_countries, last_updated )
`;

export type FetchResult = {
  data: ReuseSolution[];
  error: string | null;
  configured: boolean;
};

export async function fetchReuseSolutions(): Promise<FetchResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      data: [],
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      configured: false,
    };
  }

  // Filtering happens client-side for the small prototype dataset. The query is
  // written so category/nature/country filters can move server-side later via
  // .overlaps() on the text[] columns and .eq() on the location country.
  const { data, error } = await supabase
    .from("directories")
    .select(SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message, configured: true };
  }

  const rows = (data ?? []) as unknown as Row[];

  const solutions: ReuseSolution[] = rows
    .filter((r) => {
      const group = first(r.directory_type?.group);
      return group?.slug === REUSE_GROUP_SLUG;
    })
    .map((r) => {
      const reuse = first(r.reuse);
      const loc = r.location;
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        primaryCategory: r.directory_type?.name ?? null,
        primaryCategorySlug: r.directory_type?.slug ?? null,
        categories: reuse?.reuse_framework_categories ?? [],
        subCategories: reuse?.sub_categories ?? [],
        naturesOfService: reuse?.natures_of_service ?? [],
        affiliations: reuse?.affiliations ?? [],
        operatingCountries: reuse?.operating_countries ?? [],
        serviceProviderName: reuse?.service_provider_name ?? null,
        city: loc?.city ?? null,
        province: loc?.province ?? null,
        country: loc?.country?.name ?? null,
        countryIso2: loc?.country?.iso2 ?? null,
        latitude: loc?.latitude ?? null,
        longitude: loc?.longitude ?? null,
        verificationStatus: (r.verification_status ?? "unverified") as VerificationStatus,
        verificationSource: r.verification_status_source ?? null,
        hasPhysicalLocation: r.has_physical_location ?? true,
        lastUpdated: reuse?.last_updated ?? r.updated_at,
        updatedAt: r.updated_at,
        imageUrl: r.details?.image_url ?? null,
      };
    });

  return { data: solutions, error: null, configured: true };
}

// Pure client-side filtering. Uses array-overlap logic: a solution matches a
// filter group if ANY of its values is selected (OR within a group, AND across).
export function applyFilters(
  items: ReuseSolution[],
  filters: {
    countries: string[];
    categories: string[];
    natures: string[];
    affiliations: string[];
    search: string;
  }
): ReuseSolution[] {
  const search = filters.search.trim().toLowerCase();
  return items.filter((s) => {
    if (filters.countries.length) {
      const solCountries = [
        ...(s.country ? [s.country] : []),
        ...s.operatingCountries,
      ];
      if (!filters.countries.some((c) => solCountries.includes(c))) return false;
    }
    if (filters.categories.length) {
      const cats = s.categories.length
        ? s.categories
        : s.primaryCategory
          ? [s.primaryCategory]
          : [];
      if (!filters.categories.some((c) => cats.includes(c))) return false;
    }
    if (filters.natures.length) {
      if (!filters.natures.some((n) => s.naturesOfService.includes(n))) return false;
    }
    if (filters.affiliations.length) {
      if (!filters.affiliations.some((a) => s.affiliations.includes(a)))
        return false;
    }
    if (search) {
      const hay = [
        s.name,
        s.serviceProviderName ?? "",
        s.city ?? "",
        s.country ?? "",
        s.primaryCategory ?? "",
        ...s.subCategories,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}
