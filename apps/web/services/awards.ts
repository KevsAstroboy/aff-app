import { apiClient, getBaseUrl } from "@/lib/api-client";
import { AWARD_CATEGORIES } from "@/mock/awards";
import { latency, sleep } from "@/lib/sleep";
import { unwrap } from "@/lib/adapters";
import type { AwardCategory } from "@/types";

type BackendAwardCategory = {
  id: number;
  libelle?: string;
  code?: string;
  description?: string;
  is_grand_prix?: boolean;
  theme?: { libelle?: string };
  theme_id?: number;
  edition_id?: number;
};

export type CandidateMedia = {
  id: number;
  media_type_id: number;
  file_path?: string;
};

export type Candidate = {
  id: number;
  user_id?: number;
  user_name: string;
  prenom?: string;
  nom?: string;
  description?: string;
  portfolio_url?: string;
  statut_id?: number;
  medias: CandidateMedia[];
};

export type MyCandidature = {
  id: number;
  categorie_id?: number;
  categorie_libelle: string;
  edition_id?: number;
  description?: string;
  portfolio_url?: string;
  statut_id?: number;
  statut_code: string;
  statut_libelle: string;
  submitted_at?: string;
  medias: CandidateMedia[];
  media_count: number;
};

export function mediaPreviewUrl(filePath?: string): string | null {
  if (!filePath) return null;
  
  // New format: /uploads/... (relative URL from nginx proxy)
  if (filePath.startsWith('/uploads/')) {
    return filePath;
  }
  
  // Legacy format: http://minio:9000/bucket/path -> extract path for media API
  const m = filePath.match(/:\d+\/(.+)$/);
  const objPath = m && m[1];
  if (!objPath) return null;
  return `${getBaseUrl()}/api/media/file?path=${encodeURIComponent(objPath)}`;
}

export function mediaTypeLabel(id?: number): string {
  switch (id) {
    case 1:
      return "Image";
    case 2:
      return "Vidéo";
    case 3:
      return "PDF";
    default:
      return "Fichier";
  }
}

export type PublicResult = {
  candidature_id: number;
  user_name: string;
  votes_count: number;
};

function candidatureStatus(statut?: {
  id?: number;
  code?: string;
  libelle?: string;
}): { code: string; libelle: string } {
  const code = statut?.code ?? "SOUMISE";
  const libelle = statut?.libelle ?? "Soumise";
  return { code, libelle };
}

function adaptCandidate(raw: Record<string, unknown>): Candidate {
  const user = (raw.user as Record<string, unknown>) ?? {};
  const medias = (raw.candidature_media as unknown[] ?? []) as Record<string, unknown>[];
  return {
    id: Number(raw.id),
    user_id: raw.user_id as number | undefined,
    user_name: [
      (user as { prenom?: string }).prenom,
      (user as { nom?: string }).nom,
    ]
      .filter(Boolean)
      .join(" ") || (user as { username?: string }).username || `Candidat #${raw.id}`,
    prenom: (user as { prenom?: string }).prenom,
    nom: (user as { nom?: string }).nom,
    description: (raw.description as string) ?? undefined,
    portfolio_url: (raw.portfolio_url as string) ?? undefined,
    statut_id: raw.statut_id as number | undefined,
    medias: medias.map((m) => ({
      id: Number(m.id),
      media_type_id: Number(m.media_type_id),
      file_path: m.file_path as string | undefined,
    })),
  };
}

function adaptMyCandidature(raw: Record<string, unknown>): MyCandidature {
  const category = (raw.award_category as Record<string, unknown>) ?? {};
  const statut = candidatureStatus(raw.statut_candidature as Record<string, unknown>);
  const medias = (raw.candidature_media as unknown[] ?? []) as Record<string, unknown>[];
  return {
    id: Number(raw.id),
    categorie_id: raw.categorie_id as number | undefined,
    categorie_libelle: (category.libelle as string) ?? "Catégorie",
    edition_id: raw.edition_id as number | undefined,
    description: (raw.description as string) ?? undefined,
    portfolio_url: (raw.portfolio_url as string) ?? undefined,
    statut_id: raw.statut_id as number | undefined,
    statut_code: statut.code,
    statut_libelle: statut.libelle,
    submitted_at: (raw.submitted_at as string) ?? (raw.created_at as string | undefined),
    medias: medias.map((m) => ({
      id: Number(m.id),
      media_type_id: Number(m.media_type_id),
      file_path: m.file_path as string | undefined,
    })),
    media_count: medias.length,
  };
}

export async function getMyCandidaturesReal(): Promise<MyCandidature[]> {
  const data = await apiClient.get<Record<string, unknown>[]>("/awards/candidatures/mes");
  return unwrap(data).map(adaptMyCandidature);
}

