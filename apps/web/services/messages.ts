import { apiClient } from "@/lib/api-client";
import { CONVERSATIONS, MESSAGES } from "@/mock/messages";
import { latency, sleep } from "@/lib/sleep";
import { unwrap, type BackendConversation, type BackendMessage } from "@/lib/adapters";
import type { Conversation, Message } from "@/types";

function convInitials(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function adaptConv(c: BackendConversation): Conversation {
  const name = c.nom ?? `Conversation #${c.id}`;
  const initials = convInitials(name);
  return {
    id: String(c.id),
    name,
    initials,
    isGroup: c.type_id === 2 || (c.participants?.length ?? 0) > 2,
    memberCount: c.participants?.length ?? 2,
    lastMessage: c.last_message?.contenu ?? "",
    lastMessageAt: c.last_message?.sent_at ?? c.created_at ?? new Date().toISOString(),
    unread: 0,
  };
}

function adaptMsg(m: BackendMessage, idx: number): Message {
  return {
    id: String(m.id ?? idx),
    conversationId: String(m.conversation_id ?? ""),
    authorId: String(m.sender_id ?? idx),
    authorName: `User ${m.sender_id ?? idx}`,
    body: m.contenu ?? "",
    sentAt: m.sent_at ?? new Date().toISOString(),
    isMine: false,
  };
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const data = await apiClient.get<BackendConversation[]>(
      "/messagerie/conversations"
    );
    return unwrap(data).map(adaptConv);
  } catch {
    await sleep(latency());
    return CONVERSATIONS;
  }
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  try {
    const c = await apiClient.get<BackendConversation>(`/messagerie/conversations/${id}`);
    return adaptConv(c);
  } catch {
    await sleep(latency());
    return CONVERSATIONS.find((c) => c.id === id);
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const data = await apiClient.get<BackendMessage[]>(
      `/messagerie/conversations/${conversationId}/messages`
    );
    return unwrap(data).map(adaptMsg);
  } catch {
    await sleep(latency());
    return MESSAGES.filter((m) => m.conversationId === conversationId);
  }
}