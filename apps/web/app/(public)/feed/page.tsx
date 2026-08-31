import { PageHeader } from "@/components/layout/PageHeader";
import { FeedClient } from "./FeedClient";
import { getFeedPosts, getTendances, getActiveMembers, getFeedCounts } from "@/services/feed";
import type { FeedPost, CommunityId } from "@/types";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const [posts, tendances, activeMembers, counts] = await Promise.all([
    getFeedPosts(),
    getTendances() as Promise<{ tag: string; count: number }[]>,
    getActiveMembers() as Promise<{ id: string; name: string; initials: string; community: string }[]>,
    getFeedCounts() as Promise<Record<CommunityId, number>>,
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Communauté"
        title="Feed"
        subtitle="Les dernières actualités de la communauté AFF."
      />
      <FeedClient
        posts={posts}
        counts={counts}
        tendances={tendances}
        activeMembers={activeMembers}
      />
    </div>
  );
}
