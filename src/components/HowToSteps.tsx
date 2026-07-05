"use client";

import { cn } from "@/lib/utils";

type Step = { title: string; body: string };

function StepCard({
  step,
  index,
  className,
}: {
  step: Step;
  index: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5",
        className
      )}
    >
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-white"
      >
        {index + 1}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-semibold leading-snug text-white">{step.title}</p>
        <p className="mt-0.5 text-xs leading-snug text-white/75">{step.body}</p>
      </div>
    </div>
  );
}

/** Responsive how-to steps: full-width step 1, then pairs on tablet/desktop. */
export function HowToSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-4 flex flex-col gap-2 sm:gap-3">
      <li>
        <StepCard step={steps[0]} index={0} />
      </li>
      <li className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <StepCard step={steps[1]} index={1} />
        <StepCard step={steps[2]} index={2} />
      </li>
      <li className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <StepCard step={steps[3]} index={3} />
        <StepCard step={steps[4]} index={4} />
      </li>
    </ol>
  );
}
