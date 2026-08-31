import { apiClient } from "@/lib/api-client";
import { COMMENTS } from "@/mock/comments";
import { latency, sleep } from "@/lib/sleep";
import { commIdToKey, unwrap, type BackendComment } from "@/lib/adapters";
import type { Comment } from "@/types";

const STATUT_TO_STATUS: Record<number, "approved" | "pending" | "hidden"> = {
  1: "approved",
  2: "pending",
  3: "hidden",
};

function adapt(c: BackendComment, idx: number): Comment {
  const u = c.user;
  const initials =
    (u?.nom?.[0] ?? "") + (u?.prenom?.[0] ?? "") ||
    (u?.username?.slice(0, 2).toUpperCase() ?? `U${idx}`);
  const status = STATUT_TO_STATUS[c.statut_id ?? 0] ?? "approved";
  return {
    id: String(c.id ?? idx),
    authorId: String(u?.id ?? idx),
    authorName: u ? `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || u.username || `User #${u.id}` : `User #${idx}`,
    initials,
    authorAvatar: u?.profile_picture_path ?? null,
    body: c.contenu ?? "",
    parentPublicationId: String(c.publication_id ?? ""),
    parentPublicationTitle: "",
    status,
    country: "FR" as Comment["country"],
    createdAt: c.created_at ?? new Date().toISOString(),
    replies: (c.other_commentaire ?? c.replies ?? []).map((r, i) => adapt(r, i)),
  };
}

export async function getComments(): Promise<Comment[]> {
  try {
    const data = await apiClient.get<BackendComment[]>(
      "/feed/commentaires/get-by-criteria"
    );
    return unwrap(data).map(adapt);
  } catch {
    await sleep(latency());
    return COMMENTS;
  }
}

export async function getCommentsByPublication(
  publicationId: string
): Promise<Comment[]> {
  try {
    const data = await apiClient.get<BackendComment[]>(
      `/feed/publications/${publicationId}/commentaires`
    );
    return unwrap(data).map(adapt);
  } catch {
    await sleep(latency());
    const pub = COMMENTS.filter(
      (c) => c.parentPublicationId === publicationId
    );
    return pub;
  }
}

export async function approveComment(id: string): Promise<void> {
  try {
    await apiClient.patch(`/feed/commentaires/${id}/statut`, { statut: "published" });
  } catch {
    await sleep(latency());
    const c = COMMENTS.find((x) => x.id === id);
    if (c) c.status = "approved";
  }
}

export async function hideComment(id: string): Promise<void> {
  try {
    await apiClient.patch(`/feed/commentaires/${id}/statut`, { statut: "hidden" });
  } catch {
    await sleep(latency());
    const c = COMMENTS.find((x) => x.id === id);
    if (c) c.status = "hidden";
  }
}

export async function deleteComment(id: string): Promise<void> {
  try {
    await apiClient.delete(`/feed/commentaires/${id}`);
  } catch {
    await sleep(latency());
    const idx = COMMENTS.findIndex((x) => x.id === id);
    if (idx >= 0) COMMENTS.splice(idx, 1);
  }
}