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

// Default per-category placeholder image path. The human drops real images into
// /public/defaults/<slug>.png; until then colored SVGs live at /defaults/<slug>.svg.
export function categoryDefaultImage(slug?: string | null): string {
  const s = slug ?? "unknown";
  return `/defaults/${s}.svg`;
}
