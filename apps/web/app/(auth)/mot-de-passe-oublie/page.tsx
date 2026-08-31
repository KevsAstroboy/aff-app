"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const forgot = useAuthStore((s) => s.forgotPassword);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgot(email);
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof msg === "string" ? msg : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard
        title="Email envoyé"
        subtitle="Vérifiez votre boîte de réception."
      >
        <div className="space-y-4 text-center">
          <div className="rounded-full bg-success/15 text-success h-16 w-16 inline-flex items-center justify-center mx-auto">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-body text-text-muted">Un code de réinitialisation a été envoyé à <strong className="text-text">{email}</strong>.</p>
          <Button block size="lg" onClick={() => router.push(`/reinitialiser?email=${email}`)}>
            Réinitialiser le mot de passe
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Recevez un code de réinitialisation par email."
      footer={
        <Link href="/login" className="text-gold hover:text-gold-hover font-medium">
          Retour à la connexion
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
            {error}
          </div>
        )}
        <AuthFormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" block size="lg" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer le code"}
        </Button>
      </form>
    </AuthCard>
  );
}
