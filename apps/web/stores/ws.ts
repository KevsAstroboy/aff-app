"use client";

import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/lib/api-client";
import { create } from "zustand";

// WebSocket connects to origin (nginx proxies /socket.io to backend)
function getWsUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

type WsStore = {
  socket: Socket | null;
  chatSocket: Socket | null;
  connect: () => void;
  disconnect: () => void;
};

function buildSocket(namespace: string, token: string): Socket {
  return io(`${getWsUrl()}${namespace}`, {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
  });
}

export const useWsStore = create<WsStore>((set, get) => ({
  socket: null,
  chatSocket: null,

  connect: () => {
    const { socket, chatSocket } = get();
    if (socket && chatSocket) return;
    const token = useAuthStore.getState().token;
    if (!token) return;

    if (!socket) {
      const s = buildSocket("/notifications", token);
      s.on("new_notification", async () => {
        try {
          const { count } = await apiClient.get<{ count: number }>(
            "/notifications/unread-count"
          );
          window.dispatchEvent(
            new CustomEvent("aff:notif-update", { detail: { count } })
          );
        } catch {
          // ignore
        }
      });
      s.on("connect_error", () => {
        // log only
      });
      set({ socket: s });
    }

    if (!chatSocket) {
      const c = buildSocket("/chat", token);
      set({ chatSocket: c });
    }
  },

  disconnect: () => {
    const { socket, chatSocket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
    if (chatSocket) {
      chatSocket.disconnect();
      set({ chatSocket: null });
    }
  },
}));

export function useNotificationsWs() {
  const token = useAuthStore((s) => s.token);
  const isAuth = useAuthStore((s) => s.isAuth);
  const connect = useWsStore((s) => s.connect);
  const disconnect = useWsStore((s) => s.disconnect);

  useEffect(() => {
    if (!isAuth || !token) {
      disconnect();
      return;
    }
    connect();
    return () => {
      disconnect();
    };
  }, [isAuth, token, connect, disconnect]);
}
