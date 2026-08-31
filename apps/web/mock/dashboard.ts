import type { ActivityItem, DashboardKPI } from "@/types";

export const DASHBOARD_KPIS: DashboardKPI[] = [
  {
    label: "Utilisateurs total",
    value: 1427,
    icon: "users",
    delta: { value: 12, isPositive: true, suffix: "% ce mois" },
  },
  {
    label: "Masterclasses",
    value: 38,
    icon: "masterclass",
    delta: { value: 1, isPositive: true, suffix: "en direct" },
  },
  {
    label: "Publications",
    value: 847,
    icon: "publication",
    delta: { value: 89, isPositive: true, suffix: "aujourd'hui" },
  },
  {
    label: "Signalements",
    value: 4,
    icon: "report",
    delta: { value: 2, isPositive: false, suffix: "urgents" },
  },
];

export const DASHBOARD_ACTIVITY: ActivityItem[] = [
  {
    id: "act-001",
    icon: "user",
    message: "Nouvel utilisateur inscrit : Aminata Diallo",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: "act-002",
    icon: "masterclass",
    message: 'Masterclass "Cinéma africain" — EN DIRECT (124 participants)',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "act-003",
    icon: "report",
    message: "Nouveau signalement sur la publication #3 (Priorité haute)",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-004",
    icon: "publication",
    message: "Publication en attente de validation : @utilisateur_test",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-005",
    icon: "resolve",
    message: "Signalement #3 résolu par l'admin",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-006",
    icon: "community",
    message: 'Communauté "Gastronomie" passée en inactif',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export const DASHBOARD_TOP_COMMUNAUTES: { id: string; name: string; members: number; color: string }[] = [
  { id: "art", name: "Art", members: 342, color: "bg-domain-art" },
  { id: "musique", name: "Musique", members: 289, color: "bg-domain-musique" },
  { id: "cinema", name: "Cinéma", members: 231, color: "bg-domain-cinema" },
  { id: "mode", name: "Mode", members: 198, color: "bg-domain-mode" },
  { id: "danse", name: "Danse", members: 156, color: "bg-domain-danse" },
];
