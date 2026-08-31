const SPONSORS = [
  "Adobe",
  "Canva",
  "Spotify",
  "UNESCO",
  "Orange",
  "Meta",
  "Google",
  "Apple Music",
];

export function SponsorsStrip() {
  return (
    <section className="relative border-y border-border bg-surface/50 py-16">
      <div className="mx-auto max-w-7xl px-6 text-center space-y-8">
        <p className="text-eyebrow uppercase tracking-[0.2em] text-text-muted">
          Soutenus par les meilleurs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {SPONSORS.map((s) => (
            <span
              key={s}
              className="text-xl font-bold tracking-tight text-text-muted/70 hover:text-text-muted transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
