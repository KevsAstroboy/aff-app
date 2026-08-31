import { apiClient, getBaseUrl } from "@/lib/api-client";
import { fileToBase64 } from "@/lib/file";

export { fileToBase64 };

export type PortfolioItem = {
  id: string;
  titre: string;
  description: string | null;
  categorie: string;
  annee: number | null;
  file_path: string;
  created_at: string | null;
};

export type BackendPortfolioItem = {
  id: number;
  titre: string;
  description: string | null;
  categorie: string;
  annee: number | null;
  file_path: string;
  created_at: string | null;
};

export type CreatePortfolioItemInput = {
  image: string;
  titre?: string;
  description?: string;
  categorie?: string;
  annee?: number;
};

export function portfolioMediaUrl(filePath?: string): string | null {
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

function adaptItem(p: BackendPortfolioItem): PortfolioItem {
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

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const data = await apiClient.get<BackendPortfolioItem[]>(
    "/portfolio"
  );
  return data.map(adaptItem);
}

export async function addPortfolioItem(
  input: CreatePortfolioItemInput
): Promise<PortfolioItem> {
  const data = await apiClient.post<BackendPortfolioItem>("/portfolio", input);
  return adaptItem(data);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await apiClient.delete(`/portfolio/${id}`);
}
