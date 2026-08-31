"use client";

import { Paperclip, Send, Smile } from "lucide-react";
import { useState, type FormEvent } from "react";
import { IconButton } from "@/components/ui/IconButton";

type ChatInputBarProps = {
  onSend?: (message: string) => void;
  onTyping?: () => void;
  placeholder?: string;
};

export function ChatInputBar({ onSend, onTyping, placeholder = "Écrivez votre message..." }: ChatInputBarProps) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-border bg-bg p-4">
      <IconButton type="button" variant="ghost" label="Joindre un fichier">
        <Paperclip className="h-4 w-4" />
      </IconButton>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onTyping?.();
        }}
        placeholder={placeholder}
        className="flex-1 h-12 px-4 rounded-lg bg-surface-raised border border-border text-text placeholder:text-text-subtle transition-colors focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
      />
      <IconButton type="button" variant="ghost" label="Emoji">
        <Smile className="h-4 w-4" />
      </IconButton>
      <button
        type="submit"
        aria-label="Envoyer"
        disabled={!value.trim()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gold text-bg hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
