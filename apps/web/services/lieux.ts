import { apiClient } from "@/lib/api-client";
import { unwrap } from "@/lib/adapters";

export type BackendLieu = {
  id: number;
  libelle?: string | null;
  capacite?: number | null;
  is_deleted?: boolean;
};

export async function getLieux(): Promise<BackendLieu[]> {
  const data = await apiClient.get<BackendLieu[] | { items: BackendLieu[] }>("/lieu");
  const items = unwrap(data);
  return items.map((l) => ({
    ...l,
    libelle: l.libelle ?? `Lieu #${l.id}`,
  }));
}

export async function createLieu(payload: { libelle: string; capacite?: number }): Promise<BackendLieu> {
  return apiClient.post<BackendLieu>("/lieu", payload);
}

export async function updateLieu(id: number, payload: { libelle?: string; capacite?: number }): Promise<BackendLieu> {
  return apiClient.patch<BackendLieu>(`/lieu/${id}`, payload);
}

export async function deleteLieu(id: number): Promise<BackendLieu> {
  return apiClient.delete<BackendLieu>(`/lieu/${id}`);
}