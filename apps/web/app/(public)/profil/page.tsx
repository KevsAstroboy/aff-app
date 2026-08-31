"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Calendar, Heart, Trophy, FolderOpen, Users, Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { QuickLinkCard } from "@/components/domain/QuickLinkCard";
import { EmptyState } from "@/components/domain/EmptyState";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth";
import type { ProfileStats } from "@/types/auth";
import { FESTIVAL_YEAR } from "@/constants/festival";

export default function ProfilPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await apiClient.get<ProfileStats>("/auth/profile/stats");
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-8">
        <PageHeader title="Profil" />
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Non connecté"
          description="Connectez-vous pour voir votre profil."
        />
      </div>
    );
  }

  const initials =
    (user.nom?.[0] ?? "") + (user.prenom?.[0] ?? "") ||
    user.username?.slice(0, 2).toUpperCase() ||
    "??";

  const fullName = [user.prenom, user.nom].filter(Boolean).join(" ") || user.username;

  return (
    <div className="space-y-8">
      {/* Header card */}
      <Card className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <Avatar
          initials={initials}
          size="lg"
          country={user.country}
          src={user.profile_picture_path}
        />
        <div className="flex-1 space-y-3">
          <h2 className="text-h1 font-bold text-text">{fullName}</h2>
          <Tag color="muted">{(user.description ?? user.username).toUpperCase()}</Tag>
          <div className="flex flex-wrap gap-6 pt-2 text-body">
            <span>
              <span className="font-bold text-text tabular-nums">{stats?.publications_count ?? 0}</span>{" "}
              <span className="text-text-muted">publications</span>
            </span>
            <span>
              <span className="font-bold text-text tabular-nums">{stats?.communautes_count ?? 0}</span>{" "}
              <span className="text-text-muted">communautés</span>
            </span>
            <span>
              <span className="font-bold text-text tabular-nums">{stats?.awards_candidatures_count ?? 0}</span>{" "}
              <span className="text-text-muted">candidatures</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Badge card */}
      <Card featured className="relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1">
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx="100" cy="100" r={10 + i * 10} className="text-gold" />
            ))}
          </svg>
        </div>
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="text-eyebrow uppercase tracking-[0.2em] text-gold">
              Badge officiel d&apos;accès
            </div>
            <h3 className="text-display font-extrabold text-gold tracking-tight">AFF. {FESTIVAL_YEAR}</h3>
            <p className="text-body text-text-muted">
              Accès libre 19 &amp; 20 Août — Palais de la Culture, Abidjan
            </p>
            <div className="flex items-end gap-1 h-24" aria-hidden="true">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-gold"
                  style={{ height: `${30 + Math.sin(i * 0.7) * 25 + Math.random() * 40}%` }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                Télécharger mon badge
              </Button>
              <Button variant="outline" size="lg">
                Partager mon badge
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuickLinkCard
          href="/profil/candidatures"
          icon={<Trophy className="h-5 w-5" />}
          title="Mes candidatures Awards"
          description="Gérer vos candidatures et suivre leur statut"
          badge={stats?.awards_candidatures_count ?? 0}
        />
        <QuickLinkCard
          href="/profil/programme"
          icon={<Calendar className="h-5 w-5" />}
          title="Mon programme personnalisé"
          description="Sessions et événements enregistrés"
          badge={stats?.masterclass_inscriptions_count ?? 0}
        />
        <QuickLinkCard
          href="/profil/reseau"
          icon={<Users className="h-5 w-5" />}
          title="Mon réseau créatif AFF"
          description="Connexions et contacts du festival"
          badge={stats?.communautes_count ?? 0}
        />
        <QuickLinkCard
          href="/profil/portfolio"
          icon={<FolderOpen className="h-5 w-5" />}
          title="Mon portfolio gallery"
          description="Projets et travaux créatifs"
        />
        <QuickLinkCard
          href="/profil/editer"
          icon={<Settings className="h-5 w-5" />}
          title="Paramètres du compte"
          description="Gérer vos informations et préférences"
          className="md:col-span-2"
        />
      </div>

      {/* Removed participation stats block per requirements */}
    </div>
  );
}