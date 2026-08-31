import { Eye, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/formatters";
import type { Signalement } from "@/types";

const TYPE_LABEL = {
  publication: "Publication",
  commentaire: "Commentaire",
  utilisateur: "Utilisateur",
} as const;

const TYPE_COLOR = {
  publication: "live-red",
  commentaire: "purple",
  utilisateur: "muted",
} as const;

const STATUS_COLOR = {
  open: "live-red",
  resolved: "success",
  closed: "muted",
} as const;

const STATUS_LABEL = {
  open: "Ouvert",
  resolved: "Résolu",
  closed: "Classé",
} as const;

type ReportCardProps = {
  report: Signalement;
  onResolve?: () => void;
  onClose?: () => void;
};

export function ReportCard({ report, onResolve, onClose }: ReportCardProps) {
  const isOpen = report.status === "open";
  const isHigh = report.severity === "high";

  return (
    <Card
      className={cn(
        isOpen && isHigh && "border-live-red/40"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 min-w-0 space-y-4">
          {/* Header: type + severity + status + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag color={TYPE_COLOR[report.type]} variant="label" size="sm">
              {TYPE_LABEL[report.type]}
            </Tag>
            <SeverityBadge level={report.severity} size="sm" />
            <Tag color={STATUS_COLOR[report.status]} variant="label" size="sm">
              {STATUS_LABEL[report.status]}
            </Tag>
            <span className="text-small text-text-muted ml-auto">{relativeTime(report.createdAt)}</span>
          </div>

          {/* Subject + reporter */}
          <div className="space-y-2">
            <h3 className="text-h3 font-semibold text-text">{report.subject}</h3>
            <div className="text-small text-text-muted">Signalé par {report.reportedBy}</div>
          </div>

          {/* Reason */}
          <p className="text-body italic text-text-muted">&ldquo;{report.reason}&rdquo;</p>
        </div>

        {/* Actions stack vertical */}
        <div className="flex flex-row lg:flex-col items-stretch gap-2 lg:min-w-[140px]">
          {isOpen ? (
            <>
              <Button variant="outline" size="sm" block>
                <Eye className="h-3.5 w-3.5" />
                Examiner
              </Button>
              <Button variant="success" size="sm" block onClick={onResolve}>
                <Check className="h-3.5 w-3.5" />
                Résoudre
              </Button>
              <Button variant="danger" size="sm" block onClick={onClose}>
                <X className="h-3.5 w-3.5" />
                Classer
              </Button>
            </>
          ) : (
            <span className="text-small italic text-text-subtle self-center">Traité</span>
          )}
        </div>
      </div>
    </Card>
  );
}