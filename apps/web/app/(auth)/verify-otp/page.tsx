"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { OTPInput } from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/Button";

function VerifyOtpInner() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const identifier = params.get("identifier") ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const verify = useAuthStore((s) => s.verifyOtp);
  const resend = useAuthStore((s) => s.resendOtp);
  const router = useRouter();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const submit = async () => {
    if (code.length < 6) return;
    setError("");
    setLoading(true);
    try {
      await verify(identifier, email, code);
      router.push("/accueil");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Code invalide";
      setError(typeof msg === "string" ? msg : "Code invalide");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    try {
      await resend(email);
    } catch {
      setError("Erreur lors du renvoi du code.");
    }
  };

  return (
    <AuthCard
      title="Vérification"
      subtitle={`Entrez le code à 6 chiffres envoyé à ${email}`}
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
            {error}
          </div>
        )}
        <OTPInput value={code} onChange={setCode} disabled={loading} />
        <Button block size="lg" onClick={submit} disabled={loading || code.length < 6}>
          {loading ? "Vérification..." : "Vérifier"}
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-small text-gold hover:text-gold-hover disabled:text-text-muted disabled:cursor-not-allowed"
          >
            {resendCooldown > 0
              ? `Renvoyer le code (${resendCooldown}s)`
              : "Renvoyer le code"}
          </button>
        </div>
      </div>
    </AuthCard>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpInner />
    </Suspense>
  );
}