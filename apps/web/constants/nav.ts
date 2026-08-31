import type { CommunityId } from "@/types";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};

export const NAV_PUBLIC: NavItem[] = [
  { label: "Accueil", href: "/accueil", icon: "Home" },
  { label: "Masterclass", href: "/masterclass", icon: "Radio" },
  { label: "Feed", href: "/feed", icon: "LayoutGrid" },
  { label: "Programme", href: "/programme", icon: "Calendar" },
  { label: "Awards", href: "/awards", icon: "Trophy" },
  { label: "Messages", href: "/messages", icon: "MessageSquare" },
  { label: "Profil", href: "/profil", icon: "User" },
];

export const NAV_ADMIN: NavItem[] = [
  { label: "Tableau de bord", href: "/admin/tableau-de-bord", icon: "LayoutDashboard" },
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: "Users", badge: 1 },
  { label: "Communautés", href: "/admin/communautes", icon: "BookOpen" },
  { label: "Publications", href: "/admin/publications", icon: "FileText", badge: 2 },
  { label: "Programme", href: "/admin/programmes", icon: "Calendar", badge: 1 },
  { label: "Masterclasses", href: "/admin/masterclasses", icon: "Radio", badge: 1 },
  { label: "Commentaires", href: "/admin/commentaires", icon: "MessageCircle", badge: 1 },
  { label: "Awards", href: "/admin/awards", icon: "Trophy" },
  { label: "Éditions", href: "/admin/editions", icon: "Calendar" },
  { label: "Lieux", href: "/admin/lieu", icon: "MapPin" },
  { label: "Profils & Features", href: "/admin/profils", icon: "Shield" },
  { label: "Signalements", href: "/admin/signalements", icon: "Flag", badge: 2 },
];

export const COMMUNITY_LABEL: Record<CommunityId, string> = {
  art: "Art",
  musique: "Musique",
  cinema: "Cinéma",
  mode: "Mode",
  danse: "Danse",
  litterature: "Littérature",
  gastronomie: "Gastronomie",
};
