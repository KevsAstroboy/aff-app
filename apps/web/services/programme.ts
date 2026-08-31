import { apiClient } from "@/lib/api-client";
import { unwrap, type BackendProgramme } from "@/lib/adapters";
import { parseDate } from "@/lib/formatters";
import type { ProgrammeEvent } from "@/types";

function time(s: string | null | undefined): string {
  if (!s) return "";
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function dayLabel(jour?: string | null): string {
  if (!jour) return "—";
  const d = parseDate(jour);
  if (Number.isNaN(d.getTime())) return jour ?? "—";
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function adapt(p: BackendProgramme, idx: number): ProgrammeEvent {
  const jour = p.jour ?? null;
  return {
    id: String(p.id ?? idx),
    day: jour ? parseDate(jour).toISOString() : String(idx),
    dayLabel: dayLabel(jour),
    startTime: time(p.heure_debut) || time(p.start_time) || "09:00",
    endTime: time(p.heure_fin) || time(p.end_time) || "",
    title: p.titre ?? p.title ?? p.libelle ?? `Événement #${p.id ?? idx}`,
    expert: p.expert,
    venue: p.lieu?.libelle ?? p.venue ?? "",
    description: p.description,
    lieu_id: p.lieu_id,
    communaute_id: p.communaute_id,
    isHot: p.is_hot ?? false,
    category: p.type_evenement?.libelle,
    isFavori: p.is_favori ?? false,
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

export async function getProgramme(): Promise<ProgrammeEvent[]> {
  const edition_id = await currentEditionId();
  const params: Record<string, string> = {};
  if (edition_id !== undefined) params.edition_id = String(edition_id);
  const data = await apiClient.get<{ data: BackendProgramme[] } | BackendProgramme[]>(
    "/programme",
    Object.keys(params).length ? params : undefined,
  );
  const items = unwrap(data);
  return items.map(adapt);
}

export async function getProgrammeForDay(jour: string): Promise<ProgrammeEvent[]> {
  const edition_id = await currentEditionId();
  const params: Record<string, string> = { jour };
  if (edition_id !== undefined) params.edition_id = String(edition_id);
  const data = await apiClient.get<{ data: BackendProgramme[] } | BackendProgramme[]>(
    "/programme",
    params,
  );
  const items = unwrap(data);
  return items.map(adapt);
}

export async function getFavoris(): Promise<ProgrammeEvent[]> {
  const data = await apiClient.get<{ data: BackendProgramme[] } | BackendProgramme[]>(
    "/programme/favoris",
  );
  const items = unwrap(data);
  return items.map(adapt);
}

export async function toggleFavori(id: number): Promise<{ is_favori: boolean }> {
  return apiClient.post<{ is_favori: boolean }>(`/programme/${id}/favori`);
}

export type { ProgrammeEvent } from "@/types";