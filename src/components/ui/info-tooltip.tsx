"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

// Accessible tooltip that works on hover, keyboard focus, and mobile tap.
// Built on Radix Popover (rather than Radix Tooltip) because Popover handles
// touch/tap, outside-click, and Escape dismissal reliably; we add hover + focus
// open/close on top. role="tooltip" + aria-describedby wire it for screen readers.
let counter = 0;

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

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 90);
  };

  React.useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-key={dataKey}
          aria-label={ariaLabel}
          aria-describedby={open ? id : undefined}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onFocus={openNow}
          onBlur={() => setOpen(false)}
          onClick={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
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
