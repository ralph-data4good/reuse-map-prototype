"use client";

import { MapPin, Share2, Bookmark } from "lucide-react";
import { SolutionImage } from "@/components/SolutionImage";
import { CategoryBadge } from "@/components/CategoryBadge";
import { VerificationChip } from "@/components/VerificationChip";
import { TruncatedTitle } from "@/components/TruncatedTitle";
import { SubCategoryTerms } from "@/components/SubCategoryTerms";
import { formatDate } from "@/lib/utils";
import type { ReuseSolution } from "@/lib/types";

function GalleryCard({ s }: { s: ReuseSolution }) {
  const location = [s.city, s.country].filter(Boolean).join(", ");
  const provider = [
    s.serviceProviderName,
    s.affiliations[0] ? `· ${s.affiliations[0]}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-shadow hover:shadow-pop">
      <div className="relative h-44 w-full bg-cream">
        <SolutionImage
          imageUrl={s.imageUrl}
          serviceProviderName={s.serviceProviderName}
          categorySlug={s.primaryCategorySlug}
          category={s.primaryCategory}
          alt={s.name}
          className="h-full w-full"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          <button
            aria-label="Share"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-navy shadow-sm hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            aria-label="Bookmark"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-navy shadow-sm hover:bg-white"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <CategoryBadge category={s.primaryCategory} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{location || "Location not set"}</span>
        </div>

        <TruncatedTitle
          text={s.name}
          limit={70}
          className="font-heading text-base font-semibold leading-snug text-ink"
        />

        {s.subCategories.length > 0 && (
          <SubCategoryTerms
            items={s.subCategories}
            className="text-xs text-muted"
          />
        )}

        {provider && (
          <p className="text-sm text-ink">
            <span className="font-medium">{s.serviceProviderName}</span>
            {s.affiliations[0] && (
              <span className="text-muted"> · {s.affiliations[0]}</span>
            )}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <VerificationChip
            status={s.verificationStatus}
            source={s.verificationSource}
          />
          <span className="text-xs text-muted">
            Updated {formatDate(s.lastUpdated)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function GalleryView({ items }: { items: ReuseSolution[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-white p-10 text-center text-muted">
        No reuse solutions match your filters.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((s) => (
        <GalleryCard key={s.id} s={s} />
      ))}
    </div>
  );
}
