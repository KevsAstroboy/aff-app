import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type NotificationIconButtonProps = {
  children: ReactNode;
  label: string;
  badge?: number;
  className?: string;
};

export function NotificationIconButton({
  children,
  label,
  badge,
  className,
}: NotificationIconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text hover:border-border-strong transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className
      )}
    >
      {children}
      {badge && badge > 0 ? (
        <span className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-live-red px-1 text-eyebrow font-semibold text-bg leading-none">
          {badge}
        </span>
      ) : (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-live-red animate-pulse-soft" />
      )}
    </button>
  );
}
