// Parser explicite pour les dates du backend, envoyées en "dd/MM/yyyy HH:mm:ss".
// "new Date('02/08/2026 ...')" serait interprété en MM/DD/yyyy (=> 8 févr. au lieu de 2 août).
export function parseDate(input: Date | string): Date {
  if (input instanceof Date) return input;
  const s = String(input).trim();
  const m = s.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (m) {
    return new Date(
      +m[3],
      +m[2] - 1,
      +m[1],
      +(m[4] ?? 0),
      +(m[5] ?? 0),
      +(m[6] ?? 0),
    );
  }
  return new Date(s);
}

export function relativeTime(date: Date | string): string {
  const d = parseDate(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "il y a quelques secondes";
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
  const days = Math.floor(seconds / 86400);
  if (days === 1) return "Hier";
  if (days < 7) return `il y a ${days} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function compactNumber(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function formatDateTime(date: Date | string): string {
  const d = parseDate(date);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateLong(date: Date | string): string {
  const d = parseDate(date);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}