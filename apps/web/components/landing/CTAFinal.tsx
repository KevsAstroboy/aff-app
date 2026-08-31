import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTAFinal() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gold/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/10 via-surface to-gold/5 p-12 backdrop-blur-sm">
          <div className="pointer-events-none absolute -top-12 -right-12 opacity-10">
            <svg viewBox="0 0 200 200" className="h-72 w-72" fill="none" stroke="currentColor" strokeWidth="1">
              {Array.from({ length: 10 }).map((_, i) => (
                <circle key={i} cx="100" cy="100" r={10 + i * 10} className="text-gold" />
              ))}
            </svg>
          </div>

          <div className="relative space-y-6 text-center">
            <div className="text-eyebrow uppercase tracking-[0.2em] text-gold">
              Prêt à rejoindre l&apos;élite ?
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight">
              Connectez-vous à la<br />
              <span className="text-gold">communauté créative africaine</span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-text-muted">
              10 000+ innovateurs, 4 200 artistes, 25 awards. Votre place vous attend.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 h-14 px-10 rounded-xl bg-gold text-bg text-lg font-bold hover:bg-gold-hover transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Se connecter
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center h-14 px-10 rounded-xl border border-gold/50 text-gold text-lg font-semibold hover:bg-gold-soft transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
