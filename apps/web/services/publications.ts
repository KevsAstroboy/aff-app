import { apiClient } from "@/lib/api-client";
import { PUBLICATIONS } from "@/mock/publications";
import { latency, sleep } from "@/lib/sleep";
import { commIdToKey, unwrap, type BackendPublication } from "@/lib/adapters";
import type { Publication } from "@/types";

const STATUT_TO_STATUS: Record<number, "published" | "pending" | "rejected"> = {
  1: "published",
  2: "pending",
  3: "rejected",
};

function adapt(p: BackendPublication): Publication {
  return {
    id: String(p.id),
    authorId: String(p.user?.id ?? 0),
    authorName:
      p.user?.nom || p.user?.prenom
        ? `${p.user?.nom ?? ""} ${p.user?.prenom ?? ""}`.trim()
        : (p.user?.username ?? `User #${p.user?.id ?? "?"}`),
    community: commIdToKey(p.communaute_id ?? undefined),
    body: p.contenu ?? "",
    status: STATUT_TO_STATUS[p.statut_id ?? 1] ?? "published",
    reactions: p.reactions?.reduce((s, r) => s + (r.count ?? 0), 0) ?? 0,
    comments: p.commentaires_count ?? 0,
    createdAt: p.created_at ?? new Date().toISOString(),
  };
}

export async function getPublications(): Promise<Publication[]> {
  try {
    const data = await apiClient.get<BackendPublication[]>(
      "/feed/get-by-criteria"
    );
    const items = unwrap(data);
    return items.map(adapt);
  } catch {
    await sleep(latency());
    return PUBLICATIONS;
  }
}

export async function validatePublication(id: string): Promise<void> {
  try {
    await apiClient.patch(`/feed/publications/${id}/statut`, { statut: "published" });
  } catch {
    await sleep(latency());
    const p = PUBLICATIONS.find((x) => x.id === id);
    if (p) p.status = "published";
  }
}

export async function rejectPublication(id: string): Promise<void> {
  try {
    await apiClient.patch(`/feed/publications/${id}/statut`, { statut: "rejected" });
  } catch {
    await sleep(latency());
    const p = PUBLICATIONS.find((x) => x.id === id);
    if (p) p.status = "rejected";
  }
}

export async function deletePublication(id: string): Promise<void> {
  try {
    await apiClient.delete(`/feed/publications/${id}`);
  } catch {
    await sleep(latency());
    const idx = PUBLICATIONS.findIndex((x) => x.id === id);
    if (idx >= 0) PUBLICATIONS.splice(idx, 1);
  }
}