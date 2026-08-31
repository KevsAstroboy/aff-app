import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  color?: "gold" | "live-red";
};

export function ProgressBar({ value, max, className, color = "gold" }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const overflow = value > max;
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline gap-1.5 text-body tabular-nums">
        <span className={cn("font-bold", overflow ? "text-live-red" : "text-text")}>{value}</span>
        <span className="text-text-muted">/{max}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            overflow || color === "live-red" ? "bg-live-red" : "bg-gold"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
