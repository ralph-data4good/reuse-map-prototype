import { ShieldCheck, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { trustBadgeLabel, type VerificationStatus } from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";

const STYLES: Record<VerificationStatus, string> = {
  partner_verified: "chip-verified",
  staff_verified: "chip-staff",
  unverified: "chip-unverified",
};

export function TrustBadge({
  status,
  source,
  lastUpdated,
  className,
}: {
  status: VerificationStatus;
  source?: string | null;
  lastUpdated?: string | null;
  className?: string;
}) {
  const Icon = status === "unverified" ? ShieldQuestion : ShieldCheck;
  const label = trustBadgeLabel(status, source, formatDate(lastUpdated));

  return (
    <span className={cn("chip", STYLES[status], className)}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export function TableTrustIndicator({
  status,
  source,
  lastUpdated,
  className,
}: {
  status: VerificationStatus;
  source?: string | null;
  lastUpdated?: string | null;
  className?: string;
}) {
  if (status === "unverified") return null;

  const Icon = ShieldCheck;
  const label = trustBadgeLabel(status, source, formatDate(lastUpdated));

  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-chip-verified-fg",
        className
      )}
      title={label}
      aria-label={label}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}
