import { slugifyName } from "@/lib/utils";

// Known service-provider website URLs for seed entries. Keys are slugified
// provider names (same convention as provider-images).
export const PROVIDER_LINKS: Record<string, string> = {
  alner: "https://alner.id/",
  shenzhenkuaipininformationtechnologyco: "https://www.kplocker.com/",
  recube: "https://recube.hk/",
  bangkokmetropolitanauthority: "https://www.bangkok.go.th/coverpage",
  refillablesdongday: "https://refillableshoian.com/",
  back2basics: "https://www.btbecostore.com/",
  irefill: "https://irefill.org/",
  unileversmartfill: "https://smartfill.store/",
  hepicircle: "https://hepicircle.com/",
  kkpkpwastepickercollectiveofpune: "https://kkpkp-pune.org/",
};

/** Resolve a provider website URL from the service-provider display name. */
export function providerLink(name?: string | null): string | null {
  const key = slugifyName(name);
  return key ? PROVIDER_LINKS[key] ?? null : null;
}
