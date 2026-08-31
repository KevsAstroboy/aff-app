import { cn } from "@/lib/cn";

type LiveIndicatorProps = {
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export function LiveIndicator({ label = "En direct", size = "md", className }: LiveIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-live-red font-semibold",
        size === "sm" ? "text-eyebrow tracking-[0.15em]" : "text-small tracking-[0.18em] uppercase",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-live-red animate-pulse-soft" />
      {label}
    </span>
  );
}
