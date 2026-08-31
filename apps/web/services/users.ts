import { apiClient } from "@/lib/api-client";
import { USERS } from "@/mock/users";
import type { BackendPortfolioItem, PortfolioItem } from "@/services/portfolio";
import { unwrap } from "@/lib/adapters";
import type { User } from "@/types";

export async function getUsers(): Promise<User[]> {
  return USERS;
}
export type PublicUser = {
  id: number;
  username: string;
  nom: string | null;
  prenom: string | null;
  description: string | null;
  profile_picture_path: string | null;
  is_officiel: boolean;
  created_at: string | null;
  communautes: { id: number | null; libelle: string | null; code: string | null }[];
  stats: {
    publications_count: number;
    candidatures_count: number;
    masterclass_inscriptions_count: number;
    portfolio_count: number;
  };
};

export type BackendPublicUser = {
  id: number;
  username: string;
  nom: string | null;
  prenom: string | null;
  description: string | null;
  profile_picture_path: string | null;
  is_officiel: boolean;
  created_at: string | null;
  communautes: { id: number | null; libelle: string | null; code: string | null }[];
  stats: {
    publications_count: number;
    candidatures_count: number;
    masterclass_inscriptions_count: number;
    portfolio_count: number;
  };
};

export async function getPublicUser(id: number): Promise<PublicUser> {
  return apiClient.get<BackendPublicUser>(`/users/${id}`);
}

function adaptPortfolioItem(p: BackendPortfolioItem): PortfolioItem {
  return {
    id: String(p.id),
    titre: p.titre ?? "",
    description: p.description ?? null,
    categorie: p.categorie ?? "",
    annee: p.annee ?? null,
    file_path: p.file_path,
    created_at: p.created_at ?? null,
  };
}

export async function getPublicPortfolio(id: number): Promise<PortfolioItem[]> {
  const data = await apiClient.get<BackendPortfolioItem[] | { items: BackendPortfolioItem[] }>(
    `/users/${id}/portfolio`
  );
  return unwrap(data).map(adaptPortfolioItem);
}
