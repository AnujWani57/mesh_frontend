import { createFileRoute } from "@tanstack/react-router";
import { Bell, HardHat, Radio, Siren } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { ReadingCards } from "@/components/reading-cards";
import { GasTrendChart } from "@/components/gas-trend-chart";
import { StatusBadge, DeviceStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupervisorHome } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth/auth-context";
import { useSos } from "@/components/sos-overlay";

export const Route = createFileRoute("/supervisor/")({
  head: () => ({ meta: [{ title: "Home — MineMesh Supervisor" }] }),
  component: SupervisorHome,
});

function SupervisorHome() {
  const { user } = useAuth();
  const sectorId = user?.sectorId ?? "sector-1";
  const { data, isLoading } = useSupervisorHome(sectorId);
  const { triggerSos } = useSos();

  if (isLoading || !data) return <p className="text-muted-foreground">Loading…</p>;

  const simulateSos = () => {
    triggerSos({
      id: `SOS-${Date.now()}`,
      workerName: "Rahul Meena",
      deviceId: "WD-203",
      sectorId: data.sectorId,
      sectorName: data.sectorName,
      nodeId: "Node 1",
      coordinates: { x: 20, y: 15, z: 4 },
      reason: "SOS Button Pressed",
      time: new Date().toISOString(),
    });
  };

  return (
    <div>
      <PageHeader
        title={`${data.sectorName} — Overview`}
        description="Live readings and status for your sector."
        action={
          <Button variant="destructive" className="gap-2" onClick={simulateSos}>
            <Siren className="h-4 w-4" /> Simulate SOS
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Sector Status" value={data.status} icon={Radio} accent={data.status} />
        <StatCard label="Workers" value={data.totalWorkers} icon={HardHat} />
        <StatCard label="Devices Online" value={data.devicesOnline} icon={Radio} accent="safe" />
        <StatCard
          label="SOS Count"
          value={data.sosCount}
          icon={Siren}
          accent={data.sosCount > 0 ? "critical" : "safe"}
        />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Average Gas Readings
      </h2>
      <ReadingCards readings={data.averageReadings} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GasTrendChart data={data.trends} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Node Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.nodes.map((n) => (
              <div key={n.id} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium">{n.name}</span>
                <DeviceStatusBadge status={n.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.recentAlerts.length === 0 && (
            <p className="text-sm text-muted-foreground">No alerts.</p>
          )}
          {data.recentAlerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {a.hazard} · {a.workerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.deviceId} · {new Date(a.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <StatusBadge status={a.severity} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
