"use client";

import {
  ChevronRight,
  ExternalLink,
  LayoutGrid,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HowToStep = {
  title: string;
  body: string;
};

type StepBadge = "start" | "filter" | "views" | "open" | "share";

const BADGE_ICONS: Record<
  Exclude<StepBadge, "start">,
  typeof SlidersHorizontal
> = {
  filter: SlidersHorizontal,
  views: LayoutGrid,
  open: ExternalLink,
  share: Plus,
};

function StepBadgeIcon({ kind }: { kind: StepBadge }) {
  if (kind === "start") {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-white"
      >
        1
      </span>
    );
  }
  const Icon = BADGE_ICONS[kind];
  return (
    <span
      aria-hidden
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white"
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

function StepCard({
  step,
  badge,
  onActivate,
  className,
}: {
  step: HowToStep;
  badge: StepBadge;
  onActivate: () => void;
  className?: string;
}) {
  const accessibleName = `${step.title} — ${step.body}`;

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={accessibleName}
      className={cn(
        "flex w-full cursor-pointer gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-left",
        "transition-colors motion-safe:transition-colors hover:border-white/35 hover:bg-white/15",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
        className
      )}
    >
      <StepBadgeIcon kind={badge} />
      <div className="min-w-0 pt-0.5">
        <p className="flex items-center gap-1 text-sm font-semibold leading-snug text-white">
          <span>{step.title}</span>
          <span className="text-white/80">· Try it</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/80" aria-hidden />
        </p>
        <p className="mt-0.5 text-xs leading-snug text-white/90">{step.body}</p>
      </div>
    </button>
  );
}

const STEP_BADGES: StepBadge[] = [
  "start",
  "filter",
  "views",
  "open",
  "share",
];

/** Interactive how-to steps: each card performs the action it describes. */
export function HowToSteps({
  steps,
  onStepAction,
}: {
  steps: HowToStep[];
  onStepAction: (index: number) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs leading-relaxed text-white/90 sm:text-sm">
        Start with step 1. Steps 2–5 can be done in any order.
      </p>
      <ol className="mt-3 flex list-none flex-col gap-2 pl-0 sm:gap-3">
        <li className="list-none">
          <StepCard
            step={steps[0]}
            badge={STEP_BADGES[0]}
            onActivate={() => onStepAction(0)}
          />
        </li>
        <li className="grid list-none grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <StepCard
            step={steps[1]}
            badge={STEP_BADGES[1]}
            onActivate={() => onStepAction(1)}
          />
          <StepCard
            step={steps[2]}
            badge={STEP_BADGES[2]}
            onActivate={() => onStepAction(2)}
          />
        </li>
        <li className="grid list-none grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <StepCard
            step={steps[3]}
            badge={STEP_BADGES[3]}
            onActivate={() => onStepAction(3)}
          />
          <StepCard
            step={steps[4]}
            badge={STEP_BADGES[4]}
            onActivate={() => onStepAction(4)}
          />
        </li>
      </ol>
    </div>
  );
}
