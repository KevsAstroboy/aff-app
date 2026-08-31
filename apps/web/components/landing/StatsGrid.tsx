import { Users, Radio, FileText, Award } from "lucide-react";
import { cn } from "@/lib/cn";

type StatItem = {
  label: string;
  value: string;
  icon: "users" | "live" | "publications" | "awards";
  accent: "gold" | "live-red" | "purple" | "success";
};

const ICONS = {
  users: Users,
  live: Radio,
  publications: FileText,
  awards: Award,
} as const;

const ACCENTS = {
  gold: "text-gold bg-gold-soft",
  "live-red": "text-live-red bg-live-red/10",
  purple: "text-purple bg-purple/15",
  success: "text-success bg-success/10",
} as const;

const STATS: StatItem[] = [
  { label: "Innovateurs attendus", value: "10 000+", icon: "users", accent: "gold" },
  { label: "Masterclass live", value: "38", icon: "live", accent: "live-red" },
  { label: "Publications prévues", value: "847", icon: "publications", accent: "purple" },
  { label: "Trophées Awards", value: "25+", icon: "awards", accent: "success" },
];

export function StatsGrid() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {STATS.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-surface p-6 backdrop-blur-sm hover:border-border-strong transition-colors"
              >
                <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-md", ACCENTS[s.accent])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-h2 font-extrabold text-text tabular-nums">{s.value}</div>
                <div className="mt-2 text-small text-text-muted">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
