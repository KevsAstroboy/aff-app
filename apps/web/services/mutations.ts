import { apiClient } from "@/lib/api-client";

export type CreatePublicationPayload = {
  contenu: string;
  communaute_id?: number;
  hashtags?: string[];
};

export async function createPublication(payload: CreatePublicationPayload): Promise<{ id: number }> {
  return apiClient.post<{ id: number }>("/feed/publications", payload);
}

export async function reactToPublication(
  publicationId: string,
  reactionTypeId: number
): Promise<void> {
  return apiClient.post(`/feed/publications/${publicationId}/reactions`, {
    reaction_type_id: reactionTypeId,
  });
}

export async function commentPublication(
  publicationId: string,
  contenu: string,
  parent_commentaire_id?: number
): Promise<unknown> {
  return apiClient.post(`/feed/publications/${publicationId}/commentaires`, {
    contenu,
    parent_commentaire_id,
  });
}

export async function subscribeCommunaute(communauteId: number): Promise<void> {
  return apiClient.post(`/communaute/${communauteId}/subscribe`);
}

export async function createConversation(userId: number): Promise<{ id: number }> {
  return apiClient.post<{ id: number }>("/messagerie/conversations", {
    type_id: 1,
    user2_id: userId,
  });
}

export async function listGroupConversations(): Promise<unknown[]> {
  return apiClient.get("/messagerie/conversations?type_id=2");
}