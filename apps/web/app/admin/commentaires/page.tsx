import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { AdminTable, type AdminColumn } from "@/components/domain/AdminTable";
import { ActionCell } from "@/components/domain/ActionCell";
import { getComments } from "@/services/comments";
import { relativeTime } from "@/lib/formatters";
import type { Comment } from "@/types";

export const dynamic = 'force-dynamic';

export default async function AdminCommentairesPage() {
  const comments = await getComments();

  const columns: AdminColumn<Comment>[] = [
    {
      key: "auteur",
      header: "Auteur",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <Avatar initials={c.initials} size="sm" country={c.country} />
          <span className="text-body font-medium text-text">{c.authorName}</span>
        </div>
      ),
    },
    {
      key: "extrait",
      header: "Extrait",
      cell: (c) => <span className="line-clamp-2 text-text-muted text-small max-w-md">{c.body}</span>,
    },
    {
      key: "publication",
      header: "Publication",
      cell: (c) => (
        <span className="line-clamp-1 text-small text-text-muted max-w-xs">{c.parentPublicationTitle}</span>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      cell: (c) => (
        <StatusPill
          kind={c.status === "approved" ? "validated" : c.status === "pending" ? "waiting" : "cancelled"}
        />
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (c) => <span className="text-small text-text-muted">{relativeTime(c.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Admin", href: "/admin/tableau-de-bord" }, { label: "Commentaires" }]} />
        <PageHeader title="Commentaires" />
      </div>

      <AdminTable
        columns={columns}
        rows={comments}
        rowKey={(c) => c.id}
        actions={(c) => (
          <ActionCell
            destructiveLabel={c.status === "pending" ? "Approuver" : "Masquer"}
            destructiveVariant={c.status === "pending" ? "success" : "danger"}
          />
        )}
        emptyTitle="Aucun commentaire"
      />
    </div>
  );
}
