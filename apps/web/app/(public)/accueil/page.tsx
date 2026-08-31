import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/domain/StatCard";
import { Countdown } from "@/components/domain/Countdown";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Users, TrendingUp, Building, Award } from "lucide-react";
import { DISCIPLINES } from "@/constants/disciplines";
import { FESTIVAL_START, FESTIVAL_YEAR } from "@/constants/festival";
import { getProgramme } from "@/services/programme";

export const dynamic = 'force-dynamic';

const SPONSORS = ["Adobe", "Canva", "Spotify", "UNESCO", "Orange", "Meta", "Google"];

export default async function PublicHomePage() {
  const programme = await getProgramme();
  const nextEvent = programme[0];

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={`Édition ${FESTIVAL_YEAR}`}
        title={
          <span className="block leading-[1.05]">
            <span className="block">AFRICA FUTURE</span>
            <span className="block">FESTIVAL</span>
          </span>
        }
        subtitle={`Palais de la Culture, Abidjan — 19 & 20 Août ${FESTIVAL_YEAR}.`}
        actions={<Tag color="success" variant="chip">Entrée gratuite</Tag>}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          iconColor="gold"
          value="+10K"
          label="Participants"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="success"
          value="15+"
          label="Disciplines"
        />
        <StatCard
          icon={<Building className="h-5 w-5" />}
          iconColor="purple"
          value="+200"
          label="Exposants"
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          iconColor="warn"
          value="25+"
          label="Awards"
        />
      </div>

      <Card className="space-y-8">
        <Countdown target={FESTIVAL_START} />
        <div className="flex justify-center">
          <a
            href="/feed"
            className="inline-flex items-center h-12 px-6 rounded-md bg-gold text-bg font-semibold hover:bg-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            S&apos;inscrire maintenant
          </a>
        </div>
      </Card>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-h2 font-bold text-text">Disciplines créatives</h2>
          <span className="text-small text-text-muted">12 univers à explorer</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINES.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center px-4 h-10 rounded-md border border-border bg-surface text-body text-text hover:border-gold/40 hover:text-gold transition-colors cursor-pointer"
            >
              {d.label}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold text-text">Prochainement</h2>
        {nextEvent ? (
          <Card featured className="space-y-2">
            <Tag color="warn" size="sm">PROCHAINEMENT</Tag>
            <h3 className="text-h2 font-bold text-gold">{nextEvent.title}</h3>
            <div className="text-body text-text-muted">
              {nextEvent.startTime} – {nextEvent.endTime} · {nextEvent.venue}
            </div>
          </Card>
        ) : null}
      </section>

      <section className="space-y-6">
        <h2 className="text-eyebrow uppercase tracking-[0.2em] text-text-muted">Partenaires</h2>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-70">
          {SPONSORS.map((s) => (
            <span key={s} className="text-h3 font-semibold text-text-muted">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
