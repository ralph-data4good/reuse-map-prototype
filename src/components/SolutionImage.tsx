"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryDefaultImage, solutionImageSrc } from "@/lib/utils";
import { COPY } from "@/lib/taxonomy";
import { getCategoryColor } from "@/lib/reuse-categories";

// Shows the best image for a solution (explicit URL, then a provider photo
// matched by name, then the per-category default SVG), then a "No image" state
// tinted with the category color. Handles broken URLs too.
export function SolutionImage({
  imageUrl,
  serviceProviderName,
  categorySlug,
  category,
  alt,
  className,
}: {
  imageUrl?: string | null;
  serviceProviderName?: string | null;
  categorySlug?: string | null;
  category?: string | null;
  alt: string;
  className?: string;
}) {
  const fallback = categoryDefaultImage(categorySlug);
  const [src, setSrc] = useState<string>(
    solutionImageSrc({ imageUrl, serviceProviderName, categorySlug })
  );
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 text-white/90",
          className
        )}
        style={{ backgroundColor: getCategoryColor(category) }}
      >
        <ImageOff className="h-6 w-6 opacity-80" />
        <span className="text-xs font-medium">{COPY.noImage}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
        else setFailed(true);
      }}
    />
  );
}
