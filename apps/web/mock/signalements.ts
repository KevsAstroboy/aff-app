import type { Signalement } from "@/types";

export const SIGNALEMENTS: Signalement[] = [
  {
    id: "s-001",
    type: "publication",
    severity: "high",
    status: "open",
    subject: "Publication non-conforme de @inconnu",
    reportedBy: "Kemi O.",
    reason: "Contenu offensant et non lié aux industries créatives africaines",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "s-002",
    type: "commentaire",
    severity: "high",
    status: "open",
    subject: 'Commentaire de @anonyme sur "Lagos Nights"',
    reportedBy: "Tolani A.",
    reason: "Langage inapproprié et discours haineux",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "s-003",
    type: "utilisateur",
    severity: "medium",
    status: "resolved",
    subject: "Compte @spam_bot",
    reportedBy: "Maïmouna D.",
    reason: "Comportement de spam et usurpation d'identité",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "s-004",
    type: "publication",
    severity: "low",
    status: "closed",
    subject: "Publication publicitaire de @utilisateur_test",
    reportedBy: "Imane A.",
    reason: "Contenu promotionnel non autorisé",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];
