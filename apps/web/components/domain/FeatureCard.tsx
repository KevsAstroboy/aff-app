import { Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

type FeatureCardProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  watermark?: boolean;
  className?: string;
};

export function FeatureCard({
  eyebrow,
  title,
  description,
  action,
  watermark = true,
  className,
}: FeatureCardProps) {
  return (
    <Card featured className={cn("relative overflow-hidden", className)}>
      {watermark && (
        <Trophy
          className="absolute -right-8 -bottom-8 h-64 w-64 text-gold/5 pointer-events-none"
          strokeWidth={1}
        />
      )}
      <div className="relative space-y-4 max-w-2xl">
        {eyebrow && (
          <div className="flex items-center gap-2 text-eyebrow text-gold tracking-[0.2em]">
            <Trophy className="h-4 w-4" />
            {eyebrow}
          </div>
        )}
        <h2 className="text-h1 font-bold text-gold tracking-tight">{title}</h2>
        {description && <p className="text-body text-text-muted">{description}</p>}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </Card>
  );
}
