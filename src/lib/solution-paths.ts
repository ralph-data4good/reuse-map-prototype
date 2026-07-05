import { BASE_PATH } from "@/lib/utils";

/** Hyphenated slug for directory permalinks (matches Supabase `directories.slug`). */
export function slugifyEntry(
  ...parts: (string | null | undefined)[]
): string {
  return parts
    .filter((p): p is string => Boolean(p?.trim()))
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** App-router path to a solution detail page (Next.js adds basePath). */
export function solutionDetailPath(slug: string): string {
  return `/directory/reuse-solutions/${slug}`;
}

/** Absolute URL for OG tags and JSON-LD (includes basePath when deployed). */
export function solutionDetailUrl(slug: string, siteOrigin?: string): string {
  const origin = (siteOrigin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://zerowaste.asia").replace(
    /\/$/,
    ""
  );
  return `${origin}${BASE_PATH}${solutionDetailPath(slug)}/`;
}
