"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, SlidersHorizontal, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/domain/EmptyState";
import { MasterclassAdminRow, MasterclassAdminCard } from "@/components/domain/MasterclassAdminRow";
import { Calendar } from "lucide-react";
import type { Masterclass } from "@/types";
import {
  getMasterclassesAdmin,
  listMyMasterclassIds,
  createMasterclass,
  updateMasterclass,
  deleteMasterclass,
} from "@/services/masterclasses";
import { getLieux, createLieu, type BackendLieu } from "@/services/lieux";
import { getProgramme, type ProgrammeEvent } from "@/services/programme";

const GRID_COLS =
  "xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,auto)_minmax(0,0.9fr)_minmax(0,140px)_minmax(0,auto)_minmax(0,auto)]";

const PAGE_SIZE = 10;

type FormState = {
  evenement_id: number | "";
  titre: string;
  description: string;
  expert: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  lieu_id: string;
  communaute_id: string;
  mode_diffusion_id: string;
  meeting_url: string;
  max_participants: string;
};

const EMPTY_FORM: FormState = {
  evenement_id: "",
  titre: "",
  description: "",
  expert: "",
  jour: "",
  heure_debut: "10:00",
  heure_fin: "11:00",
  lieu_id: "",
  communaute_id: "1",
  mode_diffusion_id: "1",
  meeting_url: "",
  max_participants: "",
};

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export default function AdminMasterclassesPage() {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [lieux, setLieux] = useState<BackendLieu[]>([]);
  const [events, setEvents] = useState<ProgrammeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [addLieuOpen, setAddLieuOpen] = useState(false);
  const [editing, setEditing] = useState<Masterclass | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [lieuForm, setLieuForm] = useState({ libelle: "", capacite: "" });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [l, e] = await Promise.all([
          getLieux(),
          getProgramme(),
        ]);
        setLieux(l);
        setEvents(e);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const availableEvents = useMemo(() => {
    const linked = new Set(
      masterclasses
        .map((m) => m.evenement_id)
        .filter((id): id is number => typeof id === "number"),
    );
    return events.filter((ev) => !linked.has(Number(ev.id)));
  }, [events, masterclasses]);

  function load(pageNum: number = page) {
    setLoading(true);
    getMasterclassesAdmin({ page: pageNum, size: PAGE_SIZE })
      .then((pg) => {
        setMasterclasses(pg.items);
        setPage(pg.page);
        setPages(pg.pages);
        setTotal(pg.total);
      })
      .catch(() => setMasterclasses([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setOpen(true);
  }

  function startEdit(m: Masterclass) {
    setEditing(m);
    setForm({
      evenement_id: m.evenement_id != null ? m.evenement_id : "",
      titre: m.title,
      description: m.description ?? "",
      expert: m.expert ?? "",
      jour: m.date.slice(0, 10) ?? "",
      heure_debut: m.date.slice(11) || "10:00",
      heure_fin: "",
      lieu_id: "",
      communaute_id: "1",
      mode_diffusion_id: m.mode?.toLowerCase().includes("distan") ? "2" : "1",
      meeting_url: m.meetingUrl ?? "",
      max_participants: m.capacity ? String(m.capacity) : "",
    });
    setError("");
    setOpen(true);
  }

  async function updateStatus(id: string, statut_id: number) {
    try {
      await updateMasterclass(id, { statut_id });
      await load();
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      alert(typeof m === "string" ? m : "Erreur lors du changement de statut");
    }
  }

  async function save() {
    setError("");
    if (!form.titre.trim()) {
      setError("Le titre est obligatoire (ou liez une masterclass à un événement).");
      return;
    }
    const mode = Number(form.mode_diffusion_id);
    const payload = {
      evenement_id: form.evenement_id !== "" ? Number(form.evenement_id) : undefined,
      titre: form.titre.trim(),
      description: form.description.trim() || undefined,
      expert: form.expert.trim() || undefined,
      jour: form.jour || undefined,
      heure_debut: form.heure_debut || undefined,
      heure_fin: form.heure_fin || undefined,
      lieu_id: form.lieu_id ? Number(form.lieu_id) : undefined,
      communaute_id: form.communaute_id ? Number(form.communaute_id) : undefined,
      mode_diffusion_id: mode,
      meeting_url: mode === 2 ? form.meeting_url.trim() || undefined : undefined,
      max_participants: form.max_participants ? Number(form.max_participants) : undefined,
    };
    try {
      if (editing) {
        await updateMasterclass(editing.id, payload);
      } else {
        await createMasterclass(payload);
      }
      setOpen(false);
      await load();
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof m === "string" ? m : "Erreur");
    }
  }

  async function remove(m: Masterclass) {
    if (!confirm(`Supprimer la masterclass « ${m.title} » ?`)) return;
    try {
      await deleteMasterclass(m.id);
      if (masterclasses.length === 1 && page > 1) {
        load(page - 1);
      } else {
        load();
      }
    } catch {}
  }

  function handleEventChange(raw: string) {
    const id = raw ? Number(raw) : "";
    const ev =
      id !== "" ? availableEvents.find((e) => Number(e.id) === Number(id)) : undefined;
    setForm((prev) => ({
      ...prev,
      evenement_id: id,
      titre: ev?.title ?? EMPTY_FORM.titre,
      description: ev?.description ?? EMPTY_FORM.description,
      jour: ev?.day ? ev.day.slice(0, 10) : EMPTY_FORM.jour,
      heure_debut: ev?.startTime ?? EMPTY_FORM.heure_debut,
      heure_fin: ev?.endTime ?? EMPTY_FORM.heure_fin,
      lieu_id: ev?.lieu_id != null ? String(ev.lieu_id) : EMPTY_FORM.lieu_id,
      communaute_id:
        ev?.communaute_id != null ? String(ev.communaute_id) : prev.communaute_id,
      expert: ev?.expert ?? EMPTY_FORM.expert,
    }));
  }

  async function saveLieu() {
    if (!lieuForm.libelle.trim()) return;
    try {
      await createLieu({
        libelle: lieuForm.libelle.trim(),
        capacite: lieuForm.capacite ? Number(lieuForm.capacite) : undefined,
      });
      setAddLieuOpen(false);
      setLieuForm({ libelle: "", capacite: "" });
      setLieux(await getLieux());
    } catch {}
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Admin", href: "/admin/tableau-de-bord" }, { label: "Masterclasses" }]} />
        <PageHeader
          title="Masterclasses"
          actions={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nouvelle masterclass
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <IconButton variant="outline" label="Filtrer">
          <SlidersHorizontal className="h-4 w-4" />
        </IconButton>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : masterclasses.length === 0 ? (
        <EmptyState icon={<Calendar className="h-6 w-6" />} title="Aucune masterclass" />
      ) : (
        <>
          <Card className="overflow-hidden hidden xl:block">
            <div
              className={`grid gap-x-6 px-5 py-4 border-b border-border text-eyebrow uppercase tracking-[0.14em] text-text-muted font-semibold ${GRID_COLS}`}
            >
              <div>Session</div>
              <div>Expert</div>
              <div>Communauté</div>
              <div>Date</div>
              <div>Participants</div>
              <div>Statut</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-border">
              {masterclasses.map((m) => (
                <MasterclassAdminRow
                  key={m.id}
                  masterclass={m}
                  onEdit={startEdit}
                  onDelete={remove}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          </Card>

          <div className="space-y-4 xl:hidden">
            {masterclasses.map((m) => (
              <MasterclassAdminCard
                key={m.id}
                masterclass={m}
                onEdit={startEdit}
                onDelete={remove}
                onStatusChange={updateStatus}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-small text-text-muted">
              {total} masterclass{total > 1 ? "es" : ""}
            </span>
            {pages > 1 && (
              <div className="flex items-center gap-1">
                {pageList(page, pages).map((n, i) =>
                  n === "…" ? (
                    <span key={`e${i}`} className="px-1 text-text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => n !== page && load(n)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-small font-semibold transition ${
                        n === page
                          ? "bg-gold text-black"
                          : "text-text-muted hover:bg-surface-hover hover:text-text"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier la masterclass" : "Nouvelle masterclass"}
        size="lg"
      >
        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
              {error}
            </div>
          )}
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Événement lié (optionnel)</span>
            <Select
              value={form.evenement_id === "" ? "" : String(form.evenement_id)}
              onChange={(e) => handleEventChange(e.target.value)}
              options={[
                { value: "", label: "— Créer une masterclass autonome —" },
                ...availableEvents.map((ev) => ({
                  value: String(ev.id),
                  label: `${ev.title} · ${ev.dayLabel} · ${ev.startTime}–${ev.endTime}`,
                })),
              ]}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Titre</span>
            <Input
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              placeholder="Titre de la masterclass"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Expert</span>
              <Input value={form.expert} onChange={(e) => setForm({ ...form, expert: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Communauté</span>
              <Select
                value={form.communaute_id}
                onChange={(e) => setForm({ ...form, communaute_id: e.target.value })}
                options={[
                  { value: "1", label: "Art" },
                  { value: "2", label: "Musique" },
                  { value: "3", label: "Cinéma" },
                  { value: "4", label: "Mode" },
                ]}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Date</span>
              <Input type="date" value={form.jour} onChange={(e) => setForm({ ...form, jour: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Modalité</span>
              <Select
                value={form.mode_diffusion_id}
                onChange={(e) => setForm({ ...form, mode_diffusion_id: e.target.value })}
                options={[
                  { value: "1", label: "Présentiel" },
                  { value: "2", label: "Distanciel" },
                ]}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Début</span>
              <Input type="time" value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Fin</span>
              <Input type="time" value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })} />
            </label>
          </div>

          {form.mode_diffusion_id === "1" ? (
            <div className="space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                Lieu
              </span>
              <div className="flex gap-2">
                <Select
                  value={form.lieu_id}
                  onChange={(e) => setForm({ ...form, lieu_id: e.target.value })}
                  placeholder="Sélectionner un lieu"
                  options={lieux.map((l) => ({ value: String(l.id), label: l.libelle ?? `Lieu #${l.id}` }))}
                />
                <Button variant="outline" onClick={() => setAddLieuOpen(true)} className="shrink-0">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Lien de la réunion</span>
              <Input
                value={form.meeting_url}
                onChange={(e) => setForm({ ...form, meeting_url: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </label>
          )}

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Max participants</span>
              <Input
                type="number"
                value={form.max_participants}
                onChange={(e) => setForm({ ...form, max_participants: e.target.value })}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Description</span>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={addLieuOpen}
        onClose={() => setAddLieuOpen(false)}
        title="Ajouter un lieu"
        size="sm"
      >
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Libellé</span>
            <Input
              value={lieuForm.libelle}
              onChange={(e) => setLieuForm({ ...lieuForm, libelle: e.target.value })}
              placeholder="Ex : Grande scène"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Capacité</span>
            <Input
              type="number"
              value={lieuForm.capacite}
              onChange={(e) => setLieuForm({ ...lieuForm, capacite: e.target.value })}
              placeholder="Optionnel"
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setAddLieuOpen(false)}>Annuler</Button>
            <Button onClick={saveLieu}>Créer le lieu</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}