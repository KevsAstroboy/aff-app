import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

type StatCardProps = {
  icon: ReactNode;
  value: string | number;
  label: string;
  delta?: { value: number; isPositive: boolean; suffix: string };
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

export function StatCard({ icon, value, label, delta, iconColor = "gold", className }: StatCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md",
            ICON_COLORS[iconColor]
          )}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="text-h2 font-bold text-text tabular-nums">{value}</div>
        <div className="mt-2 text-eyebrow uppercase tracking-[0.18em] text-text-muted">{label}</div>
      </div>
      {delta && (
        <Tag color={delta.isPositive ? "success" : "live-red"} variant="chip" size="sm">
          {delta.isPositive ? "+" : ""}
          {delta.value}
          <span className="ml-1 font-normal text-text-muted">{delta.suffix}</span>
        </Tag>
      )}
    </Card>
  );
}
