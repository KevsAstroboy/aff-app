import { Trophy } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

type CategoryCardProps = {
  id?: string;
  title: string;
  onApply?: () => void;
};

export function CategoryCard({ id, title, onApply }: CategoryCardProps) {
  const button = onApply ? (
    <button
      onClick={onApply}
      className="self-start inline-flex items-center h-9 px-4 rounded-md border border-gold/40 text-small font-medium text-gold hover:bg-gold-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      Candidater
    </button>
  ) : id ? (
    <Link
      href={`/awards/candidater/${id}`}
      className="self-start inline-flex items-center h-9 px-4 rounded-md border border-gold/40 text-small font-medium text-gold hover:bg-gold-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      Candidater
    </Link>
  ) : null;

  return (
    <Card className="flex flex-col gap-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised border border-border text-gold">
        <Trophy className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="text-h3 font-semibold text-text">{title}</h3>
      {button}
    </Card>
  );
}
