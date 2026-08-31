"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/domain/EmptyState";
import { StatusPill } from "@/components/ui/StatusPill";
import { Tag } from "@/components/ui/Tag";
import { apiClient } from "@/lib/api-client";

type Edition = {
  id: number;
  annee: number;
  ville?: string;
  pays?: string;
  date_debut?: string;
  date_fin?: string;
  statut_id?: number;
  is_current?: boolean;
};

export default function AdminEditionsPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Edition | null>(null);
  const [form, setForm] = useState({ annee: 2026, ville: "", pays: "Côte d'Ivoire", date_debut: "", date_fin: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await apiClient.get<Edition[] | { items: Edition[] }>("/editions");
      const items = Array.isArray(data) ? data : data.items ?? [];
      setEditions(items);
    } catch {
      setEditions([]);
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditing(null);
    setForm({ annee: 2027, ville: "", pays: "Côte d'Ivoire", date_debut: "", date_fin: "" });
    setError("");
    setOpen(true);
  }

  function startEdit(e: Edition) {
    setEditing(e);
    setForm({
      annee: e.annee,
      ville: e.ville ?? "",
      pays: e.pays ?? "",
      date_debut: e.date_debut ?? "",
      date_fin: e.date_fin ?? "",
    });
    setError("");
    setOpen(true);
  }

  async function save() {
    setError("");
    try {
      if (editing) {
        await apiClient.patch(`/editions/${editing.id}`, form);
      } else {
        await apiClient.post("/editions", form);
      }
      setOpen(false);
      await load();
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof m === "string" ? m : "Erreur");
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cette édition ?")) return;
    try {
      await apiClient.delete(`/editions/${id}`);
      await load();
    } catch {}
  }

  async function setCurrent(id: number) {
    try {
      await apiClient.patch(`/editions/${id}`, { is_current: true });
      await load();
    } catch {}
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/tableau-de-bord" },
            { label: "Éditions" },
          ]}
        />
        <PageHeader
          title="Éditions"
          actions={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nouvelle édition
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : editions.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="Aucune édition"
        />
      ) : (
        <Card className="divide-y divide-border">
          {editions.map((e) => (
            <div key={e.id} className="flex items-center gap-4 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-h3 font-bold text-gold tabular-nums">{e.annee}</h3>
                  {e.is_current && <Tag color="warn">ACTIVE</Tag>}
                </div>
                <div className="text-small text-text-muted">
                  {e.ville && `${e.ville}, `}{e.pays}
                </div>
                <div className="text-small text-text-muted tabular-nums">
                  {e.date_debut ?? ""} {e.date_fin ? `→ ${e.date_fin}` : ""}
                </div>
              </div>
              {!e.is_current && (
                <Button variant="outline" size="sm" onClick={() => setCurrent(e.id)}>
                  Activer
                </Button>
              )}
              <IconButton variant="outline" size="sm" label="Modifier" onClick={() => startEdit(e)}>
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton variant="danger" size="sm" label="Supprimer" onClick={() => remove(e.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier l'édition" : "Nouvelle édition"}
        size="md"
      >
        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Année</span>
              <Input
                type="number"
                value={form.annee}
                onChange={(e) => setForm({ ...form, annee: parseInt(e.target.value) })}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Ville</span>
              <Input value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Pays</span>
            <Input value={form.pays} onChange={(e) => setForm({ ...form, pays: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Début</span>
              <Input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Fin</span>
              <Input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} />
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}