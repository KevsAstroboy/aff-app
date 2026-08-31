import { apiClient } from "@/lib/api-client";
import type { NotificationItem } from "@/types/auth";

export async function getNotifications(unreadOnly?: boolean): Promise<NotificationItem[]> {
  return apiClient.get("/notifications", unreadOnly ? { unread_only: "true" } : undefined);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return apiClient.get("/notifications/unread-count");
}

export async function markAsRead(id: number): Promise<void> {
  return apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  return apiClient.patch("/notifications/read-all");
}
