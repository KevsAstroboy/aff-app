import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-gold text-bg hover:bg-gold-hover",
  ghost: "bg-transparent text-text hover:bg-surface-hover",
  outline: "border border-gold/40 text-gold hover:bg-gold-soft",
  danger:
    "border border-live-red/40 text-live-red hover:bg-live-red/10",
  success: "border border-success/40 text-success hover:bg-success/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-4 text-body",
  lg: "h-12 px-6 text-body",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block, loading = false, disabled, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], SIZES[size], block && "w-full", className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
