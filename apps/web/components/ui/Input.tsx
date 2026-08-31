import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const BASE =
  "w-full h-12 px-4 rounded-lg bg-surface-raised border text-text placeholder:text-text-subtle transition-all duration-150 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(BASE, invalid ? "border-live-red/60" : "border-border", className)}
      {...rest}
    />
  )
);
Input.displayName = "Input";
