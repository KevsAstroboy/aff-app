import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/domain/PostCard";
import { LiveIndicator } from "@/components/domain/LiveIndicator";
import { EmptyState } from "@/components/domain/EmptyState";
import { Newspaper } from "lucide-react";
import { getFeedPosts } from "@/services/feed";

export const dynamic = 'force-dynamic';

export default async function ActualitesPage() {
  const posts = await getFeedPosts();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Actualités"
        title="Live Feed"
        actions={<LiveIndicator />}
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={<Newspaper className="h-6 w-6" />}
          title="Aucune actualité pour l'instant"
          description="Les dernières annonces du festival apparaîtront ici dès qu'elles seront publiées."
        />
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
