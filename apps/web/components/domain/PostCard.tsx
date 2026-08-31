"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { flag } from "@/lib/flags";
import { relativeTime } from "@/lib/formatters";
import { COMMUNITY_TEXT_COLORS } from "@/constants/communautes";
import { reactToPublication, commentPublication } from "@/services/mutations";
import { getCommentsByPublication } from "@/services/comments";
import { getReactionTypes } from "@/services/feed";
import { useAuthStore } from "@/stores/auth";
import type { FeedPost, Comment } from "@/types";

type PostCardProps = {
  post: FeedPost;
  onReact?: () => void;
  onComment?: () => void;
};

type ReactionType = { id: number; code: string; emoji: string; libelle?: string };

export function PostCard({ post, onReact, onComment }: PostCardProps) {
  const me = useAuthStore((s) => s.user);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [reacting, setReacting] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [reactionTypes, setReactionTypes] = useState<ReactionType[]>([]);

  useEffect(() => {
    getReactionTypes().then(setReactionTypes);
  }, []);

  const toggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments === null) {
      const list = await getCommentsByPublication(post.id);
      setComments(list);
    }
  };

  const handleReact = async (reactionTypeId: number) => {
    if (reacting || !me) return;
    setReacting(true);
    try {
      await reactToPublication(post.id, reactionTypeId);
      onReact?.();
    } finally {
      setReacting(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      next.has(commentId) ? next.delete(commentId) : next.add(commentId);
      return next;
    });
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const parentId = replyingTo !== null ? Number(replyingTo) : undefined;
      await commentPublication(post.id, text, parentId);
      setCommentText("");
      setReplyingTo(null);
      const list = await getCommentsByPublication(post.id);
      setComments(list);
      onComment?.();
    } finally {
      setSending(false);
    }
  };

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 space-y-4">
      <header className="flex items-start gap-3">
        <Link href={`/profil/${post.authorId}`}>
          <Avatar
            initials={post.initials}
            size="md"
            src={post.authorAvatar}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profil/${post.authorId}`}
              className="text-body font-semibold text-text hover:text-gold transition-colors"
            >
              {post.authorName}
            </Link>
            <Tag color={`domain-${post.community}` as never} size="sm">
              {post.community.toUpperCase()}
            </Tag>
            {post.flags.map((c) => (
              <span key={c} className="text-body">
                {flag(c)}
              </span>
            ))}
          </div>
          <div className="text-small text-text-muted">{relativeTime(post.createdAt)}</div>
        </div>
        <button
          aria-label="Plus d'options"
          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-text-subtle hover:bg-surface-hover hover:text-text-muted"
        >
          ···
        </button>
      </header>

      <p className={`text-body leading-relaxed text-text ${COMMUNITY_TEXT_COLORS[post.community]}`}>
        {post.body}
      </p>

      <div className="flex flex-wrap gap-2">
        {post.reactions.map((r, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-raised border border-border text-small text-text"
          >
            <span>{r.emoji}</span>
            <span className="tabular-nums">{r.count}</span>
          </span>
        ))}
      </div>

      <footer className="flex items-center justify-between border-t border-border pt-4 text-small text-text-muted">
        <div className="flex items-center gap-5">
          {reactionTypes.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {reactionTypes.map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => handleReact(rt.id)}
                  disabled={!me || reacting}
                  title={rt.code}
                  className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full bg-surface-raised border border-border text-text hover:border-gold/60 hover:text-gold transition-colors disabled:opacity-50"
                >
                  <span className="text-base leading-none">{rt.emoji}</span>
                  <span className="tabular-nums">
                    {post.reactions?.find((r) => r.emoji === rt.emoji)?.count ?? 0}
                  </span>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={toggleComments}
            className="inline-flex items-center gap-1.5 hover:text-text transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="tabular-nums">{post.comments}</span>
          </button>
          <button className="inline-flex items-center gap-1.5 hover:text-text transition-colors">
            <Share2 className="h-4 w-4" />
            <span className="tabular-nums">{post.shares}</span>
          </button>
        </div>
        <button
          aria-label="Enregistrer"
          className="hover:text-text transition-colors"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </footer>

      {showComments && (
        <div className="space-y-3 border-t border-border pt-4">
          {comments === null ? (
            <p className="text-small text-text-muted">Chargement des commentaires...</p>
          ) : comments.length === 0 ? (
            <p className="text-small text-text-muted">Aucun commentaire pour le moment.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id}>
                <div className="flex items-start gap-2">
                  <Link href={`/profil/${c.authorId}`}>
                    <Avatar
                      initials={c.initials}
                      size="sm"
                      src={c.authorAvatar}
                    />
                  </Link>
                  <div className="bg-surface-raised rounded-lg px-3 py-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profil/${c.authorId}`}
                        className="text-small font-semibold text-text hover:text-gold transition-colors"
                      >
                        {c.authorName}
                      </Link>
                      <span className="text-xs text-text-muted">{relativeTime(c.createdAt)}</span>
                    </div>
                    <p className="text-small text-text mt-0.5">{c.body}</p>
                    {me && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                        className="mt-1 text-xs text-text-muted hover:text-gold transition-colors"
                      >
                        Répondre
                      </button>
                    )}
                  </div>
                </div>
                {replyingTo === c.id && me && (
                  <form
                    onSubmit={handleComment}
                    className="flex items-center gap-2 pl-9 pt-2"
                  >
                    <span className="text-xs text-gold shrink-0">↳ {c.authorName}</span>
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Répondre..."
                      className="flex-1 h-8 px-3 rounded-md bg-surface-raised border border-border text-small text-text placeholder:text-text-subtle focus:outline-none focus:border-gold/60"
                    />
                    <button
                      type="submit"
                      disabled={sending || !commentText.trim()}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold disabled:opacity-40 transition-colors"
                      aria-label="Envoyer la réponse"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
                {(c as Comment & { replies?: Comment[] }).replies?.length ? (
                  <button
                    onClick={() => toggleReplies(c.id)}
                    className="mt-1 pl-9 text-xs text-text-muted hover:text-gold transition-colors inline-flex items-center gap-1"
                  >
                    {expandedReplies.has(c.id)
                      ? "Masquer les réponses"
                      : `Voir les ${(c as Comment & { replies?: Comment[] }).replies!.length} réponse(s)`}
                  </button>
                ) : null}
                {expandedReplies.has(c.id) &&
                  (c as Comment & { replies?: Comment[] }).replies?.map((r) => (
                    <div key={r.id} className="flex items-start gap-2 pl-4 mt-2">
                      <Link href={`/profil/${r.authorId}`}>
                        <Avatar
                          initials={r.initials}
                          size="sm"
                          src={r.authorAvatar}
                        />
                      </Link>
                      <div className="bg-surface-raised rounded-lg px-3 py-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/profil/${r.authorId}`}
                            className="text-small font-semibold text-text hover:text-gold transition-colors"
                          >
                            {r.authorName}
                          </Link>
                          <span className="text-xs text-text-muted">{relativeTime(r.createdAt)}</span>
                        </div>
                        <p className="text-small text-text mt-0.5">{r.body}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ))
          )}

          {me && (
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrire un commentaire..."
                className="flex-1 h-9 px-3 rounded-md bg-surface-raised border border-border text-small text-text placeholder:text-text-subtle focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft"
              />
              <button
                type="submit"
                disabled={sending || !commentText.trim()}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold disabled:opacity-40 transition-colors"
                aria-label="Envoyer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}