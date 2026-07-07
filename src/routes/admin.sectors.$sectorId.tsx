import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, IdCard } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { StatusBadge, DeviceStatusBadge } from "@/components/status-badge";
import { ReadingCards } from "@/components/reading-cards";
import { GasTrendChart } from "@/components/gas-trend-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSector, useNodes } from "@/hooks/use-api";
import { makeTrends } from "@/lib/data/dummy";

export const Route = createFileRoute("/admin/sectors/$sectorId")({
  head: () => ({ meta: [{ title: "Sector detail — MineMesh Admin" }] }),
  component: SectorDetail,
});

function SectorDetail() {
  const { sectorId } = Route.useParams();
  const { data: sector, isLoading } = useSector(sectorId);
  const { data: nodes } = useNodes(sectorId);

  if (isLoading || !sector) return <p className="text-muted-foreground">Loading sector…</p>;

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 gap-2" asChild>
        <Link to="/admin/sectors">
          <ArrowLeft className="h-4 w-4" /> Back to sectors
        </Link>
      </Button>
      <PageHeader
        title={sector.name}
        description="Sector-level supervisor, nodes and readings."
        action={<StatusBadge status={sector.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supervisor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-lg font-semibold">{sector.supervisor.name}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <IdCard className="h-4 w-4" /> {sector.supervisor.employeeId}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> {sector.supervisor.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {sector.supervisor.email}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Nodes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {nodes?.map((n) => (
              <div key={n.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{n.name}</p>
                  <DeviceStatusBadge status={n.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {n.connectedDevices} devices · Battery {n.battery}% · {n.signalStrength}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Average Sensor Readings
      </h2>
      <ReadingCards readings={sector.averageReadings} />

      <div className="mt-6">
        <GasTrendChart data={makeTrends(sector.averageReadings)} title="Sector Trends" />
      </div>
    </div>
  );
}
