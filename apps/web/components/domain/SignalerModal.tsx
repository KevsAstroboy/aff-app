"use client";

import { create } from "zustand";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Flag } from "lucide-react";
import { createReport } from "@/services/moderation";

type CibleType = "publication" | "commentaire" | "utilisateur";

type ReportStore = {
  open: boolean;
  cibleType: CibleType | null;
  cibleId: number | null;
  openReport: (type: CibleType, id: number) => void;
  closeReport: () => void;
};

export const useReportStore = create<ReportStore>((set) => ({
  open: false,
  cibleType: null,
  cibleId: null,
  openReport: (type, id) => set({ open: true, cibleType: type, cibleId: id }),
  closeReport: () => set({ open: false, cibleType: null, cibleId: null }),
}));

const SEVERITY_OPTIONS = [
  { value: "1", label: "Faible" },
  { value: "2", label: "Moyen" },
  { value: "3", label: "Élevé" },
];

const CIBLE_TYPE_ID: Record<CibleType, number> = {
  publication: 1,
  commentaire: 2,
  utilisateur: 3,
};

export function SignalerModalHost() {
  const { open, cibleType, cibleId, closeReport } = useReportStore();
  const [motif, setMotif] = useState("");
  const [severiteId, setSeveriteId] = useState("2");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!motif || !cibleType || cibleId == null) return;
    setLoading(true);
    setError("");
    try {
      await createReport({
        cible_type_id: CIBLE_TYPE_ID[cibleType],
        cible_id: cibleId,
        severite_id: parseInt(severiteId),
        motif,
      });
      setDone(true);
      setTimeout(closeReport, 1500);
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof m === "string" ? m : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setMotif("");
        setDone(false);
        closeReport();
      }}
      title="Signaler ce contenu"
      size="md"
    >
      {done ? (
        <div className="text-center py-6 space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <Flag className="h-5 w-5" />
          </div>
          <p className="text-body text-text">Signalement envoyé. Merci.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
              {error}
            </div>
          )}
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
              Sévérité
            </span>
            <select
              value={severiteId}
              onChange={(e) => setSeveriteId(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-surface-raised border border-border text-text focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
            >
              {SEVERITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-surface">
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
              Motif
            </span>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              rows={4}
              required
              placeholder="Décrivez le problème..."
              className="w-full px-4 py-3 rounded-lg bg-surface-raised border border-border text-text placeholder:text-text-subtle focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft resize-none"
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeReport}>
              Annuler
            </Button>
            <Button type="button" onClick={submit} disabled={loading || !motif}>
              {loading ? "Envoi..." : "Signaler"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}