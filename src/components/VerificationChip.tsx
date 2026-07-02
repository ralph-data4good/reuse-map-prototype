import { ShieldCheck, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { verificationLabel, type VerificationStatus } from "@/lib/taxonomy";

const STYLES: Record<VerificationStatus, string> = {
  partner_verified: "chip-verified",
  staff_verified: "chip-staff",
  unverified: "chip-unverified",
};

export function VerificationChip({
  status,
  source,
  className,
}: {
  status: VerificationStatus;
  source?: string | null;
  className?: string;
}) {
  const Icon = status === "unverified" ? ShieldQuestion : ShieldCheck;
  return (
    <span className={cn("chip", STYLES[status], className)}>
      <Icon className="h-3.5 w-3.5" />
      {verificationLabel(status, source)}
    </span>
  );
}
