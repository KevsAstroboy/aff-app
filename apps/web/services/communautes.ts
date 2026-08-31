import { apiClient } from "@/lib/api-client";
import { COMMUNAUTES } from "@/mock/communautes";
import { latency, sleep } from "@/lib/sleep";
import { unwrap, type BackendCommunaute } from "@/lib/adapters";
import type { Communaute } from "@/types";

function adapt(c: BackendCommunaute): Communaute {
  const idMap: Record<string, Communaute["id"]> = {
    art: "art",
    musique: "musique",
    cinema: "cinema",
    mode: "mode",
    danse: "danse",
    litterature: "litterature",
    gastronomie: "gastronomie",
    tech: "art",
    musique_danse: "musique",
  };
  const key = (c.code ?? c.libelle ?? "").toLowerCase().split("_")[0];
  const id = idMap[key] ?? "art";
  return {
    id,
    name: c.libelle ?? `Communauté #${c.id}`,
    description: c.description ?? "",
    members: c.membres_count ?? 0,
    publications: c.publications_count ?? 0,
    status: c.is_active ? "active" : "inactive",
    createdAt: c.created_at ?? new Date().toISOString(),
  };
}

export async function getCommunautes(): Promise<Communaute[]> {
  try {
    const data = await apiClient.get<BackendCommunaute[]>("/communaute");
    return unwrap(data).map(adapt);
  } catch {
    await sleep(latency());
    return COMMUNAUTES;
  }
}

export async function toggleStatut(id: string): Promise<Communaute | undefined> {
  try {
    const c = await apiClient.patch<BackendCommunaute>(`/communaute/${id}/toggle`);
    return adapt(c);
  } catch {
    await sleep(latency());
    const c = COMMUNAUTES.find((x) => x.id === (id as Communaute["id"]));
    if (!c) return undefined;
    c.status = c.status === "active" ? "inactive" : "active";
    return c;
  }
}

export async function deleteCommunaute(id: string): Promise<void> {
  try {
    await apiClient.delete(`/communaute/${id}`);
  } catch {
    await sleep(latency());
    const idx = COMMUNAUTES.findIndex((x) => x.id === (id as Communaute["id"]));
    if (idx >= 0) COMMUNAUTES.splice(idx, 1);
  }
}