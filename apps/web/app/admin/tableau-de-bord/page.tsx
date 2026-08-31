import { Users, Radio, FileText, Flag } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { KPICard } from "@/components/domain/KPICard";
import { ActivityItem } from "@/components/domain/ActivityItem";
import { Card } from "@/components/ui/Card";
import { getKpis, getActivite, getTopCommunautes } from "@/services/dashboard";
import { apiClient } from "@/lib/api-client";
import { unwrap, type BackendCommunaute } from "@/lib/adapters";
import type { ActivityItem as ActivityItemType } from "@/types";

export const dynamic = 'force-dynamic';

const ICONS = {
  users: Users,
  masterclass: Radio,
  publication: FileText,
  report: Flag,
} as const;

const ICON_COLORS: Record<string, "gold" | "warn" | "success" | "purple" | "live-red"> = {
  users: "gold",
  masterclass: "purple",
  publication: "success",
  report: "live-red",
};

const ACTIVITY_ICONS = {
  user: "user",
  masterclass: "masterclass",
  report: "report",
  publication: "publication",
  resolve: "resolve",
  community: "community",
} as const;

export default async function AdminDashboardPage() {
  const [kpis, activityRaw, topCommunautesRaw, adminUsers, adminStats, adminContent, adminReports, communautes] =
    await Promise.all([
      getKpis(),
      apiClient
        .get<ActivityItemType[] | { items: ActivityItemType[] }>(
          "/admin/signalements/recent",
          { limit: "10" }
        )
        .catch(() => [] as ActivityItemType[]),
      apiClient.get("/admin/content/stats").catch(() => []),
      apiClient.get("/admin/users/get-by-criteria").catch(() => []),
      apiClient.get("/admin/stats").catch(() => ({})),
      apiClient.get("/admin/content/stats").catch(() => ({})),
      apiClient.get("/moderation/get-by-criteria").catch(() => []),
      apiClient.get<BackendCommunaute[]>("/communaute").catch(() => []),
    ]);

  const activity = Array.isArray(activityRaw)
    ? activityRaw
    : unwrap(activityRaw as ActivityItemType[] | { items: ActivityItemType[] });

  const communautesItems = unwrap(communautes as BackendCommunaute[] | { items: BackendCommunaute[] });
  const topByMembers = [...communautesItems]
    .sort((a, b) => (b.membres_count ?? 0) - (a.membres_count ?? 0))
    .slice(0, 5)
    .map((c, i) => ({
      id: String(c.id),
      name: c.libelle ?? `Communauté #${c.id}`,
      members: c.membres_count ?? 0,
      color: COLOR_BY_INDEX[i] ?? "bg-text-muted",
    }));

  const adminStatsObj = (adminStats ?? {}) as {
    total_users?: number;
    total_publications?: number;
    total_masterclass?: number;
    total_signalements?: number;
  };
  const adminContentObj = (adminContent ?? {}) as {
    total_publications?: number;
    publications_today?: number;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/tableau-de-bord" },
            { label: "Tableau de bord" },
          ]}
        />
        <PageHeader title="Tableau de bord" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Utilisateurs"
          value={adminStatsObj.total_users ?? 0}
          delta={{ value: 12, isPositive: true, suffix: "% ce mois" }}
          icon={<Users className="h-5 w-5" />}
          iconColor="gold"
        />
        <KPICard
          label="Masterclasses"
          value={adminStatsObj.total_masterclass ?? 0}
          delta={{ value: 1, isPositive: true, suffix: "en direct" }}
          icon={<Radio className="h-5 w-5" />}
          iconColor="purple"
        />
        <KPICard
          label="Publications"
          value={adminStatsObj.total_publications ?? 0}
          delta={{
            value: adminContentObj.publications_today ?? 0,
            isPositive: true,
            suffix: "aujourd'hui",
          }}
          icon={<FileText className="h-5 w-5" />}
          iconColor="success"
        />
        <KPICard
          label="Signalements"
          value={adminStatsObj.total_signalements ?? 0}
          delta={{ value: 2, isPositive: false, suffix: "urgents" }}
          icon={<Flag className="h-5 w-5" />}
          iconColor="live-red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gold-soft text-gold">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 7-7" />
                </svg>
              </span>
              <h2 className="text-eyebrow uppercase tracking-[0.2em] text-gold">Activité récente</h2>
            </div>
          </div>
          {activity.length === 0 ? (
            <p className="text-body text-text-muted py-8 text-center">Aucune activité récente.</p>
          ) : (
            <div className="divide-y divide-border">
              {activity.map((a) => (
                <ActivityItem key={a.id} item={a} />
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <h2 className="text-eyebrow uppercase tracking-[0.2em] text-gold">Communautés actives</h2>
          {topByMembers.length === 0 ? (
            <p className="text-body text-text-muted">Aucune communauté.</p>
          ) : (
            <ul className="space-y-4">
              {topByMembers.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3">
                  <span className="text-small tabular-nums text-text-subtle w-6">
                    #{i + 1}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} aria-hidden="true" />
                  <span className="flex-1 text-body text-text">{c.name}</span>
                  <span className="text-body font-semibold text-text tabular-nums">{c.members}</span>
                  <span className="text-small text-text-muted">membres</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

const COLOR_BY_INDEX = [
  "bg-domain-art",
  "bg-domain-musique",
  "bg-domain-cinema",
  "bg-domain-mode",
  "bg-domain-danse",
];