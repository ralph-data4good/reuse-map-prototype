import { providerLink } from "@/lib/provider-links";
import { solutionDetailPath } from "@/lib/solution-paths";
import { BASE_PATH } from "@/lib/utils";

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

function detailHref(slug: string): string {
  return `${BASE_PATH}${solutionDetailPath(slug)}/`;
}

/** Primary popup CTA linking to the solution detail page. */
export function solutionDetailLinkMarkup(
  slug: string,
  label = "View details"
): string {
  return `<a href="${esc(detailHref(slug))}" style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;padding:9px 14px;border-radius:8px;background:#C1A158;color:#1A1A1A;font-family:var(--font-body),system-ui,sans-serif;font-size:12px;font-weight:600;text-decoration:none;width:100%;box-sizing:border-box;transition:filter 0.15s;" onmouseover="this.style.filter='brightness(0.95)'" onmouseout="this.style.filter='none'">
    ${esc(label)}
  </a>`;
}

/** Secondary popup CTA linking to the provider website. */
export function visitProviderButtonMarkup(
  serviceProviderName?: string | null,
  label = "Visit website"
): string {
  const url = providerLink(serviceProviderName);
  if (!url) return "";
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;padding:9px 14px;border-radius:8px;background:#1E3A4C;color:#ffffff;font-family:var(--font-body),system-ui,sans-serif;font-size:12px;font-weight:600;text-decoration:none;width:100%;box-sizing:border-box;transition:background 0.15s;" onmouseover="this.style.background='#14344A'" onmouseout="this.style.background='#1E3A4C'">
    ${esc(label)}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </a>`;
}
