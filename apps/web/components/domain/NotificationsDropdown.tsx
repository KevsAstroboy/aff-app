"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/lib/api-client";
import { unwrap } from "@/lib/adapters";
import { relativeTime } from "@/lib/formatters";
import type { NotificationItem } from "@/types/auth";

export function NotificationsDropdown() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    load();
    // live push via WS (aff:notif-update dispatched by ws store)
    const onNotif = (e: Event) => {
      const detail = (e as CustomEvent<{ count: number }>).detail;
      if (detail?.count != null) setUnread(detail.count);
      if (open) load();
    };
    window.addEventListener("aff:notif-update", onNotif);
    // refresh every 30s as fallback
    const id = setInterval(load, 30000);
    return () => {
      clearInterval(id);
      window.removeEventListener("aff:notif-update", onNotif);
    };
  }, [user, open]);

  async function load() {
    try {
      const [list, countRes] = await Promise.all([
        apiClient.get<NotificationItem[] | { items: NotificationItem[] }>(
          "/notifications"
        ),
        apiClient.get<{ count: number }>("/notifications/unread-count"),
      ]);
      setItems(unwrap(list));
      setUnread(countRes?.count ?? 0);
    } catch {
      // silent fail
    }
  }

  async function toggle() {
    setOpen((o) => !o);
    if (!open) {
      setLoading(true);
      await load();
      setLoading(false);
    }
  }

  async function markRead(id: number) {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setItems((arr) => arr.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      // silent
    }
  }

  async function markAll() {
    try {
      await apiClient.patch("/notifications/read-all");
      setItems((arr) => arr.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {
      // silent
    }
  }

  function handleClick(n: NotificationItem) {
    if (!n.is_read) markRead(n.id);
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label="Notifications"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-border-strong transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] inline-flex items-center justify-center rounded-full bg-live-red text-[10px] font-bold text-bg tabular-nums px-1 leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          />
          <div className="absolute right-0 top-12 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
            <header className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <div className="text-body font-semibold text-text">Notifications</div>
                <div className="text-small text-text-muted">{unread} non lues</div>
              </div>
              {unread > 0 && (
                <button
                  onClick={markAll}
                  className="text-small text-gold hover:text-gold-hover inline-flex items-center gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tout marquer
                </button>
              )}
            </header>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-8 text-center text-small text-text-muted">Chargement...</div>
              ) : items.length === 0 ? (
                <div className="p-8 text-center text-small text-text-muted">
                  Aucune notification
                </div>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`flex items-start gap-3 w-full text-left px-4 py-3 hover:bg-white/5 border-b border-border last:border-b-0 ${
                      !n.is_read ? "bg-gold/[0.04]" : ""
                    }`}
                  >
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        n.is_read ? "bg-text-subtle" : "bg-gold"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-body text-text line-clamp-2">{n.title}</div>
                      {n.body && (
                        <div className="text-small text-text-muted mt-1 line-clamp-2">
                          {n.body}
                        </div>
                      )}
                      <div className="text-small text-text-subtle mt-1">
                        {relativeTime(n.created_at)}
                      </div>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(n.id);
                        }}
                        aria-label="Marquer lu"
                        className="p-1 rounded-md hover:bg-white/5 text-gold shrink-0"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </button>
                ))
              )}
            </div>

            <Link
              href="/profil/notifications"
              onClick={() => setOpen(false)}
              className="block text-center px-4 py-3 border-t border-border text-small text-gold hover:bg-gold-soft"
            >
              Voir toutes les notifications
            </Link>
          </div>
        </>
      )}
    </div>
  );
}