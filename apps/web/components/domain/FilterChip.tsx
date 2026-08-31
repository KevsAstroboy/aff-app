import type { CommunityId } from "@/types";
import { COMMUNITY_TEXT_COLORS } from "@/constants/communautes";
import { cn } from "@/lib/cn";

type FilterChipProps = {
  id: CommunityId | "all";
  label: string;
  count: number;
  color?: string;
  active?: boolean;
  onClick?: () => void;
};

export function FilterChip({ label, count, color, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 px-3 h-10 rounded-md transition-all duration-150 w-full",
        active
          ? "bg-gold-soft text-gold"
          : "text-text-muted hover:bg-surface-hover hover:text-text"
      )}
    >
      {color && (
        <span className={cn("h-2 w-2 rounded-full shrink-0", color)} aria-hidden="true" />
      )}
      <span className="flex-1 text-left text-body">{label}</span>
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-surface-hover px-1.5 text-small tabular-nums text-text-muted">
        {count}
      </span>
    </button>
  );
}

export function communityColorClass(id: CommunityId): string {
  return COMMUNITY_TEXT_COLORS[id]
    .replace("text-", "bg-")
    .replace(/-\d+$/, "");
}
