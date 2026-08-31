"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { commIdToKey, unwrap, type BackendCommunaute } from "@/lib/adapters";

type CommunauteOpt = { id: number; label: string };

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nom: "",
    prenom: "",
    phone_numb: "",
    communaute_id: 1,
  });
  const [communities, setCommunities] = useState<CommunauteOpt[]>([]);
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.get<BackendCommunaute[]>("/communaute");
        const items = unwrap(data).map((c) => ({
          id: c.id,
          label: c.libelle ?? `Communauté #${c.id}`,
        }));
        setCommunities(items);
        if (items.length > 0) {
          setForm((f) => ({ ...f, communaute_id: items[0].id }));
        }
      } catch {
        // silent — community list optional
      }
    })();
  }, []);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({
        ...f,
        [k]: k === "communaute_id" ? parseInt(e.target.value) : e.target.value,
      }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      setSent(form.email);
    } catch (err: unknown) {
      const msg = (err as { message?: string | string[] })?.message ?? "Erreur d'inscription";
      setError(Array.isArray(msg) ? msg[0] : String(msg));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Vérification" subtitle="Un code vous a été envoyé par email.">
        <div className="space-y-4 text-center">
          <p className="text-body text-text-muted">
            Un code OTP a été envoyé à <strong className="text-text">{sent}</strong>.
          </p>
          <Button
            block
            size="lg"
            onClick={() =>
              router.push(`/verify-otp?email=${sent}&identifier=${form.username}`)
            }
          >
            Vérifier mon code
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Inscription"
      subtitle="Rejoignez la communauté Africa Future Festival."
      footer={
        <span className="flex items-center justify-center gap-2">
          Déjà un compte ?
          <Link href="/login" className="text-gold hover:text-gold-hover font-medium">
            Se connecter
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
            {error}
          </div>
        )}
        <AuthFormField label="Nom d'utilisateur" value={form.username} onChange={set("username")} required />
        <AuthFormField label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
        <AuthFormField
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={set("password")}
          minLength={8}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthFormField label="Nom" value={form.nom} onChange={set("nom")} required />
          <AuthFormField label="Prénom" value={form.prenom} onChange={set("prenom")} required />
        </div>
        <AuthFormField
          label="Téléphone"
          type="tel"
          value={form.phone_numb}
          onChange={set("phone_numb")}
          placeholder="+2250102030405"
          required
        />

        <label className="block space-y-2">
          <span className="block text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Communauté principale
          </span>
          <select
            value={form.communaute_id}
            onChange={set("communaute_id")}
            required
            className="w-full h-12 px-4 rounded-lg bg-surface-raised border border-border text-text focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
          >
            {communities.length === 0 ? (
              <option value={1}>Communauté par défaut</option>
            ) : (
              communities.map((c) => (
                <option key={c.id} value={c.id} className="bg-surface">
                  {c.label}
                </option>
              ))
            )}
          </select>
          <span className="block text-small text-text-subtle">
            Vous pourrez en rejoindre d&apos;autres après votre inscription.
          </span>
        </label>

        <Button type="submit" block size="lg" loading={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>
    </AuthCard>
  );
}