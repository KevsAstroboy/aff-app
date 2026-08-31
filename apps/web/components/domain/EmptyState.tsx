import { Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised border border-border text-text-muted">
        {icon ?? <Users className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-h3 font-semibold text-text">{title}</h3>
        {description && <p className="max-w-md text-small text-text-muted">{description}</p>}
      </div>
    </Card>
  );
}
