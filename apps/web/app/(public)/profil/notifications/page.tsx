"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/domain/EmptyState";
import { apiClient } from "@/lib/api-client";
import { unwrap } from "@/lib/adapters";
import { useAuthStore } from "@/stores/auth";
import type { NotificationItem } from "@/types/auth";
import { relativeTime } from "@/lib/formatters";

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await apiClient.get<NotificationItem[] | { items: NotificationItem[] }>(
          "/notifications"
        );
        setItems(unwrap(data));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function markAll() {
    try {
      await apiClient.patch("/notifications/read-all");
      setItems((arr) => arr.map((n) => ({ ...n, is_read: true })));
    } catch {}
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Profil", href: "/profil" }, { label: "Notifications" }]} />
        <PageHeader
          eyebrow="Mon compte"
          title="Notifications"
          actions={
            <Button variant="outline" onClick={markAll}>
              <CheckCheck className="h-4 w-4" />
              Tout marquer lu
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="Aucune notification"
          description="Vous serez prévenu ici quand quelque chose se passe."
        />
      ) : (
        <Card className="divide-y divide-border">
          {items.map((n) => (
            <Link
              key={n.id}
              href={n.link ?? "#"}
              className={`flex items-start gap-3 px-5 py-4 hover:bg-white/5 ${
                !n.is_read ? "bg-gold/[0.04]" : ""
              }`}
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.is_read ? "bg-text-subtle" : "bg-gold"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-body font-medium text-text">{n.title}</div>
                {n.body && (
                  <div className="text-small text-text-muted mt-0.5">{n.body}</div>
                )}
                <div className="text-small text-text-subtle mt-1">
                  {relativeTime(n.created_at)}
                </div>
              </div>
              {!n.is_read && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await apiClient.patch(`/notifications/${n.id}/read`);
                      setItems((arr) =>
                        arr.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
                      );
                    } catch {}
                  }}
                  className="p-1 rounded-md hover:bg-white/5 text-gold shrink-0"
                  aria-label="Marquer lu"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}