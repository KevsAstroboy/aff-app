"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, Users, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/domain/PostCard";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { FilterChip, communityColorClass } from "@/components/domain/FilterChip";
import { FeedComposer } from "@/components/domain/FeedComposer";
import { createConversation } from "@/services/mutations";
import { useAuthStore } from "@/stores/auth";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { FeedPost, CommunityId } from "@/types";

type FeedPageProps = {
  posts: FeedPost[];
  counts: Record<CommunityId, number>;
  tendances: { tag: string; count: number }[];
  activeMembers: { id: string; name: string; initials: string; community: string }[];
};

const COMMUNITY_ORDER: CommunityId[] = ["art", "musique", "cinema", "mode", "danse", "litterature", "gastronomie"];

const COMMUNITY_LABELS: Record<CommunityId, string> = {
  art: "Art",
  musique: "Musique",
  cinema: "Cinéma",
  mode: "Mode",
  danse: "Danse",
  litterature: "Littérature",
  gastronomie: "Gastronomie",
};

const COMMUNITY_COLOR: Record<CommunityId, string> = {
  art: "bg-domain-art",
  musique: "bg-domain-musique",
  cinema: "bg-domain-cinema",
  mode: "bg-domain-mode",
  danse: "bg-domain-danse",
  litterature: "bg-domain-litterature",
  gastronomie: "bg-warn",
};

export function FeedClient({ posts, tendances, activeMembers, counts }: FeedPageProps) {
  const [filter, setFilter] = useState<CommunityId | "all">("all");
  const router = useRouter();
  const me = useAuthStore((s) => s.user);
  const [chatUser, setChatUser] = useState<{ id: string; name: string } | null>(null);
  const [creating, setCreating] = useState(false);
  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.community === filter);

  const totalCount = COMMUNITY_ORDER.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
  const communityList = COMMUNITY_ORDER.filter((k) => (counts[k] ?? 0) > 0).map((k) => ({
    id: k,
    label: COMMUNITY_LABELS[k],
    count: counts[k] ?? 0,
    color: COMMUNITY_COLOR[k],
  }));

  const openChat = async (userId: string, name: string) => {
    if (!me) return router.push("/login");
    if (String(me.id) === userId) return;
    setChatUser({ id: userId, name });
  };

  const confirmChat = async () => {
    if (!chatUser) return;
    setCreating(true);
    try {
      const conv = await createConversation(parseInt(chatUser.id));
      router.push(`/messages?conv=${conv.id}`);
    } catch {
      setCreating(false);
      setChatUser(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px]">
      {/* Left: filters */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <h2 className="px-3 text-eyebrow uppercase tracking-[0.18em] text-text-muted">
          Communautés
        </h2>
        <div className="space-y-1">
          <FilterChip
            key="all"
            id="all"
            label="Tout"
            count={totalCount}
            color="bg-gold"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {communityList.map((c) => (
            <FilterChip
              key={c.id}
              id={c.id}
              label={c.label}
              count={c.count}
              color={c.color ?? "bg-gold"}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            />
          ))}
        </div>
      </aside>

      {/* Center: composer + posts */}
      <section className="space-y-6 min-w-0">
        <FeedComposer />

        <div className="space-y-6">
          {filteredPosts.map((p) => (
            <div key={p.id} className="space-y-2">
              <PostCard post={p} onReact={() => router.refresh()} onComment={() => router.refresh()} />
              <div className="flex items-center justify-end gap-2 px-2">
                <button
                  onClick={() => openChat(String(p.authorId), p.authorName)}
                  className="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-gold transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Envoyer un message à {p.authorName.split(" ")[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Right: trends + active members */}
      <aside className="hidden xl:block space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold" />
            <h2 className="text-eyebrow uppercase tracking-[0.18em] text-gold">Tendances</h2>
          </div>
          <div className="space-y-3">
            {tendances.map((t) => (
              <div key={t.tag} className="space-y-0.5">
                <div className="text-body font-semibold text-gold">{t.tag}</div>
                <div className="text-small text-text-muted tabular-nums">
                  {t.count.toLocaleString("fr-FR")} publications
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-text-muted" />
            <h2 className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
              Membres actifs
            </h2>
          </div>
          <div className="space-y-3">
            {activeMembers.map((m) => (
              <Link
                key={m.id}
                href={`/profil/${m.id}`}
                className="flex w-full items-center gap-3 rounded-md p-1 hover:bg-white/5"
              >
                <Avatar initials={m.initials} size="sm" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-body text-text truncate">{m.name}</div>
                  <div className="text-small text-gold">{m.community}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat confirm modal */}
      <Modal
        open={chatUser !== null}
        onClose={() => setChatUser(null)}
        title="Démarrer une conversation"
        size="sm"
      >
        <div className="space-y-5">
          <p className="text-body text-text-muted">
            Démarrer une conversation privée avec <strong className="text-text">{chatUser?.name}</strong> ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setChatUser(null)} disabled={creating}>
              Annuler
            </Button>
            <Button onClick={confirmChat} disabled={creating}>
              {creating ? "Création..." : "Démarrer"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
