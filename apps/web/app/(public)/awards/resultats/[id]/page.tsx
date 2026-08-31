"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Trophy, Users } from "lucide-react";
import { getPublicResultsReal, type PublicResult } from "@/services/awards";

export default function ResultatsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [results, setResults] = useState<PublicResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!Number.isInteger(id)) {
      setLoading(false);
      return;
    }
    getPublicResultsReal(id)
      .then((r) => {
        if (mounted) setResults(r);
      })
      .catch(() => {
        if (mounted) setResults([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const total = results.reduce((s, r) => s + r.votes_count, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumb items={[{ label: "Awards", href: "/awards" }, { label: "Résultats" }]} />
      <PageHeader
        eyebrow="Vote public"
        title="Résultats en direct"
        actions={
          <div className="inline-flex items-center gap-2 rounded-md border border-gold/40 bg-gold-soft px-3 py-1.5 text-small text-gold">
            <Users className="h-3.5 w-3.5" />
            <span className="tabular-nums">{total}</span> votes
          </div>
        }
      />

      <Card>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 rounded-md bg-surface-hover animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-body text-text-muted text-center py-12">Aucun vote enregistré pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {results
              .sort((a, b) => b.votes_count - a.votes_count)
              .map((r, i) => {
                const pct = total > 0 ? Math.round((r.votes_count / total) * 100) : 0;
                return (
                  <div key={r.candidature_id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-small tabular-nums text-text-muted w-6">
                          #{i + 1}
                        </span>
                        <Avatar
                          initials={r.user_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          size="sm"
                        />
                        <span className="text-body font-medium text-text truncate">
                          {r.user_name}
                        </span>
                        {i === 0 && <Trophy className="h-4 w-4 text-gold shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 tabular-nums text-small shrink-0">
                        <span className="font-bold text-text">{r.votes_count}</span>
                        <span className="text-text-muted">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
                      <div
                        className="h-full bg-gold rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>
    </div>
  );
}
