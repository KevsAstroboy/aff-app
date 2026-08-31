import { Pencil, Trash2, Check, X, Clock, Users, Play, StopCircle } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/domain/ProgressBar";
import { COMMUNITY_LABEL } from "@/constants/nav";
import type { Masterclass } from "@/types";

type Props = {
  masterclass: Masterclass;
  onEdit?: (m: Masterclass) => void;
  onDelete?: (m: Masterclass) => void;
  onStatusChange?: (id: string, statut_id: number) => void;
};

const GRID_COLS =
  "xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,auto)_minmax(0,0.9fr)_minmax(0,140px)_minmax(0,auto)_minmax(0,auto)]";

function StatusActions({ masterclass, onEdit, onDelete, onStatusChange }: Props) {
  const m = masterclass;
  const isPending = m.status === "pending";
  const isLive = m.status === "live";
  const isTerminated = m.status === "terminated";
  const isCancelled = m.status === "cancelled";

  return (
    <>
      <IconButton variant="outline" size="sm" label="Modifier" onClick={() => onEdit?.(m)}>
        <Pencil className="h-3.5 w-3.5" />
      </IconButton>

      {isPending && (
        <>
          <Button variant="success" size="sm" onClick={() => onStatusChange?.(m.id, 2)}>
            <Play className="h-3.5 w-3.5" />
            Activer
          </Button>
          <Button variant="danger" size="sm" onClick={() => onStatusChange?.(m.id, 4)}>
            <X className="h-3.5 w-3.5" />
            Annuler
          </Button>
        </>
      )}

      {isLive && (
        <>
          <Button variant="danger" size="sm" onClick={() => onStatusChange?.(m.id, 3)}>
            <StopCircle className="h-3.5 w-3.5" />
            Terminer
          </Button>
          <Button variant="danger" size="sm" onClick={() => onStatusChange?.(m.id, 4)}>
            <X className="h-3.5 w-3.5" />
            Annuler
          </Button>
        </>
      )}

      {(isTerminated || isCancelled) && (
        <Button variant="outline" size="sm" disabled>
          <X className="h-3.5 w-3.5" />
          Fermée
        </Button>
      )}

      <IconButton variant="danger" size="sm" label="Supprimer" onClick={() => onDelete?.(m)}>
        <Trash2 className="h-3.5 w-3.5" />
      </IconButton>
    </>
  );
}

export function MasterclassAdminRow({ masterclass: m, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div className={`grid gap-y-3 gap-x-6 px-5 py-4 ${GRID_COLS}`}>
      <div className="min-w-0 space-y-1 xl:self-center">
        <div className="text-body font-medium text-text truncate">{m.title}</div>
        <div className="text-small text-text-muted">{m.durationMin} min</div>
      </div>

      <div className="text-body text-text-muted truncate min-w-0 xl:self-center">
        {m.expert}
      </div>

      <div className="self-center min-w-0">
        <Tag color={`domain-${m.community}` as never} size="sm">
          {COMMUNITY_LABEL[m.community].toUpperCase()}
        </Tag>
      </div>

      <div className="text-small text-text-muted truncate min-w-0 xl:self-center">
        {m.date}
      </div>

      <div className="min-w-0 xl:self-center">
        <ProgressBar value={m.participants} max={m.capacity} />
      </div>

      <div className="self-center min-w-0">
        <StatusPill
          size="sm"
          kind={
            m.status === "live"
              ? "live"
              : m.status === "pending"
                ? "pending"
                : m.status === "terminated"
                  ? "terminated"
                  : "cancelled"
          }
        />
      </div>

      <div className="flex items-center gap-2 justify-end flex-wrap min-w-0 xl:self-center">
        <StatusActions masterclass={m} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}

export function MasterclassAdminCard({ masterclass: m, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <Card className="space-y-4">
      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 space-y-2">
          <h3 className="text-h3 font-semibold text-text">{m.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Tag color={`domain-${m.community}` as never} size="sm">
              {COMMUNITY_LABEL[m.community].toUpperCase()}
            </Tag>
            <StatusPill
              size="sm"
              kind={
                m.status === "live"
                  ? "live"
                  : m.status === "pending"
                    ? "pending"
                    : m.status === "terminated"
                      ? "terminated"
                      : "cancelled"
              }
            />
          </div>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="text-eyebrow uppercase tracking-[0.14em] text-text-muted">Expert</div>
          <div className="text-body text-text">{m.expert}</div>
        </div>
        <div className="space-y-1">
          <div className="text-eyebrow uppercase tracking-[0.14em] text-text-muted flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Date
          </div>
          <div className="text-body text-text">{m.date}</div>
          <div className="text-small text-text-muted">{m.durationMin} min</div>
        </div>
        <div className="space-y-1">
          <div className="text-eyebrow uppercase tracking-[0.14em] text-text-muted flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            Participants
          </div>
          <ProgressBar value={m.participants} max={m.capacity} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
        <StatusActions masterclass={m} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      </div>
    </Card>
  );
}