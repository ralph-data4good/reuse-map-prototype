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
  kkpkpwastepickercollectiveofpune: "https://swachcoop.com/initiatives/v-collect/",
  cupable: "https://www.linkedin.com/company/cupable/",
  infinitybox: "https://getinfinitybox.com/",
  crockerybankforeveryone: "https://www.facebook.com/crockerybankforeveryone/",
  greenpeacephilippinesinnovationcatalystlocalgovernments:
    "https://www.greenpeace.org/philippines/publication/68199/kuha-sa-tingi/",
  weuse: "https://www.weuse.hk/",
  juanazeroexpress: "http://www.motherearthphil.org/",
  muuse: "https://www.muuse.io/",
  rnisargfoundation:
    "https://sway.cloud.microsoft/mfslexQgAs71N5EU?ref=Link&loc=mysways",
};

/** Resolve a provider website URL from the service-provider display name. */
export function providerLink(name?: string | null): string | null {
  const key = slugifyName(name);
  return key ? PROVIDER_LINKS[key] ?? null : null;
}
