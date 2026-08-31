import type { CommunityId } from "@/types";

const COMM_ID_TO_KEY: Record<number, CommunityId> = {
  1: "art",
  2: "musique",
  3: "cinema",
  4: "mode",
  5: "danse",
  6: "litterature",
  7: "gastronomie",
};

const COMM_KEY_TO_ID: Record<CommunityId, number> = {
  art: 1,
  musique: 2,
  cinema: 3,
  mode: 4,
  danse: 5,
  litterature: 6,
  gastronomie: 7,
};

export function commIdToKey(id: number | undefined | null): CommunityId {
  if (id == null) return "art";
  return COMM_ID_TO_KEY[id] ?? "art";
}

export function commKeyToId(key: CommunityId): number {
  return COMM_KEY_TO_ID[key] ?? 1;
}

export function unwrap<T>(data: T[] | { items: T[] } | { data: T[] } | null | undefined): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && "items" in data && Array.isArray((data as { items: T[] }).items)) {
    return (data as { items: T[] }).items;
  }
  if (typeof data === "object" && "data" in data && Array.isArray((data as { data: T[] }).data)) {
    return (data as { data: T[] }).data;
  }
  return [];
}

export type BackendUser = {
  id: number;
  username: string;
  nom?: string;
  prenom?: string;
  profile_picture_path?: string;
  is_officiel?: boolean;
};

export type BackendPublication = {
  id: number;
  contenu: string;
  communaute_id?: number | null;
  user?: BackendUser;
  commentaires_count?: number;
  reactions?: { reaction_type_id: number; code: string; emoji: string; count: number }[];
  hashtags?: { id: number; libelle: string }[];
  created_at: string;
  statut_id?: number;
};

export type BackendCommunaute = {
  id: number;
  libelle?: string;
  code?: string;
  description?: string;
  couleur?: string;
  membres_count?: number;
  publications_count?: number;
  is_active?: boolean;
  created_at?: string;
};

export type BackendSignalement = {
  id: number;
  type?: "publication" | "commentaire" | "utilisateur" | string;
  severity?: "low" | "medium" | "high" | string;
  status?: "open" | "resolved" | "closed" | string;
  subject?: string;
  reportedBy?: string;
  reported_by?: string;
  reason?: string;
  motif?: string;
  created_at?: string;
};

export type BackendUserFull = {
  id: number;
  username?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  description?: string;
  profile_picture_path?: string;
  is_officiel?: boolean;
  is_active?: boolean;
  is_default_password?: boolean;
};

export type BackendComment = {
  id: number | string;
  contenu: string;
  publication_id?: number;
  user?: BackendUser;
  parent_commentaire_id?: number | null;
  created_at?: string;
  statut?: "published" | "pending" | "hidden";
  statut_id?: number;
  other_commentaire?: BackendComment[];
  replies?: BackendComment[];
};

export type BackendConversation = {
  id: number;
  type_id?: number;
  nom?: string;
  description?: string;
  is_canal_general?: boolean;
  created_at: string;
  participants?: { user_id: number; username: string; nom_complet: string; profile_picture_path?: string; joined_at: string }[];
  last_message?: {
    _id: string;
    sender_id: number;
    contenu: string;
    type: string;
    sent_at: string;
  };
};

export type BackendMessage = {
  id?: string | number;
  _id?: string | number;
  conversation_id?: number;
  sender_id?: number;
  sender_username?: string;
  contenu: string;
  type?: string;
  sent_at?: string;
};

export type BackendProgramme = {
  id: number;
  edition_id?: number;
  jour?: string | null;
  start_time?: string;
  end_time?: string;
  heure_debut?: string | null;
  heure_fin?: string | null;
  titre?: string | null;
  title?: string;
  libelle?: string;
  expert?: string;
  venue?: string;
  description?: string;
  lieu?: { libelle: string } | null;
  lieu_id?: number;
  type_evenement?: { libelle: string } | null;
  type_evenement_id?: number;
  is_hot?: boolean;
  is_favori?: boolean;
  communaute_id?: number;
  type_id?: number;
  statut_id?: number;
};

export type BackendAwardCategory = {
  id: number;
  libelle?: string;
  code?: string;
  description?: string;
  is_grand_prix?: boolean;
  theme?: { libelle?: string };
  theme_id?: number;
  edition_id?: number;
};

export type BackendMasterclass = {
  id: number;
  evenement?: BackendProgramme;
  evenement_id?: number;
  expert?: { id: number; nom?: string; prenom?: string; username?: string };
  duration_min?: number;
  participants_count?: number;
  capacity?: number;
  statut?: "live" | "pending" | "terminated" | "cancelled";
  statut_id?: number;
};

const STATUT_MAP: Record<number, "live" | "pending" | "terminated" | "cancelled"> = {
  1: "pending",
  2: "live",
  3: "terminated",
  4: "cancelled",
};

export function statutIdToKind(
  id: number | string | undefined,
  fallback: "live" | "pending" | "terminated" | "cancelled" = "pending"
): "live" | "pending" | "terminated" | "cancelled" {
  if (id == null) return fallback;
  if (typeof id === "string") {
    if (["live", "pending", "terminated", "cancelled"].includes(id)) {
      return id as "live" | "pending" | "terminated" | "cancelled";
    }
    return fallback;
  }
  return STATUT_MAP[id] ?? fallback;
}