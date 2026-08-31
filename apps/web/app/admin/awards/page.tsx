"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/domain/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Trophy, X } from "lucide-react";
import {
  getAwardCategories,
  createAwardCategory,
  updateAwardCategory,
} from "@/services/awards-api";
import { useModalStore } from "@/stores/modal";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

type Category = {
  id: number;
  libelle?: string;
  code?: string;
  is_grand_prix?: boolean;
  theme_id?: number;
  edition_id?: number;
};

export default function AdminAwardsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ libelle: "", code: "" });
  const [error, setError] = useState("");
  const { inscriptionOpen, openInscription, closeInscription } = useModalStore();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = (await getAwardCategories()) as Category[] | { items: Category[] };
      const arr = Array.isArray(data) ? data : data.items ?? [];
      setCategories(arr);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditing({ id: 0, libelle: "", code: "" });
    setForm({ libelle: "", code: "" });
    openInscription();
  }

  function startEdit(c: Category) {
    setEditing(c);
    setForm({ libelle: c.libelle ?? "", code: c.code ?? "" });
    openInscription();
  }

  async function save() {
    setError("");
    try {
      if (editing && editing.id) {
        await updateAwardCategory(editing.id, form);
      } else {
        await createAwardCategory({ ...form, theme_id: 1, edition_id: 1 });
      }
      closeInscription();
      await load();
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof m === "string" ? m : "Erreur");
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await apiClient.delete(`/awards/categories/${id}`);
      await load();
    } catch {
      // silent
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/tableau-de-bord" },
            { label: "Awards" },
          ]}
        />
        <PageHeader
          title="Awards — Catégories"
          actions={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nouvelle catégorie
            </Button>
          }
        />
      </div>

      <SearchInput placeholder="Rechercher une catégorie..." />

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-6 w-6" />}
          title="Aucune catégorie"
          description="Créez la première catégorie d'Awards."
        />
      ) : (
        <Card className="divide-y divide-border">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-body font-medium text-text">{c.libelle}</div>
                  {c.is_grand_prix && (
                    <Tag color="warn">GRAND PRIX</Tag>
                  )}
                </div>
                <div className="text-small text-text-muted">
                  Code : <span className="font-mono">{c.code}</span>
                </div>
              </div>
              <StatusPill kind="active" />
              <IconButton variant="outline" size="sm" label="Modifier" onClick={() => startEdit(c)}>
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton variant="danger" size="sm" label="Supprimer" onClick={() => remove(c.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={inscriptionOpen}
        onClose={closeInscription}
        title={editing?.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
        size="md"
      >
        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
              {error}
            </div>
          )}
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Libellé</span>
            <Input value={form.libelle} onChange={(e) => setForm((f) => ({ ...f, libelle: e.target.value }))} />
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Code</span>
            <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
          </label>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeInscription}>
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button type="button" onClick={save}>
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}