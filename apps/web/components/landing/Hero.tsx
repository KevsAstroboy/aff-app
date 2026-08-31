import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { FESTIVAL_YEAR } from "@/constants/festival";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Background ornaments */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute top-1/2 left-0 h-[400px] w-[400px] rounded-full bg-purple/10 blur-[100px]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-domain-cinema/10 blur-[100px]" />
      </div>

      {/* Decorative concentric rings */}
      <div className="pointer-events-none absolute -top-20 -right-32 opacity-[0.08]">
        <svg viewBox="0 0 400 400" className="h-[600px] w-[600px]" fill="none" stroke="currentColor" strokeWidth="1">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="200" cy="200" r={40 + i * 25} className="text-gold" />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft px-4 py-1.5 text-eyebrow text-gold tracking-[0.18em]">
          <Sparkles className="h-3 w-3" />
          Édition {FESTIVAL_YEAR} · Palais de la Culture, Abidjan
        </div>

        <h1 className="mx-auto mt-8 max-w-5xl font-extrabold tracking-tight text-text">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-display leading-[0.95]">
            AFRICA <span className="text-gold">FUTURE</span>
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-display leading-[0.95]">
            FESTIVAL
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-text-muted">
          Le rendez-vous incontournable des industries créatives africaines.
          <span className="text-text"> 19 &amp; 20 Août {FESTIVAL_YEAR}</span>, deux jours pour célébrer, connecter et façonner l&apos;avenir.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/accueil"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-gold text-bg text-lg font-bold hover:bg-gold-hover transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Accéder à l&apos;application
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#programme"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-xl border border-gold/40 text-gold text-lg font-semibold hover:bg-gold-soft transition-colors"
          >
            Découvrir le programme
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-small text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-gold" />
            Entrée gratuite
          </span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-gold" />
            4 200+ créatifs attendus
          </span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-gold" />
            25+ Awards
          </span>
        </div>
      </div>
    </section>
  );
}
