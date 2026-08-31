import { Plus, Pencil, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconButton } from "@/components/ui/IconButton";
import { COMMUNITY_COLORS } from "@/constants/communautes";
import { COMMUNITY_LABEL } from "@/constants/nav";
import { getCommunautes } from "@/services/communautes";
import { formatDateLong } from "@/lib/formatters";
import type { Communaute } from "@/types";

export const dynamic = 'force-dynamic';

export default async function AdminCommunautesPage() {
  const communautes = await getCommunautes();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Admin", href: "/admin/tableau-de-bord" }, { label: "Communautés" }]} />
        <PageHeader title="Communautés" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <SearchInput placeholder="Rechercher une communauté..." />
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Nouvelle communauté
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communautes.map((c: Communaute) => (
          <Card key={c.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${COMMUNITY_COLORS[c.id]}`} />
                <div className="space-y-1">
                  <h3 className="text-h3 font-semibold text-text">{c.name}</h3>
                  <StatusPill kind={c.status === "active" ? "active" : "inactive"} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IconButton variant="ghost" size="sm" label="Modifier">
                  <Pencil className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton variant="danger" size="sm" label="Supprimer">
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>

            <p className="text-small text-text-muted">{c.description}</p>

            <div className="flex items-end justify-between gap-4 pt-2">
              <div className="flex items-baseline gap-6">
                <div>
                  <div className="text-h2 font-bold text-text tabular-nums">{c.members}</div>
                  <div className="text-eyebrow uppercase tracking-[0.15em] text-text-muted">Membres</div>
                </div>
                <div>
                  <div className="text-h2 font-bold text-text tabular-nums">{c.publications}</div>
                  <div className="text-eyebrow uppercase tracking-[0.15em] text-text-muted">Publications</div>
                </div>
              </div>
              <div className="text-right text-small text-text-muted">
                Créée le<br />
                <span className="text-text">{formatDateLong(c.createdAt)}</span>
              </div>
            </div>

            <Button
              variant={c.status === "active" ? "danger" : "success"}
              block
              size="sm"
            >
              {c.status === "active" ? "Désactiver" : "Activer"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
