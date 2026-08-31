"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { OTPInput } from "@/components/auth/OTPInput";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/Button";

function ResetInner() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const reset = useAuthStore((s) => s.resetPassword);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setError("");
    setLoading(true);
    try {
      await reset(email, otp, password);
      setDone(true);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Erreur";
      setError(typeof msg === "string" ? msg : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthCard title="Mot de passe réinitialisé" subtitle="Connectez-vous avec votre nouveau mot de passe.">
        <div className="text-center">
          <Button block size="lg" onClick={() => router.push("/login")}>
            Se connecter
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Réinitialiser" subtitle={`Code envoyé à ${email}`}>
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <span className="block text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Code de vérification
          </span>
          <OTPInput value={otp} onChange={setOtp} disabled={loading} />
        </div>
        <AuthFormField
          label="Nouveau mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <Button type="submit" block size="lg" disabled={loading || otp.length < 6 || password.length < 8}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Link href="/login" className="block text-center text-small text-gold hover:text-gold-hover">
          Retour à la connexion
        </Link>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}