import { apiClient, getBaseUrl, getApiToken } from "@/lib/api-client";
import { commIdToKey, unwrap } from "@/lib/adapters";
import type { Masterclass } from "@/types";

export type BackendMasterclass = {
  id?: number;
  evenement_id?: number | null;
  communaute_id?: number | null;
  mode_diffusion_id?: number | null;
  expert?: string | null;
  titre?: string | null;
  description?: string | null;
  jour?: string | null;
  heure_debut?: string | null;
  heure_fin?: string | null;
  lieu_id?: number | null;
  lieu?: { libelle?: string | null } | null;
  meeting_url?: string | null;
  max_participants?: number | null;
  participants_count?: number | null;
  statut_id?: number | null;
  created_at?: string;
  mode_diffusion?: { libelle?: string; code?: string } | null;
  communaute?: { libelle?: string; code?: string } | null;
  statut_masterclass?: { code?: string; libelle?: string } | null;
  programme_evenement?: {
    titre?: string | null;
    description?: string | null;
    jour?: string | null;
    heure_debut?: string | null;
    heure_fin?: string | null;
    lieu?: { libelle?: string | null } | null;
  } | null;
};

function timeOfDay(s?: string | null): string {
  if (!s) return "";
  return s.length >= 10 && s.includes(":")
    ? s.slice(11, 16)
    : s.length >= 5
      ? s.slice(0, 5)
      : s;
}

function adapt(m: BackendMasterclass, idx: number): Masterclass {
  const ev = m.programme_evenement;
  const statutId = m.statut_id;
  const title = m.titre ?? ev?.titre ?? "Masterclass";
  const date = `${m.jour ?? ev?.jour ?? ""} ${timeOfDay(m.heure_debut ?? ev?.heure_debut)}`.trim();
  const lieu = m.lieu?.libelle ?? ev?.lieu?.libelle ?? undefined;
  return {
    id: String(m.id ?? idx),
    title,
    expert: m.expert ?? "",
    community: commIdToKey(m.communaute_id ?? undefined),
    date,
    durationMin: 0,
    participants: m.participants_count ?? 0,
    capacity: m.max_participants ?? 0,
    status:
      statutId === 2
        ? "live"
        : statutId === 3
          ? "terminated"
          : statutId === 4
            ? "cancelled"
            : "pending",
    mode: m.mode_diffusion?.libelle ?? "",
    lieu,
    description: m.description ?? ev?.description ?? undefined,
    meetingUrl: m.meeting_url ?? undefined,
    isInscrit: false,
    evenement_id: m.evenement_id ?? null,
  };
}

async function currentEditionId(): Promise<number | undefined> {
  try {
    const data = await apiClient.get<{ id?: number }>("/editions/current");
    const unwrapped = Array.isArray(data) ? data[0] : data;
    if (!unwrapped && typeof data === "number") return data;
    return typeof unwrapped?.id === "number" ? unwrapped.id : undefined;
  } catch {
    return undefined;
  }
}

export async function getMasterclasses(): Promise<Masterclass[]> {
  const edition_id = await currentEditionId();
  const params: Record<string, string> = {
    include: "programme_evenement,mode_diffusion,communaute,statut_masterclass,lieu",
    sort: "-created_at",
  };
  if (edition_id !== undefined) {
    params.edition_id = String(edition_id);
  }
  const data = await apiClient.get<BackendMasterclass[]>(
    "/programme/masterclass",
    params,
  );
  const items = unwrap(data);
  return items.map(adapt);
}

export type MasterclassPage = {
  items: Masterclass[];
  total: number;
  pages: number;
  page: number;
};

export async function getMasterclassesAdmin(
  opts: { page?: number; size?: number } = {},
): Promise<MasterclassPage> {
  const { page = 1, size = 10 } = opts;
  const edition_id = await currentEditionId();
  const params: Record<string, string> = {
    include: "programme_evenement,mode_diffusion,communaute,statut_masterclass,lieu",
    sort: "created_at",
    "statut_id.in": "1,2,3,4",
    page: String(page),
    size: String(size),
  };
  if (edition_id !== undefined) {
    params.edition_id = String(edition_id);
  }
  const data = await apiClient.get<{
    items: BackendMasterclass[];
    total: number;
    pages: number;
    page: number;
  }>("/programme/masterclass", params);
  const items = unwrap(data);
  return {
    items: items.map(adapt),
    total: data?.total ?? items.length,
    pages: data?.pages ?? 1,
    page: data?.page ?? page,
  };
}

export async function getMyMasterclassIds(): Promise<Set<string>> {
  const data = await apiClient.get<{ masterclass_id?: number }[]>(
    "/programme/masterclass/mes-inscriptions",
  );
  const items = unwrap(data);
  return new Set(items.map((i) => String(i.masterclass_id)));
}

export const listMyMasterclassIds = getMyMasterclassIds;

export async function inscribeToMasterclass(id: string): Promise<void> {
  await apiClient.post(`/programme/masterclass/${id}/inscription`, {
    role_id: 3,
  });
}

export async function unsubscribeFromMasterclass(id: string): Promise<void> {
  await apiClient.delete(`/programme/masterclass/${id}/inscription`);
}

export type CreateMasterclassPayload = {
  evenement_id?: number | null;
  titre?: string;
  description?: string;
  jour?: string;
  heure_debut?: string;
  heure_fin?: string;
  lieu_id?: number | null;
  communaute_id?: number | null;
  mode_diffusion_id: number;
  meeting_url?: string;
  expert?: string;
  max_participants?: number;
  statut_id?: number;
};

export async function createMasterclass(
  payload: CreateMasterclassPayload,
): Promise<void> {
  await apiClient.post("/programme/masterclass", payload);
}

export async function updateMasterclass(
  id: string,
  payload: Partial<CreateMasterclassPayload>,
): Promise<void> {
  await apiClient.patch(`/programme/masterclass/${id}`, payload);
}

export async function deleteMasterclass(id: string): Promise<void> {
  await apiClient.delete(`/programme/masterclass/${id}`);
}

export async function getLiveSession(): Promise<Masterclass | undefined> {
  const all = await getMasterclasses();
  return all.find((m) => m.status === "live");
}

export type Billet = {
  masterclass_id: number;
  titre: string;
  expert: string | null;
  date: string | null;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
  mode: string | null;
  meeting_url: string | null;
  communaute: string | null;
  edition: string | null;
  participant: string;
  participants_count: number;
  max_participants: number | null;
  qr: string;
};

export async function getBillet(id: string): Promise<Billet> {
  return apiClient.get<Billet>(`/programme/masterclass/${id}/billet`);
}

export async function downloadBilletPdf(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/programme/masterclass/${id}/billet.pdf`,
      {
        headers: getApiToken() ? { Authorization: `Bearer ${getApiToken()}` } : {},
      },
    );
    if (!res.ok) throw new Error("pdf");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billet-masterclass-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}