"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import {
  Trophy,
  CheckCircle2,
  ImagePlus,
  FileText,
  Trash2,
  Sparkles,
  UploadCloud,
  Camera,
  Globe,
} from "lucide-react";
import {
  createCandidature,
  getCurrentEditionId,
  uploadCandidatureMedia,
} from "@/services/awards-api";
import {
  getCategoryById,
  getMyCandidaturesReal,
  type MyCandidature,
} from "@/services/awards";
import { FESTIVAL_YEAR } from "@/constants/festival";

const ACCEPT = {
  photo: "image/*",
  pdf: "application/pdf",
};

export default function CandidaterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [editionId, setEditionId] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [photo, setPhoto] = useState<File | null>(null);
  const [portfolio, setPortfolio] = useState<File | null>(null);
  const [mediaError, setMediaError] = useState("");

  const photoPreview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  useEffect(() => {
    (async () => {
      if (!Number.isInteger(id)) return;
      const [cat, edition, mine] = await Promise.all([
        getCategoryById(id).catch(() => undefined),
        getCurrentEditionId(),
        getMyCandidaturesReal().catch(() => [] as MyCandidature[]),
      ]);
      setCategoryName(cat?.name ?? null);
      setEditionId(edition);
      setAlreadyApplied(mine.some((m) => Number(m.categorie_id) === id));
    })();
  }, [id]);

  function setPhotoFile(f: File | null) {
    if (f && !f.type.startsWith("image/")) {
      setMediaError("La photo doit être une image (PNG, JPG…).");
      return;
    }
    setMediaError("");
    setPhoto(f);
  }

  function setPortfolioFile(f: File | null) {
    if (f && f.type !== "application/pdf") {
      setMediaError("Le portfolio doit être au format PDF.");
      return;
    }
    setMediaError("");
    setPortfolio(f);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo && !portfolio && !description.trim()) {
      setMediaError(
        "Ajoutez au moins une photo, un portfolio PDF ou une description.",
      );
      return;
    }
    if (editionId === undefined) {
      setMsg("Impossible de déterminer l'édition courante.");
      return;
    }
    setSubmitting(true);
    setMsg("");
    try {
      const created = (await createCandidature({
        categorie_id: id,
        edition_id: editionId,
        description: description.trim() || undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
      })) as { id?: number };
      const createdId = Number(created?.id);
      if (!createdId) {
        setMsg("La candidature n'a pas pu être enregistrée.");
        return;
      }
      if (photo) await uploadCandidatureMedia(createdId, photo, 1).catch(() => {});
      if (portfolio) await uploadCandidatureMedia(createdId, portfolio, 3).catch(() => {});
      setDone(true);
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setMsg(typeof m === "string" ? m : "Erreur lors de la candidature.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-8 max-w-xl mx-auto text-center py-16">
        <div className="relative mx-auto inline-flex">
          <div className="absolute inset-0 rounded-full bg-success/20 blur-xl" />
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-inset ring-success/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-h2 font-bold text-text">
          Félicitations, candidature {photo && portfolio ? "complète" : "envoyée"} !
        </h2>
        <p className="text-body text-text-muted">
          Votre dossier
          {photo ? " photo" : ""}
          {portfolio ? " + portfolio" : ""} est en cours d’examen par le jury.
          Vous serez notifié·e de son avancement.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => router.push("/profil/candidatures")}>
            Suivre mes candidatures
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/awards")}>
            Retour aux Awards
          </Button>
        </div>
      </div>
    );
  }

  const dropZone =
    "group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/25 bg-surface-raised/50 px-4 py-8 text-center transition-colors hover:border-gold/60 hover:bg-gold-soft/10 cursor-pointer";

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb items={[{ label: "Awards", href: "/awards" }, { label: "Candidater" }]} />

      {/* Hero */}
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold text-bg shadow-lg shadow-gold/30">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag color="gold" icon={<Sparkles className="h-3 w-3" />}>
                  {categoryName ?? "Catégorie"}
                </Tag>
                <Tag color="muted">Édition {FESTIVAL_YEAR}</Tag>
              </div>
              <h2 className="mt-2 text-h2 font-bold text-text">
                {categoryName ?? "Déposez votre candidature"}
              </h2>
              <p className="mt-1 text-body text-text-muted">
                Partagez votre photo, votre portfolio et votre vision créative pour
                convaincre le jury.
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 rounded-xl border border-gold/20 bg-gold-soft/40 px-4 py-3 text-center sm:block">
            <div className="text-eyebrow uppercase tracking-[0.18em] text-gold">
              Date limite
            </div>
            <div className="mt-0.5 text-h3 font-bold text-text">
              30 Juil. {FESTIVAL_YEAR}
            </div>
          </div>
        </div>
      </Card>

      {alreadyApplied && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold-soft px-4 py-3">
          <span className="text-small text-gold">
            Vous avez déjà soumis une candidature pour cette catégorie.
          </span>
          <Link href="/profil/candidatures" className="shrink-0 text-small font-semibold text-gold underline">
            Suivre mes candidatures
          </Link>
        </div>
      )}

      {msg && (
        <div className="rounded-xl border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
          {msg}
        </div>
      )}
      {mediaError && !msg && (
        <div className="rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-small text-warn">
          {mediaError}
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Médias */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-6">
            <div>
              <h3 className="text-h3 font-semibold text-text">Votre dossier visuel</h3>
              <p className="text-small text-text-muted">
                Format recommandé : photo en portrait, portfolio en PDF.
              </p>
            </div>

            {/* Photo */}
            <label className="block space-y-2">
              <span className="flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.18em] text-text-muted">
                <Camera className="h-3.5 w-3.5 text-gold" />
                Photo / Portrait
              </span>
              {photo ? (
                <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-xl border border-gold/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview ?? ""}
                    alt="Aperçu photo"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoFile(null)}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg/80 text-live-red backdrop-blur hover:bg-live-red hover:text-white"
                    aria-label="Retirer la photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-bg/70 px-2 py-1 text-center text-[10px] uppercase tracking-wider text-text">
                    {photo.name}
                  </div>
                </div>
              ) : (
                <label className={dropZone}>
                  <input
                    type="file"
                    accept={ACCEPT.photo}
                    className="sr-only"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  />
                  <ImagePlus className="h-8 w-8 text-gold" />
                  <span className="text-small font-medium text-text">
                    Glissez une photo ou cliquez
                  </span>
                  <span className="text-[11px] text-text-muted">PNG · JPG · WebP</span>
                </label>
              )}
            </label>

            {/* Portfolio PDF */}
            <label className="block space-y-2">
              <span className="flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.18em] text-text-muted">
                <FileText className="h-3.5 w-3.5 text-gold" />
                Portfolio
              </span>
              {portfolio ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/30 bg-surface-raised/60 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-live-red/10 text-live-red">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-small font-medium text-text">
                        {portfolio.name}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {(portfolio.size / 1024 / 1024).toFixed(2)} Mo · PDF
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPortfolioFile(null)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-live-red/10 hover:text-live-red"
                    aria-label="Retirer le portfolio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className={dropZone}>
                  <input
                    type="file"
                    accept={ACCEPT.pdf}
                    className="sr-only"
                    onChange={(e) => setPortfolioFile(e.target.files?.[0] ?? null)}
                  />
                  <UploadCloud className="h-8 w-8 text-gold" />
                  <span className="text-small font-medium text-text">
                    Glissez votre portfolio ou cliquez
                  </span>
                  <span className="text-[11px] text-text-muted">
                    PDF · max 10 Mo
                  </span>
                </label>
              )}
            </label>
          </Card>
        </div>

        {/* Principal */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="space-y-6">
            <div>
              <h3 className="text-h3 font-semibold text-text">Présentez votre projet</h3>
              <p className="text-small text-text-muted">
                Décrivez votre vision, votre impact et ce qui vous distingue.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
                Description du projet
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text placeholder:text-text-subtle focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft resize-none"
                placeholder="Expliquez votre projet, ses ambitions, et l'impact créatif de votre démarche…"
              />
              <span className="text-[11px] text-text-muted tabular-nums">
                {description.length}/2000
              </span>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.18em] text-text-muted">
                <Globe className="h-3.5 w-3.5 text-gold" />
                Lien vers votre portfolio (optionnel)
              </span>
              <Input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://votre-portfolio.com"
              />
            </label>
          </Card>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={submitting}
              disabled={alreadyApplied}
            >
              {!submitting && <Trophy className="h-4 w-4" />}
              {submitting ? "Envoi du dossier…" : "Soumettre ma candidature"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
