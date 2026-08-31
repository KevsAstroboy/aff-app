"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type ReactionButtonProps = {
  emoji: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
};

export function ReactionButton({ emoji, count, active: initialActive, onClick }: ReactionButtonProps) {
  const [active, setActive] = useState(initialActive ?? false);
  const [localCount, setLocalCount] = useState(count);

  const handle = () => {
    setActive((a) => {
      const next = !a;
      setLocalCount((c) => c + (next ? 1 : -1));
      return next;
    });
    onClick?.();
  };

  return (
    <button
      onClick={handle}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-small transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        active
          ? "bg-gold-soft border-gold/40 text-gold"
          : "bg-surface-raised border-border text-text hover:border-border-strong"
      )}
    >
      <span>{emoji}</span>
      <span className="tabular-nums">{localCount}</span>
    </button>
  );
}
