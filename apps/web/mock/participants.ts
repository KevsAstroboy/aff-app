import type { CountryCode } from "@/types";

export type Participant = {
  id: string;
  initials: string;
  name: string;
  role: "EXPERT" | "MODERATOR" | "PARTICIPANT";
  country: CountryCode;
  raisedHand?: boolean;
};

export const PARTICIPANTS_BY_MASTERCLASS: Record<string, Participant[]> = {
  "m-001": [
    { id: "p-001", initials: "MD", name: "Maïmouna Doucouré", role: "EXPERT", country: "CI" },
    { id: "p-002", initials: "KM", name: "Kofi Mensah", role: "MODERATOR", country: "GH" },
    { id: "p-003", initials: "AD", name: "Aminata Diallo", role: "PARTICIPANT", country: "SN", raisedHand: true },
    { id: "p-004", initials: "TB", name: "Tunde Bakare", role: "PARTICIPANT", country: "NG" },
    { id: "p-005", initials: "FK", name: "Fatou Keïta", role: "PARTICIPANT", country: "CI", raisedHand: true },
    { id: "p-006", initials: "YD", name: "Yaw Darko", role: "PARTICIPANT", country: "GH" },
    { id: "p-007", initials: "NB", name: "Nadia Benali", role: "PARTICIPANT", country: "MA" },
    { id: "p-008", initials: "CO", name: "Chidi Okeke", role: "PARTICIPANT", country: "NG" },
  ],
};
