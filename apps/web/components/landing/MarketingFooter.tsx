import Link from "next/link";
import { FESTIVAL_YEAR } from "@/constants/festival";

const COLUMNS = [
  {
    title: "Festival",
    links: [
      { label: "Programme", href: "/programme" },
      { label: "Masterclass", href: "/masterclass" },
      { label: "Awards", href: "/awards" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Feed", href: "/feed" },
      { label: "Messages", href: "/messages" },
      { label: "Groupes", href: "/accueil" },
    ],
  },
  {
    title: "Le festival",
    links: [
      { label: "À propos", href: "#" },
      { label: "Partenaires", href: "#" },
      { label: "Presse", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "#" },
      { label: "Conditions", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-border bg-surface/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-gold">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="12" r="7" opacity="0.4" />
                  <circle cx="12" cy="12" r="10" opacity="0.2" />
                </svg>
              </span>
              <div className="leading-tight">
                <div className="text-eyebrow text-gold tracking-[0.2em]">AFF</div>
                <div className="text-small text-text-muted">{FESTIVAL_YEAR}</div>
              </div>
            </Link>
            <p className="max-w-sm text-small text-text-muted">
              Le plus grand festival des industries créatives africaines. Palais de la Culture,
              Abidjan — 19 &amp; 20 Août {FESTIVAL_YEAR}.
            </p>
            <div className="flex items-center gap-3 text-small text-text-muted">
              <span>contact@aff{FESTIVAL_YEAR}.ci</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-3">
              <div className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-small text-text-muted hover:text-gold transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-small text-text-muted">
            © {FESTIVAL_YEAR} Africa Future Festival. Tous droits réservés.
          </p>
          <p className="text-small text-text-muted">
            Abidjan · Côte d&apos;Ivoire
          </p>
        </div>
      </div>
    </footer>
  );
}
