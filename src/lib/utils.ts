import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
