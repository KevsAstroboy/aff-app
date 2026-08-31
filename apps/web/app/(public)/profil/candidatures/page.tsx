"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import type { StatusKind } from "@/lib/status-config";
import { EmptyState } from "@/components/domain/EmptyState";
import {
  Trophy,
  Paperclip,
  ImageIcon,
  FileText,
  Film,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import {
  getMyCandidaturesReal,
  mediaPreviewUrl,
  mediaTypeLabel,
  type MyCandidature,
  type CandidateMedia,
} from "@/services/awards";
import { deleteCandidature } from "@/services/awards-api";

function statusKind(code: string): StatusKind {
  switch (code) {
    case "FINALISTE":
      return "announce";
    case "REJETEE":
      return "rejected";
    case "EN_REVISION":
      return "waiting";
    default:
      return "pending";
  }
}

function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function mediaIcon(m: CandidateMedia) {
  if (m.media_type_id === 1) return <ImageIcon className="h-4 w-4" />;
  if (m.media_type_id === 2) return <Film className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

export default function CandidaturesPage() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const [candidatures, setCandidatures] = useState<MyCandidature[]>([]);
  const [loading, setLoading] = useState(true);

  const [lightboxMedia, setLightboxMedia] = useState<CandidateMedia[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const shown = useMemo(
    () => lightboxMedia[lightboxIndex],
    [lightboxMedia, lightboxIndex],
  );
  const shownUrl = useMemo(() => mediaPreviewUrl(shown?.file_path), [shown]);

  useEffect(() => {
    if (!isAuth) {
      setLoading(false);
      return;
    }
    let mounted = true;
    getMyCandidaturesReal()
      .then((c) => mounted && setCandidatures(c))
      .catch(() => mounted && setCandidatures([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [isAuth]);

  useEffect(() => {
    if (lightboxMedia.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxMedia([]);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % lightboxMedia.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + lightboxMedia.length) % lightboxMedia.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxMedia]);

  const openMedia = (medias: CandidateMedia[], idx: number) => {
    setLightboxMedia(medias);
    setLightboxIndex(idx);
  };

  const handleDelete = async (c: MyCandidature) => {
    if (
      !confirm(
        `Supprimer votre candidature « ${c.categorie_libelle} » ? Cette action est définitive.`,
      )
    )
      return;
    try {
      await deleteCandidature(c.id);
      setCandidatures((list) => list.filter((x) => x.id !== c.id));
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      alert(typeof m === "string" ? m : "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Profil", href: "/profil" },
          { label: "Candidatures Awards" },
        ]}
      />
      <PageHeader
        eyebrow="Awards"
        title="Mes candidatures"
        subtitle="Suivez l'état de vos soumissions et consultez vos visuels."
      />

      {!isAuth ? (
        <EmptyState
          icon={<Trophy className="h-6 w-6" />}
          title="Connectez-vous"
          description="Connectez-vous pour consulter vos candidatures aux Awards."
        />
      ) : loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : candidatures.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-6 w-6" />}
          title="Aucune candidature"
          description="Soumettez votre candidature depuis la page Awards."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {candidatures.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              {/* Média hero : première photo, sinon bandeau logo */}
              <div className="relative h-44 bg-surface-hover">
                {c.medias.some((m) => m.media_type_id === 1) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPreviewUrl(
                      c.medias.find((m) => m.media_type_id === 1)?.file_path,
                    ) ?? ""}
                    alt={c.categorie_libelle}
                    className="h-full w-full object-cover"
                    onClick={() =>
                      openMedia(c.medias, c.medias.findIndex((m) => m.media_type_id === 1))
                    }
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gold/10">
                    <Trophy className="h-12 w-12 text-gold/40" />
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <StatusPill kind={statusKind(c.statut_code)} size="sm" />
                </div>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <Tag color="gold">{c.categorie_libelle}</Tag>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-live-red/10 hover:text-live-red"
                    aria-label="Supprimer la candidature"
                    title="Supprimer la candidature"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {c.description && (
                  <p className="text-small text-text-muted line-clamp-2">{c.description}</p>
                )}
                <p className="text-small text-text-muted">
                  Soumise le {fmtDate(c.submitted_at)}
                </p>

                {c.medias.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
                      Votre dossier
                    </span>
                    <span className="text-[11px] text-text-muted tabular-nums">
                      {c.medias.length} média{c.medias.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {c.medias.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {c.medias.slice(0, 6).map((m, idx) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => openMedia(c.medias, idx)}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-raised transition-colors hover:border-gold/50"
                      >
                        {m.media_type_id === 1 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaPreviewUrl(m.file_path) ?? ""}
                            alt={`Média ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="flex h-full w-full flex-col items-center justify-center gap-1 bg-surface-raised text-gold">
                            {mediaIcon(m)}
                            <span className="text-[9px] uppercase tracking-wider text-text-muted">
                              {m.media_type_id === 3 ? "PDF" : "Vidéo"}
                            </span>
                          </span>
                        )}
                        {idx === 5 && c.medias.length > 6 && (
                          <span className="absolute inset-0 flex items-center justify-center bg-bg/70 text-small font-bold text-text backdrop-blur-[1px]">
                            +{c.medias.length - 6}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxMedia.length > 0 && shown && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2 text-text-muted">
              <Paperclip className="h-4 w-4" />
              <span className="text-small">
                {mediaTypeLabel(shown.media_type_id)} · {lightboxIndex + 1}/{lightboxMedia.length}
              </span>
              {shown.file_path && (
                <span className="hidden text-[11px] text-text-muted sm:inline">
                  · {shown.file_path.split("/").pop()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {shownUrl && (
                <a
                  href={shownUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover hover:text-text"
                  aria-label="Ouvrir dans un nouvel onglet"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => setLightboxMedia([])}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover hover:text-text"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-6">
            {lightboxMedia.length > 1 && (
              <button
                onClick={() => setLightboxIndex((i) => (i - 1 + lightboxMedia.length) % lightboxMedia.length)}
                className="mr-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-text hover:border-gold/50"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-xl">
              {shown.media_type_id === 1 && shownUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shownUrl}
                  alt="Média soumis"
                  className="mx-auto max-h-[80vh] w-auto object-contain"
                />
              ) : shown.media_type_id === 2 && shownUrl ? (
                <video src={shownUrl} controls className="mx-auto max-h-[80vh] w-auto" />
              ) : shownUrl ? (
                <iframe
                  src={shownUrl}
                  title="Portfolio PDF"
                  className="h-[70vh] w-full rounded-lg border border-border bg-white"
                />
              ) : (
                <p className="text-body text-text-muted">Média indisponible</p>
              )}
            </div>
            {lightboxMedia.length > 1 && (
              <button
                onClick={() => setLightboxIndex((i) => (i + 1) % lightboxMedia.length)}
                className="ml-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-text hover:border-gold/50"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}