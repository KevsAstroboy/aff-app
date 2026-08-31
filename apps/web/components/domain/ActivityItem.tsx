import {
  UserPlus,
  Radio,
  Flag,
  FileText,
  CheckCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/formatters";
import type { ActivityItem as ActivityItemType } from "@/types";

const ICON_MAP = {
  user: { Icon: UserPlus, color: "text-success bg-success/15" },
  masterclass: { Icon: Radio, color: "text-live-red bg-live-red/15" },
  report: { Icon: Flag, color: "text-live-red bg-live-red/15" },
  publication: { Icon: FileText, color: "text-warn bg-warn/15" },
  resolve: { Icon: CheckCircle, color: "text-success bg-success/15" },
  community: { Icon: Users, color: "text-text-muted bg-surface-hover" },
} as const;

export function ActivityItem({ item }: { item: ActivityItemType }) {
  const { Icon, color } = ICON_MAP[item.icon];
  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          color
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body text-text">{item.message}</p>
        <p className="mt-0.5 text-small text-text-muted">{relativeTime(item.createdAt)}</p>
      </div>
    </div>
  );
}
