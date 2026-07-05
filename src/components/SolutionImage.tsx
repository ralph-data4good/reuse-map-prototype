"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryDefaultImage, solutionImageSrc } from "@/lib/utils";
import { COPY } from "@/lib/taxonomy";
import { getCategoryColor } from "@/lib/reuse-categories";

export function SolutionImage({
  imageUrl,
  serviceProviderName,
  categorySlug,
  category,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw",
  priority = false,
}: {
  imageUrl?: string | null;
  serviceProviderName?: string | null;
  categorySlug?: string | null;
  category?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
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
        <ImageOff className="h-6 w-6 opacity-80" aria-hidden />
        <span className="text-xs font-medium">{COPY.noImage}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        unoptimized
        className="object-cover"
        onError={() => {
          if (src !== fallback) setSrc(fallback);
          else setFailed(true);
        }}
      />
    </div>
  );
}
