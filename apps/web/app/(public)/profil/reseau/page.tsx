import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { EmptyState } from "@/components/domain/EmptyState";
import { flag } from "@/lib/flags";
import { COMMUNITY_LABEL } from "@/constants/nav";
import { getNetwork } from "@/services/network";
import type { CommunityId } from "@/types";
import { Users } from "lucide-react";

export const dynamic = 'force-dynamic';

const SAFE_COMMUNITIES: CommunityId[] = [
  "art",
  "musique",
  "cinema",
  "mode",
  "danse",
  "litterature",
  "gastronomie",
];

function safeCommunity(c: string | undefined | null): CommunityId {
  return (SAFE_COMMUNITIES as string[]).includes(c ?? "")
    ? (c as CommunityId)
    : "art";
}

export default async function ReseauPage() {
  let contacts: Awaited<ReturnType<typeof getNetwork>> = [];
  try {
    contacts = await getNetwork();
  } catch {
    contacts = [];
  }

  const followingCount = contacts.filter((c) => c.isFollowing === true).length;

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Profil", href: "/profil" },
          { label: "Réseau créatif" },
        ]}
      />
      <PageHeader
        eyebrow="Communauté"
        title="Mon réseau créatif"
        subtitle={`${followingCount} créateurs suivis`}
      />

      {contacts.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Aucune communauté"
          description="Vos communautés suivies apparaîtront ici."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => {
            const community = safeCommunity(c.community);
            const country = c.country ?? "";
            const name = c.name ?? "";
            const role = c.role ?? "Créateur";
            const initials = c.initials || name.slice(0, 2).toUpperCase() || "??";
            return (
              <Card key={c.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={initials} size="md" country={country} />
                  <div className="flex-1 min-w-0">
                    <div className="text-body font-semibold text-text truncate">
                      {name}
                    </div>
                    <div className="text-small text-text-muted truncate">{role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag color={`domain-${community}` as never} size="sm">
                    {COMMUNITY_LABEL[community].toUpperCase()}
                  </Tag>
                  <span className="text-body">{flag(country)}</span>
                </div>
                <Button
                  variant={c.isFollowing ? "outline" : "primary"}
                  size="sm"
                  block
                >
                  {c.isFollowing ? "Suivi" : "Suivre"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}