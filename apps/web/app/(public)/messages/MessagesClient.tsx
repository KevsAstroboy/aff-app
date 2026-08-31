"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Users, Loader2, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConversationItem } from "@/components/domain/ConversationItem";
import { ChatBubble } from "@/components/domain/ChatBubble";
import { ChatInputBar } from "@/components/domain/ChatInputBar";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { useChatStore } from "@/stores/chat";
import { useWsStore } from "@/stores/ws";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/lib/api-client";
import type { Message } from "@/types";

export default function MessagesClient() {
  const conversations = useChatStore((s) => s.conversations);
  const messages = useChatStore((s) => s.messages);
  const activeId = useChatStore((s) => s.activeId);
  const loadingConversations = useChatStore((s) => s.loadingConversations);
  const loadingMessages = useChatStore((s) => s.loadingMessages);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const error = useChatStore((s) => s.error);

  const loadConversations = useChatStore((s) => s.loadConversations);
  const openConversation = useChatStore((s) => s.openConversation);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const notifyTyping = useChatStore((s) => s.notifyTyping);
  const initListeners = useChatStore((s) => s.initListeners);
  const reset = useChatStore((s) => s.reset);

  const me = useAuthStore((s) => s.user);
  const chatSocket = useWsStore((s) => s.chatSocket);

  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initListeners();
    loadConversations();
    return () => reset();
  }, [initListeners, loadConversations, reset]);

  useEffect(() => {
    if (activeId && chatSocket) {
      chatSocket.emit("join_conversation", { conversation_id: Number(activeId) });
    }
    return () => {
      if (activeId && chatSocket) {
        chatSocket.emit("leave_conversation", { conversation_id: Number(activeId) });
      }
    };
  }, [activeId, chatSocket]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, activeId]);

  const active = conversations.find((c) => c.id === activeId);
  const activeMessages = (messages[activeId ?? ""] ?? []) as Message[];
  const activeTyping = activeId ? typingUsers[activeId] : undefined;

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSend = (text: string) => {
    if (!activeId) return;
    sendMessage(activeId, text);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    chatSocket?.emit("stop_typing", { conversation_id: Number(activeId) });
  };

  const handleTyping = () => {
    if (!activeId) return;
    notifyTyping(activeId);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      chatSocket?.emit("stop_typing", { conversation_id: Number(activeId) });
    }, 2500);
  };

  const renderMessage = (m: Message) => (
    <ChatBubble
      key={m.id}
      body={m.body}
      sentAt={m.sentAt}
      isMine={String(m.authorId) === String(me?.id)}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" subtitle="Vos conversations avec la communauté AFF." />

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[340px_1fr] rounded-2xl border border-border bg-surface overflow-hidden min-h-[600px]">
        <aside className="border-b border-border lg:border-b-0 lg:border-r flex flex-col">
          <div className="p-4 border-b border-border">
            <SearchInput
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {loadingConversations ? (
              <div className="p-8 flex flex-col items-center gap-2 text-text-muted">
                <Loader2 className="h-5 w-5 animate-spin text-gold" />
                <span className="text-small">Chargement…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-small text-text-muted">
                Aucune conversation
              </div>
            ) : (
              filtered.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  active={c.id === activeId}
                  onClick={() => openConversation(c.id)}
                />
              ))
            )}
          </div>
        </aside>

        <section className="flex flex-col min-h-0">
          {active ? (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={active.initials} size="md" src={active.avatar} />
                  <div className="leading-tight">
                    <div className="text-body font-semibold text-text">{active.name}</div>
                    <div className="text-small text-text-muted inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {active.memberCount.toLocaleString("fr-FR")} membres
                    </div>
                  </div>
                </div>
                <IconButton variant="ghost" label="Plus d'options">
                  <MoreVertical className="h-4 w-4" />
                </IconButton>
              </header>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4"
              >
                {error && (
                  <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
                    {error}
                  </div>
                )}
                {loadingMessages ? (
                  <div className="py-10 flex flex-col items-center gap-2 text-text-muted">
                    <Loader2 className="h-5 w-5 animate-spin text-gold" />
                    <span className="text-small">Chargement des messages…</span>
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="py-10 text-center text-small text-text-muted">
                    Aucun message. Soyez le premier à écrire.
                  </div>
                ) : (
                  activeMessages.map(renderMessage)
                )}
                {activeTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-surface-raised border border-border px-4 py-2 text-small text-text-muted">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
                      {activeTyping} écrit…
                    </div>
                  </div>
                )}
              </div>

              <ChatInputBar onSend={handleSend} onTyping={handleTyping} />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-text-muted">
              <MessageSquare className="h-10 w-10" />
              Sélectionnez une conversation
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
