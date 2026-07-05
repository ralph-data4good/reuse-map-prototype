"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { EmptyResults } from "@/components/EmptyResults";
import { SolutionImage } from "@/components/SolutionImage";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TrustBadge } from "@/components/TrustBadge";
import { VisitProviderButton } from "@/components/VisitProviderButton";
import { TruncatedTitle } from "@/components/TruncatedTitle";
import { SubCategoryTerms } from "@/components/SubCategoryTerms";
import { providerLink } from "@/lib/provider-links";
import { solutionDetailPath } from "@/lib/solution-paths";
import { categoryOverlayGradient } from "@/lib/reuse-categories";
import type { Filters, ReuseSolution } from "@/lib/types";

function GalleryCard({
  s,
  activeSubcategories,
  onSubcategorySelect,
}: {
  s: ReuseSolution;
  activeSubcategories: string[];
  onSubcategorySelect?: (subcategory: string) => void;
}) {
  const location = [s.city, s.country].filter(Boolean).join(", ");
  const hasVisitLink = Boolean(providerLink(s.serviceProviderName));
  const providerTitle = s.serviceProviderName?.trim() || s.name;
  const description =
    s.serviceProviderName?.trim() && s.name.trim() !== s.serviceProviderName.trim()
      ? s.name
      : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card motion-safe:transition-shadow motion-safe:hover:shadow-pop">
      <Link
        href={solutionDetailPath(s.slug)}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
      >
        <div className="relative h-44 w-full bg-cream">
          <SolutionImage
            imageUrl={s.imageUrl}
            serviceProviderName={s.serviceProviderName}
            categorySlug={s.primaryCategorySlug}
            category={s.primaryCategory}
            alt={providerTitle}
            className="h-full w-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: categoryOverlayGradient(s.primaryCategory) }}
          />
          <div className="absolute bottom-2 left-2">
            <CategoryBadge category={s.primaryCategory} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{location || "Location not set"}</span>
        </div>

        <Link
          href={solutionDetailPath(s.slug)}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          <TruncatedTitle
            text={providerTitle}
            limit={70}
            className="font-heading text-lg font-semibold leading-snug text-ink group-hover:text-navy"
          />
        </Link>

        {description && (
          <p className="text-sm leading-snug text-muted">{description}</p>
        )}

        {s.affiliations[0] && (
          <p className="text-xs text-muted">{s.affiliations[0]}</p>
        )}

        {s.subCategories.length > 0 && (
          <SubCategoryTerms
            items={s.subCategories}
            activeSubcategories={activeSubcategories}
            onSelect={onSubcategorySelect}
            className="text-xs"
          />
        )}

        <div className="mt-auto space-y-3 pt-2">
          <TrustBadge
            status={s.verificationStatus}
            source={s.verificationSource}
            lastUpdated={s.lastUpdated}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={solutionDetailPath(s.slug)}
              className="inline-flex flex-1 items-center justify-center rounded-btn border border-border bg-white px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-cream"
            >
              View details
            </Link>
            {hasVisitLink && (
              <VisitProviderButton
                serviceProviderName={s.serviceProviderName}
                fullWidth
                size="sm"
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function GalleryView({
  items,
  filters,
  onClearFilters,
  hasActiveFilters,
  activeSubcategories = [],
  onSubcategorySelect,
}: {
  items: ReuseSolution[];
  filters?: Filters;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  activeSubcategories?: string[];
  onSubcategorySelect?: (subcategory: string) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyResults
        filters={filters}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((s) => (
        <GalleryCard
          key={s.id}
          s={s}
          activeSubcategories={activeSubcategories}
          onSubcategorySelect={onSubcategorySelect}
        />
      ))}
    </div>
  );
}
