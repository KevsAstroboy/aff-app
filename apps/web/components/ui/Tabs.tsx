"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = {
  id: string;
  label: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "pill" | "underline";
};

export function Tabs({ items, defaultValue, onChange, variant = "pill" }: TabsProps) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.id ?? "");

  const handle = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  if (variant === "pill") {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => handle(it.id)}
            aria-pressed={active === it.id}
            className={cn(
              "px-4 h-10 rounded-md text-body font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              active === it.id
                ? "bg-gold text-bg"
                : "bg-surface border border-border text-text hover:border-border-strong"
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 border-b border-border">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => handle(it.id)}
          aria-pressed={active === it.id}
          className={cn(
            "pb-3 -mb-px text-body font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            active === it.id
              ? "text-gold border-b-2 border-gold"
              : "text-text-muted hover:text-text"
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
