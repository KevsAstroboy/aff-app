import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "outline" | "danger";
  size?: "sm" | "md";
  label: string;
};

const BASE =
  "inline-flex items-center justify-center rounded-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS = {
  ghost: "text-text-muted hover:bg-surface-hover hover:text-text",
  outline: "border border-border text-text-muted hover:text-text hover:border-border-strong",
  danger:
    "border border-live-red/40 text-live-red hover:bg-live-red/10",
};

const SIZES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", label, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {children}
    </button>
  )
);
IconButton.displayName = "IconButton";
