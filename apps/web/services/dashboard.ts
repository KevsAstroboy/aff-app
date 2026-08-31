import { apiClient } from "@/lib/api-client";
import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_KPIS,
  DASHBOARD_TOP_COMMUNAUTES,
} from "@/mock/dashboard";
import { latency, sleep } from "@/lib/sleep";
import type { ActivityItem, DashboardKPI } from "@/types";

export async function getKpis(): Promise<DashboardKPI[]> {
  try {
    const data = await apiClient.get<{
      total_users?: number;
      total_masterclass?: number;
      total_publications?: number;
      total_signalements?: number;
    }>("/admin/stats");
    return [
      {
        label: "Utilisateurs total",
        value: data.total_users ?? 0,
        icon: "users",
        delta: { value: 12, isPositive: true, suffix: "% ce mois" },
      },
      {
        label: "Masterclasses",
        value: data.total_masterclass ?? 0,
        icon: "masterclass",
        delta: { value: 1, isPositive: true, suffix: "en direct" },
      },
      {
        label: "Publications",
        value: data.total_publications ?? 0,
        icon: "publication",
        delta: { value: 89, isPositive: true, suffix: "aujourd'hui" },
      },
      {
        label: "Signalements",
        value: data.total_signalements ?? 0,
        icon: "report",
        delta: { value: 2, isPositive: false, suffix: "urgents" },
      },
    ];
  } catch {
    await sleep(latency());
    return DASHBOARD_KPIS;
  }
}

export async function getActivite(): Promise<ActivityItem[]> {
  try {
    return await apiClient.get<ActivityItem[]>("/admin/signalements/recent", {
      limit: "10",
    });
  } catch {
    await sleep(latency());
    return DASHBOARD_ACTIVITY;
  }
}

export async function getTopCommunautes() {
  try {
    const data = await apiClient.get<unknown>("/admin/content/stats");
    if (Array.isArray(data)) return data;
    const obj = data as { top_communautes?: unknown };
    if (obj?.top_communautes && Array.isArray(obj.top_communautes)) {
      return obj.top_communautes;
    }
    return DASHBOARD_TOP_COMMUNAUTES;
  } catch {
    await sleep(latency());
    return DASHBOARD_TOP_COMMUNAUTES;
  }
}