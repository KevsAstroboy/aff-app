"use client";

import { Menu, Mail, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationsDropdown } from "@/components/domain/NotificationsDropdown";
import { useNotificationsWs } from "@/stores/ws";
import { useRouter } from "next/navigation";
import { FESTIVAL_YEAR } from "@/constants/festival";

type TopbarProps = {
  onMenuClick?: () => void;
  variant?: "public" | "admin";
};

export function Topbar({ onMenuClick, variant = "public" }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  useNotificationsWs();

  const initials =
    (user?.nom?.[0] ?? "") + (user?.prenom?.[0] ?? "") ||
    user?.username?.slice(0, 2).toUpperCase() ||
    "??";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-bg/80 px-6 backdrop-blur-md">
      <button
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover hover:text-text"
      >
        <Menu className="h-5 w-5" />
      </button>

      {variant === "public" && (
        <div className="hidden md:block leading-tight">
          <div className="text-body font-bold text-text tracking-[0.04em]">
            AFRICA FUTURE FESTIVAL
          </div>
          <div className="text-small text-text-muted">Abidjan — 19 & 20 Août {FESTIVAL_YEAR}</div>
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <IconButton variant="outline" aria-label="Messages" label="Messages">
          <Mail className="h-4 w-4" />
        </IconButton>
        <NotificationsDropdown />
        {user && (
          <Avatar
            initials={initials}
            size="md"
            className="ml-2"
            src={user.profile_picture_path}
          />
        )}
        {user && (
          <IconButton
            variant="ghost"
            onClick={handleLogout}
            label="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </IconButton>
        )}
      </div>
    </header>
  );
}