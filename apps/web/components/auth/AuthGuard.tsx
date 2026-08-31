"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

type AuthGuardProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const isAuth = useAuthStore((s) => s.isAuth);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const features = useAuthStore((s) => s.features);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuth) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (adminOnly && !features.includes("ACCEDER_ADMIN")) {
      router.replace("/accueil");
    }
  }, [hasHydrated, isAuth, adminOnly, features, pathname, router]);

  if (!hasHydrated) return null;
  if (!isAuth) return null;
  if (adminOnly && !features.includes("ACCEDER_ADMIN")) return null;

  return <>{children}</>;
}