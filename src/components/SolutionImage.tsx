"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryDefaultImage } from "@/lib/utils";
import { COPY } from "@/lib/taxonomy";
import { getCategoryColor } from "@/lib/reuse-categories";

// Shows the entry image, falling back to the per-category default SVG, then to a
// "No image" state tinted with the category color. Handles broken URLs too.
export function SolutionImage({
  imageUrl,
  categorySlug,
  category,
  alt,
  className,
}: {
  imageUrl?: string | null;
  categorySlug?: string | null;
  category?: string | null;
  alt: string;
  className?: string;
}) {
  const fallback = categoryDefaultImage(categorySlug);
  const [src, setSrc] = useState<string>(imageUrl || fallback);
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
