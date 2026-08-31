"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { apiClient } from "@/lib/api-client";

type Profil = {
  id: number;
  libelle: string;
  code: string;
  description?: string;
  niveau?: number;
};

type Feature = {
  id: number;
  code: string;
  libelle: string;
};

type ProfilFeature = {
  profil_id: number;
  feature_id: number;
  profile?: Profil;
  feature?: Feature;
};

export default function AdminProfilsPage() {
  const [profils, setProfils] = useState<Profil[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [assignments, setAssignments] = useState<ProfilFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Profil | null>(null);
  const [form, setForm] = useState({ libelle: "", code: "", description: "", niveau: 1 });
  const [error, setError] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedProfil, setSelectedProfil] = useState<Profil | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [pRes, fRes] = await Promise.all([
        apiClient.get<Profil[] | { items: Profil[] }>("/feature-profil/profils").catch(() => []),
        apiClient.get<Feature[] | { items: Feature[] }>("/feature-profil/features").catch(() => []),
      ]);
      setProfils(Array.isArray(pRes) ? pRes : pRes.items ?? []);
      setFeatures(Array.isArray(fRes) ? fRes : fRes.items ?? []);
      try {
        const aRes = await apiClient.get<ProfilFeature[] | { items: ProfilFeature[] }>("/feature-profil/assignments");
        setAssignments(Array.isArray(aRes) ? aRes : aRes.items ?? []);
      } catch {
        setAssignments([]);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditing(null);
    setForm({ libelle: "", code: "", description: "", niveau: 1 });
    setError("");
    setOpen(true);
  }

  function startEdit(p: Profil) {
    setEditing(p);
    setForm({
      libelle: p.libelle,
      code: p.code,
      description: p.description ?? "",
      niveau: p.niveau ?? 1,
    });
    setError("");
    setOpen(true);
  }

  async function save() {
    setError("");
    try {
      if (editing) {
        await apiClient.patch(`/feature-profil/profils/${editing.id}`, form);
      } else {
        await apiClient.post("/feature-profil/profils", form);
      }
      setOpen(false);
      await load();
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof m === "string" ? m : "Erreur");
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce profil ?")) return;
    try {
      await apiClient.delete(`/feature-profil/profils/${id}`);
      await load();
    } catch {}
  }

  function featuresOfProfil(id: number): string[] {
    return assignments
      .filter((a) => a.profil_id === id)
      .map((a) => a.feature?.code ?? "")
      .filter(Boolean);
  }

  function manageFeatures(p: Profil) {
    setSelectedProfil(p);
    setAssignOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/tableau-de-bord" },
            { label: "Profils & Features" },
          ]}
        />
        <PageHeader
          title="Profils & Features"
          actions={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nouveau profil
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
      ) : profils.length === 0 ? (
        <Card className="p-8 text-center text-text-muted">
          Aucun profil configuré.
        </Card>
      ) : (
        <Card className="divide-y divide-border">
          {profils.map((p) => (
            <div key={p.id} className="flex items-center gap-4 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-body font-semibold text-text">{p.libelle}</h3>
                  <Tag color="muted">{p.code}</Tag>
                  {p.niveau !== undefined && <Tag color="warn">NIVEAU {p.niveau}</Tag>}
                </div>
                {p.description && (
                  <div className="text-small text-text-muted">{p.description}</div>
                )}
                <div className="text-small text-text-muted mt-1">
                  {featuresOfProfil(p.id).length} feature(s) assignée(s)
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => manageFeatures(p)}>
                Features
              </Button>
              <IconButton variant="outline" size="sm" label="Modifier" onClick={() => startEdit(p)}>
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton variant="danger" size="sm" label="Supprimer" onClick={() => remove(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier le profil" : "Nouveau profil"}
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
            <Input value={form.libelle} onChange={(e) => setForm({ ...form, libelle: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Code</span>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Niveau</span>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.niveau}
                onChange={(e) => setForm({ ...form, niveau: parseInt(e.target.value) || 1 })}
              />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Description</span>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Features — ${selectedProfil?.libelle ?? ""}`}
        size="lg"
      >
        <div className="space-y-4">
          {features.length === 0 ? (
            <p className="text-text-muted">Aucune feature disponible.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {features.map((f) => {
                const assigned = assignments.some(
                  (a) => a.feature_id === f.id && a.profil_id === selectedProfil?.id
                );
                return (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-border">
                    <div>
                      <div className="text-body font-medium text-text">{f.libelle}</div>
                      <div className="text-small text-text-muted">{f.code}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={assigned ? "danger" : "success"}
                      onClick={async () => {
                        try {
                          if (assigned) {
                            await apiClient.delete(
                              `/feature-profil/${selectedProfil?.id}/${f.id}`
                            );
                          } else {
                            await apiClient.post("/feature-profil", {
                              profil_id: selectedProfil?.id,
                              feature_id: f.id,
                            });
                          }
                          await load();
                        } catch {}
                      }}
                    >
                      {assigned ? "Retirer" : "Assigner"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}