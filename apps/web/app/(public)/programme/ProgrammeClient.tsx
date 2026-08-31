"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { TimelineEvent } from "@/components/domain/TimelineEvent";
import { EmptyState } from "@/components/domain/EmptyState";
import { Calendar } from "lucide-react";
import type { ProgrammeEvent } from "@/types";
import { FESTIVAL_YEAR } from "@/constants/festival";
import { useAuthStore } from "@/stores/auth";
import { getFavoris, toggleFavori } from "@/services/programme";

export function ProgrammeClient({ events }: { events: ProgrammeEvent[] }) {
  const me = useAuthStore((s) => s.user);
  const [favoris, setFavoris] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!me) return;
    let alive = true;
    getFavoris()
      .then((favs) => {
        if (!alive) return;
        setFavoris(new Set(favs.map((f) => Number(f.id))));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [me]);

  const eventsWithFav = useMemo(
    () => events.map((e) => ({ ...e, isFavori: favoris.has(Number(e.id)) })),
    [events, favoris],
  );

  const days = useMemo(() => {
    const order: { id: string; label: string }[] = [];
    const seen = new Set<string>();
    const sorted = [...eventsWithFav].sort((a, b) =>
      (a.day ?? a.dayLabel ?? "").localeCompare(b.day ?? b.dayLabel ?? ""),
    );
    for (const e of sorted) {
      const key = e.day ?? "";
      if (!seen.has(key)) {
        seen.add(key);
        order.push({ id: key, label: e.dayLabel ?? key });
      }
    }
    return order;
  }, [eventsWithFav]);

  const [activeDay, setActiveDay] = useState<string>(days[0]?.id ?? "");
  const filtered = useMemo(
    () => eventsWithFav.filter((e) => (e.day ?? "") === activeDay),
    [eventsWithFav, activeDay],
  );

  async function handleFavorite(id: number) {
    if (!me) return;
    try {
      const res = await toggleFavori(id);
      setFavoris((prev) => {
        const next = new Set(prev);
        if (res.is_favori) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch {}
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Festival ${FESTIVAL_YEAR}`}
        title="Programme"
        subtitle="Découvrez toutes les sessions, masterclasses et événements du festival."
      />

      {days.length > 1 ? (
        <Tabs
          items={days.map((d) => ({ id: d.id, label: d.label }))}
          defaultValue={days[0]?.id}
          onChange={setActiveDay}
        />
      ) : (
        days[0] && (
          <h2 className="flex items-center gap-2 text-h3 font-semibold text-gold capitalize">
            <Calendar className="h-5 w-5" />
            {days[0].label}
          </h2>
        )
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="Aucun événement programmé"
          description="Le programme de cette journée sera bientôt disponible."
        />
      ) : (
        <div className="space-y-8">
          {filtered.map((e, i) => (
            <TimelineEvent
              key={e.id}
              event={e}
              first={i === 0}
              last={i === filtered.length - 1}
              onFavorite={() => handleFavorite(Number(e.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
