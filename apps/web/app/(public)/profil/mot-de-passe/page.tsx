"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/auth";

export default function ChangePasswordPage() {
  const change = useAuthStore((s) => s.changePassword);
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await change(current, next, confirm);
      setMsg("Mot de passe modifié avec succès.");
      setTimeout(() => router.push("/profil"), 1500);
    } catch (err: unknown) {
      const m = (err as { message?: string })?.message ?? "Erreur";
      setMsg(typeof m === "string" ? m : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Profil", href: "/profil" }, { label: "Mot de passe" }]} />
      <PageHeader eyebrow="Sécurité" title="Changer mon mot de passe" />

      <Card className="space-y-5 max-w-lg">
        {msg && (
          <div className={`rounded-lg px-4 py-3 text-small ${msg.startsWith("Erreur") || !msg.includes("succès") ? "bg-live-red/10 text-live-red border border-live-red/40" : "bg-success/15 text-success border border-success/20"}`}>
            {msg}
          </div>
        )}
        <form onSubmit={submit} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Mot de passe actuel</span>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Nouveau mot de passe</span>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} minLength={8} required />
          </label>
          <label className="block space-y-2">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">Confirmer le mot de passe</span>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required />
          </label>
          <Button type="submit" size="lg" disabled={loading}>{loading ? "Enregistrement..." : "Modifier le mot de passe"}</Button>
        </form>
      </Card>
    </div>
  );
}
