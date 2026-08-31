"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/domain/EmptyState";
import { getLieux, createLieu, updateLieu, deleteLieu, type BackendLieu } from "@/services/lieux";

export default function AdminLieuxPage() {
  const [lieux, setLieux] = useState<BackendLieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BackendLieu | null>(null);
  const [form, setForm] = useState({ libelle: "", capacite: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setLieux(await getLieux());
    } catch {
      setLieux([]);
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditing(null);
    setForm({ libelle: "", capacite: "" });
    setError("");
    setOpen(true);
  }

  function startEdit(l: BackendLieu) {
    setEditing(l);
    setForm({
      libelle: l.libelle ?? "",
      capacite: l.capacite != null ? String(l.capacite) : "",
    });
    setError("");
    setOpen(true);
  }

  async function save() {
    setError("");
    if (!form.libelle.trim()) {
      setError("Le libellé est obligatoire.");
      return;
    }
    try {
      const payload = {
        libelle: form.libelle.trim(),
        capacite: form.capacite !== "" ? Number(form.capacite) : undefined,
      };
      if (editing) {
        await updateLieu(editing.id, payload);
      } else {
        await createLieu(payload);
      }
      setOpen(false);
      await load();
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof m === "string" ? m : "Erreur");
    }
  }

  async function remove(l: BackendLieu) {
    if (!confirm(`Supprimer le lieu « ${l.libelle} » ?`)) return;
    try {
      await deleteLieu(l.id);
      await load();
    } catch {}
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/tableau-de-bord" },
            { label: "Lieux" },
          ]}
        />
        <PageHeader
          title="Lieux"
          actions={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nouveau lieu
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : lieux.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="Aucun lieu"
          description="Ajoutez un premier lieu pour les masterclasses présentielles."
        />
      ) : (
        <Card className="divide-y divide-border">
          {lieux.map((l) => (
            <div key={l.id} className="flex items-center gap-4 py-4 px-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft text-gold">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-body font-semibold text-text">{l.libelle}</h3>
                {l.capacite != null && (
                  <div className="text-small text-text-muted">
                    Capacité : {l.capacite}
                  </div>
                )}
              </div>
              <IconButton variant="outline" size="sm" label="Modifier" onClick={() => startEdit(l)}>
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton variant="danger" size="sm" label="Supprimer" onClick={() => remove(l)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier le lieu" : "Nouveau lieu"}
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
            <Input
              value={form.libelle}
              onChange={(e) => setForm({ ...form, libelle: e.target.value })}
              placeholder="Ex : Grande scène"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Capacité</span>
            <Input
              type="number"
              value={form.capacite}
              onChange={(e) => setForm({ ...form, capacite: e.target.value })}
              placeholder="Optionnel"
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}