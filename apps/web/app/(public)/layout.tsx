"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SignalerModalHost } from "@/components/domain/SignalerModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-bg">
        <div className="hidden md:block h-screen sticky top-0">
          <Sidebar variant="public" />
        </div>
        <MobileNav
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          variant="public"
        />

        <div className="flex flex-1 flex-col min-w-0">
          <Topbar onMenuClick={() => setMobileOpen(true)} variant="public" />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-10 page-fade-in">{children}</div>
          </main>
        </div>
      </div>
      <SignalerModalHost />
    </AuthGuard>
  );
}