"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Vote as VoteIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { votePublic } from "@/services/awards-api";
import {
  getCandidatesByCategory,
  getMyVotesSet,
  type Candidate,
} from "@/services/awards";
import { FESTIVAL_YEAR } from "@/constants/festival";

export default function VoterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<number | null>(null);
  const [votedCategories, setVotedCategories] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const alreadyVoted = votedCategories.has(id);

  useEffect(() => {
    if (!Number.isInteger(id)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getCandidatesByCategory(id, 3).catch(() => [] as Candidate[]),
      getMyVotesSet(),
    ])
      .then(([cands, voted]) => {
        setCandidats(cands);
        setVotedCategories(voted);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleVote = async (candidature_id: number) => {
    setError("");
    setVotingId(candidature_id);
    try {
      await votePublic({ candidature_id });
      setVotedCategories((s) => new Set(s).add(id));
      setDone(true);
      setCandidats((cs) => cs.map((c) => (c.id === candidature_id ? { ...c } : c)));
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string };
      if (e?.statusCode === 409) {
        setError("Vous avez déjà voté pour cette catégorie.");
        setVotedCategories((s) => new Set(s).add(id));
      } else {
        setError(e?.message ?? "Erreur lors du vote.");
      }
    } finally {
      setVotingId(null);
    }
  };

  if (done) {
    return (
      <div className="space-y-8 max-w-xl mx-auto text-center py-16">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-h2 font-bold text-text">Vote enregistré</h2>
        <p className="text-body text-text-muted">
          Merci pour votre participation aux Africa Future Awards {FESTIVAL_YEAR}.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => router.push(`/awards/resultats/${id}`)}>
            Voir les résultats
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/awards")}>
            Retour aux Awards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{ label: "Awards", href: "/awards" }, { label: "Voter" }]} />
      <PageHeader
        eyebrow="Vote public"
        title="Votez pour votre favori"
        subtitle="1 vote par catégorie. Vos choix sont anonymes."
      />

      {error && (
        <div className="rounded-lg border border-live-red/40 bg-live-red/10 px-4 py-3 text-small text-live-red">
          {error}
        </div>
      )}

      {alreadyVoted && !done && (
        <div className="rounded-lg border border-gold/40 bg-gold-soft px-4 py-3 text-small text-gold">
          Vous avez déjà voté dans cette catégorie.{" "}
          <Link href={`/awards/resultats/${id}`} className="underline font-medium">
            Voir les résultats
          </Link>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : candidats.length === 0 ? (
        <Card className="text-center py-12 text-body text-text-muted">
          Aucun candidat finaliste dans cette catégorie pour le moment.
        </Card>
      ) : (
        <div className="space-y-4">
          {candidats.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  initials={c.user_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="text-body font-semibold text-text truncate">{c.user_name}</div>
                  {c.description && (
                    <div className="text-small text-text-muted line-clamp-1">{c.description}</div>
                  )}
                </div>
              </div>
              <Button
                onClick={() => handleVote(c.id)}
                variant={alreadyVoted ? "success" : "primary"}
                size="sm"
                loading={votingId === c.id}
                disabled={alreadyVoted}
              >
                {!alreadyVoted && votingId !== c.id && <VoteIcon className="h-4 w-4" />}
                {alreadyVoted ? "Voté" : "Voter"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
