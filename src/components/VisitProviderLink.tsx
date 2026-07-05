import { ExternalLink } from "lucide-react";
import { providerLink } from "@/lib/provider-links";
import { cn } from "@/lib/utils";

/** Quiet table link to a provider website. */
export function VisitProviderLink({
  serviceProviderName,
  href,
  className,
}: {
  serviceProviderName?: string | null;
  href?: string | null;
  className?: string;
}) {
  const url = href ?? providerLink(serviceProviderName);
  if (!url) return <span className="text-muted">—</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-sm text-brand hover:underline",
        className
      )}
    >
      Visit website
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  );
}
