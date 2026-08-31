"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Video, Users, Clock, ExternalLink, Copy, Check, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/domain/ProgressBar";
import { LiveIndicator } from "@/components/domain/LiveIndicator";
import { ConfirmationModal } from "@/components/domain/masterclass/ConfirmationModal";
import { useAuthStore } from "@/stores/auth";
import { COMMUNITY_LABEL } from "@/constants/nav";
import {
  getMasterclasses,
  getMyMasterclassIds,
  inscribeToMasterclass,
  unsubscribeFromMasterclass,
  downloadBilletPdf,
} from "@/services/masterclasses";
import type { Masterclass } from "@/types";

export default function MasterclassListPage() {
  const me = useAuthStore((s) => s.user);
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [inscritIds, setInscritIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<Masterclass | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [list, insc] = await Promise.all([
          getMasterclasses(),
          me ? getMyMasterclassIds() : Promise.resolve(new Set<string>()),
        ]);
        if (!alive) return;
        setMasterclasses(list);
        setInscritIds(insc);
      } catch {
        // données backend indisponibles
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [me]);

  const isInscrit = (m: Masterclass) => inscritIds.has(m.id) || m.isInscrit;

  const handleInscribe = async (m: Masterclass) => {
    if (!me || busyId) return;
    setBusyId(m.id);
    try {
      await inscribeToMasterclass(m.id);
      setInscritIds((prev) => new Set(prev).add(m.id));
      if (m.mode?.toLowerCase().includes("distanciel")) {
        setJoined(m);
      }
    } catch {
      // erreur déjà gérée par un toast global (si présent)
    } finally {
      setBusyId(null);
    }
  };

  const handleUnsubscribe = async (m: Masterclass) => {
    if (busyId) return;
    setBusyId(m.id);
    try {
      await unsubscribeFromMasterclass(m.id);
      setInscritIds((prev) => {
        const next = new Set(prev);
        next.delete(m.id);
        return next;
      });
    } finally {
      setBusyId(null);
    }
  };

  const copyLink = async () => {
    if (!joined?.meetingUrl) return;
    try {
      await navigator.clipboard.writeText(joined.meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const grid: (Masterclass | null)[] = useMemo(
    () => (loading ? Array.from({ length: 6 }).map(() => null) : masterclasses),
    [loading, masterclasses],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sessions en direct"
        title="Masterclass"
        subtitle="Découvrez les masterclasses dispensées par les meilleurs experts africains. Inscrivez-vous pour réserver votre place."
      />

      {!me && (
        <Card className="p-4 text-small text-text-muted">
          Connectez-vous pour vous inscrire aux masterclasses.
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {grid.map((entry, i) => {
          if (loading || !entry) {
            return (
              <Card key={i} className="animate-pulse space-y-3">
                <div className="h-4 w-24 rounded bg-surface-raised" />
                <div className="h-5 w-3/4 rounded bg-surface-raised" />
                <div className="h-4 w-1/2 rounded bg-surface-raised" />
                <div className="h-2 w-full rounded bg-surface-raised" />
              </Card>
            );
          }
          const m = entry;
          const isLive = m.status === "live";
          const inscrit = isInscrit(m);
          const distanciel = (m.mode ?? "").toLowerCase().startsWith("distanciel");
          const full = m.capacity > 0 && m.participants >= m.capacity;

          return (
            <Card key={m.id} className="space-y-4 hover:border-border-strong transition-colors">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Tag color={`domain-${m.community}` as never} size="sm">
                  {COMMUNITY_LABEL[m.community]?.toUpperCase() ?? "ART"}
                </Tag>
                {isLive ? (
                  <LiveIndicator size="sm" />
                ) : (
                  <StatusPill kind={m.status === "cancelled" ? "cancelled" : "pending"} />
                )}
              </div>

              <h3 className="text-h3 font-semibold text-text leading-snug">{m.title}</h3>

              {m.expert && <div className="text-body text-text-muted">Avec {m.expert}</div>}

              <div className="flex flex-wrap items-center gap-3 text-small text-text-muted">
                {m.lieu && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {m.lieu}
                  </span>
                )}
                {m.mode && (
                  <span className="inline-flex items-center gap-1">
                    <Video className="h-3.5 w-3.5" />
                    {m.mode}
                  </span>
                )}
                {m.date && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {m.date}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {m.participants}/{m.capacity || "∞"}
                </span>
              </div>

              <ProgressBar
                value={m.participants}
                max={m.capacity}
                color={m.capacity > 0 && m.participants >= m.capacity ? "live-red" : "gold"}
              />

              {inscrit ? (
                <div className="space-y-2">
                  {!distanciel && (
                    <Button
                      className="w-full"
                      onClick={() => downloadBilletPdf(m.id)}
                    >
                      <Download className="h-4 w-4" />
                      Télécharger le billet + QR
                    </Button>
                  )}
                  {distanciel && (
                    <Button
                      className="w-full"
                      onClick={() => setJoined(m)}
                      disabled={!m.meetingUrl}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {m.meetingUrl ? "Rejoindre la visio" : "Lien visio à venir"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleUnsubscribe(m)}
                    disabled={busyId === m.id}
                  >
                    {busyId === m.id ? "Chargement..." : "Se désinscrire"}
                  </Button>
                  {!distanciel && (
                    <p className="text-xs text-text-muted text-center">
                      Téléchargez votre billet avec QR code pour l&apos;événement.
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleInscribe(m)}
                  disabled={!me || busyId === m.id || statusDisabled(m) || full}
                >
                  {busyId === m.id
                    ? "Chargement..."
                    : full
                      ? "Complet"
                      : m.status === "live"
                        ? "Rejoindre maintenant"
                        : "S'inscrire"}
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {joined && joined.meetingUrl && (
        <ConfirmationModal
          isLive={joined.status === "live"}
          title={joined.title}
          expert={joined.expert}
          meetingUrl={joined.meetingUrl}
          copied={copied}
          onCopy={copyLink}
          onClose={() => setJoined(null)}
        />
      )}
    </div>
  );
}

function statusDisabled(m: Masterclass): boolean {
  return m.status === "terminated" || m.status === "cancelled";
}