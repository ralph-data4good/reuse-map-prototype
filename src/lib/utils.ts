import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PROVIDER_IMAGES } from "./provider-images.generated";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// On GitHub Pages project sites the app is served from /<repo>, injected at build
// time as NEXT_PUBLIC_BASE_PATH. Static files in /public are NOT auto-prefixed the
// way next/link routes are, so absolute asset paths must go through this helper.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetPath(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

// Default per-category placeholder image path. The human drops real images into
// /public/defaults/<slug>.png; until then colored SVGs live at /defaults/<slug>.svg.
export function categoryDefaultImage(slug?: string | null): string {
  const s = slug ?? "unknown";
  return assetPath(`/defaults/${s}.svg`);
}

// Normalize a name to a lookup key (lowercase, strip accents + punctuation +
// spaces). Must stay in sync with slugifyName() in
// scripts/generate-provider-images.mjs.
export function slugifyName(name?: string | null): string {
  return (name ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "");
}

// Photo for a service provider, matched by name against files dropped into
// /public/providers (see the generated manifest). Returns null if none exists.
export function providerImage(name?: string | null): string | null {
  const key = slugifyName(name);
  const path = key ? PROVIDER_IMAGES[key] : undefined;
  // encodeURI so filenames with spaces or & resolve on the static host.
  return path ? assetPath(encodeURI(path)) : null;
}

// Best available image for a solution: an explicit URL from the data, then a
// provider photo matched by name, then the per-category placeholder.
export function solutionImageSrc(opts: {
  imageUrl?: string | null;
  serviceProviderName?: string | null;
  categorySlug?: string | null;
}): string {
  return (
    opts.imageUrl ||
    providerImage(opts.serviceProviderName) ||
    categoryDefaultImage(opts.categorySlug)
  );
}
