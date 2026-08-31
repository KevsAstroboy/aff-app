import { apiClient } from "@/lib/api-client";
import { ACTIVE_MEMBERS, FEED_POSTS, TRENDING } from "@/mock/feed";
import { latency, sleep } from "@/lib/sleep";
import { commIdToKey, commKeyToId, unwrap, type BackendPublication } from "@/lib/adapters";
import type { CommunityId, FeedPost } from "@/types";

function adaptPost(p: BackendPublication, idx: number): FeedPost {
  const u = p.user;
  const initials =
    (u?.nom?.[0] ?? "") + (u?.prenom?.[0] ?? "") ||
    (u?.username?.slice(0, 2).toUpperCase() ?? `U${idx}`);
  return {
    id: String(p.id ?? idx),
    authorId: String(u?.id ?? idx),
    authorName: u ? `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || u.username || `User #${u.id}` : `User #${idx}`,
    initials,
    authorAvatar: u?.profile_picture_path ?? null,
    community: commIdToKey(p.communaute_id ?? undefined),
    body: p.contenu ?? "",
    flags: [],
    createdAt: p.created_at ?? new Date().toISOString(),
    reactions: (p.reactions ?? []).map((r) => ({
      emoji: r.emoji ?? "👍",
      count: r.count ?? 0,
    })),
    comments: p.commentaires_count ?? 0,
    shares: 0,
  };
}

export async function getFeedPosts(
  filter?: CommunityId | "all",
  userId?: number
): Promise<FeedPost[]> {
  try {
    const params: Record<string, string> = {};
    if (filter && filter !== "all") params.communaute_id = String(commKeyToId(filter));
    if (userId) params.user_id = String(userId);
    const data = await apiClient.get<BackendPublication[]>(
      "/feed",
      params
    );
    const items = unwrap(data).map(adaptPost);
    if (items.length === 0 && !filter) return FEED_POSTS;
    return items;
  } catch {
    await sleep(latency());
    if (!filter || filter === "all") return FEED_POSTS;
    return FEED_POSTS.filter((p) => p.community === filter);
  }
}

export async function getReactionTypes(): Promise<
  { id: number; code: string; emoji: string; libelle?: string }[]
> {
  try {
    const data = await apiClient.get<
      { id: number; code: string; emoji: string; libelle?: string }[]
    >("/feed/reaction-types");
    return unwrap(data);
  } catch {
    await sleep(latency());
    return [
      { id: 1, code: "HEART", emoji: "❤️" },
      { id: 2, code: "CLAP", emoji: "👏" },
      { id: 3, code: "FIRE", emoji: "🔥" },
      { id: 4, code: "PARTY", emoji: "🎉" },
    ];
  }
}

export async function getTendances() {
  try {
    const data = await apiClient.get<{ libelle: string; publications_count: number }[]>(
      "/feed/hashtags"
    );
    const items = unwrap(data);
    return items.map((h) => ({ tag: `#${h.libelle}`, count: h.publications_count }));
  } catch {
    await sleep(latency());
    return TRENDING;
  }
}

export async function getActiveMembers() {
  try {
    const data = await apiClient.get<
      {
        id: number;
        username?: string;
        nom?: string;
        prenom?: string;
        communaute_principale?: { id: number; libelle?: string; code?: string } | null;
      }[]
    >("/feed/membres-actifs");
    const items = unwrap(data);
    return items.map((u) => ({
      id: String(u.id),
      name: `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || u.username || "Membre",
      initials: (u.nom?.[0] ?? "") + (u.prenom?.[0] ?? "") || u.username?.slice(0, 2).toUpperCase() || "M",
      community: u.communaute_principale?.libelle ?? "Art",
    }));
  } catch {
    await sleep(latency());
    return ACTIVE_MEMBERS;
  }
}

export async function getFeedCounts(): Promise<Record<CommunityId, number>> {
  try {
    const data = await apiClient.get<{ communaute_id: number; count: number }[]>(
      "/feed/communautes/counts"
    );
    const items = unwrap(data);
    const map: Record<CommunityId, number> = {
      art: 0, musique: 0, cinema: 0, mode: 0, danse: 0, litterature: 0, gastronomie: 0,
    };
    for (const c of items) {
      const key = commIdToKey(c.communaute_id);
      map[key] = (map[key] ?? 0) + c.count;
    }
    return map;
  } catch {
    await sleep(latency());
    return {
      art: 12,
      musique: 9,
      cinema: 11,
      mode: 7,
      danse: 5,
      litterature: 3,
      gastronomie: 0,
    };
  }
}