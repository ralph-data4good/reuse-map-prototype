"use client";

import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
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

function StepArrow({
  direction,
  className,
}: {
  direction: "down" | "right";
  className?: string;
}) {
  const Icon = direction === "down" ? ArrowDown : ArrowRight;
  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center text-white/45", className)}
    >
      <Icon className="h-4 w-4" strokeWidth={2.5} />
    </div>
  );
}

/** Responsive how-to steps with directional arrows between each step. */
export function HowToSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="mt-4">
      {/* Mobile: single column, down arrows */}
      <ol className="flex flex-col sm:hidden">
        {steps.map((step, i) => (
          <Fragment key={step.title}>
            <li>
              <StepCard step={step} index={i} />
            </li>
            {i < steps.length - 1 && (
              <li>
                <StepArrow direction="down" className="py-1" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>

      {/* Tablet / desktop: 2-column flow with horizontal + vertical arrows */}
      <ol className="hidden sm:flex sm:flex-col sm:gap-0">
        {/* Steps 1 → 2 */}
        <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
          <StepCard step={steps[0]} index={0} />
          <StepArrow direction="right" />
          <StepCard step={steps[1]} index={1} />
        </li>
        <li>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2">
            <StepArrow direction="down" className="py-1" />
            <div />
            <StepArrow direction="down" className="py-1" />
          </div>
        </li>
        {/* Steps 3 → 4 */}
        <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
          <StepCard step={steps[2]} index={2} />
          <StepArrow direction="right" />
          <StepCard step={steps[3]} index={3} />
        </li>
        <li>
          <StepArrow direction="down" className="py-1" />
        </li>
        {/* Step 5 */}
        <li className="grid grid-cols-[1fr_auto_1fr] gap-x-2">
          <StepCard step={steps[4]} index={4} />
        </li>
      </ol>
    </div>
  );
}
