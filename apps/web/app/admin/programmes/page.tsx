"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/domain/EmptyState";
import { Calendar } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { unwrap, type BackendProgramme } from "@/lib/adapters";
import { getLieux, type BackendLieu } from "@/services/lieux";

const TYPE_EVENEMENTS = [
  { id: 1, label: "Cérémonie" },
  { id: 2, label: "Masterclass" },
  { id: 3, label: "Atelier" },
  { id: 4, label: "Panel" },
  { id: 5, label: "Autre" },
];

type DisplayEvent = {
  id: number;
  titre: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  is_hot: boolean;
  lieu: string | null;
};

type FormState = {
  titre: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  type_evenement_id: number;
  lieu_id: number | "";
  edition_id: number;
  description: string;
  is_hot: boolean;
};

const EMPTY_FORM: FormState = {
  titre: "",
  jour: "",
  heure_debut: "10:00",
  heure_fin: "11:00",
  type_evenement_id: 1,
  lieu_id: "",
  edition_id: 2,
  description: "",
  is_hot: false,
};

function fmtDay(s: string): string {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s.slice(0, 10);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
}

function hhmm(v: string | null | undefined): string {
  if (!v) return "--:--";
  return v.slice(0, 5);
}

export default function AdminProgrammesPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [lieux, setLieux] = useState<BackendLieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [l, e] = await Promise.all([
          getLieux(),
          apiClient.get<{ id: number }>("/editions/current").catch(() => null),
        ]);
        setLieux(l);
        if (e?.id) setForm((f) => ({ ...f, edition_id: e.id }));
      } catch {
        /* ignore */
      }
    })();
  }, []);

  function load() {
    setLoading(true);
    apiClient
      .get<BackendProgramme[] | { data: BackendProgramme[] }>("/programme")
      .then((data) => {
        const items = unwrap(data);
        setEvents(
          items.map((e) => ({
            id: e.id,
            titre: e.titre ?? `Événement #${e.id}`,
            jour: e.jour ?? "",
            heure_debut: e.heure_debut ?? "",
            heure_fin: e.heure_fin ?? "",
            is_hot: e.is_hot ?? false,
            lieu: e.lieu?.libelle ?? null,
          })),
        );
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, edition_id: form.edition_id });
    setError("");
    setOpen(true);
  }

  function startEdit(e: DisplayEvent) {
    setEditing(e.id);
    setForm({
      titre: e.titre,
      jour: e.jour ? e.jour.slice(0, 10) : "",
      heure_debut: hhmm(e.heure_debut),
      heure_fin: hhmm(e.heure_fin),
      type_evenement_id: 1,
      edition_id: form.edition_id,
      lieu_id: "",
      description: "",
      is_hot: e.is_hot,
    });
    setError("");
    setOpen(true);
  }

  async function save() {
    setError("");
    if (!form.titre.trim()) return setError("Le titre est obligatoire");
    if (!form.jour.trim()) return setError("La date est obligatoire");
    try {
      const payload = {
        titre: form.titre,
        jour: form.jour,
        heure_debut: `${form.heure_debut}:00`,
        heure_fin: `${form.heure_fin}:00`,
        type_evenement_id: form.type_evenement_id,
        edition_id: form.edition_id,
        description: form.description || undefined,
        is_hot: form.is_hot,
        ...(form.lieu_id !== "" ? { lieu_id: Number(form.lieu_id) } : {}),
      };
      if (editing) {
        await apiClient.patch(`/programme/${editing}`, payload);
      } else {
        await apiClient.post("/programme", payload);
      }
      setOpen(false);
      load();
    } catch (err: unknown) {
      const res = err as { message?: string };
      setError(typeof res?.message === "string" ? res.message : "Erreur lors de l'enregistrement");
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cet événement ?")) return;
    try {
      await apiClient.delete(`/programme/${id}`);
      load();
    } catch {}
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/tableau-de-bord" },
            { label: "Programme" },
          ]}
        />
        <PageHeader
          title="Programme"
          actions={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nouvel événement
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
      ) : events.length === 0 ? (
        <EmptyState icon={<Calendar className="h-6 w-6" />} title="Aucun événement" />
      ) : (
        <Card className="divide-y divide-border">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-4 py-4">
              <div className="flex flex-col items-center min-w-[64px]">
                <span className="text-h3 font-bold text-gold tabular-nums">
                  {hhmm(e.heure_debut)}
                </span>
                <span className="text-small text-text-muted capitalize">{fmtDay(e.jour)}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-body font-semibold text-text">{e.titre}</h3>
                {e.lieu && (
                  <div className="flex items-center gap-1 text-small text-text-muted">
                    <MapPin className="h-3 w-3" />
                    {e.lieu}
                  </div>
                )}
              </div>
              {e.is_hot && <StatusPill kind="hot" />}
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Modifier l'événement" : "Nouvel événement"} size="md">
        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
              {error}
            </div>
          )}
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Titre</span>
            <Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Date</span>
              <Input
                type="date"
                value={form.jour}
                onChange={(e) => setForm({ ...form, jour: e.target.value })}
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Type</span>
              <Select
                value={String(form.type_evenement_id)}
                onChange={(e) => setForm({ ...form, type_evenement_id: Number(e.target.value) })}
                options={TYPE_EVENEMENTS.map((t) => ({ value: String(t.id), label: t.label }))}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Début</span>
              <Input type="time" value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Fin</span>
              <Input type="time" value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Lieu</span>
              <Select
                value={form.lieu_id === "" ? "" : String(form.lieu_id)}
                onChange={(e) => setForm({ ...form, lieu_id: e.target.value ? Number(e.target.value) : "" })}
                options={[
                  { value: "", label: "— Aucun —" },
                  ...lieux.map((l) => ({ value: String(l.id), label: l.libelle ?? `Lieu #${l.id}` })),
                ]}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Édition #{form.edition_id}</span>
              <Input value={`${form.edition_id}`} disabled />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Description</span>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_hot}
              onChange={(e) => setForm({ ...form, is_hot: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className="text-body text-text">Marquer comme HOT</span>
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