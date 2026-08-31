import { Trophy, Globe, Smartphone, Calendar as CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/domain/StatCard";
import { FeatureCard } from "@/components/domain/FeatureCard";
import { CategorySection } from "@/components/domain/CategorySection";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAwardsBySection } from "@/services/awards";
import { FESTIVAL_YEAR } from "@/constants/festival";

export const dynamic = 'force-dynamic';

const SECTIONS_ORDER = [
  "Image & Visuel",
  "Son & Scène",
  "Mode & Style",
  "Digital & Influence",
  "Architecture & Espace",
  "Entrepreneuriat & Impact",
  "Catégories spéciales",
];

export default async function AwardsPage() {
  const bySection = await getAwardsBySection();

  const all = Object.values(bySection).flat();
  const grandPrixId =
    all.find((c) => c.isGrandPrix)?.id ??
    all.find((c) => c.section === "Catégories spéciales")?.id ??
    all[0]?.id ??
    null;
  const submitHref = grandPrixId ? `/awards/candidater/${grandPrixId}` : null;

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={`Édition ${FESTIVAL_YEAR}`}
        title="Africa Future Awards"
        subtitle="Célébrer l'excellence et l'innovation des industries créatives africaines"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Trophy className="h-5 w-5" />} iconColor="warn" value="25+" label="Trophées" />
        <StatCard icon={<Globe className="h-5 w-5" />} iconColor="gold" value="Expert" label="Jury international" />
        <StatCard icon={<Smartphone className="h-5 w-5" />} iconColor="purple" value="Via App" label="Vote live" />
        <StatCard icon={<CalendarIcon className="h-5 w-5" />} iconColor="success" value="20/08" label="Cérémonie" />
      </div>

      <FeatureCard
        eyebrow="Trophée suprême"
        title={
          <span className="block">
            <span className="block">Grand Prix</span>
            <span className="block">Africa Future</span>
          </span>
        }
        description="Le prix le plus prestigieux récompensant la personnalité créative ayant le plus marqué l'année par son innovation, son impact et sa contribution exceptionnelle aux industries créatives africaines."
        action={
          submitHref ? (
            <a href={submitHref}>
              <Button size="lg">Soumettre ma candidature</Button>
            </a>
          ) : (
            <Button size="lg" disabled>
              Soumettre ma candidature
            </Button>
          )
        }
      />

      {SECTIONS_ORDER.map((section) => {
        const cats = bySection[section] ?? [];
        if (cats.length === 0) return null;
        return <CategorySection key={section} eyebrow={section} categories={cats} />;
      })}

      <Card className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-h2 font-bold text-text">
            Candidatures ouvertes jusqu&apos;au 30 Juillet {FESTIVAL_YEAR}
          </h3>
          <p className="text-body text-text-muted">
            Partagez votre portfolio, vos projets et votre vision créative
          </p>
        </div>
        <Button size="lg">Télécharger le dossier de candidature</Button>
      </Card>
    </div>
  );
}
