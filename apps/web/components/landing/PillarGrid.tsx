import { Camera, Video, Palette, Music, Shirt, Cpu } from "lucide-react";
import { cn } from "@/lib/cn";

const PILLARS = [
  {
    icon: Camera,
    title: "Image & Visuel",
    description: "Photographie, cinéma, design graphique et IA créative.",
  },
  {
    icon: Music,
    title: "Son & Scène",
    description: "Afrobeats, jazz, podcast, beatmaking et performances live.",
  },
  {
    icon: Shirt,
    title: "Mode & Style",
    description: "Couture africaine, design textile et marques durables.",
  },
  {
    icon: Cpu,
    title: "Digital & Influence",
    description: "Content creators, chaînes créatives et impact social.",
  },
  {
    icon: Palette,
    title: "Architecture & Espace",
    description: "Architecture contemporaine et design d'intérieur.",
  },
  {
    icon: Video,
    title: "Entrepreneuriat",
    description: "Startups créatives, leadership et projets à impact.",
  },
];

export function PillarGrid() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center space-y-4">
          <div className="text-eyebrow uppercase tracking-[0.2em] text-gold">Univers créatif</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-text">
            6 piliers, <span className="text-gold">une vision</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Un festival conçu pour célébrer toutes les expressions de la créativité africaine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={cn(
                  "group relative rounded-2xl border border-border bg-surface p-8 transition-all duration-300",
                  "hover:border-gold/40 hover:bg-surface-raised hover:-translate-y-1"
                )}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft text-gold transition-all group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-h3 font-semibold text-text">{p.title}</h3>
                <p className="mt-3 text-body text-text-muted">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
