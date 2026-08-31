import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/formatters";

type ChatBubbleProps = {
  body: string;
  sentAt: string;
  isMine: boolean;
  showTime?: boolean;
};

export function ChatBubble({ body, sentAt, isMine, showTime = true }: ChatBubbleProps) {
  return (
    <div className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-md space-y-1", isMine ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-body",
            isMine
              ? "bg-gold text-bg rounded-br-md"
              : "bg-surface-raised border border-border text-text rounded-bl-md"
          )}
        >
          {body}
        </div>
        {showTime && (
          <div className="text-small text-text-subtle tabular-nums">{formatDateTime(sentAt)}</div>
        )}
      </div>
    </div>
  );
}
