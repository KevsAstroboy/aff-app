"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  FolderOpen,
  Pencil,
  MapPin,
  Users,
  BadgeCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/domain/EmptyState";
import { Skeleton } from "@/components/domain/Skeleton";
import { useAuthStore } from "@/stores/auth";
import { getPublicUser, getPublicPortfolio, type PublicUser } from "@/services/users";
import { createConversation } from "@/services/mutations";
import { useChatStore } from "@/stores/chat";
import type { PortfolioItem } from "@/services/portfolio";
import { mediaFileUrl } from "@/components/ui/Avatar";

function PublicProfileSkeleton() {
  return (
    <div className="space-y-8">
      <PageHeader title="Profil" />
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = Number(params?.id);
  const me = useAuthStore((s) => s.user);
  const openConversation = useChatStore((s) => s.openConversation);

  const [user, setUser] = useState<PublicUser | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const isSelf = me?.id === userId;

  useEffect(() => {
    if (!Number.isFinite(userId)) {
      router.replace("/profil");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [profile, portfolio] = await Promise.all([
          getPublicUser(userId),
          getPublicPortfolio(userId),
        ]);
        setUser(profile);
        setPortfolio(portfolio);
      } catch {
        router.replace("/profil");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, router]);

  const handleMessage = useCallback(async () => {
    if (!user) return;
    setSending(true);
    try {
      const conv = await createConversation(user.id);
      openConversation(String(conv.id));
      router.push("/messages");
    } catch {
      // silently ignore; user stays on profile
    } finally {
      setSending(false);
    }
  }, [user, openConversation, router]);

  const initials = useMemo(() => {
    if (!user) return "??";
    return (
      (user.nom?.[0] ?? "") + (user.prenom?.[0] ?? "") ||
      user.username?.slice(0, 2).toUpperCase() ||
      "??"
    );
  }, [user]);

  const fullName = useMemo(
    () => [user?.prenom, user?.nom].filter(Boolean).join(" ") || user?.username,
    [user]
  );

  if (loading) return <PublicProfileSkeleton />;

  if (!user) {
    return (
      <div className="space-y-8">
        <PageHeader title="Profil" />
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Profil introuvable"
          description="Cet utilisateur n'existe pas ou n'est plus actif."
        />
      </div>
    );
  }

  const lightboxItems = portfolio
    .map((p) => mediaFileUrl(p.file_path))
    .filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      <PageHeader title="Profil" />

      {/* Header card */}
      <Card className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <Avatar
          initials={initials}
          size="xl"
          src={user.profile_picture_path}
          className="ring-4 ring-gold/30"
        />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h1 font-bold text-text">{fullName}</h2>
            {user.is_officiel && (
              <BadgeCheck className="h-5 w-5 text-gold" aria-label="Compte officiel" />
            )}
          </div>
          <p className="text-text-muted">
            @{user.username}
            {user.is_officiel ? " · Compte officiel AFF" : ""}
          </p>
          {user.description && <p className="text-body text-text">{user.description}</p>}

          <div className="flex flex-wrap gap-6 pt-2 text-body">
            <span>
              <span className="font-bold text-text tabular-nums">{user.stats.portfolio_count}</span>{" "}
              <span className="text-text-muted">œuvres</span>
            </span>
            <span>
              <span className="font-bold text-text tabular-nums">{user.stats.candidatures_count}</span>{" "}
              <span className="text-text-muted">candidatures</span>
            </span>
            <span>
              <span className="font-bold text-text tabular-nums">
                {user.stats.masterclass_inscriptions_count}
              </span>{" "}
              <span className="text-text-muted">sessions</span>
            </span>
          </div>

          {user.communautes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <MapPin className="h-4 w-4 text-text-muted" aria-hidden="true" />
              {user.communautes.map((c) => (
                <Tag key={c.id ?? c.code} color="muted">
                  {c.libelle}
                </Tag>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-3">
            {isSelf ? (
              <Link href="/profil/editer">
                <Button variant="outline">
                  <Pencil className="h-4 w-4" />
                  Modifier mon profil
                </Button>
              </Link>
            ) : (
              <Button loading={sending} onClick={handleMessage}>
                <MessageCircle className="h-4 w-4" />
                Envoyer un message
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Portfolio section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-gold" />
          <h2 className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Portfolio
          </h2>
          {portfolio.length > 0 && (
            <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs tabular-nums text-text-muted">
              {portfolio.length}
            </span>
          )}
        </div>

        {portfolio.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-6 w-6" />}
            title="Portfolio vide"
            description={`${user.username} n'a pas encore partagé d'œuvres.`}
          />
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {portfolio.map((item, index) => {
              const url = mediaFileUrl(item.file_path);
              if (!url) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => setLightbox(index)}
                  className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-surface-hover text-left transition-transform hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={item.titre}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 p-4">
                    <p className="font-semibold text-text">{item.titre}</p>
                    {item.description && (
                      <p className="text-small text-text-muted line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && lightboxItems[lightbox] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full bg-surface p-2 text-text-muted hover:bg-surface-hover hover:text-text"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxItems[lightbox]}
            alt={portfolio[lightbox]?.titre ?? ""}
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-body text-text">
            {portfolio[lightbox]?.titre}
          </p>
        </div>
      )}
    </div>
  );
}