export async function getCandidatesByCategory(
  categorieId: number,
  statutId?: number,
): Promise<Candidate[]> {
  const data = await apiClient.get<{ data: Record<string, unknown>[] } | Record<string, unknown>[]>(
    "/awards/candidatures",
    {
      categorie_id: String(categorieId),
      ...(statutId !== undefined ? { statut_id: String(statutId) } : {}),
    },
  );
  return unwrap(data).map(adaptCandidate);
}

export async function getMyVotesSet(): Promise<Set<number>> {
  try {
    const data = await apiClient.get<{ categorie_id?: number }[]>("/awards/votes/mes");
    const items = unwrap(data);
    return new Set(items.map((v) => Number(v.categorie_id)).filter((n) => !Number.isNaN(n)));
  } catch {
    return new Set();
  }
}

export async function getPublicResultsReal(categorieId: number): Promise<PublicResult[]> {
  const data = await apiClient.get<
    Array<{
      candidature_id: number;
      user_name?: string;
      username?: string;
      nom?: string;
      prenom?: string;
      votes_count?: number;
    }>
  >(`/awards/votes/public/results/${categorieId}`);
  const arr = Array.isArray(data) ? data : [];
  return arr.map((r) => ({
    candidature_id: Number(r.candidature_id),
    user_name:
      r.user_name ??
      ([r.prenom, r.nom].filter(Boolean).join(" ") || r.username || `Candidat #${r.candidature_id}`),
    votes_count: r.votes_count ?? 0,
  }));
}

export async function getCategoryById(id: number): Promise<AwardCategory | undefined> {
  const cats = await getAwardCategories();
  return cats.find((c) => Number(c.id) === id);
}

const THEME_ID_TO_SECTION: Record<number, string> = {
  1: "Image & Visuel",
  2: "Son & Scène",
  3: "Mode & Style",
  4: "Digital & Influence",
  5: "Architecture & Espace",
  6: "Entrepreneuriat & Impact",
  7: "Catégories spéciales",
};

const SECTION_BY_THEME: Record<string, string> = {
  image: "Image & Visuel",
  visuel: "Image & Visuel",
  son: "Son & Scène",
  scene: "Son & Scène",
  mode: "Mode & Style",
  style: "Mode & Style",
  digital: "Digital & Influence",
  influence: "Digital & Influence",
  architecture: "Architecture & Espace",
  espace: "Architecture & Espace",
  entrepreneuriat: "Entrepreneuriat & Impact",
  impact: "Entrepreneuriat & Impact",
  special: "Catégories spéciales",
  grand_prix: "Catégories spéciales",
};

function sectionFrom(c: BackendAwardCategory): string {
  if (c.theme_id != null && THEME_ID_TO_SECTION[c.theme_id]) {
    return THEME_ID_TO_SECTION[c.theme_id];
  }
  const code = (c.code ?? c.theme?.libelle ?? "").toLowerCase();
  for (const k of Object.keys(SECTION_BY_THEME)) {
    if (code.includes(k)) return SECTION_BY_THEME[k];
  }
  if (c.is_grand_prix) return "Catégories spéciales";
  return "Autres";
}

function adapt(c: BackendAwardCategory, idx: number): AwardCategory {
  return {
    id: String(c.id ?? idx),
    name: c.libelle ?? `Catégorie #${c.id ?? idx}`,
    section: sectionFrom(c),
    isGrandPrix: c.is_grand_prix ?? false,
  };
}

export async function getAwardCategories(): Promise<AwardCategory[]> {
  try {
    const data = await apiClient.get<BackendAwardCategory[]>("/awards/categories");
    return unwrap(data).map(adapt);
  } catch {
    await sleep(latency());
    return AWARD_CATEGORIES;
  }
}

export async function getAwardsBySection(): Promise<Record<string, AwardCategory[]>> {
  try {
    const cats = await getAwardCategories();
    const map: Record<string, AwardCategory[]> = {};
    for (const c of cats) {
      if (!map[c.section]) map[c.section] = [];
      map[c.section].push(c);
    }
    return map;
  } catch {
    await sleep(latency());
    const map: Record<string, AwardCategory[]> = {};
    for (const c of AWARD_CATEGORIES) {
      if (!map[c.section]) map[c.section] = [];
      map[c.section].push(c);
    }
    return map;
  }
}

export async function getMyCandidatures(): Promise<AwardCategory[]> {
  try {
    const data = await apiClient.get<unknown>("/awards/candidatures");
    const items = unwrap(data as BackendAwardCategory[]);
    if (items.length > 0) return items.map(adapt);
    return AWARD_CATEGORIES.slice(0, 3);
  } catch {
    await sleep(latency());
    return [
      AWARD_CATEGORIES[0],
      AWARD_CATEGORIES[6],
      AWARD_CATEGORIES[11],
    ];
  }
}