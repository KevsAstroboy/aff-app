import { type ClassValue } from "clsx";

export type StatusKind =
  | "live"
  | "pending"
  | "terminated"
  | "cancelled"
  | "active"
  | "inactive"
  | "waiting"
  | "suspended"
  | "published"
  | "validated"
  | "rejected"
  | "open"
  | "resolved"
  | "closed"
  | "treated"
  | "low"
  | "medium"
  | "high"
  | "hot"
  | "announce"
  | "record"
  | "partner";

type StatusConfig = {
  label: string;
  color:
    | "live-red"
    | "amber"
    | "muted"
    | "success"
    | "warn"
    | "purple"
    | "domain-cinema";
  variant: "solid" | "soft";
};

export const STATUS_CONFIG: Record<StatusKind, StatusConfig> = {
  live: { label: "En direct", color: "live-red", variant: "solid" },
  pending: { label: "En attente", color: "amber", variant: "soft" },
  terminated: { label: "Terminée", color: "muted", variant: "soft" },
  cancelled: { label: "Annulée", color: "muted", variant: "soft" },
  active: { label: "Actif", color: "success", variant: "soft" },
  inactive: { label: "Inactif", color: "muted", variant: "soft" },
  waiting: { label: "En attente", color: "amber", variant: "soft" },
  suspended: { label: "Suspendu", color: "live-red", variant: "soft" },
  published: { label: "Publié", color: "success", variant: "soft" },
  validated: { label: "Validé", color: "success", variant: "soft" },
  rejected: { label: "Rejeté", color: "live-red", variant: "soft" },
  open: { label: "Ouvert", color: "live-red", variant: "soft" },
  resolved: { label: "Résolu", color: "success", variant: "soft" },
  closed: { label: "Classé", color: "muted", variant: "soft" },
  treated: { label: "Traité", color: "muted", variant: "soft" },
  low: { label: "Faible", color: "success", variant: "soft" },
  medium: { label: "Moyen", color: "amber", variant: "soft" },
  high: { label: "Élevé", color: "live-red", variant: "soft" },
  hot: { label: "HOT", color: "amber", variant: "soft" },
  announce: { label: "ANNONCE", color: "amber", variant: "soft" },
  record: { label: "RECORD GUINNESS", color: "purple", variant: "soft" },
  partner: { label: "PARTENARIAT", color: "success", variant: "soft" },
};

import { cn } from "./cn";

export function getStatusClassName(kind: StatusKind): ClassValue {
  const cfg = STATUS_CONFIG[kind];
  if (cfg.variant === "solid" && cfg.color === "live-red") {
    return "bg-live-red/15 text-live-red";
  }
  if (cfg.color === "muted") {
    return "bg-white/5 text-text-muted";
  }
  if (cfg.color === "amber") {
    return "bg-warn/15 text-warn";
  }
  if (cfg.color === "success") {
    return "bg-success/15 text-success";
  }
  if (cfg.color === "live-red") {
    return "bg-live-red/15 text-live-red";
  }
  if (cfg.color === "purple") {
    return "bg-purple/15 text-purple";
  }
  if (cfg.color === "domain-cinema") {
    return "bg-purple/15 text-purple";
  }
  return cn();
}
