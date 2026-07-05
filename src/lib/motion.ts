/** Read prefers-reduced-motion (client-only). */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth scroll unless the user prefers reduced motion. */
export function scrollIntoViewRespectingMotion(
  element: Element | null | undefined,
  options: ScrollIntoViewOptions = { block: "start" }
): void {
  if (!element) return;
  const behavior = getPrefersReducedMotion() ? "auto" : "smooth";
  element.scrollIntoView({ ...options, behavior });
}

/** Mapbox camera animation duration (ms). */
export function mapCameraDuration(): number {
  return getPrefersReducedMotion() ? 0 : 800;
}

export const HOWTO_COLLAPSED_KEY = "howto_collapsed";
