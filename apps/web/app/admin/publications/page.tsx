import { Heart, MessageCircle, SlidersHorizontal, Eye, Trash2, Check, X } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/domain/EmptyState";
import { FileText } from "lucide-react";
import { COMMUNITY_LABEL } from "@/constants/nav";
import { getPublications } from "@/services/publications";
import { relativeTime, compactNumber } from "@/lib/formatters";
import type { Publication } from "@/types";

export const dynamic = 'force-dynamic';

export default async function AdminPublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Admin", href: "/admin/tableau-de-bord" }, { label: "Publications" }]} />
        <PageHeader title="Publications" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <SearchInput placeholder="Rechercher une publication..." />
        </div>
        <div className="w-40">
          <Select
            placeholder="Tous"
            options={[
              { value: "all", label: "Tous" },
              { value: "pending", label: "En attente" },
              { value: "published", label: "Publiées" },
              { value: "rejected", label: "Rejetées" },
            ]}
          />
        </div>
        <IconButton variant="outline" label="Filtres">
          <SlidersHorizontal className="h-4 w-4" />
        </IconButton>
      </div>

      {publications.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="Aucune publication"
          description="Aucune publication ne correspond à votre recherche."
        />
      ) : (
        <div className="space-y-4">
          {publications.map((p) => (
            <PublicationRow key={p.id} pub={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PublicationRow({ pub }: { pub: Publication }) {
  const isPending = pub.status === "pending";

  return (
    <Card
      className={
        isPending
          ? "border-live-red/40"
          : ""
      }
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header line: auteur + tags + time */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-body font-semibold text-text">{pub.authorName}</span>
<Tag color={`domain-${pub.community}` as never} size="sm">
            {COMMUNITY_LABEL[pub.community].toUpperCase()}
          </Tag>
            <StatusPill
              kind={
                pub.status === "published"
                  ? "published"
                  : pub.status === "pending"
                    ? "waiting"
                    : "rejected"
              }
            />
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-live-red/15 text-live-red text-eyebrow tracking-[0.15em]">
                <span className="h-1.5 w-1.5 rounded-full bg-live-red animate-pulse-soft" />
                Signalé
              </span>
            )}
            <div className="flex-1" />
            <span className="text-small text-text-muted">{relativeTime(pub.createdAt)}</span>
          </div>

          {/* Body */}
          <p className="text-body text-text-muted line-clamp-2">{pub.body}</p>

          {/* Reactions */}
          <div className="flex items-center gap-4 text-small text-text-muted tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              {compactNumber(pub.reactions)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              {pub.comments}
            </span>
          </div>
        </div>

        {/* Actions stack vertical */}
        <div className="flex flex-row lg:flex-col items-stretch gap-2 lg:min-w-[140px]">
          <Button variant="outline" size="sm" block>
            <Eye className="h-3.5 w-3.5" />
            Voir
          </Button>
          {isPending && (
            <Button variant="success" size="sm" block>
              <Check className="h-3.5 w-3.5" />
              Valider
            </Button>
          )}
          <Button variant="danger" size="sm" block>
            <X className="h-3.5 w-3.5" />
            Rejeter
          </Button>
          <IconButton variant="danger" size="md" label="Supprimer" className="self-stretch w-full">
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
