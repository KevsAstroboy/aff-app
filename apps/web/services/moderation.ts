import { apiClient } from "@/lib/api-client";

export async function createReport(data: {
  cible_type_id: number;
  cible_id: number;
  severite_id: number;
  motif: string;
}): Promise<unknown> {
  return apiClient.post("/moderation", data);
}

export async function getReports(params?: Record<string, string>): Promise<unknown[]> {
  return apiClient.get("/moderation", params);
}

export async function getReport(id: number): Promise<unknown> {
  return apiClient.get(`/moderation/${id}`);
}

export async function resolveReport(id: number): Promise<unknown> {
  return apiClient.patch(`/moderation/${id}/resolve`);
}
