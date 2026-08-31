import { cn } from "@/lib/cn";
import { STATUS_CONFIG, type StatusKind, getStatusClassName } from "@/lib/status-config";

type StatusPillProps = {
  kind: StatusKind;
  size?: "sm" | "md";
  className?: string;
};

const DOT_COLOR: Record<StatusKind, string> = {
  live: "bg-live-red",
  pending: "bg-warn",
  terminated: "bg-text-subtle",
  cancelled: "bg-text-subtle",
  active: "bg-success",
  inactive: "bg-text-subtle",
  waiting: "bg-warn",
  suspended: "bg-live-red",
  published: "bg-success",
  validated: "bg-success",
  rejected: "bg-live-red",
  open: "bg-live-red",
  resolved: "bg-success",
  closed: "bg-text-subtle",
  treated: "bg-text-subtle",
  low: "bg-success",
  medium: "bg-warn",
  high: "bg-live-red",
  hot: "bg-warn",
  announce: "bg-gold",
  record: "bg-purple",
  partner: "bg-success",
};

export function StatusPill({ kind, size = "md", className }: StatusPillProps) {
  const cfg = STATUS_CONFIG[kind];
  const isPulsing = kind === "live" || kind === "open";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-semibold whitespace-nowrap",
        size === "sm" ? "h-6 px-2 text-[10px]" : "h-7 px-2.5 text-[11px]",
        "uppercase tracking-[0.14em]",
        getStatusClassName(kind),
        className
      )}
    >
      {isPulsing ? (
        <span className="relative inline-flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-live-red opacity-60 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live-red" />
        </span>
      ) : (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT_COLOR[kind])}
          aria-hidden="true"
        />
      )}
      <span>{cfg.label}</span>
    </span>
  );
}