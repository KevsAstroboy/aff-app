"use client";

import { create } from "zustand";
import { apiClient } from "@/lib/api-client";
import { unwrap } from "@/lib/adapters";
import { useWsStore } from "@/stores/ws";
import { useAuthStore } from "@/stores/auth";
import type { BackendConversation, BackendMessage } from "@/lib/adapters";
import type { Conversation, Message } from "@/types";

type ChatMessage = Message;

type ChatStore = {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeId: string | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
  typingUsers: Record<string, string>;
  presence: Record<number, "online" | "offline">;
  error: string;

  loadConversations: () => Promise<void>;
  openConversation: (id: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => void;
  notifyTyping: (conversationId: string) => void;
  initListeners: () => void;
  reset: () => void;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function convInitials(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function currentUserId(): number | null {
  try {
    return useAuthStore.getState().user?.id ?? null;
  } catch {
    return null;
  }
}

function adaptConv(c: BackendConversation): Conversation {
  const name = c.nom ?? `Conversation #${c.id}`;
  const peers = (c.participants ?? []).filter((p) => p.user_id !== currentUserId());
  const avatar = peers.length === 1 ? (peers[0].profile_picture_path ?? null) : null;
  return {
    id: String(c.id),
    name,
    initials: convInitials(name),
    avatar,
    isGroup: c.type_id === 2 || (c.participants?.length ?? 0) > 2,
    memberCount: c.participants?.length ?? 2,
    lastMessage: c.last_message?.contenu ?? "",
    lastMessageAt: c.last_message?.sent_at ?? c.created_at ?? new Date().toISOString(),
    unread: 0,
  };
}

function adaptMsg(m: BackendMessage, idx: number): ChatMessage {
  return {
    id: String(m.id ?? m._id ?? idx),
    conversationId: String(m.conversation_id ?? ""),
    authorId: String(m.sender_id ?? idx),
    authorName: m.sender_username ?? `User ${m.sender_id ?? idx}`,
    body: m.contenu ?? "",
    sentAt: m.sent_at ?? new Date().toISOString(),
    isMine: false,
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  messages: {},
  activeId: null,
  loadingConversations: false,
  loadingMessages: false,
  typingUsers: {},
  presence: {},
  error: "",

  initListeners: () => {
    const chat = useWsStore.getState().chatSocket;
    if (!chat) return;

    chat.off("new_message");
    chat.on("new_message", (payload: {
      _id: string;
      conversation_id: number;
      sender_id: number;
      sender_username?: string;
      contenu: string;
      type?: string;
      sent_at: string;
    }) => {
      const convId = String(payload.conversation_id);
      const isMine = false;
      const msg: ChatMessage = {
        id: payload._id,
        conversationId: convId,
        authorId: String(payload.sender_id),
        authorName: payload.sender_username ?? `User ${payload.sender_id}`,
        body: payload.contenu,
        sentAt: payload.sent_at ?? new Date().toISOString(),
        isMine,
      };
      set((s) => ({
        messages: {
          ...s.messages,
          [convId]: [...(s.messages[convId] ?? []), msg],
        },
        conversations: s.conversations.map((c) =>
          c.id === convId
            ? { ...c, lastMessage: payload.contenu, lastMessageAt: msg.sentAt }
            : c
        ),
      }));
    });

    chat.off("user_typing");
    chat.on("user_typing", (payload: { conversation_id: number; username: string }) => {
      set((s) => ({
        typingUsers: { ...s.typingUsers, [String(payload.conversation_id)]: payload.username },
      }));
    });

    chat.off("user_stop_typing");
    chat.on("user_stop_typing", (payload: { conversation_id: number }) => {
      set((s) => {
        const next = { ...s.typingUsers };
        delete next[String(payload.conversation_id)];
        return { typingUsers: next };
      });
    });

    chat.off("user_presence");
    chat.on("user_presence", (payload: { user_id: number; status: string }) => {
      set((s) => ({
        presence: {
          ...s.presence,
          [payload.user_id]: payload.status === "online" ? "online" : "offline",
        },
      }));
    });
  },

  loadConversations: async () => {
    if (get().loadingConversations) return;
    set({ loadingConversations: true, error: "" });
    try {
      const data = await apiClient.get<BackendConversation[] | { items: BackendConversation[] }>(
        "/messagerie/conversations"
      );
      set({ conversations: unwrap(data).map(adaptConv) });
    } catch {
      set({ error: "Impossible de charger vos conversations." });
    } finally {
      set({ loadingConversations: false });
    }
  },

  openConversation: async (id: string) => {
    const chat = useWsStore.getState().chatSocket;
    set({ activeId: id, loadingMessages: true, error: "" });
    const convId = Number(id);
    if (chat) {
      chat.emit("join_conversation", { conversation_id: convId });
    }
    try {
      const data = await apiClient.get<BackendMessage[] | { data: BackendMessage[] }>(
        `/messagerie/conversations/${id}/messages?page=1&limit=100`
      );
      const list = unwrap(data).map(adaptMsg);
      set((s) => ({
        messages: { ...s.messages, [id]: list },
        conversations: s.conversations.map((c) =>
          c.id === id ? { ...c, unread: 0 } : c
        ),
      }));
    } catch {
      set({ error: "Impossible de charger les messages." });
    } finally {
      set({ loadingMessages: false });
    }
  },

  sendMessage: (conversationId, text) => {
    const chat = useWsStore.getState().chatSocket;
    if (!chat) return;
    chat.emit("send_message", {
      conversation_id: Number(conversationId),
      contenu: text,
    });
  },

  notifyTyping: (conversationId) => {
    const chat = useWsStore.getState().chatSocket;
    if (!chat) return;
    chat.emit("typing", { conversation_id: Number(conversationId) });
  },

  reset: () => {
    set({
      conversations: [],
      messages: {},
      activeId: null,
      typingUsers: {},
      presence: {},
      error: "",
    });
  },
}));

export { BASE_URL };
