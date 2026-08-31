export type AuthUser = {
  id: number;
  username: string;
  email: string;
  nom?: string;
  prenom?: string;
  description?: string;
  profile_picture_path?: string;
  is_officiel: boolean;
  is_active: boolean;
  is_default_password: boolean;
  country?: string;
  communaute_ids?: number[];
};

export type AuthProfil = {
  id: number;
  libelle: string;
  code: string;
};

export type AuthResponse = {
  user: AuthUser;
  profils: AuthProfil[];
  features: string[];
  access_token: string;
  token_type: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone_numb: string;
  communaute_id?: number;
  description?: string;
};

export type CreateCandidatureRequest = {
  categorie_id: number;
  edition_id: number;
  description: string;
  portfolio_url?: string;
};

export type NotificationItem = {
  id: number;
  type: string;
  title: string;
  body?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
};

export type ProfileStats = {
  publications_count: number;
  reactions_received_count: number;
  communautes_count: number;
  masterclass_inscriptions_count: number;
  awards_candidatures_count: number;
  profils_count: number;
};
