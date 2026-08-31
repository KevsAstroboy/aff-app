import type { CommunityId } from "@/types";

export const COMMUNITY_COLORS: Record<CommunityId, string> = {
  art: "bg-domain-art",
  musique: "bg-domain-musique",
  cinema: "bg-domain-cinema",
  mode: "bg-domain-mode",
  danse: "bg-domain-danse",
  litterature: "bg-domain-litterature",
  gastronomie: "bg-warn",
};

export const COMMUNITY_TEXT_COLORS: Record<CommunityId, string> = {
  art: "text-domain-art",
  musique: "text-domain-musique",
  cinema: "text-domain-cinema",
  mode: "text-domain-mode",
  danse: "text-domain-danse",
  litterature: "text-domain-litterature",
  gastronomie: "text-warn",
};
