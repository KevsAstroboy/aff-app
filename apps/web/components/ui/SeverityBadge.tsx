import { ArrowDown, Minus, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

export type SeverityLevel = "low" | "medium" | "high";

type SeverityBadgeProps = {
  level: SeverityLevel;
  size?: "sm" | "md";
  className?: string;
};

const LEVELS: Record<SeverityLevel, { label: string; classes: string; dot: string }> = {
  low: {
    label: "Faible",
    classes: "bg-success/15 text-success ring-1 ring-inset ring-success/20",
    dot: "bg-success",
  },
  medium: {
    label: "Moyen",
    classes: "bg-warn/15 text-warn ring-1 ring-inset ring-warn/20",
    dot: "bg-warn",
  },
  high: {
    label: "Élevé",
    classes: "bg-live-red/15 text-live-red ring-1 ring-inset ring-live-red/20",
    dot: "bg-live-red",
  },
};

const ICONS = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
};

export function SeverityBadge({ level, size = "md", className }: SeverityBadgeProps) {
  const cfg = LEVELS[level];
  const Icon = ICONS[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap",
        size === "sm" ? "h-6 px-2 text-[10px]" : "h-7 px-2.5 text-[11px]",
        "uppercase tracking-[0.14em]",
        cfg.classes,
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} strokeWidth={2.5} aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}