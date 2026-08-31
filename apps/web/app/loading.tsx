export default function RootLoading() {
  return (
    <div
      role="status"
      aria-label="Chargement"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-bg/70 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-surface px-5 py-3 shadow-lg">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" aria-hidden />
        <span className="text-small text-text-muted">Chargement…</span>
      </div>
    </div>
  );
}