"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw, UploadCloud } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/auth";
import { fileToObjectUrl } from "@/lib/file";
import { cn } from "@/lib/cn";

type NoticeKind = "success" | "error";
type Notice = { kind: NoticeKind; text: string } | null;

export default function EditProfilPage() {
  const user = useAuthStore((s) => s.user);
  const update = useAuthStore((s) => s.updateProfile);
  const upload = useAuthStore((s) => s.uploadPhoto);
  const router = useRouter();

  const [nom, setNom] = useState(user?.nom ?? "");
  const [prenom, setPrenom] = useState(user?.prenom ?? "");
  const [desc, setDesc] = useState(user?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const initials =
    (user.nom?.[0] ?? "") + (user.prenom?.[0] ?? "") ||
    user.username?.slice(0, 2).toUpperCase() ||
    "??";

  const showNotice = (kind: NoticeKind, text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handlePhoto = async (file: File | undefined | null) => {
    if (!file) return;
    setUploading(true);
    setNotice(null);
    setPreview(fileToObjectUrl(file));
    try {
      await upload(file);
      showNotice("success", "Photo de profil mise à jour.");
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message;
      showNotice("error", typeof m === "string" ? m : "Échec de l'upload de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await update({ nom, prenom, description: desc });
      showNotice("success", "Profil mis à jour.");
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message;
      showNotice("error", typeof m === "string" ? m : "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setNom(user.nom ?? "");
    setPrenom(user.prenom ?? "");
    setDesc(user.description ?? "");
    setPreview(null);
    setNotice(null);
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Profil", href: "/profil" }, { label: "Modifier mon profil" }]} />
      <PageHeader eyebrow="Mon espace" title="Modifier mon profil" />

      {notice && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3 text-small",
            notice.kind === "success"
              ? "border-success/20 bg-success/15 text-success"
              : "border-live-red/40 bg-live-red/10 text-live-red"
          )}
          role="status"
        >
          {notice.kind === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <span className="shrink-0" aria-hidden="true">
              !
            </span>
          )}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Photo card */}
        <Card className="space-y-4 self-start">
          <h2 className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Photo de profil
          </h2>

          <div className="flex flex-col items-center gap-4">
            <Avatar
              initials={initials}
              size="xl"
              src={preview ?? user.profile_picture_path}
              className="ring-4 ring-gold/30"
            />

            {uploading ? (
              <div className="flex items-center gap-2 text-small text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi de la photo...
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handlePhoto(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
                  dragging
                    ? "border-gold bg-gold-soft"
                    : "border-border bg-surface-raised hover:border-gold/60"
                )}
              >
                <UploadCloud className="h-6 w-6 text-text-muted" />
                <span className="text-small text-text">
                  Cliquez ou glissez-déposez
                </span>
                <span className="text-xs text-text-subtle">PNG, JPG — 5 Mo max</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handlePhoto(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
        </Card>

        {/* Identity form */}
        <Card className="space-y-6">
          <h2 className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Informations personnelles
          </h2>

          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Nom</span>
                <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" />
              </label>
              <label className="block space-y-2">
                <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Prénom</span>
                <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom" />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Description</span>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Décrivez-vous en quelques mots..."
                rows={4}
                maxLength={280}
                className="w-full resize-none rounded-lg border border-border bg-surface-raised px-4 py-3 text-text placeholder:text-text-subtle transition-all duration-150 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
              />
              <span className="block text-right text-xs text-text-subtle tabular-nums">
                {desc.length}/280
              </span>
            </label>

            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button type="button" variant="ghost" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
