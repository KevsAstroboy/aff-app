import type { CountryCode } from "@/types";

export type NetworkContact = {
  id: string;
  initials: string;
  name: string;
  role: string;
  community: "art" | "musique" | "cinema" | "mode" | "danse" | "litterature";
  country: CountryCode;
  isFollowing: boolean;
};

export const NETWORK_CONTACTS: NetworkContact[] = [
  { id: "n-001", initials: "KO", name: "Kemi Onabanjo", role: "Artiste Digital", community: "art", country: "NG", isFollowing: true },
  { id: "n-002", initials: "TA", name: "Tolani Adeyemi", role: "Producteur", community: "musique", country: "NG", isFollowing: true },
  { id: "n-003", initials: "MD", name: "Maïmouna Doucouré", role: "Réalisatrice", community: "cinema", country: "CI", isFollowing: false },
  { id: "n-004", initials: "IA", name: "Imane Ayissi", role: "Créateur Mode", community: "mode", country: "MA", isFollowing: true },
  { id: "n-005", initials: "AD", name: "Aminata Diallo", role: "Danseuse", community: "danse", country: "SN", isFollowing: false },
  { id: "n-006", initials: "SM", name: "Scholastique Mukasonga", role: "Écrivaine", community: "litterature", country: "FR", isFollowing: true },
  { id: "n-007", initials: "SF", name: "Samuel Fosso", role: "Photographe", community: "art", country: "CI", isFollowing: true },
  { id: "n-008", initials: "OM", name: "Omar Mbaye", role: "Designer", community: "mode", country: "SN", isFollowing: false },
];
