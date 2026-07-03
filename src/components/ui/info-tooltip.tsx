"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

// Accessible tooltip that works on hover, keyboard focus, and mobile tap.
// Built on Radix Popover (rather than Radix Tooltip) because Popover handles
// touch/tap, outside-click, and Escape dismissal reliably; we add hover + focus
// open/close on top. role="tooltip" + aria-describedby wire it for screen readers.
let counter = 0;

// Global coordinator: only one InfoTooltip may be open at a time, so hovering a
// new helper closes the previous one (no overlapping definitions).
let closeActiveTooltip: (() => void) | null = null;

export function InfoTooltip({
  content,
  children,
  ariaLabel,
  side = "top",
  className,
  contentClassName,
  dataKey,
}: {
  content: string;
  children: React.ReactNode;
  ariaLabel?: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  contentClassName?: string;
  dataKey?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [id] = React.useState(() => `tt-${++counter}`);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Stable reference to this instance's close fn, used by the global coordinator.
  const closeSelf = React.useRef<() => void>(() => {});
  closeSelf.current = () => setOpen(false);

  const clearActive = () => {
    if (closeActiveTooltip === closeSelf.current) closeActiveTooltip = null;
  };

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // Close any other open tooltip so definitions never overlap.
    if (closeActiveTooltip && closeActiveTooltip !== closeSelf.current) {
      closeActiveTooltip();
    }
    closeActiveTooltip = closeSelf.current;
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      clearActive();
    }, 90);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      if (closeActiveTooltip && closeActiveTooltip !== closeSelf.current) {
        closeActiveTooltip();
      }
      closeActiveTooltip = closeSelf.current;
    } else {
      clearActive();
    }
  };

  React.useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      clearActive();
    },
    []
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-key={dataKey}
          aria-label={ariaLabel}
          aria-describedby={open ? id : undefined}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onFocus={openNow}
          onBlur={() => {
            setOpen(false);
            clearActive();
          }}
          onClick={(e) => {
            e.preventDefault();
            if (open) {
              setOpen(false);
              clearActive();
            } else {
              openNow();
            }
          }}
          className={cn(
            "inline-flex items-center rounded outline-none focus-visible:ring-2 focus-visible:ring-navy/40",
            className
          )}
        >
          {children}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          id={id}
          role="tooltip"
          side={side}
          sideOffset={6}
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          className={cn(
            "z-50 max-w-xs rounded-md bg-navy px-3 py-2 text-xs leading-snug text-white shadow-pop",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            contentClassName
          )}
        >
          {content}
          <PopoverPrimitive.Arrow className="fill-navy" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
