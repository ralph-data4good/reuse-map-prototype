import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TrustBadge } from "@/components/TrustBadge";
import { VisitProviderButton } from "@/components/VisitProviderButton";
import { SolutionMiniMap } from "@/components/SolutionMiniMap";
import { SolutionImage } from "@/components/SolutionImage";
import { categoryOverlayGradient } from "@/lib/reuse-categories";
import { providerLink } from "@/lib/provider-links";
import { EXPLORER_PATH } from "@/lib/contribute-link";
import { providerDisplay } from "@/lib/solution-display";
import { formatDate } from "@/lib/utils";
import type { ReuseSolution } from "@/lib/types";

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

export function SolutionDetailView({ solution }: { solution: ReuseSolution }) {
  const location = [solution.city, solution.country].filter(Boolean).join(", ");
  const { title: providerTitle, secondary: solutionSubtitle } =
    providerDisplay(solution);
  const websiteUrl = providerLink(solution.serviceProviderName);
  const updatedLabel = formatDate(solution.lastUpdated ?? solution.updatedAt);

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <div className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <BackButton fallbackHref={EXPLORER_PATH} />
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-sm"
        >
          <a
            href="https://zerowaste.asia/directories?page=1&pageSize=20&view=grid"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted hover:text-navy hover:underline"
          >
            Directory
          </a>
          <ChevronRight className="h-4 w-4 text-muted" />
          <Link
            href={EXPLORER_PATH}
            className="font-medium text-muted hover:text-navy hover:underline"
          >
            Reuse Solutions
          </Link>
          <ChevronRight className="h-4 w-4 text-muted" />
          <span className="font-semibold text-ink">{providerTitle}</span>
        </nav>

        <article className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
          <div className="relative h-52 w-full bg-cream sm:h-64">
            <SolutionImage
              imageUrl={solution.imageUrl}
              serviceProviderName={solution.serviceProviderName}
              categorySlug={solution.primaryCategorySlug}
              category={solution.primaryCategory}
              alt={providerTitle}
              className="h-full w-full"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: categoryOverlayGradient(solution.primaryCategory),
              }}
            />
            <div className="absolute bottom-3 left-3">
              {solution.primaryCategory && (
                <CategoryBadge category={solution.primaryCategory} />
              )}
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_280px] lg:p-8">
            <div className="space-y-6">
              <header className="space-y-3">
                <h1 className="font-heading text-2xl font-bold leading-tight text-ink sm:text-3xl">
                  {providerTitle}
                </h1>
                {solutionSubtitle && (
                  <p className="text-base text-muted">{solutionSubtitle}</p>
                )}
                {location && (
                  <p className="text-sm text-muted">{location}</p>
                )}
              </header>

              {solution.description && (
                <section>
                  <h2 className="font-heading text-base font-semibold text-ink sm:text-lg">
                    About
                  </h2>
                  <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-ink/80 sm:text-sm">
                    {solution.description}
                  </p>
                </section>
              )}

              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Sub-categories">
                  {solution.subCategories.length > 0
                    ? solution.subCategories.join(", ")
                    : null}
                </DetailField>
                <DetailField label="Nature of service">
                  {solution.naturesOfService.length > 0
                    ? solution.naturesOfService.join(", ")
                    : null}
                </DetailField>
                <DetailField label="Provider type">
                  {solution.affiliations.length > 0
                    ? solution.affiliations.join(", ")
                    : null}
                </DetailField>
                <DetailField label="Operating countries">
                  {solution.operatingCountries.length > 0
                    ? solution.operatingCountries.join(", ")
                    : solution.country}
                </DetailField>
              </dl>

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <TrustBadge
                  status={solution.verificationStatus}
                  source={solution.verificationSource}
                  lastUpdated={solution.lastUpdated}
                />
                <span className="text-xs text-muted">
                  Updated {updatedLabel}
                </span>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="space-y-3 rounded-card border border-border bg-cream/40 p-4">
                {websiteUrl && (
                  <VisitProviderButton
                    serviceProviderName={solution.serviceProviderName}
                    fullWidth
                  />
                )}
                {solution.referenceUrl && (
                  <a
                    href={solution.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-btn border border-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-cream"
                  >
                    View source
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <SolutionMiniMap solution={solution} />
            </aside>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}
