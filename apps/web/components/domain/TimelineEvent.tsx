import { Flame, MapPin, CalendarPlus, Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Tag } from "@/components/ui/Tag";
import type { ProgrammeEvent } from "@/types";

type TimelineEventProps = {
  event: ProgrammeEvent;
  first?: boolean;
  last?: boolean;
  onAddToCalendar?: () => void;
  onFavorite?: () => void;
};

export function TimelineEvent({
  event,
  first,
  last,
  onAddToCalendar,
  onFavorite,
}: TimelineEventProps) {
  return (
    <div className="relative grid grid-cols-[60px_1fr] gap-4">
      <div className="relative flex justify-center">
        {!first && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-px bg-border" />
        )}
        <span
          className={cn(
            "absolute left-1/2 top-0 -translate-x-1/2 h-3 w-3 rounded-full border-2",
            event.isHot ? "bg-gold border-gold" : "bg-bg border-border-strong"
          )}
        />
        {!last && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 bottom-0 w-px bg-border" />
        )}
      </div>

      <Card
        featured={event.isHot}
        className="relative hover:border-border-strong transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-h3 font-bold text-gold tabular-nums">{event.startTime}</span>
              {event.isHot && (
                <Tag color="warn" size="sm" icon={<Flame className="h-3 w-3" />}>
                  HOT
                </Tag>
              )}
              {event.category && (
                <Tag color="gold" size="sm" variant="chip">
                  {event.category}
                </Tag>
              )}
            </div>
            <h3 className="text-h3 font-semibold text-text">{event.title}</h3>
            {event.expert && (
              <div className="text-body text-text-muted">Avec {event.expert}</div>
            )}
            <div className="flex items-center gap-1.5 text-small text-text-muted">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue}
            </div>
            <button
              onClick={onAddToCalendar}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-small text-text-muted hover:text-text hover:border-border-strong"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Ajouter à mon calendrier
            </button>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onFavorite} label={event.isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <Heart
              className={cn("h-4 w-4", event.isFavori && "fill-gold text-gold")}
            />
          </IconButton>
        </div>
      </Card>
    </div>
  );
}
