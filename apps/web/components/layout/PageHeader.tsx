import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          {eyebrow && (
            <div className="text-eyebrow text-gold tracking-[0.2em]">{eyebrow}</div>
          )}
          <h1 className="text-h1 font-bold text-text">{title}</h1>
          {subtitle && <p className="max-w-2xl text-body text-text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
