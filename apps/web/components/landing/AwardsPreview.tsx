import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { FESTIVAL_YEAR } from "@/constants/festival";

type FeaturedAward = {
  title: string;
  description: string;
  badge: string;
};

const FEATURED: FeaturedAward[] = [
  {
    title: "Grand Prix Africa Future",
    badge: "Trophée suprême",
    description: "La plus haute distinction, célébrant une carrière qui a marqué l'année créative africaine.",
  },
  {
    title: "Meilleur Photographe",
    badge: "Image",
    description: "L'œil qui raconte, fige et révèle l'Afrique contemporaine à travers ses séries marquantes.",
  },
  {
    title: "Meilleur Artiste Musical",
    badge: "Son",
    description: "L'artiste dont le son a transcendé les frontières et porté la scène africaine plus loin.",
  },
];

export function AwardsPreview() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="text-eyebrow uppercase tracking-[0.2em] text-gold">Awards {FESTIVAL_YEAR}</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-text">
              <span className="text-gold">25 catégories</span> à découvrir
            </h2>
            <p className="max-w-2xl text-lg text-text-muted">
              Le festival récompense l&apos;excellence dans toutes les disciplines créatives du continent.
            </p>
          </div>
          <Link
            href="/accueil"
            className="inline-flex items-center gap-2 text-small font-semibold text-gold hover:text-gold-hover transition-colors whitespace-nowrap"
          >
            Toutes les catégories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURED.map((a) => (
            <div
              key={a.title}
              className="group relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 via-surface to-surface p-8 transition-all duration-300 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10"
            >
              <div className="relative space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-gold">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="text-eyebrow uppercase tracking-[0.18em] text-gold">{a.badge}</div>
                <h3 className="text-h2 font-bold text-gold leading-tight">{a.title}</h3>
                <p className="text-body text-text-muted">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
