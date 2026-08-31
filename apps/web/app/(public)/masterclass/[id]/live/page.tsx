import { notFound } from "next/navigation";
import { Wifi, Hand, ThumbsUp, PartyPopper, Smile, PhoneOff, Radio } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { MasterclassLiveCard } from "@/components/domain/MasterclassLiveCard";
import { ParticipantItem } from "@/components/domain/ParticipantItem";
import { ReactionButton } from "@/components/domain/ReactionButton";
import { LiveIndicator } from "@/components/domain/LiveIndicator";
import { getLiveSession, getMasterclasses } from "@/services/masterclasses";
import { getParticipants } from "@/services/participants";
import { COMMUNITY_LABEL } from "@/constants/nav";

export const dynamic = 'force-dynamic';

type Params = { id: string };

export default async function MasterclassLivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const [live, all, participants] = await Promise.all([
    getLiveSession(),
    getMasterclasses(),
    getParticipants(id),
  ]);

  const session = live && live.id === id ? live : all.find((m) => m.id === id);
  if (!session) notFound();

  const expert = session.expert;
  const initials = expert
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const otherSessions = all.filter((m) => m.id !== id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Masterclass — En direct"
        title={session.title}
        actions={
          <div className="flex items-center gap-2">
            <Tag color="warn" size="sm" icon={<Wifi className="h-3 w-3" />}>
              HD
            </Tag>
            <LiveIndicator />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_320px]">
        {/* Left: other sessions */}
        <aside className="space-y-4 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto scrollbar-thin">
          <h2 className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Autres sessions
          </h2>
          {otherSessions.map((m) => (
            <MasterclassLiveCard key={m.id} masterclass={m} variant="sidebar" />
          ))}
        </aside>

        {/* Center: main stage */}
        <Card className="relative flex flex-col items-center justify-center gap-8 min-h-[480px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple/10 via-transparent to-gold/5 pointer-events-none" />
          <div className="relative flex flex-col items-center gap-6">
            <Avatar initials={initials} size="xl" />
            <div className="text-center space-y-1">
              <h3 className="text-h2 font-bold text-text">{expert}</h3>
              <p className="text-body text-text-muted">Réalisatrice &amp; Productrice</p>
            </div>
          </div>
        </Card>

        {/* Right: participants */}
        <aside className="space-y-4 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between">
            <h2 className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
              Participants ({participants.length})
            </h2>
          </div>
          <div className="space-y-2">
            {participants.map((p) => (
              <ParticipantItem
                key={p.id}
                initials={p.initials}
                name={p.name}
                role={p.role}
                country={p.country}
                raisedHand={p.raisedHand}
              />
            ))}
          </div>
        </aside>
      </div>

      {/* Bottom control bar */}
      <Card className="flex flex-wrap items-center justify-between gap-4 sticky bottom-4">
        <div className="flex items-center gap-3">
          <span className="text-small text-text-muted uppercase tracking-[0.18em]">
            Réactions rapides
          </span>
          <div className="flex items-center gap-2">
            <ReactionButton emoji="❤️" count={42} />
            <ReactionButton emoji="👏" count={18} />
            <ReactionButton emoji="🔥" count={31} />
            <ReactionButton emoji="🎉" count={9} />
            <ReactionButton emoji="😄" count={14} />
          </div>
        </div>
        <Button variant="danger">
          <PhoneOff className="h-4 w-4" />
          Quitter
        </Button>
      </Card>
    </div>
  );
}
