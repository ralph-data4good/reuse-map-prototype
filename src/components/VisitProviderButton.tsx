"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { providerLink } from "@/lib/provider-links";
import { cn } from "@/lib/utils";

type VisitProviderButtonProps = {
  serviceProviderName?: string | null;
  href?: string | null;
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "default";
  label?: string;
};

/** Primary CTA linking to the service provider's website. */
export function VisitProviderButton({
  serviceProviderName,
  href,
  className,
  fullWidth = false,
  size = "default",
  label = "Visit website",
}: VisitProviderButtonProps) {
  const url = href ?? providerLink(serviceProviderName);
  if (!url) return null;

  return (
    <Button
      asChild
      variant="navy"
      size={size}
      className={cn(fullWidth && "w-full", className)}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {label}
        <ExternalLink className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </a>
    </Button>
  );
}
