"use client";

import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { flag } from "@/lib/flags";
import type { CountryCode } from "@/types";

export type ParticipantRole = "EXPERT" | "MODERATOR" | "PARTICIPANT";

type ParticipantItemProps = {
  initials: string;
  name: string;
  role: ParticipantRole;
  country: CountryCode;
  raisedHand?: boolean;
  className?: string;
};

const ROLE_COLOR: Record<ParticipantRole, "warn" | "purple" | "muted"> = {
  EXPERT: "warn",
  MODERATOR: "purple",
  PARTICIPANT: "muted",
};

export function ParticipantItem({
  initials,
  name,
  role,
  country,
  raisedHand,
  className,
}: ParticipantItemProps) {
  const [muted, setMuted] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-surface-hover",
        className
      )}
    >
      <div className="relative">
        <Avatar initials={initials} size="md" />
        {raisedHand && (
          <span className="absolute -top-1 -right-1 text-sm" aria-label="Main levée">
            👋
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body font-semibold text-text truncate">{name}</span>
          <span className="text-body">{flag(country)}</span>
        </div>
        <div className="mt-0.5">
          <Tag color={ROLE_COLOR[role]} size="sm" variant="label">
            {role}
          </Tag>
        </div>
      </div>
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Activer le micro" : "Couper le micro"}
        className={cn(
          "h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors",
          muted
            ? "text-live-red bg-live-red/10"
            : "text-text-muted hover:bg-surface-hover hover:text-text"
        )}
      >
        {muted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
