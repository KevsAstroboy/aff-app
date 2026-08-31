import { Plus, Download } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { AdminTable, type AdminColumn } from "@/components/domain/AdminTable";
import { ActionCell } from "@/components/domain/ActionCell";
import { COMMUNITY_LABEL } from "@/constants/nav";
import { getUsers } from "@/services/users";
import { formatDateLong } from "@/lib/formatters";
import type { User } from "@/types";

export const dynamic = 'force-dynamic';

export default async function AdminUtilisateursPage() {
  const users = await getUsers();

  const columns: AdminColumn<User>[] = [
    {
      key: "user",
      header: "Utilisateur",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar initials={u.initials} size="sm" country={u.country} />
          <span className="text-body font-medium text-text">{u.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (u) => <span className="text-text-muted">{u.email}</span>,
    },
    {
      key: "communaute",
      header: "Communauté",
      cell: (u) => <span className="text-text">{COMMUNITY_LABEL[u.community]}</span>,
    },
    {
      key: "role",
      header: "Rôle",
      cell: (u) => <span className="text-text-muted">{u.role}</span>,
    },
    {
      key: "statut",
      header: "Statut",
      cell: (u) => (
        <StatusPill kind={u.status === "active" ? "active" : u.status === "waiting" ? "waiting" : "suspended"} />
      ),
    },
    {
      key: "date",
      header: "Inscription",
      cell: (u) => <span className="text-small text-text-muted">{formatDateLong(u.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Admin", href: "/admin/tableau-de-bord" }, { label: "Utilisateurs" }]} />
        <PageHeader title="Utilisateurs" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <SearchInput placeholder="Rechercher un utilisateur..." />
        </div>
        <div className="w-40">
          <Select
            placeholder="Tous"
            options={[
              { value: "all", label: "Tous" },
              { value: "active", label: "Actifs" },
              { value: "waiting", label: "En attente" },
              { value: "suspended", label: "Suspendus" },
            ]}
          />
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
        <IconButton variant="outline" label="Exporter">
          <Download className="h-4 w-4" />
        </IconButton>
      </div>

      <AdminTable
        columns={columns}
        rows={users}
        rowKey={(u) => u.id}
        actions={(u) => (
          <ActionCell
            destructiveLabel={u.status === "active" ? "Suspendre" : "Valider"}
            destructiveVariant={u.status === "active" ? "danger" : "success"}
          />
        )}
        emptyTitle="Aucun utilisateur"
        emptyDescription="Aucun résultat ne correspond à votre recherche."
      />
    </div>
  );
}
