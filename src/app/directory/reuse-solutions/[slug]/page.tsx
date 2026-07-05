import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionDetailView } from "@/components/SolutionDetailView";
import {
  fetchReuseSolutionBySlug,
  fetchReuseSolutions,
} from "@/lib/data";
import { solutionDetailUrl } from "@/lib/solution-paths";
import { solutionImageSrc } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await fetchReuseSolutions();
  return data.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = await fetchReuseSolutionBySlug(slug);
  if (!solution) {
    return { title: "Solution not found | Zero Waste Asia" };
  }

  const title = solution.serviceProviderName
    ? `${solution.serviceProviderName} | Reuse Solutions`
    : `${solution.name} | Reuse Solutions`;
  const description =
    solution.description?.slice(0, 160) ||
    `${solution.primaryCategory ?? "Reuse"} solution${
      solution.country ? ` in ${solution.country}` : ""
    }.`;
  const url = solutionDetailUrl(slug);
  const image = solutionImageSrc({
    imageUrl: solution.imageUrl,
    serviceProviderName: solution.serviceProviderName,
    categorySlug: solution.primaryCategorySlug,
  });
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zerowaste.asia").replace(
    /\/$/,
    ""
  );
  const ogImage = image.startsWith("http")
    ? image
    : `${siteOrigin}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function jsonLd(
  solution: NonNullable<Awaited<ReturnType<typeof fetchReuseSolutionBySlug>>>
) {
  const url = solutionDetailUrl(solution.slug);
  const type = solution.hasPhysicalLocation ? "LocalBusiness" : "Organization";
  const location = [solution.city, solution.country].filter(Boolean).join(", ");

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: solution.serviceProviderName ?? solution.name,
    description: solution.description ?? undefined,
    url,
    ...(solution.latitude != null && solution.longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: solution.latitude,
            longitude: solution.longitude,
          },
        }
      : {}),
    ...(location
      ? { address: { "@type": "PostalAddress", addressLocality: location } }
      : {}),
    ...(solution.primaryCategory
      ? { additionalType: solution.primaryCategory }
      : {}),
  };
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = await fetchReuseSolutionBySlug(slug);
  if (!solution) notFound();

  const ld = jsonLd(solution);
  // Escape `<` so string fields (name/description from the DB) cannot break out
  // of the <script> element via a literal "</script>" sequence.
  const ldJson = JSON.stringify(ld).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson }}
      />
      <SolutionDetailView solution={solution} />
    </>
  );
}

export const dynamicParams = false;
