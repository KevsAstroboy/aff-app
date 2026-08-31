// Année de l'édition courante — dérivée automatiquement du jour d'ouverture,
// ne doit jamais être fixée en dur ailleurs.
export const FESTIVAL_START = new Date("2026-08-19T09:00:00Z");

export const FESTIVAL_YEAR: number = FESTIVAL_START.getFullYear();

export function festivalYear(): number {
  return FESTIVAL_YEAR;
}