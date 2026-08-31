import { MapPin, Users, Wifi } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "./ProgressBar";
import { LiveIndicator } from "./LiveIndicator";
import { COMMUNITY_LABEL } from "@/constants/nav";
import type { Masterclass } from "@/types";

type MasterclassLiveCardProps = {
  masterclass: Masterclass;
  variant?: "list" | "sidebar";
  onJoin?: () => void;
};

export function MasterclassLiveCard({ masterclass, variant = "list", onJoin }: MasterclassLiveCardProps) {
  if (variant === "sidebar") {
    const active = masterclass.status === "live";
    return (
      <Card className={active ? "border-l-2 border-l-gold" : ""}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Tag color={`domain-${masterclass.community}` as never} size="sm">
            {COMMUNITY_LABEL[masterclass.community].toUpperCase()}
          </Tag>
          {active ? (
            <LiveIndicator label="EN DIRECT" size="sm" />
          ) : (
            <StatusPill kind={masterclass.status === "pending" ? "pending" : masterclass.status === "terminated" ? "terminated" : "cancelled"} />
          )}
        </div>
        <h3 className="text-body font-semibold text-text leading-snug mb-2">{masterclass.title}</h3>
        <div className="text-small text-text-muted">{masterclass.expert}</div>
        <div className="mt-3 flex items-center gap-3 text-small text-text-muted">
          <span className="inline-flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            {masterclass.date}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {masterclass.participants}/{masterclass.capacity}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 hover:border-border-strong transition-colors">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Tag color={`domain-${masterclass.community}` as never} size="sm">
          {COMMUNITY_LABEL[masterclass.community].toUpperCase()}
        </Tag>
        <div className="flex items-center gap-2">
          {masterclass.status === "live" ? (
            <LiveIndicator size="sm" />
          ) : (
            <StatusPill
              kind={
                masterclass.status === "pending"
                  ? "pending"
                  : masterclass.status === "terminated"
                    ? "terminated"
                    : "cancelled"
              }
            />
          )}
        </div>
      </div>

      <h3 className="text-h3 font-semibold text-text leading-snug">{masterclass.title}</h3>

      <div className="text-body text-text-muted">
        {masterclass.expert} · {masterclass.durationMin} min
      </div>

      <div className="flex items-center gap-2 text-small text-text-muted">
        <MapPin className="h-3.5 w-3.5" />
        {masterclass.date}
      </div>

      <div className="pt-2">
        <ProgressBar
          value={masterclass.participants}
          max={masterclass.capacity}
          color={masterclass.participants > masterclass.capacity ? "live-red" : "gold"}
        />
      </div>

      <button
        onClick={onJoin}
        disabled={masterclass.status === "terminated" || masterclass.status === "cancelled"}
        className="w-full h-10 rounded-md bg-gold text-bg font-medium hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {masterclass.status === "live" ? "Rejoindre maintenant" : "Voir les détails"}
      </button>
    </Card>
  );
}
