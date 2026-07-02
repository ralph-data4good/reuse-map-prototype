"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ZWA button variants: navy primary, gold secondary, outline. Fully rounded
// pills use the `pill` variant (view toggle).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        navy: "rounded-btn bg-navy text-white hover:bg-navy-hover focus-visible:ring-navy/40",
        gold: "rounded-btn bg-gold text-white hover:brightness-95 focus-visible:ring-gold/40",
        outline:
          "rounded-btn border border-navy/25 bg-white text-navy hover:bg-navy/5 focus-visible:ring-navy/30",
        ghost: "rounded-btn text-navy hover:bg-navy/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-9 w-9 rounded-btn",
      },
    },
    defaultVariants: { variant: "navy", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
