"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Send, Hash, Check } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { createPublication } from "@/services/mutations";
import { apiClient } from "@/lib/api-client";
import { unwrap } from "@/lib/adapters";

type CommunauteOption = { id: number; libelle: string };

type Props = {
  onPosted?: () => void;
};

export function FeedComposer({ onPosted }: Props) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [posting, setPosting] = useState(false);
  const [allCommunautes, setAllCommunautes] = useState<CommunauteOption[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.get<CommunauteOption[]>("/communaute");
        const items = unwrap(data);
        setAllCommunautes(items.filter((c) => c.id != null));
      } catch {
        setAllCommunautes([]);
      }
    })();
  }, []);

  useEffect(() => {
    const ids = user?.communaute_ids ?? [];
    if (!user || ids.length === 0) return;
    setSelected((prev) => (prev.length ? prev : [...new Set(ids)]));
  }, [user]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const hashtags = tags
        .split(/[\s,]+/)
        .map((t) => t.replace(/^#/, "").trim())
        .filter(Boolean);
      // une publication par communauté sélectionnée
      const targets = selected.length > 0 ? selected : (user?.communaute_ids ?? []);
      if (targets.length > 0) {
        for (const communaute_id of targets) {
          await createPublication({
            contenu: content.trim(),
            hashtags: hashtags.length > 0 ? hashtags : undefined,
            communaute_id,
          });
        }
      } else {
        await createPublication({
          contenu: content.trim(),
          hashtags: hashtags.length > 0 ? hashtags : undefined,
        });
      }
      setContent("");
      setTags("");
      onPosted?.();
      router.refresh();
    } catch {
      // silent
    } finally {
      setPosting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <Avatar
          initials={
            (user?.nom?.[0] ?? "") + (user?.prenom?.[0] ?? "") ||
            user?.username?.slice(0, 2).toUpperCase() ||
            "JD"
          }
          size="md"
          src={user?.profile_picture_path}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partager quelque chose avec votre communauté..."
          rows={3}
          className="flex-1 px-3 py-2 rounded-md bg-surface-raised border border-border text-text placeholder:text-text-subtle focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft resize-none"
        />
      </div>

      {allCommunautes.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pl-13">
          {allCommunautes.map((c) => {
            const on = selected.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-small border transition-colors ${
                  on
                    ? "bg-gold/10 border-gold/60 text-gold"
                    : "bg-surface-raised border-border text-text-muted hover:text-text"
                }`}
              >
                {on && <Check className="h-3 w-3" />}
                {c.libelle}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 justify-between pl-13">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Hash className="h-3.5 w-3.5 text-text-subtle" />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="hashtags séparés par espace"
            className="flex-1 h-9 px-3 rounded-md bg-surface-raised border border-border text-small text-text placeholder:text-text-subtle focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
          />
          <button
            type="button"
            aria-label="Joindre une image"
            className="h-9 w-9 inline-flex items-center justify-center rounded-md text-text-muted hover:bg-white/5 hover:text-text"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
        <Button type="submit" size="sm" disabled={posting || !content.trim()}>
          <Send className="h-4 w-4" />
          {posting ? "Publication..." : "Publier"}
        </Button>
      </div>
    </form>
  );
}