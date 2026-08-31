import { AlertTriangle } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { ReportCard } from "@/components/domain/ReportCard";
import { getSignalements } from "@/services/signalements";

export const dynamic = 'force-dynamic';

export default async function AdminSignalementsPage() {
  const reports = await getSignalements();
  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: "Admin", href: "/admin/tableau-de-bord" }, { label: "Signalements" }]} />
        <PageHeader
          title="Signalements"
          actions={
            openCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-md border border-live-red/40 bg-live-red/10 px-3 py-1.5 text-small text-live-red font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                {openCount} signalement{openCount > 1 ? "s" : ""} ouvert{openCount > 1 ? "s" : ""}
              </div>
            )
          }
        />
      </div>

      <div className="space-y-4">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
