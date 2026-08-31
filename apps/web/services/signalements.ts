import { apiClient } from "@/lib/api-client";
import { SIGNALEMENTS } from "@/mock/signalements";
import { latency, sleep } from "@/lib/sleep";
import { unwrap, type BackendSignalement } from "@/lib/adapters";
import type { Signalement } from "@/types";

const TYPE_MAP: Record<string, "publication" | "commentaire" | "utilisateur"> = {
  publication: "publication",
  post: "publication",
  commentaire: "commentaire",
  comment: "commentaire",
  utilisateur: "utilisateur",
  user: "utilisateur",
};

const SEV_MAP: Record<string, "low" | "medium" | "high"> = {
  low: "low",
  faible: "low",
  1: "low",
  medium: "medium",
  moyen: "medium",
  2: "medium",
  high: "high",
  eleve: "high",
  élevé: "high",
  3: "high",
};

const STATUS_MAP: Record<string, "open" | "resolved" | "closed"> = {
  open: "open",
  ouvert: "open",
  1: "open",
  resolved: "resolved",
  resolu: "resolved",
  résolu: "resolved",
  2: "resolved",
  closed: "closed",
  classe: "closed",
  3: "closed",
};

function adapt(s: BackendSignalement, idx: number): Signalement {
  return {
    id: String(s.id ?? idx),
    type: TYPE_MAP[(s.type ?? "").toLowerCase()] ?? "publication",
    severity: SEV_MAP[(s.severity ?? "").toLowerCase()] ?? "medium",
    status: STATUS_MAP[(s.status ?? "").toLowerCase()] ?? "open",
    subject: s.subject ?? `Signalement #${s.id ?? idx}`,
    reportedBy: s.reportedBy ?? s.reported_by ?? "Anonyme",
    reason: s.reason ?? s.motif ?? "",
    createdAt: s.created_at ?? new Date().toISOString(),
  };
}

export async function getSignalements(): Promise<Signalement[]> {
  try {
    const data = await apiClient.get<BackendSignalement[]>(
      "/moderation/get-by-criteria"
    );
    return unwrap(data).map(adapt);
  } catch {
    await sleep(latency());
    return SIGNALEMENTS;
  }
}

export async function resolveSignalement(id: string): Promise<void> {
  try {
    await apiClient.patch(`/moderation/${id}/resolve`);
  } catch {
    await sleep(latency());
    const s = SIGNALEMENTS.find((x) => x.id === id);
    if (s) s.status = "resolved";
  }
}

export async function closeSignalement(id: string): Promise<void> {
  try {
    await apiClient.patch(`/moderation/${id}/close`);
  } catch {
    await sleep(latency());
    const s = SIGNALEMENTS.find((x) => x.id === id);
    if (s) s.status = "closed";
  }
}