import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

type KPICardProps = {
  label: string;
  value: number;
  delta?: { value: number; isPositive: boolean; suffix?: string };
  icon: ReactNode;
  iconColor?: "gold" | "warn" | "success" | "purple" | "live-red";
  className?: string;
};

const ICON_COLORS = {
  gold: "text-gold bg-gold-soft",
  warn: "text-warn bg-warn/15",
  success: "text-success bg-success/15",
  purple: "text-purple bg-purple/15",
  "live-red": "text-live-red bg-live-red/15",
};

export function KPICard({ label, value, delta, icon, iconColor = "gold", className }: KPICardProps) {
  return (
    <Card className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="text-small text-text-muted">{label}</div>
        <div
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md",
            ICON_COLORS[iconColor]
          )}
        >
          {icon}
        </div>
      </div>
      <div className="text-h1 font-bold text-text tabular-nums">
        {value.toLocaleString("fr-FR")}
      </div>
      {delta && (
        <div
          className={cn(
            "text-small font-medium tabular-nums",
            delta.isPositive ? "text-success" : "text-live-red"
          )}
        >
          {delta.isPositive ? "+" : ""}
          {delta.value}
          {delta.suffix && <span className="ml-1">{delta.suffix}</span>}
        </div>
      )}
    </Card>
  );
}
