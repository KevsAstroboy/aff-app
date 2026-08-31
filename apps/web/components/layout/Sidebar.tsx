"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Radio,
  LayoutGrid,
  Calendar,
  Trophy,
  MessageSquare,
  User,
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageCircle,
  Flag,
  LogOut,
  Settings,
  Award,
  Shield,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_ADMIN, NAV_PUBLIC } from "@/constants/nav";
import { FESTIVAL_YEAR } from "@/constants/festival";
import { useAuthStore } from "@/stores/auth";
import { Avatar } from "@/components/ui/Avatar";

const ICONS = {
  Home,
  Radio,
  LayoutGrid,
  Calendar,
  Trophy,
  MessageSquare,
  User,
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageCircle,
  Flag,
  MapPin,
} as const;

export type SidebarProps = {
  variant?: "public" | "admin";
  onNavigate?: () => void;
};

export function Sidebar({ variant = "public", onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const features = useAuthStore((s) => s.features);
  const logout = useAuthStore((s) => s.logout);

  const items = variant === "admin" ? NAV_ADMIN : NAV_PUBLIC;

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-border bg-bg",
        variant === "admin" && "bg-surface"
      )}
    >
      <div className="p-6">
        <Link
          href={variant === "admin" ? "/admin/tableau-de-bord" : "/"}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-gold">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" opacity="0.4" />
              <circle cx="12" cy="12" r="10" opacity="0.2" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-eyebrow text-gold tracking-[0.2em]">AFF</div>
            <div className="text-small text-text-muted">{variant === "admin" ? "ADMINISTRATION" : String(FESTIVAL_YEAR)}</div>
          </div>
        </Link>

        {variant === "admin" && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-live-red/10 px-3 py-1.5 text-small text-live-red">
            <span className="h-1.5 w-1.5 rounded-full bg-live-red animate-pulse-soft" />
            Accès administrateur
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 scrollbar-none">
        {variant === "admin" && (
          <div className="px-3 pb-2 text-eyebrow text-text-subtle">NAVIGATION</div>
        )}
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = ICONS[it.icon as keyof typeof ICONS];
            const active = pathname === it.href;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 h-10 text-body transition-colors",
                    active
                      ? "bg-gold-soft text-gold font-medium"
                      : "text-text-muted hover:bg-surface-hover hover:text-text"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span className="flex-1">{it.label}</span>
                  {it.badge && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-live-red px-1.5 text-eyebrow font-semibold text-bg tabular-nums">
                      {it.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {variant === "public" && features.includes("ACCEDER_ADMIN") && (
          <div className="mt-6 border-t border-border pt-4 px-3">
            <Link
              href="/admin/tableau-de-bord"
              className="flex items-center gap-3 rounded-md px-3 h-10 text-body text-text-muted hover:text-text"
            >
              <LogOut className="h-4 w-4" />
              Administration
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 space-y-3">
        {variant === "public" ? (
          <>
            {user && (
              <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-surface-raised">
                <Avatar
                  initials={
                    (user.nom?.[0] ?? "") + (user.prenom?.[0] ?? "") ||
                    user.username?.slice(0, 2).toUpperCase() ||
                    "??"
                  }
                  size="md"
                  src={user.profile_picture_path}
                />
                <div className="leading-tight min-w-0">
                  <div className="text-body text-text truncate">
                    {user.nom} {user.prenom}
                  </div>
                  <div className="text-small text-text-muted truncate">
                    @{user.username}
                  </div>
                </div>
              </div>
            )}
            {features.includes("ACCEDER_ADMIN") && (
              <Link
                href="/admin/tableau-de-bord"
                onClick={onNavigate}
                className="flex w-full items-center justify-center gap-2 h-10 rounded-md border border-gold/40 text-gold hover:bg-gold-soft text-small font-medium"
              >
                <Award className="h-4 w-4" />
                Administration
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                router.push("/login");
                onNavigate?.();
              }}
              className="flex w-full items-center justify-center gap-2 h-10 rounded-md border border-border text-text-muted hover:text-text text-small"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              href="/accueil"
              onClick={onNavigate}
              className="flex items-center gap-2 text-small text-text-muted hover:text-text"
            >
              <LogOut className="h-4 w-4" />
              Retour à l&apos;application
            </Link>
            <Link
              href="/profil/editer"
              onClick={onNavigate}
              className="flex items-center gap-2 text-small text-text-muted hover:text-text"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
            {user && (
              <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-surface-raised">
                <Avatar
                  initials={
                    (user.nom?.[0] ?? "") + (user.prenom?.[0] ?? "") ||
                    user.username?.slice(0, 2).toUpperCase() ||
                    "??"
                  }
                  size="md"
                  src={user.profile_picture_path}
                />
                <div className="leading-tight min-w-0">
                  <div className="text-body text-text truncate">
                    {user.nom} {user.prenom}
                  </div>
                  <div className="text-small text-text-muted truncate">
                    Super admin
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
