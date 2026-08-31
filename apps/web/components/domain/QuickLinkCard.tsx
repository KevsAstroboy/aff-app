"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

type QuickLinkCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: number | string;
  className?: string;
};

export function QuickLinkCard({
  href,
  icon,
  title,
  description,
  badge,
  className,
}: QuickLinkCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <Card className="flex items-start justify-between gap-4 hover:border-border-strong transition-colors">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-raised border border-border text-gold">
            {icon}
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="text-h3 font-semibold text-text">{title}</h3>
            <p className="text-small text-text-muted">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {badge !== undefined && (
            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-surface-raised border border-border text-body text-text tabular-nums px-2">
              {badge}
            </span>
          )}
          <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-gold transition-colors" />
        </div>
      </Card>
    </Link>
  );
}
