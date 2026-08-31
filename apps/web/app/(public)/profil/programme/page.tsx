import { Heart, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { TimelineEvent } from "@/components/domain/TimelineEvent";
import { EmptyState } from "@/components/domain/EmptyState";
import { getFavoris } from "@/services/programme";
import { unwrap, type BackendProgramme } from "@/lib/adapters";

export const dynamic = 'force-dynamic';

type DisplayEvent = {
  id: string;
  day: "samedi" | "dimanche";
  startTime: string;
  endTime: string;
  title: string;
  expert?: string;
  venue: string;
  isHot: boolean;
};

export default async function ProgrammePersoPage() {
  let events: DisplayEvent[] = [];
  try {
    const data = await getFavoris();
    events = unwrap(data as unknown as BackendProgramme[]).map((e, i) => ({
      id: String(e.id ?? i),
      day: (e.jour ?? "samedi") as "samedi" | "dimanche",
      startTime: e.start_time?.slice(0, 5) ?? "10:00",
      endTime: e.end_time?.slice(0, 5) ?? "11:00",
      title: e.libelle ?? e.title ?? `Événement #${e.id}`,
      expert: e.expert,
      venue: e.venue ?? "",
      isHot: e.is_hot ?? false,
    }));
  } catch {
    events = [];
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Profil", href: "/profil" },
          { label: "Programme personnalisé" },
        ]}
      />
      <PageHeader
        eyebrow="Mon planning"
        title="Programme personnalisé"
        subtitle="Les sessions et événements que vous avez ajoutés à votre programme."
      />

      {events.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="Aucun favori"
          description="Ajoutez des sessions depuis le programme du festival."
        />
      ) : (
        <div className="space-y-8">
          {events.map((e, i) => (
            <TimelineEvent
              key={e.id}
              event={e}
              first={i === 0}
              last={i === events.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}