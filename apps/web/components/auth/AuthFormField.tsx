import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type AuthFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function AuthFormField({ label, error, className, ...rest }: AuthFormFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-eyebrow uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
      <input
        className={cn(
          "w-full h-12 px-4 rounded-lg bg-surface-raised border text-text placeholder:text-text-subtle transition-all duration-150",
          "focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft",
          "disabled:opacity-50",
          error ? "border-live-red/60" : "border-border",
          className
        )}
        {...rest}
      />
      {error && (
        <p className="text-small text-live-red">{error}</p>
      )}
    </label>
  );
}
