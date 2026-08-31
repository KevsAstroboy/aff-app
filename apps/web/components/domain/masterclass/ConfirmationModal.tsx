import { ExternalLink, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ConfirmationModalProps = {
  isLive: boolean;
  title: string;
  expert: string;
  meetingUrl: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
};

export function ConfirmationModal({
  isLive,
  title,
  expert,
  meetingUrl,
  copied,
  onCopy,
  onClose,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-gold/30 bg-surface p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 text-text-muted hover:text-text transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-1 text-eyebrow uppercase tracking-[0.2em] text-gold">
          {isLive ? "En direct" : "Place réservée"}
        </div>
        <h3 className="text-h3 font-semibold text-text leading-snug">{title}</h3>
        {expert && <p className="mt-1 text-small text-text-muted">Avec {expert}</p>}

        <div className="mt-6 rounded-xl border border-border bg-surface-raised p-4">
          <div className="text-eyebrow uppercase tracking-[0.18em] text-text-muted">
            Votre lien de visio
          </div>
          <p className="mt-2 break-all text-small text-text">{meetingUrl}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-gold px-4 text-body font-medium text-bg hover:bg-gold-hover transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ExternalLink className="h-4 w-4" />
              Rejoindre
            </a>
            <Button variant="outline" onClick={onCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}