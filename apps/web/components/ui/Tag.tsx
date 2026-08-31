import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TagColor =
  | "gold"
  | "warn"
  | "success"
  | "live-red"
  | "purple"
  | "muted"
  | "domain-art"
  | "domain-musique"
  | "domain-cinema"
  | "domain-mode"
  | "domain-danse"
  | "domain-litterature";

export type TagVariant = "label" | "chip";
export type TagSize = "sm" | "md";

type TagProps = {
  children: ReactNode;
  color?: TagColor;
  variant?: TagVariant;
  size?: TagSize;
  icon?: ReactNode;
  className?: string;
};

const COLORS: Record<TagColor, string> = {
  gold: "bg-gold-soft text-gold ring-1 ring-inset ring-gold/20",
  warn: "bg-warn/15 text-warn ring-1 ring-inset ring-warn/20",
  success: "bg-success/15 text-success ring-1 ring-inset ring-success/20",
  "live-red": "bg-live-red/15 text-live-red ring-1 ring-inset ring-live-red/20",
  purple: "bg-purple/15 text-purple ring-1 ring-inset ring-purple/20",
  muted: "bg-surface-hover text-text-muted ring-1 ring-inset ring-border",
  "domain-art": "bg-domain-art/15 text-domain-art ring-1 ring-inset ring-domain-art/25",
  "domain-musique": "bg-domain-musique/15 text-domain-musique ring-1 ring-inset ring-domain-musique/25",
  "domain-cinema": "bg-domain-cinema/15 text-domain-cinema ring-1 ring-inset ring-domain-cinema/25",
  "domain-mode": "bg-domain-mode/15 text-domain-mode ring-1 ring-inset ring-domain-mode/25",
  "domain-danse": "bg-domain-danse/15 text-domain-danse ring-1 ring-inset ring-domain-danse/25",
  "domain-litterature": "bg-domain-litterature/15 text-domain-litterature ring-1 ring-inset ring-domain-litterature/25",
};

const SIZE: Record<TagSize, string> = {
  sm: "h-6 px-2 text-[10px]",
  md: "h-7 px-2.5 text-[11px]",
};

export function Tag({
  children,
  color = "gold",
  variant = "label",
  size = "md",
  icon,
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap",
        variant === "label"
          ? "uppercase tracking-[0.14em]"
          : "tracking-normal normal-case",
        SIZE[size],
        COLORS[color],
        className
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}