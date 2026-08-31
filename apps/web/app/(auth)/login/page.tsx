"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier, password);
      router.push("/accueil");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Erreur de connexion";
      setError(typeof msg === "string" ? msg : "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Connexion"
      subtitle="Connectez-vous à votre espace Africa Future Festival."
      footer={
        <span className="flex items-center justify-center gap-2">
          Pas de compte ?
          <Link href="/register" className="text-gold hover:text-gold-hover font-medium">
            S&apos;inscrire
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
        <AuthFormField
          label="Nom d'utilisateur ou email"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <AuthFormField
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="text-right">
          <Link
            href="/mot-de-passe-oublie"
            className="text-small text-gold hover:text-gold-hover"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" block size="lg" loading={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </AuthCard>
  );
}
