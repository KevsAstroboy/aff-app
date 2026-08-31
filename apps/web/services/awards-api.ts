import { apiClient } from "@/lib/api-client";

export async function getCurrentEditionId(): Promise<number | undefined> {
  try {
    const data = (await apiClient.get<{ id?: number }>("/editions/current")) as unknown;
    const unwrapped =
      Array.isArray(data) ? data[0] : (data as { id?: number } | number);
    if (typeof unwrapped === "number") return unwrapped;
    return typeof unwrapped?.id === "number" ? unwrapped.id : undefined;
  } catch {
    return undefined;
  }
}

export async function createCandidature(data: {
  categorie_id: number;
  edition_id: number;
  description?: string;
  portfolio_url?: string;
}): Promise<unknown> {
  return apiClient.post("/awards/candidatures", data);
}

export async function getMyCandidatures(): Promise<unknown[]> {
  return apiClient.get("/awards/candidatures/mes");
}

export async function getCandidaturesByCategory(
  categorieId: number,
  statutId?: number,
): Promise<unknown[]> {
  const params: Record<string, string> = { categorie_id: String(categorieId) };
  if (statutId !== undefined) params.statut_id = String(statutId);
  return apiClient.get("/awards/candidatures", params);
}

export async function getCandidature(id: number): Promise<unknown> {
  return apiClient.get(`/awards/candidatures/${id}`);
}

export async function deleteCandidature(id: number): Promise<unknown> {
  return apiClient.delete(`/awards/candidatures/${id}`);
}

export async function getMyVotes(): Promise<unknown[]> {
  return apiClient.get("/awards/votes/mes");
}

export async function getPublicResults(categorieId: number): Promise<unknown> {
  return apiClient.get(`/awards/votes/public/results/${categorieId}`);
}

export async function uploadCandidatureMedia(
  candidatureId: number,
  file: File,
  mediaTypeId: number,
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("media_type_id", String(mediaTypeId));
  return apiClient.upload(`/awards/candidatures/${candidatureId}/medias`, formData);
}

export async function updateCandidatureStatut(
  id: number,
  statut: string
): Promise<unknown> {
  return apiClient.patch(`/awards/candidatures/${id}/statut`, { statut });
}

export async function voteJury(data: {
  categorie_id: number;
  candidature_id: number;
  score: number;
  commentaire?: string;
}): Promise<unknown> {
  return apiClient.post("/awards/votes/jury", data);
}

export async function votePublic(data: {
  candidature_id: number;
}): Promise<unknown> {
  return apiClient.post("/awards/votes/public", data);
}

export async function getVoteResults(categorieId: number): Promise<unknown> {
  return apiClient.get(`/awards/votes/results/${categorieId}`);
}

export async function getAwardCategories(): Promise<unknown[]> {
  return apiClient.get("/awards/categories");
}

export async function createAwardCategory(data: {
  libelle: string;
  code: string;
  theme_id: number;
  edition_id: number;
}): Promise<unknown> {
  return apiClient.post("/awards/categories", data);
}

export async function updateAwardCategory(
  id: number,
  data: { libelle?: string; code?: string; is_deleted?: boolean }
): Promise<unknown> {
  return apiClient.patch(`/awards/categories/${id}`, data);
}
