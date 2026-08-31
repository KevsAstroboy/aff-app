import { Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { relativeTime } from "@/lib/formatters";
import type { Conversation } from "@/types";

type ConversationItemProps = {
  conversation: Conversation;
  active?: boolean;
  onClick?: () => void;
};

export function ConversationItem({ conversation, active, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
        active ? "bg-gold-soft" : "hover:bg-surface-hover"
      )}
    >
      <div className="relative">
        <Avatar initials={conversation.initials} size="md" src={conversation.avatar} />
        {conversation.isGroup && (
          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface border border-border text-text-muted">
            <Users className="h-3 w-3" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("truncate text-body", active ? "text-gold font-semibold" : "text-text font-semibold")}>
            {conversation.name}
          </span>
          <span className="shrink-0 text-small text-text-muted">
            {relativeTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <div className="text-small text-text-muted">
              {conversation.memberCount.toLocaleString("fr-FR")} membres
            </div>
            <div className="truncate text-small text-text-muted">{conversation.lastMessage}</div>
          </div>
          {conversation.unread > 0 && (
            <span className="shrink-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warn px-1.5 text-eyebrow font-semibold text-bg tabular-nums">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
