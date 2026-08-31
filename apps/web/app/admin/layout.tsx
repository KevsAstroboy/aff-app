"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard adminOnly>
      <div className="flex min-h-screen bg-bg">
        <div className="hidden md:block h-screen sticky top-0">
          <Sidebar variant="admin" />
        </div>
        <MobileNav open={open} onClose={() => setOpen(false)} variant="admin" />

        <div className="flex flex-1 flex-col min-w-0">
          <Topbar onMenuClick={() => setOpen(true)} variant="admin" />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}