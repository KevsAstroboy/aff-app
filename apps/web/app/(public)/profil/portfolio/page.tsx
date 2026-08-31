"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ImagePlus,
  Eye,
  Calendar,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/domain/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPortfolio,
  addPortfolioItem,
  deletePortfolioItem,
  fileToBase64,
  portfolioMediaUrl,
  type PortfolioItem,
} from "@/services/portfolio";

const CATEGORIES = [
  { value: "", label: "Général" },
  { value: "art", label: "Art" },
  { value: "musique", label: "Musique" },
  { value: "cinema", label: "Cinéma" },
  { value: "mode", label: "Mode" },
  { value: "danse", label: "Danse" },
  { value: "litterature", label: "Littérature" },
  { value: "gastronomie", label: "Gastronomie" },
];

const CATEGORY_COLOR: Record<string, string> = {
  art: "bg-domain-art",
  musique: "bg-domain-musique",
  cinema: "bg-domain-cinema",
  mode: "bg-domain-mode",
  danse: "bg-domain-danse",
  litterature: "bg-domain-litterature",
  gastronomie: "bg-warn",
};

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("");
  const [annee, setAnnee] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getPortfolio()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const lightboxIndex = lightbox;
  const shown = lightboxIndex != null ? items[lightboxIndex] : null;

  const prev = useCallback(() => {
    setLightbox((i) => (i == null ? null : (i + items.length - 1) % items.length));
  }, [items.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i == null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (lightbox == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  const handlePick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setFormError("Format non supporté. Choisissez une image.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFormError("Image trop lourde (max 5 Mo).");
      return;
    }
    setFormError("");
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setTitre("");
    setCategorie("");
    setAnnee("");
    setDescription("");
    setFormError("");
  };

  const submit = async () => {
    if (!image) {
      setFormError("Ajoutez une image.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const base64 = await fileToBase64(image);
      await addPortfolioItem({
        image: base64,
        titre: titre.trim() || undefined,
        categorie: categorie || undefined,
        annee: annee ? Number(annee) : undefined,
        description: description.trim() || undefined,
      });
      setAddOpen(false);
      resetForm();
      load();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setFormError(typeof msg === "string" ? msg : "Erreur lors de l'ajout.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    if (!confirm(`Supprimer « ${item.titre || "cet élément"} » de votre portfolio ?`)) return;
    try {
      await deletePortfolioItem(item.id);
      setItems((list) => list.filter((x) => x.id !== item.id));
      if (lightboxIndex != null) setLightbox(null);
    } catch {
      // silent
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Profil", href: "/profil" },
          { label: "Portfolio" },
        ]}
      />
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="Mes travaux"
          title="Portfolio"
          subtitle="Vos œuvres et projets créatifs, présentés en galerie."
        />
        <Button size="lg" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter une œuvre
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-24 text-text-muted">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
          <span className="text-small">Chargement du portfolio…</span>
        </div>
      ) : error ? (
        <EmptyState
          icon={<ImagePlus className="h-6 w-6" />}
          title="Impossible de charger le portfolio"
          description="Une erreur est survenue. Réessayez dans un instant."
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ImagePlus className="h-6 w-6" />}
          title="Portfolio vide"
          description="Ajoutez vos premières œuvres pour les présenter à la communauté."
        />
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {items.map((item, idx) => {
            const url = portfolioMediaUrl(item.file_path);
            const color = CATEGORY_COLOR[item.categorie] ?? "bg-gold";
            return (
              <motion.button
                key={item.id}
                onClick={() => setLightbox(idx)}
                className="group relative mb-6 block w-full overflow-hidden rounded-2xl border border-border bg-surface break-inside-avoid text-left transition-colors hover:border-border-strong"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-[4/5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url ?? ""}
                    alt={item.titre || "Œuvre portfolio"}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />
                  <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-eyebrow font-semibold uppercase tracking-[0.14em] text-bg ${color}`}
                    >
                      {item.categorie || "Portfolio"}
                    </span>
                    <h3 className="mt-2 text-h3 font-semibold text-white leading-snug">
                      {item.titre || "Sans titre"}
                    </h3>
                    {item.annee && (
                      <div className="mt-1 inline-flex items-center gap-1 text-small text-white/70">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.annee}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      <Modal
        open={addOpen}
        onClose={() => {
          if (!submitting) {
            setAddOpen(false);
            resetForm();
          }
        }}
        title="Ajouter une œuvre"
        subtitle="Partagez une image de votre portfolio (max 5 Mo)."
        size="lg"
      >
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface-raised text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Aperçu"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <>
                <ImagePlus className="h-8 w-8" />
                <span className="text-small">Cliquez pour choisir une image</span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">
                Titre
              </label>
              <Input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex : Ancestral Futures"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">
                Catégorie
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-surface-raised border border-border text-text transition-all focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Contexte, démarche artistique, matériaux…"
                className="w-full px-4 py-3 rounded-lg bg-surface-raised border border-border text-text placeholder:text-text-subtle transition-all focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">
                Année
              </label>
              <Input
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                placeholder="Ex : 2025"
                inputMode="numeric"
              />
            </div>
          </div>

          {formError && (
            <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setAddOpen(false);
                resetForm();
              }}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button onClick={submit} loading={submitting}>
              {submitting ? "Publication…" : "Publier"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lightbox */}
      <AnimatePresence>
        {shown && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setLightbox(null)}
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
            {items.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Précédent"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Suivant"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className="max-h-full max-w-5xl flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portfolioMediaUrl(shown.file_path) ?? ""}
                alt={shown.titre || "Œuvre portfolio"}
                className="max-h-[75vh] w-auto rounded-lg object-contain shadow-2xl"
              />
              <div className="flex items-center justify-between gap-6 w-full max-w-xl">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-full bg-gold px-2.5 py-0.5 text-eyebrow font-semibold uppercase tracking-[0.14em] text-bg">
                    {shown.categorie || "Portfolio"}
                  </span>
                  <h3 className="mt-2 text-h2 font-semibold text-white">
                    {shown.titre || "Sans titre"}
                  </h3>
                  {shown.description && (
                    <p className="mt-1 text-body text-white/70">{shown.description}</p>
                  )}
                  {shown.annee && (
                    <div className="mt-1 inline-flex items-center gap-1 text-small text-white/60">
                      <Calendar className="h-3.5 w-3.5" />
                      {shown.annee}
                    </div>
                  )}
                </div>
                <IconButton
                  variant="ghost"
                  label="Supprimer"
                  onClick={() => handleDelete(shown)}
                >
                  <Trash2 className="h-5 w-5 text-white/70 hover:text-live-red" />
                </IconButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
